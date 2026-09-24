import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Loader2, WandSparkles } from 'lucide-react'
import { Footer, PageShell, SiteHeader } from '../components/Layout'
import { SitePreviewFrame } from '../components/preview/SitePreviewFrame'
import { generateAgenticSiteContext } from '../lib/agentOnboarding'
import type { GeneratedSiteContext } from '../types/generatedSite'

export function GeneratedPreviewPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialBusinessName = useMemo(() => searchParams.get('businessName')?.trim() ?? '', [searchParams])
  const initialWebsiteUrl = useMemo(() => searchParams.get('websiteUrl')?.trim() ?? '', [searchParams])
  const [businessName, setBusinessName] = useState(initialBusinessName || initialWebsiteUrl)
  const [site, setSite] = useState<GeneratedSiteContext | null>(null)
  const [isGenerating, setIsGenerating] = useState(Boolean(initialBusinessName || initialWebsiteUrl))
  const [error, setError] = useState('')
  const previewRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!initialBusinessName && !initialWebsiteUrl) return
    let cancelled = false
    setIsGenerating(true)
    setError('')
    generateAgenticSiteContext({ businessName: initialBusinessName || initialWebsiteUrl, websiteUrl: initialWebsiteUrl || undefined })
      .then((context) => { if (!cancelled) setSite(context) })
      .catch(() => { if (!cancelled) setError('We could not generate this preview. Try another business name.') })
      .finally(() => { if (!cancelled) setIsGenerating(false) })
    return () => { cancelled = true }
  }, [initialBusinessName, initialWebsiteUrl])

  useEffect(() => {
    if (!site || isGenerating) return
    const scrollTimer = window.setTimeout(() => previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    return () => window.clearTimeout(scrollTimer)
  }, [site, isGenerating])

  function submitPreview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedName = businessName.trim()
    if (!trimmedName) return
    setSearchParams({ businessName: trimmedName })
  }

  return <PageShell tone="light"><SiteHeader />
    <section className="flavor-section bg-cloud-50 px-4 py-14 text-navy-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8">
        <div className="flavor-card reveal-lift rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm sm:p-8">
          <Link to="/#agentic-onboarding" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-royal-700"><ArrowLeft size={16} /> Back to Business Launch</Link>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-amber-700"><WandSparkles size={14} /> Pre-Payment Generated Preview</div>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-navy-950 sm:text-5xl">Review your generated upgrade preview before you apply.</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">Paste a URL and the agent will use what it can glean from the current site to generate an upgrade preview. No payment is required to review it.</p>
            </div>
            {site && <Link to={`/apply?plan=launch&source=generated-preview&businessName=${encodeURIComponent(site.businessName)}`} className="primary-gradient primary-glow inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-black text-white">Continue Application <ArrowRight size={16} /></Link>}
          </div>
          <form onSubmit={submitPreview} className="mt-7 flex flex-col gap-3 sm:flex-row">
            <input value={businessName} onChange={(event) => setBusinessName(event.target.value)} placeholder="Enter website URL or business name" className="min-w-0 flex-1 rounded-full border border-slate-200 bg-cloud-50 px-5 py-4 text-sm font-semibold outline-none transition focus:border-royal-600 focus:ring-4 focus:ring-blue-100" />
            <button type="submit" disabled={!businessName.trim() || isGenerating} className="inline-flex items-center justify-center gap-2 rounded-full bg-navy-950 px-6 py-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60">{isGenerating ? 'Generating...' : 'Generate Preview'} {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}</button>
          </form>
        </div>

        {isGenerating && <div className="flavor-card reveal-lift grid min-h-[360px] place-items-center rounded-[2rem] border border-orange-100 bg-white p-8 text-center shadow-sm">
          <div>
            <Loader2 className="mx-auto mb-4 animate-spin text-royal-700" size={36} />
            <h2 className="text-2xl font-black text-navy-950">Generating your preview...</h2>
            <p className="mt-2 text-sm text-slate-600">Research, copy, and layout signals are being assembled.</p>
          </div>
        </div>}

        {!isGenerating && error && <div className="rounded-3xl border border-red-100 bg-red-50 p-5 text-sm font-semibold text-red-700">{error}</div>}

        {!isGenerating && site && <div ref={previewRef} className="scroll-mt-28"><SitePreviewFrame site={site} showFullPreviewLink={false} /></div>}

        {!isGenerating && !site && !error && <div className="flavor-card reveal-lift rounded-[2rem] border border-dashed border-orange-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-black text-navy-950">Enter a website URL or business name to generate a preview.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">If you provide a URL, the agent will analyze the existing site and generate an upgrade direction.</p>
        </div>}
      </div>
    </section>
    <Footer />
  </PageShell>
}
