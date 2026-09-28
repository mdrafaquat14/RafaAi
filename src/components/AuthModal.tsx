import { useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { X, Sparkles } from './Icons'

export function AuthModal({onClose}:{onClose:()=>void}) {
  const [mode,setMode]=useState<'login'|'signup'>('login')
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [name,setName]=useState(''); const [busy,setBusy]=useState(false); const [error,setError]=useState(''); const [done,setDone]=useState('')
  async function submit(e:React.FormEvent){e.preventDefault();setError('');setDone('');if(!supabase){setError('Connect Supabase in Vercel environment variables first.');return}setBusy(true);try{if(mode==='login'){const {error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;onClose()}else{const {error,data}=await supabase.auth.signUp({email,password,options:{data:{full_name:name}}});if(error)throw error;setDone(data.session?'Account created.':'Account created. Check your email if confirmation is enabled.')}}catch(err:any){setError(err?.message||'Could not complete authentication.')}finally{setBusy(false)}}
  return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
    <div className="auth-card">
      <button className="modal-close" onClick={onClose}><X/></button>
      <div className="auth-mark"><Sparkles/></div>
      <div className="eyebrow">WELCOME TO RAFAAI</div>
      <h2>{mode==='login'?'Welcome back':'Create your RafaAi account'}</h2>
      <p>{mode==='login'?'Continue your chats and keep learning.':'Save your chats and continue beyond guest mode.'}</p>
      <form onSubmit={submit}>
        {mode==='signup'&&<label>Name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" required/></label>}
        <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required/></label>
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" minLength={6} required/></label>
        {error&&<div className="form-error">{error}</div>}{done&&<div className="form-success">{done}</div>}
        <button className="primary-wide" disabled={busy||!isSupabaseConfigured}>{busy?'Please wait…':mode==='login'?'Log in':'Create account'}</button>
      </form>
      <button className="auth-switch" onClick={()=>{setMode(mode==='login'?'signup':'login');setError('');setDone('')}}>{mode==='login'?"Don't have an account? Create one":"Already have an account? Log in"}</button>
    </div>
  </div>
}
