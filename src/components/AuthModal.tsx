import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Logo } from './Logo'
import { X } from './Icons'

type AuthMode='login'|'signup'|'reset'
export function AuthModal({onClose}:{onClose:()=>void}) {
 const [mode,setMode]=useState<AuthMode>(()=>typeof window!=='undefined'&&window.location.hash.includes('type=recovery')?'reset':'login')
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[name,setName]=useState(''),[classLevel,setClassLevel]=useState('')
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[done,setDone]=useState(''),[verificationEmail,setVerificationEmail]=useState('')
 useEffect(()=>{if(mode==='reset')setDone('Choose a new password for your RafaAi account.')},[mode])
 async function submit(e:React.FormEvent){
   e.preventDefault();setError('');setDone('')
   if(!supabase){setError('RafaAi account system is not connected yet.');return}
   setBusy(true)
   try{
    if(mode==='login'){
      const {error}=await supabase.auth.signInWithPassword({email:email.trim(),password});if(error)throw error;onClose()
    }else if(mode==='signup'){
      const redirectTo=window.location.origin+'/'
      const {error,data}=await supabase.auth.signUp({email:email.trim(),password,options:{data:{full_name:name.trim(),class_level:classLevel.trim()},emailRedirectTo:redirectTo}})
      if(error)throw error
      if(data.session){setDone('Account created successfully.');onClose()}
      else setVerificationEmail(email.trim())
    }else{
      const {error}=await supabase.auth.updateUser({password});if(error)throw error
      window.history.replaceState({},document.title,window.location.pathname+window.location.search)
      setDone('Password changed successfully. You are logged in.')
      setTimeout(onClose,900)
    }
   }catch(err:any){setError(err?.message||'Could not complete authentication.')}finally{setBusy(false)}
 }
 async function forgotPassword(){
   if(!supabase||!email.trim()){setError('Enter your account email first.');return}
   setError('');setDone('');setBusy(true)
   try{const {error}=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo:window.location.origin+'/'})
     if(error)throw error
     setDone('Password reset link sent. Check your email.')
   }catch(err:any){setError(err?.message||'Could not send the reset email.')}finally{setBusy(false)}
 }
 async function resendVerification(){
   if(!supabase||!verificationEmail)return
   setError('');setDone('');setBusy(true)
   try{const {error}=await supabase.auth.resend({type:'signup',email:verificationEmail,options:{emailRedirectTo:window.location.origin+'/'}})
     if(error)throw error
     setDone('A new verification email has been sent. Please check your inbox.')
   }catch(err:any){setError(err?.message||'Could not resend the verification email.')}finally{setBusy(false)}
 }
 function switchMode(next:AuthMode){setMode(next);setError('');setDone(next==='reset'?'Choose a new password for your RafaAi account.':'');setVerificationEmail('')}
 return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget&&mode!=='reset'&&!verificationEmail)onClose()}}>
  <div className="auth-card">
   {mode!=='reset'&&<button className="modal-close" onClick={onClose} aria-label="Close"><X/></button>}
   <div className="auth-logo-wrap"><Logo/></div>
   {verificationEmail ? <>
    <div className="auth-verify-icon" aria-hidden="true">✓</div><div className="eyebrow">EMAIL VERIFICATION</div>
    <h2>Check your email</h2><p className="auth-verify-copy">We've sent a verification link to</p>
    <div className="auth-verify-email">{verificationEmail}</div>
    <div className="auth-verify-steps">
      <div><b>1</b><span>Open your email inbox and find the message from RafaAi.</span></div>
      <div><b>2</b><span>Click the verification link to confirm your email address.</span></div>
      <div><b>3</b><span>Return to RafaAi and log in to start using your account.</span></div>
    </div>
    {error&&<div className="form-error">{error}</div>}{done&&<div className="form-success">{done}</div>}
    <button className="primary-wide" onClick={resendVerification} disabled={busy}>{busy?'Sending…':'Resend verification email'}</button>
    <button className="verify-secondary" onClick={()=>setVerificationEmail('')}>Back to sign up</button>
   </> : <>
   <div className="eyebrow">{mode==='login'?'WELCOME BACK':mode==='signup'?'JOIN RAFAAI':'PASSWORD RECOVERY'}</div>
   <h2>{mode==='login'?'Log in to RafaAi':mode==='signup'?'Create your RafaAi account':'Set a new password'}</h2>
   <p>{mode==='login'?'Continue your chats and keep learning.':mode==='signup'?'Save your chats and continue beyond guest mode.':'Create a new password to secure your account.'}</p>
   {mode!=='reset'&&<div className="auth-tabs" role="tablist"><button className={mode==='login'?'active':''} onClick={()=>switchMode('login')}>Log in</button><button className={mode==='signup'?'active signup-tab':''} onClick={()=>switchMode('signup')}>Create account</button></div>}
   <form onSubmit={submit}>
    {mode==='signup'&&<><label>Name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" autoComplete="name" required/></label><label>Class <span className="optional-label">(optional)</span><input value={classLevel} onChange={e=>setClassLevel(e.target.value)} placeholder="e.g. Class 10 / Matric"/></label></>}
    {mode!=='reset'&&<label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required/></label>}
    <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder={mode==='reset'?'New password (6+ characters)':'At least 6 characters'} minLength={6} autoComplete={mode==='login'?'current-password':'new-password'} required/></label>
    {error&&<div className="form-error">{error}</div>}{done&&<div className="form-success">{done}</div>}
    <button className="primary-wide" disabled={busy||!isSupabaseConfigured}>{busy?'Please wait…':mode==='login'?'Log in':mode==='signup'?'Create account':'Change password'}</button>
   </form>
   {mode==='login'&&<div className="auth-helper"><button className="forgot-link" onClick={forgotPassword} disabled={busy}>Forgot password?</button></div>}
   {mode==='login'&&<div className="auth-helper">New here? <button onClick={()=>switchMode('signup')}>Create your account</button></div>}
   {mode==='signup'&&<div className="auth-helper">Already registered? <button onClick={()=>switchMode('login')}>Log in instead</button></div>}
   {mode==='reset'&&<div className="auth-helper">Back to <button onClick={()=>switchMode('login')}>Log in</button></div>}
   </>}
  </div>
 </div>
}