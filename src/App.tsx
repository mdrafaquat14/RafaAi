import { useEffect, useMemo, useState } from 'react'
import type { ChatMessage, ChatSession, Profile, PromptMode, Theme } from './types'
import { supabase, isSupabaseConfigured, getProfile } from './lib/supabase'
import { extractText, generateAnswer } from './lib/api'
import { storage } from './lib/storage'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { Welcome } from './components/Welcome'
import { Composer } from './components/Composer'
import { Message } from './components/Message'
import { AuthModal } from './components/AuthModal'
import { SettingsModal } from './components/SettingsModal'
import { CreditLimit, type CreditStatus } from './components/CreditLimit'
import { AdminModal } from './components/AdminModal'

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2,9)}`
function simpleGreeting(text:string): string | null {
  const normalized=text.trim().toLowerCase().replace(/[!?.,]+$/g,'').replace(/\s+/g,' ')
  if(/^(hi|hii|hiii|hello|hey|heyy|good morning|good afternoon|good evening)$/.test(normalized)){
    if(normalized.startsWith('good morning')) return 'Good morning! How can I help you today?'
    if(normalized.startsWith('good afternoon')) return 'Good afternoon! How can I help you today?'
    if(normalized.startsWith('good evening')) return 'Good evening! How can I help you today?'
    return 'Hi! How can I help you today?'
  }
  return null
}

const RAFAAI_IDENTITY = 'You are RafaAi, a student-first AI assistant created for learners. Your public assistant name is RafaAi. Handle identity questions by intent, not by keyword lists or fixed-trigger matching. Do not introduce yourself, state your name, explain your origin, or mention your founder unless the user is actually asking about who you are, your name, your identity, your origin/creator/founder, or a closely equivalent natural-language question. A simple greeting such as hi, hii, hello, hey, good morning, or similar social opening is only a greeting: respond naturally and briefly without an unsolicited introduction. If the user asks what your name is or otherwise asks your name, say that your name is RafaAi. If the user asks who you are or what you are, explain briefly that you are RafaAi, an AI assistant. If the user asks who created or founded RafaAi, say that its founder is Md Rafaquat. Answer only the identity detail requested rather than dumping a full introduction. Never claim to be Gemini or present the underlying model provider as your own identity. Be friendly, clear, intelligent, and natural. Support English, Hindi, and Hinglish. IMPORTANT FOR CLASS 10 STUDENTS: default to very simple, textbook-style Hindi when the student asks in Hindi/Hinglish. Use English terms only when they are standard syllabus terms, and explain each such term in simple Hindi the first time. Do not fill an answer with unnecessary English labels. Teach concept first, then a small easy example, then formula, then step-by-step solving when requested. Follow every part of the student request. If the student asks for a complete explanation, finish every requested section before stopping. Never intentionally truncate a response, leave a section unfinished, or end mid-sentence. Prefer concise but complete answers over formula dumps. For formulas, use Markdown math syntax: $x$ for inline math and $$...$$ for displayed equations; never leave raw LaTeX delimiters or formula code visible.'

export default function App() {
  const [theme,setTheme] = useState<Theme>(storage.theme())
  const [chats,setChats] = useState<ChatSession[]>(storage.chats())
  const [activeId,setActiveId] = useState<string|null>(null)
  const [sidebarOpen,setSidebarOpen] = useState(()=>typeof window!=='undefined' ? window.innerWidth<=900 : false)
  const [sidebarCollapsed,setSidebarCollapsed] = useState(false)
  const [authOpen,setAuthOpen] = useState(false)
  const [settingsOpen,setSettingsOpen] = useState(false)
  const [user,setUser] = useState<{id:string;email?:string}|null>(null)
  const [profile,setProfile] = useState<Profile|null>(null)
  const [input,setInput] = useState('')
  const [busy,setBusy] = useState(false)
  const [mode,setMode] = useState<PromptMode>('Explain')
  const [attachment,setAttachment] = useState<File|null>(null)
  const [error,setError] = useState('')
  const [guestReplies,setGuestReplies] = useState(storage.guestReplies())
  const [creditStatus,setCreditStatus] = useState<CreditStatus|null>(null)
  const [adminOpen,setAdminOpen] = useState(false)

  const activeChat = useMemo(()=>chats.find(c=>c.id===activeId)||null,[chats,activeId])
  const signedIn = Boolean(user)

  useEffect(()=>{
    const updateViewport=()=>{
      const vv=window.visualViewport
      if(!vv) return
      const keyboardOffset=Math.max(0,window.innerHeight-vv.height-vv.offsetTop)
      document.documentElement.style.setProperty('--keyboard-offset',`${keyboardOffset}px`)
      document.documentElement.style.setProperty('--viewport-height',`${vv.height}px`)
    }
    updateViewport()
    window.visualViewport?.addEventListener('resize',updateViewport)
    window.visualViewport?.addEventListener('scroll',updateViewport)
    window.addEventListener('resize',updateViewport)
    return ()=>{
      window.visualViewport?.removeEventListener('resize',updateViewport)
      window.visualViewport?.removeEventListener('scroll',updateViewport)
      window.removeEventListener('resize',updateViewport)
    }
  },[])
  useEffect(()=>{ document.documentElement.dataset.theme=theme; storage.saveTheme(theme) },[theme])

  // Open an existing chat at the exact point where the student last left it: the latest messages.
  // While a new answer is streaming, keep the view at the bottom so the latest text stays visible.
  useEffect(()=>{
    const scrollToLatest=()=>{
      const el=document.querySelector<HTMLElement>('.chat-scroll')
      if(!el) return
      el.scrollTop=el.scrollHeight
    }
    const frame=requestAnimationFrame(scrollToLatest)
    return ()=>cancelAnimationFrame(frame)
  },[activeId])

  useEffect(()=>{
    if(!busy) return
    const el=document.querySelector<HTMLElement>('.chat-scroll')
    if(!el) return
    el.scrollTop=el.scrollHeight
  },[activeChat?.messages.length,busy])
  useEffect(()=>{ storage.saveChats(chats) },[chats])
  useEffect(()=>{
    const onKey=(event:KeyboardEvent)=>{ if(event.key==='Escape'){setSidebarOpen(false);setSidebarCollapsed(true)} }
    const onPointerDown=(event:PointerEvent)=>{
      const target=event.target as HTMLElement|null
      if(!target || target.closest('.sidebar')) return
      if(target.closest('.mobile-menu')) return
      if(window.innerWidth<=900) setSidebarOpen(false)
      else setSidebarCollapsed(true)
    }
    window.addEventListener('keydown',onKey)
    document.addEventListener('pointerdown',onPointerDown)
    return ()=>{
      window.removeEventListener('keydown',onKey)
      document.removeEventListener('pointerdown',onPointerDown)
    }
  },[])


  useEffect(()=>{
    if(!supabase) return
    supabase.auth.getSession().then(async ({data})=>{
      const session=data.session
      setUser(session?.user?{id:session.user.id,email:session.user.email}:null)
      setCreditStatus(null)
      if(session?.user) { const p=await getProfile(session.user.id).catch(()=>null); setProfile(p); if(p?.role==='admin'){ setCreditStatus({ready:true,unlimited:true,remaining:null,limit:null,reset_at:null}) } else { setCreditStatus(null); setTimeout(()=>refreshCredits(session.user.id),0) } }
    })
    const {data:listener}=supabase.auth.onAuthStateChange(async (event,session)=>{
      if(event==='PASSWORD_RECOVERY') setAuthOpen(true)
      setUser(session?.user?{id:session.user.id,email:session.user.email}:null)
      setCreditStatus(null); 
      if(session?.user) { const p=await getProfile(session.user.id).catch(()=>null); setProfile(p); if(p?.role==='admin'){ setCreditStatus({ready:true,unlimited:true,remaining:null,limit:null,reset_at:null});  } else { setCreditStatus(null);  setTimeout(()=>refreshCredits(session.user.id),0) } }
      else { setProfile(null); setCreditStatus(null) }
    })
    return ()=>listener.subscription.unsubscribe()
  },[])

  async function refreshCredits(userId?:string){
    const targetUserId=userId||user?.id
    if(!targetUserId || !supabase) return
    try{
      const {data,error}=await supabase.functions.invoke('rafaai-account',{body:{action:'get_credit_status'}})
      if(error || !data?.creditStatus) return
      const r=data.creditStatus
      const unlimited=!!r.unlimited
      const remaining=r.remaining==null?null:Number(r.remaining)
      const limit=r.limit==null?null:Number(r.limit)
      setCreditStatus({ready:r.ready !== false,unlimited,remaining,limit,base_limit:r.base_limit==null?null:Number(r.base_limit),bonus:r.bonus==null?null:Number(r.bonus),reset_at:r.reset_at||null})
      // Never block a fresh/valid account unless the server explicitly reports exactly 0.
      // The backend remains the final authority when a message is actually sent.
    }catch{
      // A temporary status-fetch failure must not lock the composer.
    }
  }
  const creditLimitReached = Boolean(profile?.role !== 'admin' && creditStatus?.ready === true && !creditStatus?.unlimited && creditStatus.remaining === 0)
  useEffect(()=>{if(user && profile && profile.role !== 'admin') refreshCredits(user.id)},[user?.id, profile?.role])
  // Keep the limit screen in sync with admin approvals/credit changes without requiring a reload.
  useEffect(()=>{
    if(!user || !creditLimitReached) return
    const refresh=()=>{ refreshCredits() }
    const timer=window.setInterval(refresh,5000)
    window.addEventListener('focus',refresh)
    document.addEventListener('visibilitychange',refresh)
    return ()=>{
      window.clearInterval(timer)
      window.removeEventListener('focus',refresh)
      document.removeEventListener('visibilitychange',refresh)
    }
  },[user?.id,creditLimitReached])
  async function requestMoreAccess(message:string,requestedCredits:number|null){
    if(!supabase) return
    const {error}=await supabase.functions.invoke('rafaai-account',{body:{action:'request_more_access',message,requestedCredits}})
    if(error) throw error
  }

  function updateChat(next: ChatSession) { setChats(prev=>prev.map(c=>c.id===next.id?next:c)) }
  function newChat() { setActiveId(null); setInput(''); setError(''); setAttachment(null); setSidebarOpen(false) }
  function selectChat(id:string) { setActiveId(id); setError(''); setSidebarOpen(false); setSidebarCollapsed(false) }
  function deleteChat(id:string) { setChats(prev=>prev.filter(c=>c.id!==id)); if(activeId===id)setActiveId(null) }
  function renameChat(id:string,title:string) { const t=title.trim(); if(!t)return; setChats(prev=>prev.map(c=>c.id===id?{...c,title:t}:c)) }
  async function signOut(){await supabase?.auth.signOut();setUser(null);setProfile(null);newChat()}

  function ensureChat(title:string):ChatSession {
    if(activeChat) return activeChat
    const chat:ChatSession={id:uid(),title:title.slice(0,52)||'New chat',createdAt:Date.now(),updatedAt:Date.now(),messages:[]}
    setChats(prev=>[chat,...prev]); setActiveId(chat.id); setSidebarCollapsed(false); return chat
  }

  function inferClassFromMessage(text:string): string | undefined {
    const t=text.toLowerCase()
    const m=t.match(/(?:class|grade|standard|कक्षा)\s*(?:no\.?\s*)?(1[0-2]|[1-9])(?:th|st|nd|rd)?\b/)
    if(m?.[1]) return `Class ${m[1]}`
    if(/\bmatric(?:ulation)?\b|\bmatric\b/i.test(text)) return 'Matric / Class 10'
    return undefined
  }

  async function send(text=input) {
    const clean=text.trim(); if(!clean || busy)return
    if(!signedIn && guestReplies>=5){setAuthOpen(true);return}
    if(signedIn && profile?.role !== 'admin' && creditLimitReached && creditStatus?.remaining === 0){setError('Your daily AI credit limit has been reached.');return}
    setError('')
    const greeting=simpleGreeting(clean)
    if(greeting){
      const chat=ensureChat(clean)
      const userMsg:ChatMessage={id:uid(),role:'user',content:clean,createdAt:Date.now()}
      const assistantMsg:ChatMessage={id:uid(),role:'assistant',content:greeting,createdAt:Date.now()}
      updateChat({...chat,messages:[...chat.messages,userMsg,assistantMsg],updatedAt:Date.now()})
      setInput('');setAttachment(null)
      return
    }
    const chat=ensureChat(clean)
    const attachmentDataUrl = attachment ? await fileToDataUrl(attachment) : undefined
    const userMsg:ChatMessage={id:uid(),role:'user',content:clean,createdAt:Date.now(),attachmentName:attachment?.name,attachmentDataUrl,attachmentMimeType:attachment?.type||undefined,imageDataUrl:attachment?.type.startsWith('image/')?attachmentDataUrl:undefined}
    const nextMessages=[...chat.messages,userMsg]
    const assistantId=uid()
    const withPlaceholder=[...nextMessages,{id:assistantId,role:'assistant' as const,content:'',createdAt:Date.now()}]
    updateChat({...chat,messages:withPlaceholder,updatedAt:Date.now()})
    setInput(''); setAttachment(null); setBusy(true)
    try {
      if(!isSupabaseConfigured) throw new Error('RafaAi backend is not connected yet. Add the Supabase environment variables from .env.example.')
      const contents=[{role:'user',parts:[{text:`[RafaAi behavior instructions — follow internally]\n${RAFAAI_IDENTITY}`}]},...nextMessages.map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}, ...(m.role==='user' && m.attachmentDataUrl ? [{inline_data: dataUrlToInlineData(m.attachmentDataUrl)}] : [])]}))]
      const detectedClass=inferClassFromMessage(clean)
      const effectiveClass=detectedClass||profile?.class_level||undefined
      const result = await generateAnswer({contents,guest:!signedIn,guestQuestionNumber:!signedIn?guestReplies+1:undefined,guestId:!signedIn?storage.guestId():undefined,classLevel:effectiveClass,mode},(delta)=>{
        setChats(prev=>prev.map(c=>c.id===chat.id?{...c,messages:c.messages.map(m=>m.id===assistantId?{...m,content:m.content+delta}:m),updatedAt:Date.now()}:c))
      })
      if(result?.creditStatus){const remaining=result.creditStatus.remaining==='unlimited'?null:Number(result.creditStatus.remaining);setCreditStatus(prev=>({...prev,ready:true,remaining,limit:result.creditStatus.limit==='unlimited'?null:Number(result.creditStatus.limit),reset_at:result.creditStatus.resetAt||prev?.reset_at||null}));}
      if(!signedIn){const next=storage.incrementGuestReplies();setGuestReplies(next);if(next>=5)setAuthOpen(true)}
    } catch(err:any) {
      setChats(prev=>prev.map(c=>c.id===chat.id?{...c,messages:c.messages.filter(m=>m.id!==assistantId),updatedAt:Date.now()}:c))
      if(err?.status===401){setAuthOpen(true);setError('Please log in to continue.');return}
      if(err?.code==='GUEST_LIMIT_REACHED'){setGuestReplies(5);setAuthOpen(true);setError('Your 5 free guest replies are finished. Create an account to continue.');return}
      if(err?.code==='ACCOUNT_RESTRICTED'){setError('This account is currently restricted from using RafaAi.');return}
      if(err?.code==='GEMINI_DAILY_QUOTA_EXHAUSTED' || err?.code==='GEMINI_QUOTA_EXHAUSTED'){setError('RafaAi quota exhausted. Please try again after the quota resets.');return}
      if(err?.code==='DAILY_CREDIT_LIMIT'){setCreditStatus({ready:true,unlimited:false,remaining:0,limit:Number(err?.details?.dailyCreditLimit||20),reset_at:err?.details?.resetAt||null});setError('');return}
      setError(err?.message||'Something went wrong while generating the answer.')
    } finally {
      setBusy(false)
      // Keep the physical-keyboard workflow fast: after sending, restore focus on laptops/desktops.
      // Touch devices are intentionally excluded so a phone keyboard is never reopened automatically.
      if (typeof window !== 'undefined' && window.navigator.maxTouchPoints === 0) {
        requestAnimationFrame(() => document.querySelector<HTMLTextAreaElement>('.composer textarea')?.focus())
      }
    }
  }

  async function regenerate(){
    if(!activeChat || busy)return
    if(!signedIn && guestReplies>=5){setAuthOpen(true);return}
    const withoutAssistant=[...activeChat.messages]; if(withoutAssistant.at(-1)?.role==='assistant')withoutAssistant.pop()
    const assistantId=uid()
    const chatId=activeChat.id
    updateChat({...activeChat,messages:[...withoutAssistant,{id:assistantId,role:'assistant',content:'',createdAt:Date.now()}],updatedAt:Date.now()}); setBusy(true); setError('')
    try {
      const contents=[{role:'user',parts:[{text:`[RafaAi behavior instructions — follow internally]\n${RAFAAI_IDENTITY}`}]},...withoutAssistant.map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}, ...(m.role==='user' && m.attachmentDataUrl ? [{inline_data: dataUrlToInlineData(m.attachmentDataUrl)}] : [])]}))]
      const lastUserMessage=withoutAssistant.filter(m=>m.role==='user').at(-1)?.content||''
      const detectedClass=inferClassFromMessage(lastUserMessage)
      const effectiveClass=detectedClass||profile?.class_level||undefined
      const result = await generateAnswer({contents,guest:!signedIn,guestQuestionNumber:!signedIn?guestReplies+1:undefined,guestId:!signedIn?storage.guestId():undefined,classLevel:effectiveClass,mode},(delta)=>{
        setChats(prev=>prev.map(c=>c.id===chatId?{...c,messages:c.messages.map(m=>m.id===assistantId?{...m,content:m.content+delta}:m),updatedAt:Date.now()}:c))
      })
      if(result?.creditStatus){const remaining=result.creditStatus.remaining==='unlimited'?null:Number(result.creditStatus.remaining);setCreditStatus(prev=>({...prev,ready:true,remaining,limit:result.creditStatus.limit==='unlimited'?null:Number(result.creditStatus.limit),reset_at:result.creditStatus.resetAt||prev?.reset_at||null}))}
      if(!signedIn){const next=storage.incrementGuestReplies();setGuestReplies(next);if(next>=5)setAuthOpen(true)}
    }catch(err:any){
      setChats(prev=>prev.map(c=>c.id===chatId?{...c,messages:c.messages.filter(m=>m.id!==assistantId),updatedAt:Date.now()}:c))
      if(err?.code==='DAILY_CREDIT_LIMIT'){setCreditStatus({ready:true,unlimited:false,remaining:0,limit:Number(err?.details?.dailyCreditLimit||20),reset_at:err?.details?.resetAt||null});setError('');return}
      setError(err?.message||'Could not regenerate the answer.')
    }finally{setBusy(false)}
  }

  function stop(){setError('Generation stopped.');setBusy(false)}
  function feedback(id:string,value:boolean){if(!activeChat)return;updateChat({...activeChat,messages:activeChat.messages.map(m=>m.id===id?{...m,liked:value}:m)})}
  function prompt(text:string,m:PromptMode){setMode(m);setInput(text);setTimeout(()=>document.querySelector<HTMLTextAreaElement>('.composer textarea')?.focus(),0)}
  const composer=<Composer value={input} onChange={setInput} onSend={()=>send()} busy={busy} mode={mode} setMode={setMode} attachment={attachment} setAttachment={setAttachment} onStop={stop}/>
  const creditMeter = profile?.role === 'admin' ? null : signedIn ? (
    <div className={creditStatus?.unlimited ? 'credit-live unlimited' : 'credit-live'}><span className="credit-live-dot"></span><b>{creditStatus?.unlimited ? 'Unlimited AI' : (creditStatus?.remaining ?? '—') + ' credits left'}</b>{!creditStatus?.unlimited && <span>of {creditStatus?.limit ?? 20} today</span>}</div>
  ) : (
    <div className="credit-live guest"><span className="credit-live-dot"></span><b>{Math.max(0,5-guestReplies)} guest replies left</b></div>
  )
  const composerArea = profile?.role === 'admin'
    ? composer
    : creditLimitReached
      ? <CreditLimit status={creditStatus} onRequest={requestMoreAccess}/>
      : <><div className="composer-credit-row">{creditMeter}</div>{composer}</>

  return (
    <div className="app-shell">
      {sidebarOpen && <button className="sidebar-backdrop" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />}
      <Sidebar
        onAdmin={() => setAdminOpen(true)}
        isAdmin={profile?.role === 'admin'}
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        chats={chats}
        activeId={activeId}
        onClose={() => setSidebarOpen(false)}
        onCollapse={() => setSidebarCollapsed(v => !v)}
        onNew={newChat}
        onSelect={selectChat}
        onDelete={deleteChat}
        onRename={renameChat}
        onLogin={() => setAuthOpen(true)}
        onSettings={() => setSettingsOpen(true)}
        userName={profile?.full_name || user?.email?.split('@')[0] || null}
        onLogout={signOut}
      />
      <main className="main-panel">
        <TopBar
          onMenu={() => setSidebarOpen(v => !v)}
          onLogin={() => setAuthOpen(true)}
          onSettings={() => setSettingsOpen(true)}
          signedIn={signedIn}
          userName={profile?.full_name || user?.email?.split('@')[0] || null}
        />
        <div className="chat-scroll">
          {!activeChat ? (
            <Welcome onPrompt={prompt} />
          ) : (
            <div className="messages-container">
              {activeChat.messages.map((m, i) => {
                const isWaiting = m.role === 'assistant' && m.content === '' && busy
                return isWaiting ? (
                  <div key={m.id} className="thinking-row">
                    <div className="thinking-mark"><span /><span /><span /></div>
                    <div>RafaAi is thinking…</div>
                  </div>
                ) : (
                  <Message
                    key={m.id}
                    message={m}
                    onRegenerate={m.role === 'assistant' && i === activeChat.messages.length - 1 ? regenerate : undefined}
                    onFeedback={v => feedback(m.id, v)}
                  />
                )
              })}
              {error && (
                <div className="inline-error">
                  <span>{error}</span>
                  <button onClick={() => setError('')}>Dismiss</button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="composer-area">{composerArea}</div>
      </main>
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
      {adminOpen && <AdminModal onClose={() => setAdminOpen(false)} />}
      {settingsOpen && (
        <SettingsModal
          onClose={() => setSettingsOpen(false)}
          theme={theme}
          setTheme={setTheme}
          onChatsCleared={() => { setChats([]); setActiveId(null); setSettingsOpen(false) }}
          userName={profile?.full_name || user?.email?.split('@')[0] || null}
          classLevel={profile?.class_level || null}
          email={user?.email || null}
          onProfileUpdated={(name, classLevel) => setProfile(prev => prev ? { ...prev, full_name: name, class_level: classLevel } : prev)}
          onLogout={signOut}
        />
      )}
    </div>
  )
}
function fileToDataUrl(file:File):Promise<string>{return new Promise((resolve,reject)=>{if(file.size>4*1024*1024){reject(new Error('Please choose a file smaller than 4 MB.'));return}const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=()=>reject(new Error('Could not read the selected file.'));r.readAsDataURL(file)})}
function dataUrlToInlineData(dataUrl:string){const match=dataUrl.match(/^data:([^;]+);base64,(.*)$/s);return match?{mime_type:match[1],data:match[2]}:undefined}
