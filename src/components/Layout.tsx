import { Link, NavLink } from 'react-router-dom'
import { ArrowRight, LockKeyhole, Menu, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useAuth } from '../lib/auth'
import { cn, getInitials } from '../lib/utils'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { user, profile, isAdmin, signOut } = useAuth()
  const links = [
    ['How It Works', '/#how'],
    ['Automations', '/#automations'],
    ['Pricing', '/#pricing'],
    ['FAQ', '/#faq'],
  ]
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#06070A]/95 text-white backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 font-semibold">
          <span className="size-7 rounded-lg bg-[conic-gradient(from_210deg,#2EE6A6,#38D6F5,#A78BFA,#2EE6A6)]" />
          <span className="text-lg">Adynex Systems</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-white/70 lg:flex">
          {links.map(([label, href]) => <a key={label} href={href} className="hover:text-white">{label}</a>)}
          {isAdmin && <NavLink to="/admin" className="hover:text-white">Admin</NavLink>}
          {user ? <NavLink to="/dashboard" className="hover:text-white">Dashboard</NavLink> : <NavLink to="/auth" className="hover:text-white">Sign In</NavLink>}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          {user && <span className="grid size-9 place-items-center rounded-full bg-white/10 text-xs font-bold">{getInitials(profile?.full_name)}</span>}
          <a href="/#contact" className="inline-flex items-center gap-2 rounded-full bg-[#2EE6A6] px-5 py-3 text-sm font-semibold text-[#04140D] hover:brightness-110">Get my real preview <ArrowRight size={16} /></a>
          {user && <button onClick={signOut} className="text-xs font-semibold text-white/60 hover:text-white">Sign out</button>}
        </div>
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Open menu">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div className="border-t border-white/10 bg-[#06070A] px-4 py-5 lg:hidden">
        <div className="grid gap-3 text-sm font-semibold text-white">
          {links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}
          <a href="/#contact" className="rounded-full bg-[#2EE6A6] px-4 py-3 text-center font-semibold text-[#04140D]">Get my real preview</a>
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
          <Link to="/" className="flex items-center gap-3 font-semibold text-navy-950"><span className="size-7 rounded-lg bg-[conic-gradient(from_210deg,#2EE6A6,#38D6F5,#A78BFA,#2EE6A6)]" />Adynex Systems</Link>
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
  return <footer className="bg-navy-950 px-4 py-12 text-white"><div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4"><div><h3 className="text-xl font-semibold">Adynex Systems</h3><p className="mt-3 text-sm text-slate-300">Websites, Google presence and business automation for local businesses in Northwest Indiana and Chicagoland.</p></div><div><p className="font-semibold">How it works</p><p className="mt-3 text-sm text-slate-300">Every project starts with a free preview of your new site. You only pay once you have seen it and approved it. Domain registration and third-party services may be billed separately.</p></div><div><p className="font-semibold">Policies</p><div className="mt-3 grid gap-2 text-sm">{policyLinks.map(([label, to]) => <Link key={to} to={to} className="text-slate-300 hover:text-white">{label}</Link>)}</div></div><div><p className="font-semibold">Next Step</p><a href="/#contact" className="mt-3 inline-flex rounded-full bg-[#2EE6A6] px-5 py-3 text-sm font-semibold text-[#04140D]">Get my free preview</a></div></div></footer>
}
