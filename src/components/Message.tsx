import { useState } from 'react'
import type { ChatMessage } from '../types'
import { CopyIcon, RefreshIcon, ThumbsDownIcon, ThumbsUpIcon } from './Icons'
import { Logo } from './Logo'

function renderText(text: string) {
  const lines = text.split(/\n/)
  return lines.map((line, i) => {
    const trimmed = line.trim()
    if (!trimmed) return <div key={i} className="md-space" />
    if (/^#{1,3}\s/.test(trimmed)) return <h3 key={i}>{trimmed.replace(/^#{1,3}\s/, '')}</h3>
    if (/^[-*]\s/.test(trimmed)) return <div key={i} className="md-list">• {trimmed.replace(/^[-*]\s/, '')}</div>
    if (/^\d+\.\s/.test(trimmed)) return <div key={i} className="md-list">{trimmed}</div>
    const parts = trimmed.split(/(`[^`]+`)/g)
    return <p key={i}>{parts.map((part,j)=>part.startsWith('`')&&part.endsWith('`')?<code key={j}>{part.slice(1,-1)}</code>:part)}</p>
  })
}

export function Message({ message, onRegenerate, onFeedback }: { message: ChatMessage; onRegenerate?: ()=>void; onFeedback?: (value:boolean)=>void }) {
  const [copied, setCopied] = useState(false)
  async function copy() { await navigator.clipboard?.writeText(message.content); setCopied(true); setTimeout(()=>setCopied(false), 1200) }
  if (message.role === 'user') return <div className="message-row user-row"><div className="user-message">{message.imageDataUrl && <img className="message-image" src={message.imageDataUrl} alt="Attached" />}{message.attachmentName && <div className="attachment-chip">📎 {message.attachmentName}</div>}<div>{message.content}</div></div></div>
  return <div className="message-row assistant-row"><div className="assistant-mark"><Logo small /></div><div className="assistant-body"><div className="assistant-text">{renderText(message.content)}</div><div className="message-tools"><button onClick={copy} title="Copy"><CopyIcon />{copied && <span>Copied</span>}</button><button onClick={onRegenerate} title="Regenerate"><RefreshIcon /></button><button className={message.liked===true?'selected':''} onClick={()=>onFeedback?.(true)} title="Helpful"><ThumbsUpIcon /></button><button className={message.liked===false?'selected':''} onClick={()=>onFeedback?.(false)} title="Not helpful"><ThumbsDownIcon /></button></div></div></div>
}
