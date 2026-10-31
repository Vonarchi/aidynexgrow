import { useState } from 'react'
import type { CSSProperties } from 'react'
import { ConceptSite } from './ConceptSite'
import { screenshotOf } from '../../data/work'
import type { GeneratedSiteContext } from '../../types/generatedSite'
import type { FootprintGrade } from '../../lib/assessment/gradeFootprint'

// Before = a live screenshot of their current site (or their Google-only presence if they have none).
// After  = the upgraded concept rendered from their real details.

function NoWebsite({ site }: { site: GeneratedSiteContext }) {
  return <div className="x-nosite">
    <div className="x-nosite-search">{site.businessName} {site.city && !/your city/i.test(site.city) ? site.city : ''}</div>
    <div className="x-nosite-card">
      <b>{site.businessName}</b>
      <span>{site.category}</span>
      <div className="x-nosite-row"><em>Website</em><strong>None</strong></div>
      <div className="x-nosite-row"><em>Online booking / ordering</em><strong>None</strong></div>
    </div>
    <p>Customers who search for you have nowhere to land.</p>
  </div>
}

export function UpgradeSlider({ site, grade }: { site: GeneratedSiteContext; grade: FootprintGrade }) {
  const [pos, setPos] = useState(50)
  const [shotFailed, setShotFailed] = useState(false)
  const url = site.signals?.website?.reachable ? site.signals.website.url : site.websiteUrl
  const failing = grade.categories.flatMap((c) => c.findings.filter((f) => !f.ok)).slice(0, 2)

  return <div className="x-ba-wrap">
    <div className="x-ba-label"><span style={{ color: 'var(--danger)' }}>◀ Today · {grade.letter}</span><span style={{ color: 'var(--mint)' }}>Your upgrade ▶</span></div>
    <div className="x-ba x-ba-live" style={{ '--pos': `${pos}%` } as CSSProperties}>
      <div className="x-pane x-before-shot">
        {url
          ? shotFailed
            ? <div className="x-nosite"><div className="x-nosite-search">{url}</div><p>We couldn't capture a screenshot of your current site, but we did scan it. Your grade above is based on that scan.</p></div>
            : <img src={screenshotOf(url)} alt={`Current website for ${site.businessName}`} onError={() => setShotFailed(true)} />
          : <NoWebsite site={site} />}
        {failing.map((f, i) => <span key={f.text} className="x-flag" style={i ? { left: '4%', bottom: '8%' } : { left: '4%', top: '14%' }}>{f.text.split('.')[0]}</span>)}
      </div>
      <div className="x-pane x-after"><ConceptSite site={site} /></div>
      <div className="x-handle"><div className="x-knob">⇆</div></div>
      <input type="range" min={0} max={100} value={pos} aria-label="Drag to compare your current site with the upgrade" onChange={(e) => setPos(Number(e.target.value))} />
    </div>
    <p className="x-ba-hint">Drag the slider. This is an AI first draft from your real details. James hand-finishes your full preview, free.</p>
  </div>
}
