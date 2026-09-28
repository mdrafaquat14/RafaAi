import { useState } from 'react'
import type { ChatMessage } from '../types'
import { Copy, Refresh, ThumbsDown, ThumbsUp } from './Icons'

export function Message({message,onRegenerate,onFeedback}:{message:ChatMessage;onRegenerate?:()=>void;onFeedback:(v:boolean)=>void}) {
  const [copied,setCopied]=useState(false)
  async function copy(){try{await navigator.clipboard.writeText(message.content);setCopied(true);setTimeout(()=>setCopied(false),1300)}catch{}}
  const isAi=message.role==='assistant'
  return <article className={`message ${isAi?'ai-message':'user-message'}`}>
    <div className="message-avatar">{isAi?'R':'You'}</div>
    <div className="message-body">
      <div className="message-label">{isAi?'RafaAi':'You'}</div>
      {message.attachmentName&&<div className="message-attachment">{message.attachmentName}</div>}
      <div className="message-text">{message.content.split('\n').map((line,i)=><span key={i}>{line}{i<message.content.split('\n').length-1&&<br/>}</span>)}</div>
      {isAi&&<div className="message-actions">
        <button onClick={copy} title="Copy"><Copy size={15}/>{copied&&<span>Copied</span>}</button>
        {onRegenerate&&<button onClick={onRegenerate} title="Regenerate"><Refresh size={15}/></button>}
        <button className={message.liked===true?'active':''} onClick={()=>onFeedback(true)} title="Helpful"><ThumbsUp size={15}/></button>
        <button className={message.liked===false?'active':''} onClick={()=>onFeedback(false)} title="Not helpful"><ThumbsDown size={15}/></button>
      </div>}
    </div>
  </article>
}
