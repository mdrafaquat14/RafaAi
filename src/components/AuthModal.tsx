import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Logo } from './Logo'
import { Eye, EyeOff, X } from './Icons'

type AuthMode='login'|'signup'|'reset'

function isRecoveryUrl(){
  if(typeof window==='undefined') return false
  return window.location.hash.includes('type=recovery') || new URLSearchParams(window.location.search).get('type')==='recovery'
}

export function AuthModal({onClose}:{onClose:()=>void}) {
 const [mode,setMode]=useState<AuthMode>(()=>isRecoveryUrl()?'reset':'login')
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[confirmPassword,setConfirmPassword]=useState(''),[name,setName]=useState(''),[classLevel,setClassLevel]=useState('')
 const [showPassword,setShowPassword]=useState(false),[showConfirmPassword,setShowConfirmPassword]=useState(false)
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[done,setDone]=useState(''),[verificationEmail,setVerificationEmail]=useState(''),[resetSent,setResetSent]=useState(false),[resendCooldown,setResendCooldown]=useState(0)

 useEffect(()=>{if(mode==='reset'){setDone('Choose a new password for your RafaAi account.');setResetSent(false)}},[mode])

 async function submit(e:React.FormEvent){
   e.preventDefault();setError('');setDone('')
   if(!supabase){setError('RafaAi account system is not connected yet.');return}
   if(mode==='reset' && password!==confirmPassword){setError('Passwords do not match.');return}
   setBusy(true)
   try{
    if(mode==='login'){
      const {error}=await supabase.auth.signInWithPassword({email:email.trim(),password});if(error)throw error;onClose()
    }else if(mode==='signup'){
      const redirectTo=window.location.origin+'/'
      const {error,data}=await supabase.auth.signUp({email:email.trim(),password,options:{data:{full_name:name.trim(),class_level:classLevel.trim()},emailRedirectTo:redirectTo}})
      if(error){
        const message=String(error.message||'').toLowerCase()
        if(message.includes('already')&&message.includes('registered')){setError('An account with this email already exists. Please log in.');setMode('login');return}
        throw error
      }
      if(data.user?.identities?.length===0){
        setError('An account with this email already exists. Please log in.')
        setMode('login')
        return
      }
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
   try{
     const {error}=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo:window.location.origin+'/'})
     if(error)throw error
     setResetSent(true)
   }catch(err:any){setError(err?.message||'Could not send the reset email.')}finally{setBusy(false)}
 }

 function emailProvider(){
   const domain=verificationEmail.split('@')[1]?.toLowerCase()||''
   if(domain==='gmail.com'||domain==='googlemail.com')return 'gmail'
   if(domain==='outlook.com'||domain==='hotmail.com'||domain==='live.com'||domain==='msn.com')return 'outlook'
   if(domain==='yahoo.com'||domain.endsWith('.yahoo.com'))return 'yahoo'
   return 'email'
 }
 function openEmailInbox(emailOverride?:string){
   const providerEmail=emailOverride||verificationEmail
   const provider=(()=>{const domain=providerEmail.split('@')[1]?.toLowerCase()||'';if(domain==='gmail.com'||domain==='googlemail.com')return 'gmail';if(domain==='outlook.com'||domain==='hotmail.com'||domain==='live.com'||domain==='msn.com')return 'outlook';if(domain==='yahoo.com'||domain.endsWith('.yahoo.com'))return 'yahoo';return 'email'})(),isAndroid=/Android/i.test(navigator.userAgent),isAppleMobile=/iPhone|iPad|iPod/i.test(navigator.userAgent)
   if(provider==='gmail'&&isAndroid){
     let openedApp=false
     const fallback=window.setTimeout(()=>{if(!openedApp)window.open('https://mail.google.com/mail/u/0/#inbox','_blank','noopener,noreferrer')},1200)
     const markOpened=()=>{openedApp=true;window.clearTimeout(fallback)}
     document.addEventListener('visibilitychange',()=>{if(document.hidden)markOpened()},{once:true})
     try{window.location.href='intent://#Intent;scheme=googlegmail;package=com.google.android.gm;end'}catch{window.clearTimeout(fallback);window.open('https://mail.google.com/mail/u/0/#inbox','_blank','noopener,noreferrer')}
     return
   }
   if(provider==='gmail'&&isAppleMobile){
     let openedApp=false
     const fallback=window.setTimeout(()=>{if(!openedApp)window.open('https://mail.google.com/mail/u/0/#inbox','_blank','noopener,noreferrer')},1200)
     const markOpened=()=>{openedApp=true;window.clearTimeout(fallback)}
     document.addEventListener('visibilitychange',()=>{if(document.hidden)markOpened()},{once:true})
     try{window.location.href='googlegmail://'}catch{window.clearTimeout(fallback);window.open('https://mail.google.com/mail/u/0/#inbox','_blank','noopener,noreferrer')}
     return
   }
   const urls:{[key:string]:string}={gmail:'https://mail.google.com/mail/u/0/#inbox',outlook:'https://outlook.live.com/mail/0/inbox',yahoo:'https://mail.yahoo.com/',email:'mailto:'}
   if(provider==='email'){window.location.href='mailto:';return}
   window.open(urls[provider],'_blank','noopener,noreferrer')
 }
 async function resendVerification(){
   if(!supabase||!verificationEmail||resendCooldown>0)return
   setError('');setDone('');setBusy(true)
   try{
     const {error}=await supabase.auth.resend({type:'signup',email:verificationEmail,options:{emailRedirectTo:window.location.origin+'/'}})
     if(error)throw error
     setDone('A new verification email has been sent. Please check your inbox.')
     setResendCooldown(30)
   }catch(err:any){setError(err?.message||'Could not resend the verification email.')}finally{setBusy(false)}
 }
 useEffect(()=>{if(resendCooldown<=0)return;const timer=window.setInterval(()=>setResendCooldown(v=>Math.max(0,v-1)),1000);return()=>window.clearInterval(timer)},[resendCooldown])
 function switchMode(next:AuthMode){setMode(next);setError('');setDone(next==='reset'?'Choose a new password for your RafaAi account.':'');setVerificationEmail('');setResetSent(false);setResendCooldown(0);setShowPassword(false);setShowConfirmPassword(false)}
 const passwordField=(confirm=false)=><label>{confirm?'Confirm password':'Password'}<span className="password-field"><input type={confirm?(showConfirmPassword?'text':'password'):(showPassword?'text':'password')} value={confirm?confirmPassword:password} onChange={e=>confirm?setConfirmPassword(e.target.value):setPassword(e.target.value)} placeholder={mode==='reset'?(confirm?'Re-enter new password':'New password (6+ characters)'):'At least 6 characters'} minLength={6} autoComplete={confirm?'new-password':mode==='login'?'current-password':'new-password'} required/><button type="button" className="password-eye" onClick={()=>confirm?setShowConfirmPassword(v=>!v):setShowPassword(v=>!v)} aria-label={(confirm?showConfirmPassword:showPassword)?'Hide password':'Show password'}>{(confirm?showConfirmPassword:showPassword)?<EyeOff size={18}/>:<Eye size={18}/>}</button></span></label>

 return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget&&mode!=='reset'&&!verificationEmail&&!resetSent)onClose()}}>
  <div className="auth-card">
   {mode!=='reset'&&<button className="modal-close" onClick={onClose} aria-label="Close"><X/></button>}
   <div className="auth-logo-wrap"><Logo/></div>
   {verificationEmail ? <>
    <div className="auth-verify-icon" aria-hidden="true">✓</div><div className="eyebrow">EMAIL VERIFICATION</div>
    <h2>Check your email</h2><p className="auth-verify-copy">We've sent a verification link to</p>
    <div className="auth-verify-email">{verificationEmail}</div>
    <div className="auth-verify-steps"><div><b>1</b><span>Open your email inbox and find the message from RafaAi.</span></div><div><b>2</b><span>Click the verification link to confirm your email address.</span></div><div><b>3</b><span>Return to RafaAi and log in to start using your account.</span></div></div>
    {error&&<div className="form-error">{error}</div>}{done&&<div className="form-success">{done}</div>}
    <button className="primary-wide verify-open-mail" onClick={openEmailInbox}>{emailProvider()==='gmail'?'💌 Open Gmail':'💌 Check your email'}</button>
    <button className="verify-resend-link" onClick={resendVerification} disabled={busy||resendCooldown>0}>{busy?'Sending…':resendCooldown>0?'Resend email in '+resendCooldown+'s':'↻ Resend email'}</button>
    <button className="verify-secondary" onClick={()=>setVerificationEmail('')}>Back to sign up</button>
   </> : resetSent ? <>
    <div className="auth-verify-icon" aria-hidden="true">✉</div><div className="eyebrow">PASSWORD RECOVERY</div>
    <h2>Check your email</h2><p className="auth-verify-copy">We've sent a password reset link to</p>
    <div className="auth-verify-email">{email}</div>
    <div className="auth-verify-steps"><div><b>1</b><span>Open your email inbox and find the password reset message from RafaAi.</span></div><div><b>2</b><span>Click the reset link. RafaAi will open the secure password-change page.</span></div></div>
    {error&&<div className="form-error">{error}</div>}
    <button className="primary-wide verify-open-mail" onClick={()=>{setVerificationEmail(email);openEmailInbox(email)}}>💌 Check your email</button>
    <button className="verify-secondary" onClick={()=>{setResetSent(false);setMode('login')}}>Back to log in</button>
   </> : <>
   <div className="eyebrow">{mode==='login'?'WELCOME BACK':mode==='signup'?'JOIN RAFAAI':'PASSWORD RECOVERY'}</div>
   <h2>{mode==='login'?'Log in to RafaAi':mode==='signup'?'Create your RafaAi account':'Set a new password'}</h2>
   <p>{mode==='login'?'Continue your chats and keep learning.':mode==='signup'?'Save your chats and continue beyond guest mode.':'Create a new password to secure your account.'}</p>
   {mode!=='reset'&&<div className="auth-tabs" role="tablist"><button type="button" className={mode==='login'?'active':''} onClick={()=>switchMode('login')}>Log in</button><button type="button" className={mode==='signup'?'active signup-tab':''} onClick={()=>switchMode('signup')}>Create account</button></div>}
   <form onSubmit={submit}>
    {mode==='signup'&&<><label>Name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" autoComplete="name" required/></label><label>Class <span className="optional-label">(optional)</span><input value={classLevel} onChange={e=>setClassLevel(e.target.value)} placeholder="e.g. Class 10 / Matric"/></label></>}
    {mode!=='reset'&&<label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required/></label>}
    {passwordField()}
    {mode==='reset'&&passwordField(true)}
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