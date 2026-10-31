import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import { generateAgenticSiteContext } from '../../lib/agentOnboarding'
import { gradeFootprint } from '../../lib/assessment/gradeFootprint'
import type { FootprintGrade, LetterGrade } from '../../lib/assessment/gradeFootprint'
import type { GeneratedSiteContext } from '../../types/generatedSite'
import { UpgradeSlider } from './UpgradeSlider'

export const CONTACT_EMAIL = 'james@adynexsystems.com'

const scanSteps = ['Loading your website', 'Checking your Google listing and reviews', 'Finding your social media', 'Grading your digital footprint']

const letterColor: Record<LetterGrade, string> = { A: 'var(--mint)', B: 'var(--cyan)', C: '#F5C542', D: '#FF8A3D', F: 'var(--danger)' }

const plans = [
  { key: 'google', name: 'Google Fix', amt: '$297', small: 'one time', when: 'Live in 48 hours', items: ['Google Business Profile cleanup: hours, photos, categories, links', 'Mobile one-page menu or services page', 'Call + directions buttons'] },
  { key: 'makeover', name: 'Website Makeover', amt: '$497', small: '+ $99/mo', when: 'Founding rate (regularly $750) · live in 7 days', items: ['Everything in Google Fix', 'Full custom mobile website in your brand', 'Online ordering or booking', 'Hosting, security and unlimited small updates'] },
  { key: 'systems', name: 'Business Systems', amt: 'From $497', small: 'setup', when: 'Quoted after your free check', items: ['Missed-call text back', 'Automatic review requests', 'Booking reminders & lead follow-up', 'AI receptionist'] },
] as const

function previewRequestHref(site: GeneratedSiteContext, grade?: FootprintGrade) {
  const lines = [
    `Business: ${site.businessName}`,
    `Website: ${site.websiteUrl ?? 'none'}`,
    grade ? `My Adynex grade: ${grade.letter} (${grade.score}/100)` : '',
    grade?.biggestProblem ? `Biggest problem: ${grade.biggestProblem.label}` : '',
    'Phone:',
  ].filter(Boolean)
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Free full preview: ${site.businessName}`)}&body=${encodeURIComponent(lines.join('\n'))}`
}

function GradeReport({ grade }: { grade: FootprintGrade }) {
  const color = letterColor[grade.letter]
  return <div className="x-report">
    <div className="x-grade x-glass" style={{ '--g': color } as CSSProperties}>
      <div className="x-grade-ring" style={{ background: `conic-gradient(${color} ${grade.score * 3.6}deg, rgba(255,255,255,.06) 0)` }}>
        <div><b>{grade.letter}</b><span>{grade.score}/100</span></div>
      </div>
      <div>
        <div className="x-eyebrow">Digital footprint grade</div>
        <h3>{grade.letter === 'A' ? 'Excellent. You are ahead of most local businesses.' : grade.letter === 'B' ? 'Solid, with a few gaps costing you customers.' : 'You are losing customers online.'}</h3>
        {grade.biggestProblem && <p>Biggest problem: <strong>{grade.biggestProblem.label}</strong> ({grade.biggestProblem.earned}/{grade.biggestProblem.possible})</p>}
        {grade.partial && <p className="x-muted">Some checks could not run in this scan, so they are left out of your score rather than guessed.</p>}
      </div>
    </div>
    <div className="x-cats">
      {grade.categories.map((c) => <div key={c.key} className="x-cat x-glass">
        <div className="x-cat-head"><b>{c.label}</b><span>{c.checked ? `${c.earned}/${c.possible}` : 'Not checked'}</span></div>
        <div className="x-bar"><i style={{ width: c.checked ? `${(c.earned / c.possible) * 100}%` : '0%' }} /></div>
        <ul>{c.findings.map((f) => <li key={f.text} className={f.ok ? 'x-ok' : 'x-bad'}>{f.text}</li>)}</ul>
      </div>)}
    </div>
  </div>
}

function Offers({ site, grade }: { site: GeneratedSiteContext; grade: FootprintGrade }) {
  const recommended = grade.biggestProblem && ['google', 'reviews'].includes(grade.biggestProblem.key) && grade.categories[0].earned >= 20 ? 'google' : 'makeover'
  return <div className="x-offers">
    <div className="x-head">
      <div><div className="x-eyebrow">Fix it</div><h2 className="x-title" style={{ marginTop: 12 }}>Turn your {grade.letter} into an <em>A.</em></h2></div>
      <p className="x-sub">Your full preview is free. You only pay after you see it and approve it. No long contracts.</p>
    </div>
    <div className="x-grid3">
      {plans.map((p) => <div key={p.key} className={`x-price x-glass${p.key === recommended ? ' x-hot' : ''}`}>
        <span className="x-tag">{p.key === recommended ? 'Recommended for you' : p.when}</span>
        <h3>{p.name}</h3>
        <div className="x-amt" style={p.amt.length > 5 ? { fontSize: 40 } : undefined}>{p.amt} <small>{p.small}</small></div>
        <div className="x-when">{p.when}</div>
        <ul>{p.items.map((i) => <li key={i}>{i}</li>)}</ul>
        <a href={previewRequestHref(site, grade)} className={`x-btn ${p.key === recommended ? 'x-btn-primary' : 'x-btn-ghost'}`}>Start with a free preview</a>
      </div>)}
    </div>
  </div>
}

export function FootprintGrader() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'idle' | 'scanning' | 'done' | 'unavailable'>('idle')
  const [step, setStep] = useState(0)
  const [site, setSite] = useState<GeneratedSiteContext | null>(null)
  const [grade, setGrade] = useState<FootprintGrade | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status !== 'scanning') return
    const id = window.setInterval(() => setStep((s) => Math.min(s + 1, scanSteps.length - 1)), 1400)
    return () => window.clearInterval(id)
  }, [status])

  useEffect(() => {
    if (status === 'done' || status === 'unavailable') resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [status])

  async function run(event: FormEvent) {
    event.preventDefault()
    const value = query.trim()
    if (!value || status === 'scanning') return
    setStatus('scanning'); setStep(0); setSite(null); setGrade(null)
    try {
      const result = await generateAgenticSiteContext({ businessName: value })
      setSite(result)
      if (result.signals) { setGrade(gradeFootprint(result.signals)); setStatus('done') } else setStatus('unavailable')
    } catch {
      setStatus('unavailable')
    }
  }

  return <>
    <form className="x-grader x-glass" onSubmit={run}>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Business name and city, or your website" aria-label="Business name or website" />
      <button type="submit" className="x-btn x-btn-primary" disabled={!query.trim() || status === 'scanning'}>{status === 'scanning' ? 'Scanning…' : 'Get my grade →'}</button>
    </form>
    {status === 'scanning' && <div className="x-scan" role="status">
      {scanSteps.map((s, i) => <div key={s} className={i < step ? 'x-done' : i === step ? 'x-now' : ''}><span />{s}</div>)}
    </div>}

    <div ref={resultsRef} className="x-results">
      {status === 'unavailable' && <div className="x-glass x-unavail">
        <h3>We couldn't run the live scan right now.</h3>
        <p>Send us your business and James will grade it by hand and build your free preview within 24 hours.</p>
        <a className="x-btn x-btn-primary" href={site ? previewRequestHref(site) : `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Free grade + preview')}&body=${encodeURIComponent(`Business: ${query}\nWebsite:\nPhone:`)}`}>Email James</a>
      </div>}
      {status === 'done' && site && grade && <>
        <GradeReport grade={grade} />
        <div className="x-upgrade">
          <div className="x-head">
            <div><div className="x-eyebrow">{grade.needsUpgrade ? 'Your upgrade' : 'Your A+ version'}</div><h2 className="x-title" style={{ marginTop: 12 }}>{site.businessName}, <em>upgraded.</em></h2></div>
            <p className="x-sub">{grade.needsUpgrade ? 'Here is what your business could look like online. Built from your real details in seconds.' : 'You are already in good shape. Here is what the next level could look like.'}</p>
          </div>
          <UpgradeSlider site={site} grade={grade} />
        </div>
        <Offers site={site} grade={grade} />
      </>}
    </div>
  </>
}
