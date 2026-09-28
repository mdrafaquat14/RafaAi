import { useMemo, useState } from 'react'
import type { ChatSession } from '../types'
import { Logo } from './Logo'
import { BookOpen, ChevronLeft, MessageSquare, More, Plus, Search, Settings, Trash } from './Icons'

interface Props {
  open:boolean; collapsed:boolean; chats:ChatSession[]; activeId:string|null; onClose:()=>void; onCollapse:()=>void; onNew:()=>void; onSelect:(id:string)=>void; onDelete:(id:string)=>void; onRename:(id:string,title:string)=>void; onLogin:()=>void; onSettings:()=>void; userName:string|null; onLogout:()=>void
}
export function Sidebar({open,collapsed,chats,activeId,onClose,onCollapse,onNew,onSelect,onDelete,onRename,onLogin,onSettings,userName,onLogout}:Props){
  const [query,setQuery]=useState(''); const [menuId,setMenuId]=useState<string|null>(null)
  const filtered=useMemo(()=>chats.filter(c=>c.title.toLowerCase().includes(query.toLowerCase())),[chats,query])
  return <aside className={`sidebar ${open?'is-open':''} ${collapsed?'is-collapsed':''}`}>
    <div className="sidebar-head">
      <button className="brand-button" onClick={onNew} aria-label="New chat"><Logo compact />{!collapsed&&<span className="brand-head-name">RafaAi</span>}</button>
      <button className="icon-button sidebar-collapse" onClick={onCollapse} aria-label={collapsed?'Expand sidebar':'Collapse sidebar'}>{collapsed?<span className="collapse-glyph">›</span>:<ChevronLeft/>}</button>
    </div>
    <div className="sidebar-body">
      <button className="new-chat-button" onClick={onNew}><Plus/><span>New chat</span></button>
      <div className="search-box"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search chats" aria-label="Search chats"/></div>
      {!collapsed&&<>
        <div className="section-label">Recent</div>
        <div className="chat-list">
          {filtered.length===0?<div className="empty-chats">{query?'No matching chats':'Your recent chats will appear here.'}</div>:filtered.map(chat=><div key={chat.id} className={`chat-row ${activeId===chat.id?'active':''}`}>
            <button className="chat-select" onClick={()=>onSelect(chat.id)}><MessageSquare size={17}/><span>{chat.title}</span></button>
            <button className="chat-more" onClick={()=>setMenuId(menuId===chat.id?null:chat.id)} aria-label="Chat options"><More size={17}/></button>
            {menuId===chat.id&&<div className="chat-menu">
              <button onClick={()=>{const next=window.prompt('Rename chat',chat.title);if(next)onRename(chat.id,next);setMenuId(null)}}>Rename</button>
              <button className="danger" onClick={()=>{onDelete(chat.id);setMenuId(null)}}><Trash size={15}/> Delete</button>
            </div>}
          </div>)}
        </div>
      </>}
      <div className="sidebar-spacer"/>
      <div className="sidebar-links">
        <button className="side-link" onClick={()=>window.open('https://rafafocus.vercel.app','_blank','noopener,noreferrer')}><BookOpen/><span>Open RafaFocus</span></button>
        <button className="side-link" onClick={onSettings}><Settings/><span>Settings</span></button>
      </div>
    </div>
    <div className="sidebar-footer">
      {userName?<button className="profile-row" onClick={onLogout}><span className="avatar">{userName.slice(0,1).toUpperCase()}</span><span className="profile-copy"><b>{userName}</b><small>Log out</small></span></button>:<button className="sidebar-login" onClick={onLogin}><span>Log in</span><span>→</span></button>}
    </div>
  </aside>
}
