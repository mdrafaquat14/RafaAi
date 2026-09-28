import { useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Logo } from './Logo'
import { X } from './Icons'

export function AuthModal({onClose}:{onClose:()=>void}) {
  const [mode,setMode]=useState<'login'|'signup'>('login')
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [name,setName]=useState(''); const [classLevel,setClassLevel]=useState('');
  const [busy,setBusy]=useState(false); const [error,setError]=useState(''); const [done,setDone]=useState('')
  async function submit(e:React.FormEvent){
    e.preventDefault();setError('');setDone('')
    if(!supabase){setError('RafaAi account system is not connected yet.');return}
    setBusy(true)
    try{
      if(mode==='login'){
        const {error}=await supabase.auth.signInWithPassword({email:email.trim(),password});if(error)throw error;onClose()
      }else{
        const redirectTo = `${window.location.origin}/`
        const {error,data}=await supabase.auth.signUp({email:email.trim(),password,options:{data:{full_name:name.trim(),class_level:classLevel.trim()},emailRedirectTo:redirectTo}});
        if(error)throw error
        setDone(data.session?'Account created successfully.':'Account created. Check your email if confirmation is enabled.')
        if(data.session) onClose()
      }
    }catch(err:any){setError(err?.message||'Could not complete authentication.')}finally{setBusy(false)}
  }
  function switchMode(next:'login'|'signup'){setMode(next);setError('');setDone('')}
  return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
    <div className="auth-card">
      <button className="modal-close" onClick={onClose} aria-label="Close"><X/></button>
      <div className="auth-logo-wrap"><Logo/></div>
      <div className="eyebrow">{mode==='login'?'WELCOME BACK':'JOIN RAFAAI'}</div>
      <h2>{mode==='login'?'Log in to RafaAi':'Create your RafaAi account'}</h2>
      <p>{mode==='login'?'Continue your chats and keep learning.':'Save your chats and continue beyond guest mode.'}</p>

      <div className="auth-tabs" role="tablist">
        <button className={mode==='login'?'active':''} onClick={()=>switchMode('login')} role="tab">Log in</button>
        <button className={mode==='signup'?'active signup-tab':''} onClick={()=>switchMode('signup')} role="tab">Create account</button>
      </div>

      <form onSubmit={submit}>
        {mode==='signup'&&<>
          <label>Name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" autoComplete="name" required/></label>
          <label>Class<input value={classLevel} onChange={e=>setClassLevel(e.target.value)} placeholder="e.g. Class 10 / Matric" autoComplete="organization-title" required/></label>
        </>}
        <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required/></label>
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 6 characters" minLength={6} autoComplete={mode==='login'?'current-password':'new-password'} required/></label>
        {error&&<div className="form-error">{error}</div>}{done&&<div className="form-success">{done}</div>}
        <button className="primary-wide" disabled={busy||!isSupabaseConfigured}>{busy?'Please wait…':mode==='login'?'Log in':'Create account'}</button>
      </form>
      {mode==='login'&&<div className="auth-helper">New here? <button onClick={()=>switchMode('signup')}>Create your account</button></div>}
      {mode==='signup'&&<div className="auth-helper">Already registered? <button onClick={()=>switchMode('login')}>Log in instead</button></div>}
    </div>
  </div>
}
