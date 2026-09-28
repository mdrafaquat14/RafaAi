import { useState } from 'react'
import type { Theme } from '../types'
import { storage } from '../lib/storage'
import { X, Trash, Sparkles, LogOut } from './Icons'

type Language='auto'|'en'|'hi'|'hinglish'
type ResponseStyle='balanced'|'concise'|'detailed'
interface Props {onClose:()=>void;theme:Theme;setTheme:(t:Theme)=>void;onChatsCleared:()=>void;userName:string|null;classLevel:string|null;email:string|null;onLogout:()=>void}
export function SettingsModal({onClose,theme,setTheme,onChatsCleared,userName,classLevel,email,onLogout}:Props){
 const [language,setLanguage]=useState<Language>(storage.language()); const [style,setStyle]=useState<ResponseStyle>(storage.responseStyle()); const [saved,setSaved]=useState(false)
 function save(){storage.saveLanguage(language);storage.saveResponseStyle(style);setSaved(true);setTimeout(()=>setSaved(false),1200)}
 return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><div className="settings-card">
   <div className="settings-head"><div><div className="eyebrow">RAFAAI PREFERENCES</div><h2>Settings</h2><p className="settings-subtitle">Make RafaAi feel right for your study style.</p></div><button className="modal-close" onClick={onClose} aria-label="Close"><X/></button></div>
   <div className="settings-section"><h3>Account</h3><div className="account-panel"><div className="account-avatar">{(userName||email||'G').slice(0,1).toUpperCase()}</div><div><b>{userName||'Guest account'}</b><span>{email||'Not signed in'}</span>{classLevel&&<small>{classLevel}</small>}</div></div></div>
   <div className="settings-section"><h3>Appearance</h3><p>Choose how RafaAi looks on this device.</p><div className="segmented"><button className={theme==='light'?'active':''} onClick={()=>setTheme('light')}>Light</button><button className={theme==='dark'?'active':''} onClick={()=>setTheme('dark')}>Dark</button></div></div>
   <div className="settings-section"><h3>Language</h3><p>Choose the language RafaAi should prefer in replies.</p><select value={language} onChange={e=>setLanguage(e.target.value as Language)}><option value="auto">Auto detect</option><option value="en">English</option><option value="hi">हिन्दी</option><option value="hinglish">Hinglish</option></select></div>
   <div className="settings-section"><h3>Response style</h3><p>Control how much detail you usually want.</p><select value={style} onChange={e=>setStyle(e.target.value as ResponseStyle)}><option value="balanced">Balanced</option><option value="concise">Concise</option><option value="detailed">Detailed</option></select></div>
   <div className="settings-section"><h3>Chat data</h3><p>Chats are saved locally on this device.</p><button className="danger-wide" onClick={()=>{if(window.confirm('Delete all locally saved RafaAi chats?')){storage.clearChats();onChatsCleared()}}}><Trash size={17}/> Clear saved chats</button></div>
   <div className="settings-note"><Sparkles size={16}/><span>Preferences stay on this device. Your account and AI requests are handled through the secure RafaAi backend.</span></div>
   <div className="settings-actions"><button className="secondary-wide" onClick={()=>{onClose();if(email)onLogout()}} disabled={!email}><LogOut size={16}/> Log out</button><button className="primary-wide" onClick={save}>{saved?'Saved ✓':'Save preferences'}</button></div>
 </div></div>
}
