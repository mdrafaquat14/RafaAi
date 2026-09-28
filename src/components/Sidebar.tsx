import { useMemo, useState } from 'react'
import type { ChatSession } from '../types'
import { Logo } from './Logo'
import { EditIcon, LogOutIcon, MenuIcon, PlusIcon, SearchIcon, TrashIcon, XIcon } from './Icons'

interface Props {
  open: boolean
  chats: ChatSession[]
  activeId: string | null
  onClose: () => void
  onNew: () => void
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, title: string) => void
  onLogin: () => void
  userName?: string | null
  onLogout?: () => void
}

export function Sidebar({ open, chats, activeId, onClose, onNew, onSelect, onDelete, onRename, onLogin, userName, onLogout }: Props) {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => chats.filter(c => c.title.toLowerCase().includes(query.toLowerCase())), [chats, query])
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState('')

  return <>
    <div className={`sidebar-overlay ${open ? 'show' : ''}`} onClick={onClose} />
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-head">
        <Logo small />
        <button className="icon-button mobile-only" onClick={onClose} aria-label="Close sidebar"><XIcon /></button>
      </div>
      <button className="new-chat-button" onClick={onNew}><PlusIcon /> <span>New chat</span><kbd>⌘K</kbd></button>
      <div className="search-box"><SearchIcon /><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search chats" aria-label="Search chats" /></div>
      <div className="chat-list">
        <div className="list-label">Recent</div>
        {filtered.length === 0 && <div className="empty-side">No chats found.</div>}
        {filtered.map(chat => <div key={chat.id} className={`chat-row ${activeId===chat.id?'active':''}`}>
          {editing===chat.id ? <input className="rename-input" value={draft} autoFocus onChange={e=>setDraft(e.target.value)} onBlur={()=>{onRename(chat.id,draft);setEditing(null)}} onKeyDown={e=>{if(e.key==='Enter'){onRename(chat.id,draft);setEditing(null)}}} /> : <button className="chat-title" onClick={()=>{onSelect(chat.id);onClose()}}>{chat.title}</button>}
          <div className="chat-actions">
            <button className="tiny-icon" onClick={()=>{setEditing(chat.id);setDraft(chat.title)}} aria-label="Rename"><EditIcon /></button>
            <button className="tiny-icon danger" onClick={()=>onDelete(chat.id)} aria-label="Delete"><TrashIcon /></button>
          </div>
        </div>)}
      </div>
      <div className="sidebar-bottom">
        <a className="focus-link" href="https://rafafocus.vercel.app" target="_blank" rel="noreferrer">Open RafaFocus <span>↗</span></a>
        {userName ? <div className="account-card"><div className="avatar">{userName.trim().slice(0,1).toUpperCase()}</div><div className="account-info"><strong>{userName}</strong><span>Signed in</span></div><button className="tiny-icon" onClick={onLogout} aria-label="Log out"><LogOutIcon /></button></div> : <button className="login-side" onClick={onLogin}><span>Log in</span><span>→</span></button>}
      </div>
    </aside>
    <button className="mobile-menu-button" onClick={onClose} aria-label="Menu"><MenuIcon /></button>
  </>
}
