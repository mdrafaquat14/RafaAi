import { useState, type FormEvent } from 'react'
import { X } from './Icons'
import { supabase } from '../lib/supabase'

type ContactMethod='email'|'phone'

export function ContactPage(){
 const [name,setName]=useState('')
 const [method,setMethod]=useState<ContactMethod>('email')
 const [email,setEmail]=useState('')
 const [phone,setPhone]=useState('')
 const [message,setMessage]=useState('')
 const [file,setFile]=useState<File|null>(null)
 const [busy,setBusy]=useState(false)
 const [error,setError]=useState('')
 const [sent,setSent]=useState(false)

 async function submit(e:FormEvent){
  e.preventDefault(); setError('')
  const cleanName=name.trim(), cleanMessage=message.trim()
  const cleanEmail=email.trim(), cleanPhone=phone.trim()
  if(!cleanName || !cleanMessage || (method==='email' ? !cleanEmail : !cleanPhone)){
   setError(`Please enter your name, message, and your ${method==='email'?'email address':'phone number'}.`)
   return
  }
  if(method==='email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)){
   setError('Please enter a valid email address.')
   return
  }
  if(file && file.size>5*1024*1024){setError('Attachment must be 5 MB or smaller.');return}
  setBusy(true)
  try{
   let attachment:any=undefined
   if(file){
    const dataUrl=await new Promise<string>((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=()=>reject(new Error('Could not read the file.'));r.readAsDataURL(file)})
    attachment={name:file.name,mime:file.type||'application/octet-stream',size:file.size,data:dataUrl}
   }
   if(!supabase) throw new Error('Contact service is not configured.')
   const {data,error}=await supabase.functions.invoke('rafaai-contact',{body:{name:cleanName,email:method==='email'?cleanEmail:'',phone:method==='phone'?cleanPhone:'',message:cleanMessage,attachment}})
   if(error) throw error
   if(data?.error) throw new Error(data.error)
   setSent(true);setName('');setEmail('');setPhone('');setMessage('');setFile(null)
  }catch(e:any){setError(e?.message||'Could not send your message. Please try again.')}
  finally{setBusy(false)}
 }

 return <main className="contact-shell">
  <div className="contact-card">
   <div className="contact-brand"><img src="/rafaai-new-logo.png" alt="RafaAi" /><span>RafaAi</span></div>
   <div className="contact-top"><a className="legal-back" href="/">← Back to RafaAi</a><button className="modal-close" onClick={()=>window.history.back()} aria-label="Close"><X/></button></div>
   <div className="legal-hero"><div className="eyebrow">CONTACT RAFAAI</div><h1>Contact Us</h1><p>Have a question, suggestion, issue, or feedback? Send us a message and choose one way for RafaAi to contact you.</p></div>

   {sent ? <div className="contact-success"><div className="contact-success-icon">✓</div><h2>Message sent</h2><p>Thanks for contacting RafaAi. Your message has been received by the RafaAi admin team.</p><button className="primary-wide" onClick={()=>setSent(false)}>Send another message</button></div> :
   <form className="contact-form" onSubmit={submit}>
    <label>Name <span>*</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" maxLength={100} required /></label>

    <div className="contact-method-box">
     <div className="contact-method-head"><span>Contact method <b>*</b></span><small>Choose one</small></div>
     <div className="contact-method-tabs" role="tablist" aria-label="Choose contact method">
      <button type="button" className={method==='email'?'active':''} onClick={()=>{setMethod('email');setError('')}}>Email</button>
      <button type="button" className={method==='phone'?'active':''} onClick={()=>{setMethod('phone');setError('')}}>Phone</button>
     </div>
     {method==='email'
      ? <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" inputMode="email" maxLength={160} required aria-label="Email address" />
      : <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Your phone number" inputMode="tel" maxLength={30} required aria-label="Phone number" />}
    </div>

    <label>Message <span>*</span><textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Write your message here…" rows={6} maxLength={5000} required /></label>
    <label className="contact-file">Attachment <small>Optional · max 5 MB</small><input type="file" accept=".jpg,.jpeg,.png,.webp,.gif,.pdf,.txt,.doc,.docx,.xls,.xlsx" onChange={e=>setFile(e.target.files?.[0]||null)} /><span>{file ? file.name : 'Choose a file'}</span></label>
    {file&&<button type="button" className="contact-file-remove" onClick={()=>setFile(null)}>Remove attachment</button>}
    <div className="contact-required-note">Name, contact method, and message are required. Choose either email or phone. Contact messages and attachments are automatically deleted after 30 days.</div>
    {error&&<div className="form-error">{error}</div>}
    <button className="primary-wide contact-submit" disabled={busy}>{busy?'Sending…':'Send message'}</button>
   </form>}
  </div>
 </main>
}
