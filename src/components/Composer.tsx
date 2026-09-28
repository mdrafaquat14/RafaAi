import { useRef } from 'react'
import type { ChangeEvent, KeyboardEvent } from 'react'
import type { PromptMode } from '../types'
import { ArrowUpIcon, ImageIcon, PaperclipIcon, SearchIcon, StopIcon, XIcon } from './Icons'

const modes: PromptMode[] = ['Explain','Solve','Write','Practice','Search']

export function Composer({ value, onChange, onSend, busy, mode, setMode, attachment, setAttachment, onStop }: {
  value:string; onChange:(v:string)=>void; onSend:()=>void; busy:boolean; mode:PromptMode; setMode:(m:PromptMode)=>void; attachment?:File|null; setAttachment:(f:File|null)=>void; onStop:()=>void
}) {
  const inputRef=useRef<HTMLTextAreaElement | null>(null); const fileRef=useRef<HTMLInputElement | null>(null)
  function key(e:KeyboardEvent<HTMLTextAreaElement>){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();if(value.trim()&&!busy)onSend()}}
  function choose(e:ChangeEvent<HTMLInputElement>){const f=e.target.files?.[0];if(f)setAttachment(f);e.target.value=''}
  return <div className="composer-wrap">
    <div className="mode-row">{modes.map(m=><button key={m} className={`mode-pill ${mode===m?'active':''}`} onClick={()=>setMode(m)}>{m}</button>)}</div>
    <div className={`composer ${busy?'busy':''}`}>
      {attachment && <div className="attachment-preview"><span>📎 {attachment.name}</span><button onClick={()=>setAttachment(null)} aria-label="Remove attachment"><XIcon /></button></div>}
      <textarea ref={inputRef} value={value} onChange={e=>onChange(e.target.value)} onKeyDown={key} placeholder={busy?'RafaAi is thinking…':'Ask RafaAi anything…'} rows={1} aria-label="Message RafaAi" />
      <div className="composer-actions"><input ref={fileRef} type="file" accept="image/*,.pdf,.txt,.md,.doc,.docx" hidden onChange={choose}/><button className="tool-button" onClick={()=>fileRef.current?.click()} title="Attach file"><PaperclipIcon /></button><button className="tool-button image-tool" onClick={()=>{if(fileRef.current){fileRef.current.accept='image/*';fileRef.current.click()}}} title="Add image"><ImageIcon /></button><button className="tool-button" onClick={()=>setMode('Search')} title="Search mode"><SearchIcon /></button><button className={`send-button ${busy?'stop':''}`} disabled={!busy&&!value.trim()} onClick={busy?onStop:onSend} aria-label={busy?'Stop generation':'Send message'}>{busy?<StopIcon/>:<ArrowUpIcon/>}</button></div>
    </div>
    <div className="composer-note">RafaAi can make mistakes. Check important answers. <span>Shift + Enter for a new line</span></div>
  </div>
}
