import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { KeyRound, Mail, ShieldCheck } from 'lucide-react'
import { PageShell } from '../components/Layout'
import { useAuth } from '../lib/auth'

export function AuthPage() {
  const navigate = useNavigate()
  const { signIn, signUp, resetPassword, signInWithMagicLink, demoLogin } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin')
  const [email, setEmail] = useState('demo.client@example.com')
  const [password, setPassword] = useState('password123')
  const [fullName, setFullName] = useState('Demo Client')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    try {
      if (mode === 'signin') await signIn(email, password)
      if (mode === 'signup') await signUp(email, password, fullName, phone)
      if (mode === 'reset') await resetPassword(email)
      if (mode !== 'reset') navigate('/dashboard')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed')
    } finally { setLoading(false) }
  }

  return <PageShell><div className="grid min-h-screen lg:grid-cols-2"><div className="navy-shell hidden items-center px-12 text-white lg:flex"><div><ShieldCheck className="mb-8 text-gold-500" size={52} /><h1 className="max-w-xl text-5xl font-bold tracking-tight">Secure access for applicants, clients, and agency staff.</h1><p className="mt-5 max-w-lg text-slate-300">Use Supabase Auth for verified accounts, project portals, admin workflows, and private dashboard access.</p></div></div><div className="flex items-center justify-center px-4 py-10"><form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"><Link to="/" className="text-sm font-semibold text-royal-700">Business Launch Initiative</Link><h2 className="mt-6 text-3xl font-bold text-navy-950">{mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Reset password'}</h2><p className="mt-2 text-sm text-slate-600">Email/password, magic link, password reset, and demo access are supported.</p>{mode === 'signup' && <label className="mt-6 block text-sm font-semibold">Full name<input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-2 w-full rounded-2xl border px-4 py-3" required /></label>}{mode === 'signup' && <label className="mt-4 block text-sm font-semibold">Phone number<input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2 w-full rounded-2xl border px-4 py-3" required /></label>}<label className="mt-6 block text-sm font-semibold">Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-2xl border px-4 py-3" required /></label>{mode !== 'reset' && <label className="mt-4 block text-sm font-semibold">Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-2xl border px-4 py-3" required /></label>}<button disabled={loading} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy-950 px-5 py-3 font-bold text-white"><KeyRound size={18} />{loading ? 'Working...' : mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Email'}</button>{mode === 'signin' && <button type="button" onClick={() => signInWithMagicLink(email)} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border px-5 py-3 font-bold"><Mail size={18} />Email Magic Link</button>}<div className="mt-5 flex flex-wrap gap-2 text-sm"><button type="button" onClick={() => setMode('signin')} className="text-royal-700">Sign in</button><button type="button" onClick={() => setMode('signup')} className="text-royal-700">Create account</button><button type="button" onClick={() => setMode('reset')} className="text-royal-700">Reset password</button></div><div className="mt-6 grid gap-2 rounded-2xl bg-cloud-100 p-4 text-sm"><p className="font-semibold text-navy-950">Demo shortcuts</p><button type="button" onClick={() => { demoLogin('customer'); navigate('/dashboard') }} className="rounded-full bg-white px-4 py-2">Open customer dashboard</button><button type="button" onClick={() => { demoLogin('admin'); navigate('/admin') }} className="rounded-full bg-white px-4 py-2">Open admin dashboard</button></div></form></div></div></PageShell>
}
