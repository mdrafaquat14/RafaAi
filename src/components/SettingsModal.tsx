import { useState } from 'react'
import type { Theme } from '../types'
import { storage } from '../lib/storage'
import { supabase } from '../lib/supabase'
import { X, Trash, Sparkles, LogOut, User, Settings } from './Icons'

type Language='auto'|'en'|'hi'|'hinglish'
type ResponseStyle='balanced'|'concise'|'detailed'
type Tab='user'|'ai'
interface Props {onClose:()=>void;theme:Theme;setTheme:(t:Theme)=>void;onChatsCleared:()=>void;userName:string|null;classLevel:string|null;email:string|null;onLogout:()=>void;onProfileUpdated:(name:string,classLevel:string)=>void}

export function SettingsModal({onClose,theme,setTheme,onChatsCleared,userName,classLevel,email,onLogout,onProfileUpdated}:Props){
 const [tab,setTab]=useState<Tab>('user'),[language,setLanguage]=useState<Language>(storage.language()),[style,setStyle]=useState<ResponseStyle>(storage.responseStyle())
 const [name,setName]=useState(userName||''),[studentClass,setStudentClass]=useState(classLevel||''),[password,setPassword]=useState(''),[saved,setSaved]=useState(false),[accountError,setAccountError]=useState(''),[accountBusy,setAccountBusy]=useState(false),[logoutOpen,setLogoutOpen]=useState(false)
 async function savePreferences(){storage.saveLanguage(language);storage.saveResponseStyle(style);setSaved(true);setTimeout(()=>setSaved(false),1200)}
 async function saveAccount(){
   if(!supabase||!email)return
   setAccountError('');setAccountBusy(true)
   try{
     const {data,error}=await supabase.functions.invoke('rafaai-account',{body:{fullName:name.trim(),classLevel:studentClass.trim()}})
     if(error)throw error
     if(password.trim()){if(password.length<6)throw new Error('Password must be at least 6 characters.');const {error:pe}=await supabase.auth.updateUser({password});if(pe)throw pe}
     const nextName=String(data?.profile?.full_name||name.trim()),nextClass=String(data?.profile?.class_level||studentClass.trim())
     setName(nextName);setStudentClass(nextClass);setPassword('');onProfileUpdated(nextName,nextClass);setSaved(true);setTimeout(()=>setSaved(false),1200)
   }catch(err:any){setAccountError(err?.message||'Could not update your account.')}finally{setAccountBusy(false)}
 }
 function confirmLogout(){setLogoutOpen(false);onClose();onLogout()}
 return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
  <div className="settings-card">
   <div className="settings-head"><div><div className="eyebrow">RAFAAI SETTINGS</div><h2>Settings</h2><p className="settings-subtitle">Manage your account and how RafaAi responds.</p></div><button className="modal-close" onClick={onClose} aria-label="Close"><X/></button></div>
   <div className="settings-tabs" role="tablist"><button className={tab==='user'?'active':''} onClick={()=>setTab('user')}><User size={16}/> User settings</button><button className={tab==='ai'?'active':''} onClick={()=>setTab('ai')}><Settings size={16}/> AI settings</button></div>
   {tab==='user'?<>
    <div className="settings-section"><h3>Account</h3><div className="account-panel"><div className="account-avatar">{(name||email||'G').slice(0,1).toUpperCase()}</div><div><b>{name||'User'}</b><span>{email||'Not signed in'}</span>{studentClass&&<small>{studentClass}</small>}</div></div></div>
    <div className="settings-section"><h3>Profile</h3><p>Change the name and class shown in your RafaAi account.</p><div className="settings-form-grid"><label>Name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label><label>Class<input value={studentClass} onChange={e=>setStudentClass(e.target.value)} placeholder="e.g. Class 10 / Matric"/></label></div></div>
    <div className="settings-section"><h3>Password</h3><p>Enter a new password only if you want to change it.</p><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="New password (6+ characters)" minLength={6} autoComplete="new-password"/></label></div>
    {accountError&&<div className="form-error">{accountError}</div>}
    <button className="primary-wide settings-save-account" onClick={saveAccount} disabled={accountBusy||!email}>{accountBusy?'Saving…':saved?'Saved ✓':'Save account changes'}</button>
    <div className="settings-section settings-danger-section"><h3>Session</h3><p>Log out of this RafaAi account on this device.</p><button className="danger-wide logout-wide" onClick={()=>setLogoutOpen(true)}><LogOut size={17}/> Log out</button></div>
   </>:<>
    <div className="settings-section"><h3>Appearance</h3><p>Choose how RafaAi looks on this device.</p><div className="segmented"><button className={theme==='light'?'active':''} onClick={()=>setTheme('light')}>Light</button><button className={theme==='dark'?'active':''} onClick={()=>setTheme('dark')}>Dark</button></div></div>
    <div className="settings-section"><h3>Language</h3><p>Choose the language RafaAi should prefer in replies.</p><select value={language} onChange={e=>setLanguage(e.target.value as Language)}><option value="auto">Auto detect</option><option value="en">English</option><option value="hi">हिन्दी</option><option value="hinglish">Hinglish</option></select></div>
    <div className="settings-section"><h3>Response style</h3><p>Control how much detail you usually want.</p><select value={style} onChange={e=>setStyle(e.target.value as ResponseStyle)}><option value="balanced">Balanced</option><option value="concise">Concise</option><option value="detailed">Detailed</option></select></div>
    <div className="settings-section"><h3>Chat data</h3><p>Chats are saved locally on this device.</p><button className="danger-wide" onClick={()=>{if(window.confirm('Delete all locally saved RafaAi chats?')){storage.clearChats();onChatsCleared()}}}><Trash size={17}/> Clear saved chats</button></div>
    <div className="settings-note"><Sparkles size={16}/><span>AI preferences stay on this device. Your account and AI requests are handled through the secure RafaAi backend.</span></div>
    <button className="primary-wide" onClick={savePreferences}>{saved?'Saved ✓':'Save AI preferences'}</button>
   </>}
   {logoutOpen&&<div className="logout-confirm-overlay"><div className="logout-confirm" role="dialog" aria-modal="true"><div className="logout-icon"><LogOut size={20}/></div><h3>Log out of RafaAi?</h3><p>You can log back in anytime with your account email and password.</p><div className="logout-confirm-actions"><button className="secondary-wide" onClick={()=>setLogoutOpen(false)}>Cancel</button><button className="danger-confirm" onClick={confirmLogout}>Log out</button></div></div></div>}
  </div>
 </div>
}