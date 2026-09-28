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

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2,9)}`
const RAFAAI_IDENTITY = 'You are RafaAi, a student-first AI assistant created for learners. Your public assistant name is RafaAi. If asked your name, say RafaAi. If asked who founded RafaAi, say Md Rafaquat. Never claim to be Gemini or present the underlying model provider as your own identity. Be friendly, clear, intelligent, and natural. Support English, Hindi, and Hinglish. IMPORTANT FOR CLASS 10 STUDENTS: default to very simple, textbook-style Hindi when the student asks in Hindi/Hinglish. Use English terms only when they are standard syllabus terms, and explain each such term in simple Hindi the first time. Do not fill an answer with unnecessary English labels. Teach concept first, then a small easy example, then formula, then step-by-step solving when requested. Follow every part of the student request. If the student asks for a complete explanation, finish every requested section before stopping. Never intentionally truncate a response, leave a section unfinished, or end mid-sentence. Prefer concise but complete answers over formula dumps. For formulas, use Markdown math syntax: $x$ for inline math and $$...$$ for displayed equations; never leave raw LaTeX delimiters or formula code visible. Use clear headings and bullet points when helpful.'

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
      if(session?.user) setProfile(await getProfile(session.user.id).catch(()=>null))
    })
    const {data:listener}=supabase.auth.onAuthStateChange(async (event,session)=>{
      if(event==='PASSWORD_RECOVERY') setAuthOpen(true)
      setUser(session?.user?{id:session.user.id,email:session.user.email}:null)
      if(session?.user) setProfile(await getProfile(session.user.id).catch(()=>null))
      else setProfile(null)
    })
    return ()=>listener.subscription.unsubscribe()
  },[])

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

  async function send(text=input) {
    const clean=text.trim(); if(!clean || busy)return
    if(!signedIn && guestReplies>=5){setAuthOpen(true);return}
    setError('')
    const chat=ensureChat(clean)
    const imageDataUrl = attachment && attachment.type.startsWith('image/') ? await fileToDataUrl(attachment) : undefined
    const userMsg:ChatMessage={id:uid(),role:'user',content:clean,createdAt:Date.now(),attachmentName:attachment?.name,imageDataUrl}
    const nextMessages=[...chat.messages,userMsg]
    const assistantId=uid()
    const withPlaceholder=[...nextMessages,{id:assistantId,role:'assistant' as const,content:'',createdAt:Date.now()}]
    updateChat({...chat,messages:withPlaceholder,updatedAt:Date.now()})
    setInput(''); setAttachment(null); setBusy(true)
    try {
      if(!isSupabaseConfigured) throw new Error('RafaAi backend is not connected yet. Add the Supabase environment variables from .env.example.')
      const contents=[{role:'user',parts:[{text:`[RafaAi behavior instructions — follow internally]\n${RAFAAI_IDENTITY}`}]},...nextMessages.map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}, ...(m.role==='user' && m.imageDataUrl ? [{inline_data: dataUrlToInlineData(m.imageDataUrl)}] : [])]}))]
      await generateAnswer({contents,guest:!signedIn,guestQuestionNumber:!signedIn?guestReplies+1:undefined,guestId:!signedIn?storage.guestId():undefined,classLevel:profile?.class_level||undefined,mode},(delta)=>{
        setChats(prev=>prev.map(c=>c.id===chat.id?{...c,messages:c.messages.map(m=>m.id===assistantId?{...m,content:m.content+delta}:m),updatedAt:Date.now()}:c))
      })
      if(!signedIn){const next=storage.incrementGuestReplies();setGuestReplies(next);if(next>=5)setAuthOpen(true)}
    } catch(err:any) {
      setChats(prev=>prev.map(c=>c.id===chat.id?{...c,messages:c.messages.filter(m=>m.id!==assistantId),updatedAt:Date.now()}:c))
      if(err?.status===401){setAuthOpen(true);setError('Please log in to continue.');return}
      if(err?.code==='GUEST_LIMIT_REACHED'){setGuestReplies(5);setAuthOpen(true);setError('Your 5 free guest replies are finished. Create an account to continue.');return}
      if(err?.code==='ACCOUNT_RESTRICTED'){setError('This account is currently restricted from using RafaAi.');return}
      setError(err?.message||'Something went wrong while generating the answer.')
    } finally { setBusy(false) }
  }

  async function regenerate(){
    if(!activeChat || busy)return
    if(!signedIn && guestReplies>=5){setAuthOpen(true);return}
    const withoutAssistant=[...activeChat.messages]; if(withoutAssistant.at(-1)?.role==='assistant')withoutAssistant.pop()
    const assistantId=uid()
    const chatId=activeChat.id
    updateChat({...activeChat,messages:[...withoutAssistant,{id:assistantId,role:'assistant',content:'',createdAt:Date.now()}],updatedAt:Date.now()}); setBusy(true); setError('')
    try {
      const contents=[{role:'user',parts:[{text:`[RafaAi behavior instructions — follow internally]\n${RAFAAI_IDENTITY}`}]},...withoutAssistant.map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}, ...(m.role==='user' && m.imageDataUrl ? [{inline_data: dataUrlToInlineData(m.imageDataUrl)}] : [])]}))]
      await generateAnswer({contents,guest:!signedIn,guestQuestionNumber:!signedIn?guestReplies+1:undefined,guestId:!signedIn?storage.guestId():undefined,classLevel:profile?.class_level||undefined,mode},(delta)=>{
        setChats(prev=>prev.map(c=>c.id===chatId?{...c,messages:c.messages.map(m=>m.id===assistantId?{...m,content:m.content+delta}:m),updatedAt:Date.now()}:c))
      })
      if(!signedIn){const next=storage.incrementGuestReplies();setGuestReplies(next);if(next>=5)setAuthOpen(true)}
    }catch(err:any){
      setChats(prev=>prev.map(c=>c.id===chatId?{...c,messages:c.messages.filter(m=>m.id!==assistantId),updatedAt:Date.now()}:c))
      setError(err?.message||'Could not regenerate the answer.')
    }finally{setBusy(false)}
  }

  function stop(){setError('Generation stopped.');setBusy(false)}
  function feedback(id:string,value:boolean){if(!activeChat)return;updateChat({...activeChat,messages:activeChat.messages.map(m=>m.id===id?{...m,liked:value}:m)})}
  function prompt(text:string,m:PromptMode){setMode(m);setInput(text);setTimeout(()=>document.querySelector<HTMLTextAreaElement>('.composer textarea')?.focus(),0)}
  const composer=<Composer value={input} onChange={setInput} onSend={()=>send()} busy={busy} mode={mode} setMode={setMode} attachment={attachment} setAttachment={setAttachment} onStop={stop}/>

  return <div className="app-shell">
    {sidebarOpen&&<button className="sidebar-backdrop" aria-label="Close menu" onClick={()=>setSidebarOpen(false)}/>}
    <Sidebar open={sidebarOpen} collapsed={sidebarCollapsed} chats={chats} activeId={activeId} onClose={()=>setSidebarOpen(false)} onCollapse={()=>setSidebarCollapsed(v=>!v)} onNew={newChat} onSelect={selectChat} onDelete={deleteChat} onRename={renameChat} onLogin={()=>setAuthOpen(true)} onSettings={()=>setSettingsOpen(true)} userName={profile?.full_name||user?.email?.split('@')[0]||null} onLogout={signOut}/>
    <main className="main-panel">
      <TopBar onMenu={()=>setSidebarOpen(v=>!v)} onLogin={()=>setAuthOpen(true)} onSettings={()=>setSettingsOpen(true)} signedIn={signedIn} userName={profile?.full_name||user?.email?.split('@')[0]||null}/>
      <div className="chat-scroll">
        {!activeChat ? <Welcome onPrompt={prompt} composer={composer}/> : <div className="messages-container">{activeChat.messages.map((m,i)=>{const isWaiting=m.role==='assistant'&&m.content===''&&busy; return isWaiting ? <div key={m.id} className="thinking-row"><div className="thinking-mark"><span/><span/><span/></div><div>RafaAi is thinking…</div></div> : <Message key={m.id} message={m} onRegenerate={m.role==='assistant'&&i===activeChat.messages.length-1?regenerate:undefined} onFeedback={v=>feedback(m.id,v)}/>})}{error&&<div className="inline-error"><span>{error}</span><button onClick={()=>setError('')}>Dismiss</button></div>}</div>}
      </div>
      {activeChat&&<div className="composer-area"><div className="guest-meter">{!signedIn?<><span>{guestReplies<5?`${5-guestReplies} guest repl${5-guestReplies===1?'y':'ies'} remaining`:'Guest limit reached'}</span><button onClick={()=>setAuthOpen(true)}>{guestReplies>=5?'Log in':'Create account'}</button></>:<span>Signed in · no RafaAi-side message limit</span>}</div>{composer}</div>}
    </main>
    {authOpen&&<AuthModal onClose={()=>setAuthOpen(false)}/>} 
    {settingsOpen&&<SettingsModal onClose={()=>setSettingsOpen(false)} theme={theme} setTheme={setTheme} onChatsCleared={()=>{setChats([]);setActiveId(null);setSettingsOpen(false)}} userName={profile?.full_name||user?.email?.split('@')[0]||null} classLevel={profile?.class_level||null} email={user?.email||null} onProfileUpdated={(name,classLevel)=>setProfile(prev=>prev?{...prev,full_name:name,class_level:classLevel}:prev)} onLogout={signOut}/>}
  </div>
}
function fileToDataUrl(file:File):Promise<string>{return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=reject;r.readAsDataURL(file)})}
function dataUrlToInlineData(dataUrl:string){const match=dataUrl.match(/^data:([^;]+);base64,(.*)$/s);return match?{mime_type:match[1],data:match[2]}:undefined}
