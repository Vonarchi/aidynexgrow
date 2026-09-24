import { Link } from 'react-router-dom'
import { CalendarCheck, MapPin, Phone, Star } from 'lucide-react'
import type { GeneratedSiteContext } from '../../types/generatedSite'

function ratingLabel(site: GeneratedSiteContext) {
  if (!site.rating) return 'New local profile'
  return `${site.rating.toFixed(1)} stars${site.reviewCount ? ` from ${site.reviewCount} reviews` : ''}`
}

export function SitePreviewFrame({ site, showFullPreviewLink = true }: { site: GeneratedSiteContext; showFullPreviewLink?: boolean }) {
  const previewHref = `/preview?businessName=${encodeURIComponent(site.businessName)}`
  const applyHref = `/apply?plan=launch&source=agent-preview&businessName=${encodeURIComponent(site.businessName)}`

  return <div className="rounded-[2rem] border border-orange-100 bg-white p-4 shadow-xl shadow-navy-950/10">
    <div className="mb-4 flex items-center justify-between gap-3 px-2">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Generated Concept</p>
        <h3 className="text-xl font-black text-navy-950">{site.businessName}</h3>
      </div>
      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Ready</span>
    </div>

    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-100">
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-3">
        <span className="size-3 rounded-full bg-red-300" />
        <span className="size-3 rounded-full bg-amber-300" />
        <span className="size-3 rounded-full bg-emerald-300" />
        <span className="ml-2 truncate rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">{site.metaTitle}</span>
      </div>

      <div className="grid min-h-[420px] bg-white lg:grid-cols-[1.05fr_.95fr]">
        <div className="p-6 sm:p-8" style={{ background: site.colors.background, color: site.colors.text }}>
          <div className="mb-8 flex items-center justify-between gap-3">
            <div className="font-black">{site.businessName}</div>
            <div className="hidden rounded-full bg-white/70 px-3 py-1 text-xs font-bold shadow-sm sm:block">{site.category}</div>
          </div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold shadow-sm"><MapPin size={14} /> {site.city}, {site.state}</p>
          <h4 className="max-w-xl text-4xl font-black leading-tight tracking-tight">{site.heroHeadline}</h4>
          <p className="mt-4 max-w-xl text-sm leading-6 opacity-80">{site.heroSubheadline}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`tel:${site.phone ?? ''}`} className="rounded-full px-5 py-3 text-sm font-black text-white shadow-sm" style={{ background: site.colors.primary }}><Phone className="mr-2 inline" size={15} /> Call Now</a>
            <button className="rounded-full bg-white px-5 py-3 text-sm font-black shadow-sm" type="button">Request Estimate</button>
          </div>
        </div>

        <div className="grid gap-4 bg-white p-6 sm:p-8">
          <div className="rounded-3xl border border-slate-200 p-5">
            <div className="mb-2 flex items-center gap-2 text-amber-500"><Star size={18} fill="currentColor" /><span className="font-black text-navy-950">{ratingLabel(site)}</span></div>
            <p className="text-sm leading-6 text-slate-600">{site.address ?? 'Service area available after profile verification.'}</p>
          </div>

          <div className="rounded-3xl border border-slate-200 p-5">
            <p className="mb-3 font-black text-navy-950">Services Highlighted</p>
            <div className="grid gap-2">
              {site.services.map((service) => <div key={service} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">{service}</div>)}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 p-5">
            <p className="mb-2 flex items-center gap-2 font-black text-navy-950"><CalendarCheck size={18} /> Suggested Plan</p>
            <p className="text-sm leading-6 text-slate-600">{site.recommendedPlan} is the best first step based on this concept.</p>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 flex flex-col gap-3 border-t border-slate-200 bg-white/95 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-slate-600">Review this generated preview before payment. The final live website is built after application review and onboarding.</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          {showFullPreviewLink && <Link to={previewHref} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-navy-950">Open Full Preview</Link>}
          <Link to={applyHref} className="primary-gradient primary-glow inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-black text-white">Continue Application</Link>
        </div>
      </div>
    </div>
  </div>
}
