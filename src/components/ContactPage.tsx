import { useState, type FormEvent } from 'react'
import { X } from './Icons'
import { supabase } from '../lib/supabase'

export function ContactPage(){
 const [name,setName]=useState('')
 const [phone,setPhone]=useState('')
 const [email,setEmail]=useState('')
 const [message,setMessage]=useState('')
 const [file,setFile]=useState<File|null>(null)
 const [busy,setBusy]=useState(false)
 const [error,setError]=useState('')
 const [sent,setSent]=useState(false)

 async function submit(e:FormEvent){
  e.preventDefault(); setError('')
  const cleanName=name.trim(), cleanMessage=message.trim()
  const cleanEmail=email.trim()
  if(!cleanName || !cleanMessage || (!phone.trim() && !cleanEmail)){setError('Please enter your name, message, and at least one contact method: email or phone number.');return}
  if(cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)){setError('Please enter a valid email address.');return}
  if(file && file.size>5*1024*1024){setError('Attachment must be 5 MB or smaller.');return}
  setBusy(true)
  try{
   let attachment:any=undefined
   if(file){
    const dataUrl=await new Promise<string>((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=()=>reject(new Error('Could not read the file.'));r.readAsDataURL(file)})
    attachment={name:file.name,mime:file.type||'application/octet-stream',size:file.size,data:dataUrl}
   }
   if(!supabase) throw new Error('Contact service is not configured.')
   const {data,error}=await supabase.functions.invoke('rafaai-contact',{body:{name:cleanName,email:cleanEmail,phone:phone.trim(),message:cleanMessage,attachment}})
   if(error) throw error
   if(data?.error) throw new Error(data.error)
   setSent(true);setName('');setEmail('');setPhone('');setMessage('');setFile(null)
  }catch(e:any){setError(e?.message||'Could not send your message. Please try again.')}
  finally{setBusy(false)}
 }
 return <div className="legal-shell contact-shell">
  <div className="legal-card contact-card">
   <div className="contact-brand"><img src="/rafaai-new-logo.png" alt="RafaAi" /><span>RafaAi</span></div><div className="contact-top"><a className="legal-back" href="/">← Back to RafaAi</a><button className="modal-close" onClick={()=>window.history.back()} aria-label="Close"><X/></button></div>
   <div className="legal-hero"><div className="eyebrow">CONTACT RAFAAI</div><h1>Contact Us</h1><p>Have a question, suggestion, issue, or feedback? Send us a message and include your contact details so we can get back to you.</p></div>
   {sent ? <div className="contact-success"><div className="contact-success-icon">✓</div><h2>Message sent</h2><p>Thanks for contacting RafaAi. Your message has been received and can now be reviewed by the RafaAi admin team.</p><button className="primary-wide" onClick={()=>setSent(false)}>Send another message</button></div> :
   <form className="contact-form" onSubmit={submit}>
    <div className="contact-grid">
     <label>Name <span>*</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" maxLength={100} required /></label>
     <label>Email address <span>*</span><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" inputMode="email" maxLength={160} /></label>\n     <label>Phone number <span>*</span><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Your phone number" inputMode="tel" maxLength={30} required /></label>
    </div>
    <label>Message <span>*</span><textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Write your message here…" rows={7} maxLength={5000} required /></label>
    <label className="contact-file">Attachment <small>Optional · max 5 MB</small><input type="file" accept=".jpg,.jpeg,.png,.webp,.gif,.pdf,.txt,.doc,.docx,.xls,.xlsx" onChange={e=>setFile(e.target.files?.[0]||null)} /><span>{file ? file.name : 'Choose a file'}</span></label>
    {file&&<button type="button" className="contact-file-remove" onClick={()=>setFile(null)}>Remove attachment</button>}
    <div className="contact-required-note">Name and message are required. Enter at least one of email or phone number.</div>
    {error&&<div className="form-error">{error}</div>}
    <button className="primary-wide contact-submit" disabled={busy}>{busy?'Sending…':'Send message'}</button>
   </form>}
  </div>
 </div>
}
