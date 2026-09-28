import { useState } from 'react'
import type { Theme } from '../types'
import { storage } from '../lib/storage'
import { X, Trash, Sparkles } from './Icons'

type Language='auto'|'en'|'hi'|'hinglish'
type ResponseStyle='balanced'|'concise'|'detailed'
export function SettingsModal({onClose,theme,setTheme,onChatsCleared}:{onClose:()=>void;theme:Theme;setTheme:(t:Theme)=>void;onChatsCleared:()=>void}){
 const [language,setLanguage]=useState<Language>(storage.language()); const [style,setStyle]=useState<ResponseStyle>(storage.responseStyle()); const [saved,setSaved]=useState(false)
 function save(){storage.saveLanguage(language);storage.saveResponseStyle(style);setSaved(true);setTimeout(()=>setSaved(false),1200)}
 return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><div className="settings-card">
  <div className="settings-head"><div><div className="eyebrow">RAFAAI PREFERENCES</div><h2>Settings</h2></div><button className="modal-close" onClick={onClose}><X/></button></div>
  <div className="settings-section"><h3>Appearance</h3><div className="segmented"><button className={theme==='light'?'active':''} onClick={()=>setTheme('light')}>Light</button><button className={theme==='dark'?'active':''} onClick={()=>setTheme('dark')}>Dark</button></div></div>
  <div className="settings-section"><h3>Language</h3><select value={language} onChange={e=>setLanguage(e.target.value as Language)}><option value="auto">Auto detect</option><option value="en">English</option><option value="hi">हिन्दी</option><option value="hinglish">Hinglish</option></select></div>
  <div className="settings-section"><h3>Response style</h3><select value={style} onChange={e=>setStyle(e.target.value as ResponseStyle)}><option value="balanced">Balanced</option><option value="concise">Concise</option><option value="detailed">Detailed</option></select></div>
  <div className="settings-section"><h3>Local chat data</h3><button className="danger-wide" onClick={()=>{if(window.confirm('Delete all locally saved RafaAi chats?')){storage.clearChats();onChatsCleared();}}}><Trash size={17}/> Clear saved chats</button></div>
  <div className="settings-note"><Sparkles size={16}/> Theme, language and response preferences are saved on this device.</div>
  <button className="primary-wide" onClick={save}>{saved?'Saved ✓':'Save preferences'}</button>
 </div></div>
}
