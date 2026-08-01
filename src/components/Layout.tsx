import { Link, NavLink } from 'react-router-dom'
import { ArrowRight, Building2, LockKeyhole, Menu, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useAuth } from '../lib/auth'
import { cn, getInitials } from '../lib/utils'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { user, profile, isAdmin, signOut } = useAuth()
  const links = [
    ['How It Works', '/#how-it-works'],
    ['What Is Included', '/#included'],
    ['Examples', '/#examples'],
    ['Growth Options', '/#packages'],
    ['FAQ', '/#faq'],
  ]
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-950/90 text-white backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 font-semibold">
          <span className="grid size-10 place-items-center rounded-2xl gold-gradient text-navy-950"><Building2 size={21} /></span>
          <span><span className="block text-sm uppercase tracking-[0.28em] text-gold-500">Business Launch</span><span className="text-lg">Initiative</span></span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-slate-200 lg:flex">
          {links.map(([label, href]) => <a key={label} href={href} className="hover:text-white">{label}</a>)}
          {isAdmin && <NavLink to="/admin" className="hover:text-white">Admin</NavLink>}
          {user ? <NavLink to="/dashboard" className="hover:text-white">Dashboard</NavLink> : <NavLink to="/auth" className="hover:text-white">Sign In</NavLink>}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          {user && <span className="grid size-9 place-items-center rounded-full bg-white/10 text-xs">{getInitials(profile?.full_name)}</span>}
          <Link to="/apply" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-navy-950 shadow-xl shadow-blue-950/20 hover:bg-gold-500">Start My Application <ArrowRight size={16} /></Link>
          {user && <button onClick={signOut} className="text-xs text-slate-300 hover:text-white">Sign out</button>}
        </div>
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Open menu">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div className="border-t border-white/10 bg-navy-950 px-4 py-5 lg:hidden">
        <div className="grid gap-3 text-sm text-slate-200">
          {links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}
          <Link to="/apply" className="rounded-full bg-white px-4 py-3 text-center font-semibold text-navy-950">Start My Application</Link>
          <Link to={user ? '/dashboard' : '/auth'}>{user ? 'Dashboard' : 'Sign In'}</Link>
          {isAdmin && <Link to="/admin">Admin</Link>}
        </div>
      </div>}
    </header>
  )
}

export function PageShell({ children, tone = 'light' }: { children: ReactNode; tone?: 'light' | 'dark' }) {
  return <div className={cn('min-h-screen', tone === 'dark' ? 'bg-navy-950 text-white' : 'bg-cloud-50 text-slate-900')}>{children}</div>
}

export function DashboardLayout({ children, title, subtitle, actions }: { children: ReactNode; title: string; subtitle: string; actions?: ReactNode }) {
  const { profile, signOut, isAdmin } = useAuth()
  return (
    <PageShell>
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Link to="/" className="flex items-center gap-3 font-semibold text-navy-950"><span className="grid size-10 place-items-center rounded-2xl bg-navy-950 text-gold-500"><Building2 size={20} /></span>Business Launch Initiative</Link>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link to="/dashboard" className="rounded-full px-4 py-2 hover:bg-cloud-100">Client Dashboard</Link>
            {isAdmin && <Link to="/admin" className="rounded-full px-4 py-2 hover:bg-cloud-100">Admin</Link>}
            <span className="rounded-full bg-cloud-100 px-3 py-2">{profile?.full_name}</span>
            <button onClick={signOut} className="rounded-full border px-4 py-2">Sign out</button>
          </div>
        </div>
      </div>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-royal-700"><LockKeyhole size={14} /> Secure portal</p><h1 className="text-3xl font-bold tracking-tight text-navy-950 sm:text-5xl">{title}</h1><p className="mt-3 max-w-2xl text-slate-600">{subtitle}</p></div>
          {actions}
        </div>
        {children}
      </main>
    </PageShell>
  )
}

export function Footer() {
  const policyLinks = [
    ['Terms', '/terms'],
    ['Privacy Policy', '/privacy'],
    ['Program Guidelines', '/program-guidelines'],
    ['Acceptable Use', '/acceptable-use'],
    ['Refund or Cancellation Policy', '/refund-cancellation'],
    ['Accessibility', '/accessibility'],
    ['Contact', '/contact'],
  ]
  return <footer className="bg-navy-950 px-4 py-12 text-white"><div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4"><div><h3 className="text-xl font-semibold">Business Launch Initiative</h3><p className="mt-3 text-sm text-slate-300">A digital business-launch program helping small businesses launch, look credible, get discovered, and grow online.</p></div><div><p className="font-semibold">Important</p><p className="mt-3 text-sm text-slate-300">Website design and the initial standard build may be included for approved applicants. Domain registration, hosting, premium integrations, custom functionality, and ongoing support may require separate payment.</p></div><div><p className="font-semibold">Policies</p><div className="mt-3 grid gap-2 text-sm">{policyLinks.map(([label, to]) => <Link key={to} to={to} className="text-slate-300 hover:text-white">{label}</Link>)}</div></div><div><p className="font-semibold">Next Step</p><Link to="/apply" className="mt-3 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-navy-950">Start My Application</Link></div></div></footer>
}
