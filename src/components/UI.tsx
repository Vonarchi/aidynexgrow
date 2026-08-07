import { Check, ChevronRight, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn, formatCurrency } from '../lib/utils'
import type { ServiceCatalogItem } from '../types/platform'

export function Section({ eyebrow, title, children, className = '', dark = false }: { eyebrow?: string; title: string; children: ReactNode; className?: string; dark?: boolean }) {
  return <section className={cn('px-4 py-20 sm:px-6 lg:px-8', dark ? 'bg-navy-950 text-white' : 'bg-cloud-50 text-slate-900', className)}><div className="mx-auto max-w-7xl"><div className="mb-10 max-w-3xl">{eyebrow && <p className={cn('mb-3 text-xs font-bold uppercase tracking-[0.28em]', dark ? 'text-gold-500' : 'text-royal-700')}>{eyebrow}</p>}<h2 className="shimmer-heading text-3xl font-bold tracking-tight sm:text-5xl">{title}</h2></div>{children}</div></section>
}

export function CTAButton({ to, children, variant = 'primary' }: { to: string; children: ReactNode; variant?: 'primary' | 'secondary' | 'ghost' }) {
  const classes = variant === 'primary' ? 'bg-royal-600 text-white shadow-xl shadow-blue-900/20 hover:bg-royal-700' : variant === 'secondary' ? 'bg-white text-[#061428] hover:bg-gold-500 hover:text-[#061428]' : 'border border-white/25 text-white hover:bg-white/10'
  return <Link to={to} className={cn('inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition', classes)}>{children}<ChevronRight size={16} /></Link>
}

export function StatCard({ label, value, note }: { label: string; value: string; note?: string }) {
  return <div className="glass-card rounded-3xl p-6"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold text-navy-950">{value}</p>{note && <p className="mt-2 text-xs text-slate-500">{note}</p>}</div>
}

export function FeatureCard({ title, body, icon }: { title: string; body?: string; icon?: ReactNode }) {
  return <div className="flavor-card reveal-lift rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-4 grid size-11 place-items-center rounded-2xl bg-blue-50 text-royal-700">{icon || <Check size={20} />}</div><h3 className="font-bold text-navy-950">{title}</h3>{body && <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>}</div>
}

export function Badge({ children, tone = 'blue' }: { children: ReactNode; tone?: 'blue' | 'gold' | 'green' | 'slate' }) {
  const tones = { blue: 'bg-blue-50 text-royal-700', gold: 'bg-amber-50 text-amber-700', green: 'bg-emerald-50 text-emerald-700', slate: 'bg-slate-100 text-slate-700' }
  return <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-semibold', tones[tone])}>{children}</span>
}

export function ServiceCard({ item, onRequest }: { item: ServiceCatalogItem; onRequest?: (item: ServiceCatalogItem) => void }) {
  return <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-4 flex items-start justify-between gap-3"><div><Badge tone={item.featured ? 'gold' : 'blue'}>{item.category}</Badge><h3 className="mt-4 text-xl font-bold text-navy-950">{item.name}</h3></div><Sparkles className="text-gold-500" /></div><p className="text-sm leading-6 text-slate-600">{item.description}</p><ul className="mt-5 grid gap-2 text-sm text-slate-700">{item.benefits.map((benefit) => <li key={benefit} className="flex gap-2"><Check className="mt-0.5 shrink-0 text-emerald-500" size={16} />{benefit}</li>)}</ul><div className="mt-auto pt-6"><p className="mb-4 font-bold text-navy-950">{item.price_type === 'monthly' ? `${formatCurrency(item.monthly_price)}/mo` : item.price_type === 'fixed' ? `From ${formatCurrency(item.starting_price)}` : 'Request Quote'}</p><div className="grid gap-2 sm:grid-cols-2"><button onClick={() => onRequest?.(item)} className="rounded-full bg-navy-950 px-4 py-3 text-sm font-semibold text-white">Add to Project</button><Link to="/software-consultation" className="rounded-full border px-4 py-3 text-center text-sm font-semibold">Consultation</Link></div></div></div>
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center"><div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-blue-50 text-royal-700"><Sparkles /></div><h3 className="text-xl font-bold text-navy-950">{title}</h3><p className="mx-auto mt-2 max-w-md text-sm text-slate-600">{body}</p>{action && <div className="mt-5">{action}</div>}</div>
}
