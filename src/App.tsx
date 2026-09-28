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

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2,9)}`

export default function App() {
  const [theme,setTheme] = useState<Theme>(storage.theme())
  const [chats,setChats] = useState<ChatSession[]>(storage.chats())
  const [activeId,setActiveId] = useState<string|null>(null)
  const [sidebarOpen,setSidebarOpen] = useState(false)
  const [authOpen,setAuthOpen] = useState(false)
  const [user,setUser] = useState<{id:string;email?:string}|null>(null)
  const [profile,setProfile] = useState<Profile|null>(null)
  const [input,setInput] = useState('')
  const [busy,setBusy] = useState(false)
  const [mode,setMode] = useState<PromptMode>('Explain')
  const [attachment,setAttachment] = useState<File|null>(null)
  const [error,setError] = useState('')

  const activeChat = useMemo(()=>chats.find(c=>c.id===activeId)||null,[chats,activeId])
  const guestUsed = storage.guestQuestions()
  const signedIn = Boolean(user)

  useEffect(()=>{ document.documentElement.dataset.theme=theme; storage.saveTheme(theme) },[theme])
  useEffect(()=>{ storage.saveChats(chats) },[chats])

  useEffect(()=>{
    if(!supabase) return
    supabase.auth.getSession().then(async ({data})=>{
      const session=data.session
      setUser(session?.user?{id:session.user.id,email:session.user.email}:null)
      if(session?.user) setProfile(await getProfile(session.user.id).catch(()=>null))
    })
    const {data:listener}=supabase.auth.onAuthStateChange(async (_event,session)=>{
      setUser(session?.user?{id:session.user.id,email:session.user.email}:null)
      if(session?.user) setProfile(await getProfile(session.user.id).catch(()=>null))
      else setProfile(null)
    })
    return ()=>listener.subscription.unsubscribe()
  },[])

  function updateChat(next: ChatSession) { setChats(prev=>prev.map(c=>c.id===next.id?next:c)) }
  function newChat() { setActiveId(null); setInput(''); setError(''); setAttachment(null); setSidebarOpen(false) }
  function selectChat(id:string) { setActiveId(id); setError('') }
  function deleteChat(id:string) { setChats(prev=>prev.filter(c=>c.id!==id)); if(activeId===id)setActiveId(null) }
  function renameChat(id:string,title:string) { const t=title.trim(); if(!t)return; setChats(prev=>prev.map(c=>c.id===id?{...c,title:t}:c)) }

  async function signOut(){await supabase?.auth.signOut();setUser(null);setProfile(null);newChat()}

  function ensureChat(title:string):ChatSession {
    if(activeChat) return activeChat
    const chat:ChatSession={id:uid(),title:title.slice(0,48)||'New chat',createdAt:Date.now(),updatedAt:Date.now(),messages:[]}
    setChats(prev=>[chat,...prev])
    setActiveId(chat.id)
    return chat
  }

  async function send(text=input) {
    const clean=text.trim(); if(!clean || busy)return
    setError('')
    if(!signedIn && storage.guestQuestions()>=3){ setAuthOpen(true); return }
    const chat=ensureChat(clean)
    const imageDataUrl = attachment && attachment.type.startsWith('image/') ? await fileToDataUrl(attachment) : undefined
    const userMsg:ChatMessage={id:uid(),role:'user',content:clean,createdAt:Date.now(),attachmentName:attachment?.name,imageDataUrl}
    const nextMessages=[...chat.messages,userMsg]
    updateChat({...chat,messages:nextMessages,updatedAt:Date.now()})
    setInput(''); setAttachment(null); setBusy(true)
    try {
      if(!isSupabaseConfigured) throw new Error('RafaAi backend is not connected yet. Add the Supabase environment variables from .env.example.')
      const contents = nextMessages.map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}, ...(m.role==='user' && m.imageDataUrl ? [{inline_data: dataUrlToInlineData(m.imageDataUrl)}] : [])]}))
      const payload=await generateAnswer({contents,guest:!signedIn,guestQuestionNumber:!signedIn?storage.guestQuestions()+1:undefined})
      const answer=extractText(payload)
      const assistant:ChatMessage={id:uid(),role:'assistant',content:answer,createdAt:Date.now()}
      updateChat({...chat,messages:[...nextMessages,assistant],updatedAt:Date.now()})
      if(!signedIn) storage.incrementGuestQuestions()
    } catch(err:any) {
      if(err?.status===401){setAuthOpen(true);setError('Please log in to continue.');return}
      if(err?.status===403){setError('This account is currently restricted from using RafaAi.');return}
      setError(err?.message||'Something went wrong while generating the answer.')
    } finally { setBusy(false) }
  }

  async function regenerate(){
    if(!activeChat || busy)return
    const lastUser=[...activeChat.messages].reverse().find(m=>m.role==='user'); if(!lastUser)return
    const withoutAssistant=[...activeChat.messages]; if(withoutAssistant.at(-1)?.role==='assistant')withoutAssistant.pop()
    updateChat({...activeChat,messages:withoutAssistant,updatedAt:Date.now()});
    setBusy(true); setError('')
    try {
      const contents=withoutAssistant.map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}, ...(m.role==='user' && m.imageDataUrl ? [{inline_data: dataUrlToInlineData(m.imageDataUrl)}] : [])]}))
      const payload=await generateAnswer({contents,guest:!signedIn,guestQuestionNumber:!signedIn?storage.guestQuestions()+1:undefined})
      updateChat({...activeChat,messages:[...withoutAssistant,{id:uid(),role:'assistant',content:extractText(payload),createdAt:Date.now()}],updatedAt:Date.now()})
      if(!signedIn) storage.incrementGuestQuestions()
    }catch(err:any){setError(err?.message||'Could not regenerate the answer.')}finally{setBusy(false)}
  }

  function stop(){setBusy(false)}
  function feedback(id:string,value:boolean){if(!activeChat)return;updateChat({...activeChat,messages:activeChat.messages.map(m=>m.id===id?{...m,liked:value}:m)})}
  function prompt(text:string,m:PromptMode){setMode(m);setInput(text);setTimeout(()=>document.querySelector<HTMLTextAreaElement>('.composer textarea')?.focus(),0)}

  return <div className="app-shell">
    <Sidebar open={sidebarOpen} chats={chats} activeId={activeId} onClose={()=>setSidebarOpen(false)} onNew={newChat} onSelect={selectChat} onDelete={deleteChat} onRename={renameChat} onLogin={()=>setAuthOpen(true)} userName={profile?.full_name||user?.email?.split('@')[0]||null} onLogout={signOut}/>
    <main className="main-panel">
      <TopBar theme={theme} setTheme={setTheme} onMenu={()=>setSidebarOpen(true)} signedIn={signedIn}/>
      <div className="chat-scroll">
        {!activeChat ? <Welcome onPrompt={prompt}/> : <div className="messages-container">{activeChat.messages.map((m,i)=><Message key={m.id} message={m} onRegenerate={m.role==='assistant'&&i===activeChat.messages.length-1?regenerate:undefined} onFeedback={v=>feedback(m.id,v)}/>) }{busy&&<div className="thinking-row"><div className="thinking-mark"><span/><span/><span/></div><div>RafaAi is thinking</div></div>}{error&&<div className="inline-error">{error}<button onClick={()=>setError('')}>Dismiss</button></div>}</div>}
      </div>
      <div className="composer-area">
        {!signedIn && <div className="guest-meter"><span>{guestUsed < 3 ? `${3-guestUsed} guest question${3-guestUsed===1?'':'s'} left` : 'Login required to continue'}</span><button onClick={()=>setAuthOpen(true)}>{guestUsed>=3?'Log in':'Create account'}</button></div>}
        <Composer value={input} onChange={setInput} onSend={()=>send()} busy={busy} mode={mode} setMode={setMode} attachment={attachment} setAttachment={setAttachment} onStop={stop}/>
      </div>
    </main>
    {authOpen&&<AuthModal onClose={()=>setAuthOpen(false)}/>} 
  </div>
}

function fileToDataUrl(file:File):Promise<string>{return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=reject;r.readAsDataURL(file)})}

function dataUrlToInlineData(dataUrl:string){const match=dataUrl.match(/^data:([^;]+);base64,(.*)$/s);return match?{mime_type:match[1],data:match[2]}:undefined}
