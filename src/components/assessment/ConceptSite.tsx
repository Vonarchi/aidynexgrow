import type { CSSProperties } from 'react'
import type { GeneratedSiteContext } from '../../types/generatedSite'

// The "after" side of the upgrade: a rendered first draft of the business's upgraded homepage.
// Uses only real details we found (rating, hours, phone, city). Missing details are simply left out.

type Look = { bg: string; ink: string; accent: string; soft: string; glow: string; display: string; ctas: [string, string] }

function lookFor(category: string): Look {
  const c = category.toLowerCase()
  if (/dent|medical|clinic|doctor|health|chiro|physical/.test(c)) return { bg: '#F4FAF9', ink: '#0E2A2A', accent: '#14A38B', soft: 'rgba(14,42,42,.06)', glow: 'rgba(20,163,139,.25)', display: "'Geist', Inter, system-ui, sans-serif", ctas: ['Book an appointment', 'Call us'] }
  if (/hvac|heating|air|plumb|roof|electric|contractor|repair|clean|landscap|construction/.test(c)) return { bg: '#0B1526', ink: '#F2F5FA', accent: '#FF7A1A', soft: 'rgba(242,245,250,.07)', glow: 'rgba(255,122,26,.35)', display: "'Geist', Inter, system-ui, sans-serif", ctas: ['Get a free quote', 'Call now'] }
  if (/beauty|salon|barber|spa|nail|wellness|hair/.test(c)) return { bg: '#FBF4F1', ink: '#2B1A1F', accent: '#B5546B', soft: 'rgba(43,26,31,.06)', glow: 'rgba(181,84,107,.25)', display: "'DM Serif Display', Georgia, serif", ctas: ['Book now', 'See services'] }
  if (/restaurant|cafe|food|bakery|pizza|grill|kitchen|diner|\bbar\b/.test(c)) return { bg: '#1B120C', ink: '#FBF3E6', accent: '#F2A541', soft: 'rgba(251,243,230,.08)', glow: 'rgba(242,165,65,.35)', display: "'DM Serif Display', Georgia, serif", ctas: ['Order pickup', 'View menu'] }
  if (/church|ministry|worship/.test(c)) return { bg: '#16112A', ink: '#F5F1FF', accent: '#E9C46A', soft: 'rgba(245,241,255,.07)', glow: 'rgba(233,196,106,.3)', display: "'DM Serif Display', Georgia, serif", ctas: ['Plan a visit', 'Watch online'] }
  return { bg: '#0E1116', ink: '#F3F5F8', accent: '#2EE6A6', soft: 'rgba(243,245,248,.07)', glow: 'rgba(46,230,166,.3)', display: "'Geist', Inter, system-ui, sans-serif", ctas: ['Get in touch', 'Learn more'] }
}

const known = (value?: string) => value && !/^your (city|state)$/i.test(value) ? value : ''

export function ConceptSite({ site }: { site: GeneratedSiteContext }) {
  const look = lookFor(site.category)
  const city = known(site.city)
  const state = known(site.state)
  const place = [city, state].filter(Boolean).join(', ')
  const todayHours = site.hours?.[((new Date().getDay() + 6) % 7)]?.split(': ').slice(1).join(': ')
  const style = { '--c-bg': look.bg, '--c-ink': look.ink, '--c-accent': look.accent, '--c-soft': look.soft, '--c-glow': look.glow, '--c-display': look.display } as CSSProperties

  return <div className="x-concept" style={style}>
    <div className="x-c-nav">
      <b>{site.businessName}</b>
      <span>{site.services.slice(0, 3).join(' · ')}</span>
      <i>{site.phone || look.ctas[1]}</i>
    </div>
    <div className="x-c-hero">
      <div className="x-c-copy">
        {(place || site.category) && <div className="x-c-eb">{[site.category, place].filter(Boolean).join(' · ')}</div>}
        <h4>{site.heroHeadline}</h4>
        <p>{site.heroSubheadline}</p>
        <div className="x-c-btns"><span>{look.ctas[0]} →</span><span>{site.phone ? `Call ${site.phone}` : look.ctas[1]}</span></div>
        <div className="x-c-meta">
          {typeof site.rating === 'number' && <div><b>★ {site.rating.toFixed(1)}</b>{site.reviewCount ? `${site.reviewCount} Google reviews` : 'on Google'}</div>}
          {todayHours && <div><b>Today</b>{todayHours}</div>}
          {place && <div><b>Local</b>{place}</div>}
        </div>
      </div>
      <div className="x-c-art" aria-hidden="true">
        <div className="x-c-orb" />
        <div className="x-c-card x-c-card1">{typeof site.rating === 'number'
          ? <><b>★ {site.rating.toFixed(1)}</b><span>{site.reviewCount ? `${site.reviewCount} Google reviews` : 'Google rating'}</span></>
          : <><b>{site.services[0]}</b><span>{site.businessName}</span></>}</div>
        <div className="x-c-card x-c-card2"><b>{look.ctas[0]}</b><span>{todayHours ? `Today ${todayHours}` : 'Online, in seconds'}</span></div>
      </div>
    </div>
    <div className="x-c-services">
      {site.services.slice(0, 3).map((s) => <div key={s}><span />{s}</div>)}
    </div>
  </div>
}
