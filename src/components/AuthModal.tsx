import { useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { XIcon } from './Icons'
import { Logo } from './Logo'

export function AuthModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<'login'|'signup'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setError(''); setMessage('')
    if (!supabase) { setError('Supabase is not connected yet. Add the project environment variables first.'); setBusy(false); return }
    try {
      if (mode === 'signup') {
        if (!name.trim()) throw new Error('Please enter your name.')
        const { data, error: signError } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { full_name: name.trim() } } })
        if (signError) throw signError
        if (!data.session) setMessage('Account created. Check your email if email confirmation is enabled.')
        else onClose()
      } else {
        const { error: loginError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
        if (loginError) throw loginError
        onClose()
      }
    } catch (err: any) { setError(err.message || 'Something went wrong.') }
    finally { setBusy(false) }
  }

  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <div className="auth-modal" role="dialog" aria-modal="true" aria-label={mode === 'login' ? 'Log in' : 'Create account'}>
      <button className="icon-button modal-close" onClick={onClose} aria-label="Close"><XIcon /></button>
      <Logo small />
      <div className="auth-copy">
        <div className="eyebrow">RafaAi account</div>
        <h2>{mode === 'login' ? 'Welcome back.' : 'Create your RafaAi account.'}</h2>
        <p>{mode === 'login' ? 'Continue your chats and keep your study workspace in one place.' : 'Sign up to continue after your three free guest questions.'}</p>
      </div>
      <form onSubmit={submit} className="auth-form">
        {mode === 'signup' && <label>Name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" autoComplete="name" /></label>}
        <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required /></label>
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" autoComplete={mode==='login'?'current-password':'new-password'} minLength={6} required /></label>
        {error && <div className="form-error">{error}</div>}
        {message && <div className="form-success">{message}</div>}
        <button className="primary-button auth-submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}</button>
      </form>
      <button className="text-switch" onClick={() => {setMode(mode==='login'?'signup':'login');setError('');setMessage('')}}>
        {mode === 'login' ? 'New to RafaAi? Create an account' : 'Already have an account? Log in'}
      </button>
    </div>
  </div>
}
