import { useEffect, useRef, useState } from 'react'
import type { PromptMode } from '../types'
import { ImageIcon, Paperclip, Send, Sparkles, X } from './Icons'

interface Props { value:string; onChange:(v:string)=>void; onSend:()=>void; busy:boolean; mode:PromptMode; setMode:(m:PromptMode)=>void; attachment:File|null; setAttachment:(f:File|null)=>void; onStop:()=>void; compact?:boolean }
export function Composer({value,onChange,onSend,busy,mode,setMode,attachment,setAttachment,onStop,compact}:Props) {
  const inputRef=useRef<HTMLTextAreaElement>(null)
  const fileRef=useRef<HTMLInputElement>(null)
  const composerRef=useRef<HTMLDivElement>(null)
  const [dragging,setDragging]=useState(false)
  const [toolsOpen,setToolsOpen]=useState(false)
  function handleKey(e:React.KeyboardEvent<HTMLTextAreaElement>){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();if(!busy)onSend()}}
  function chooseFile(file:File|null){if(!file)return;if(file.size>4*1024*1024){window.alert('Please choose a file smaller than 4 MB.');return}setAttachment(file);setToolsOpen(false);setDragging(false)}
  useEffect(()=>{
    if(!toolsOpen) return
    const onPointerDown=(event:PointerEvent)=>{
      const target=event.target as Node|null
      if(target && composerRef.current?.contains(target)) return
      setToolsOpen(false)
    }
    document.addEventListener('pointerdown',onPointerDown)
    return ()=>document.removeEventListener('pointerdown',onPointerDown)
  },[toolsOpen])
  function handleDragOver(e:React.DragEvent<HTMLDivElement>){e.preventDefault();if(!busy)setDragging(true)}
  function handleDragLeave(e:React.DragEvent<HTMLDivElement>){if(!e.currentTarget.contains(e.relatedTarget as Node|null))setDragging(false)}
  function handleDrop(e:React.DragEvent<HTMLDivElement>){e.preventDefault();if(busy)return;chooseFile(e.dataTransfer.files?.[0]||null)}
  return <div ref={composerRef} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`composer ${compact?'composer-compact':''} ${busy?'is-busy':''} ${dragging?'is-dragging':''}`}>
    {dragging&&<div className="drop-overlay"><div><Paperclip size={22}/><b>Drop file here</b><span>Images, PDF or supported documents · max 4 MB</span></div></div>}
    {attachment&&<div className="attachment-preview">{attachment.type.startsWith('image/')?<ImageIcon size={16}/>:<Paperclip size={16}/>}<span>{attachment.name}</span><button onClick={()=>setAttachment(null)} disabled={busy} aria-label="Remove attachment"><X size={15}/></button></div>}
    <div className="composer-main">
      <button className={`composer-tool ${toolsOpen?'selected':''}`} onClick={()=>setToolsOpen(!toolsOpen)} disabled={busy} aria-label="Add attachment"><Paperclip/></button>
      <textarea ref={inputRef} value={value} onChange={e=>onChange(e.target.value)} onKeyDown={handleKey} placeholder={busy?'RafaAi is thinking…':'Ask RafaAi anything…'} rows={1} disabled={busy}/>
      <div className="composer-right">
        {busy ? <button className="send-button generating" disabled aria-label="RafaAi is generating"><span className="send-spinner"/></button> : <button className="send-button" onClick={onSend} disabled={!value.trim()} aria-label="Send"><Send/></button>}
      </div>
    </div>
    {toolsOpen&&!busy&&<div className="tool-popover">
      <button onClick={()=>{fileRef.current?.click();setToolsOpen(false)}}><Paperclip/> Add file</button>
      <button onClick={()=>{setMode('Study');setToolsOpen(false)}}><Sparkles/> Study mode <small>UI ready</small></button>
    </div>}
    <input ref={fileRef} type="file" accept="image/*,application/pdf,text/plain,text/csv,text/html,text/css,text/xml,text/rtf,text/javascript,application/json" hidden onChange={e=>chooseFile(e.target.files?.[0]||null)}/>
    <div className="composer-meta"><span>{mode} mode</span><span>Enter to send · Shift + Enter for new line</span></div>
  </div>
}
