import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CONTACT_EMAIL, FootprintGrader } from '../components/assessment/FootprintGrader'
import { beforeAfterWork, products, screenshotOf, siteWork } from '../data/work'
import { offers, priceLabel } from '../data/offers'
import { AdShowcase } from '../components/showcase/AdShowcase'
import './landing.css'

// Homepage: one job. Drop in a business name or URL → get a grade → see the upgrade → see our work.

const mailHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Free grade + preview')}&body=${encodeURIComponent('Business name:\nWebsite (if any):\nPhone:')}`

export function LandingPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [showSticky, setShowSticky] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('x-in'); io.unobserve(e.target) }
    }), { threshold: 0.12 })
    root.querySelectorAll('.x-reveal').forEach((el, i) => { (el as HTMLElement).style.transitionDelay = `${(i % 3) * 60}ms`; io.observe(el) })
    const onScroll = () => {
      const hero = document.getElementById('grade')
      if (hero) setShowSticky(hero.getBoundingClientRect().bottom < 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll) }
  }, [])

  return <div className="adx" ref={rootRef}>
    <header className="x-header">
      <nav className="x-nav x-glass" aria-label="Main">
        <a href="#grade" className="x-brand"><span className="x-logo" />Adynex Systems</a>
        <div className="x-nav-links"><a href="#grade">Get your grade</a><a href="#ads">Ads</a><a href="#ai">AI Front Desk</a><a href="#pricing">Pricing</a><a href="#work">Our work</a><a href="#products">Products</a></div>
        <a href="#grade" className="x-btn x-btn-primary">Get my grade</a>
      </nav>
    </header>

    <section className="x-hero" id="grade">
      <div className="x-aurora" />
      <div className="x-wrap x-hero-grid">
        <div>
          <span className="x-pill x-glass"><b>Free</b> Takes about 30 seconds</span>
          <h1>What grade does your business get <em>online?</em></h1>
          <p className="x-sub">Enter your business name or website. We scan your site, Google listing, reviews, search visibility and social media, grade it, and show you what your upgrade would look like.</p>
          <FootprintGrader />
          <div className="x-trust"><span>Website</span><span>Google</span><span>Reviews</span><span>SEO</span><span>Social</span></div>
        </div>
      </div>
    </section>

    <section className="x-block x-tight" id="ads">
      <div className="x-wrap">
        <div className="x-head x-reveal">
          <div><div className="x-eyebrow">Cinematic ads</div><h2 className="x-title" style={{ marginTop: 12 }}>Ads people <em>stop</em> for.</h2></div>
          <p className="x-sub">Movie-quality commercials for local businesses, made in days, not months, and priced for Main Street. Tap an industry.</p>
        </div>
        <div className="x-reveal"><AdShowcase /></div>
        <div className="x-row-ctas x-reveal">
          <a href={offers.cinematic_ad.checkout} className="x-btn x-btn-primary">Get your ad · ${offers.cinematic_ad.setup}</a>
          <a href={offers.ad_studio.checkout} className="x-btn x-btn-ghost">Ad Studio · ${offers.ad_studio.monthly}/mo, first month free</a>
        </div>
      </div>
    </section>

    <section className="x-block x-tight" id="ai">
      <div className="x-wrap">
        <div className="x-head x-reveal">
          <div><div className="x-eyebrow">AI Front Desk</div><h2 className="x-title" style={{ marginTop: 12 }}>Your first <em>AI employees.</em></h2></div>
          <p className="x-sub">We run our own company with a team of AI agents. Now we set up the same thing for you: they answer, book, follow up and collect reviews while you work. You get a report on your phone every week.</p>
        </div>
        <div className="x-agents">
          {[
            ['Missed call', 'Texts the caller back in seconds so they don\'t call your competitor.'],
            ['Receptionist', 'Answers questions and books appointments 24/7, in your voice.'],
            ['Reviews', 'Asks happy customers for a Google review at the perfect moment.'],
            ['Follow-up', 'Replies to every new lead instantly and keeps following up.'],
          ].map(([t, b]) => <div key={t} className="x-agent x-glass x-reveal"><span className="x-agent-dot" /><b>{t}</b><p>{b}</p></div>)}
          <div className="x-agent x-agent-buy x-glass x-reveal">
            <b>{offers.ai_front_desk.name}</b>
            <div className="x-amt" style={{ fontSize: 40 }}>${offers.ai_front_desk.setup}<small> + ${offers.ai_front_desk.monthly}/mo</small></div>
            <p>Running in 7 days. First month free.</p>
            <a href={offers.ai_front_desk.checkout} className="x-btn x-btn-primary">Hire your AI front desk</a>
          </div>
        </div>
      </div>
    </section>

    <section className="x-block x-tight" id="pricing">
      <div className="x-wrap">
        <div className="x-head x-reveal">
          <div><div className="x-eyebrow">Pricing</div><h2 className="x-title" style={{ marginTop: 12 }}>Simple. <em>Unbeatable.</em></h2></div>
          <p className="x-sub">Pay once to start. Monthly plans start after your first free month. Cancel the monthly anytime.</p>
        </div>
        <a href={offers.all_in_growth.checkout} className="x-allin x-glass x-reveal">
          <div><span className="x-tag">Best value</span><h3>{offers.all_in_growth.name}</h3><p>{offers.all_in_growth.items.slice(0, 4).join(' · ')}</p></div>
          <div className="x-allin-price"><div className="x-amt">${offers.all_in_growth.setup}<small> + ${offers.all_in_growth.monthly}/mo</small></div><span>{offers.all_in_growth.when}</span></div>
        </a>
        <div className="x-mini-grid">
          {(['google_fix', 'website_makeover', 'ai_front_desk', 'cinematic_ad', 'ad_studio', 'kiokitchen'] as const).map((k) => offers[k]).map((o) => <a key={o.key} href={o.checkout} className="x-mini x-glass x-reveal">
            <b>{o.name}</b><span>{o.result}</span><em>{priceLabel(o)}</em>
          </a>)}
        </div>
      </div>
    </section>

    <section className="x-block x-tight" id="work">
      <div className="x-wrap">
        <div className="x-head x-reveal">
          <div><div className="x-eyebrow">Our work</div><h2 className="x-title" style={{ marginTop: 12 }}>Before. <em>After.</em></h2></div>
          <p className="x-sub">Real upgrades we've built for local businesses. Tap one to see the full preview.</p>
        </div>
        <div className="x-ba-grid">
          {beforeAfterWork.map((w) => <a key={w.title} href={w.href} className="x-ba-card x-glass x-reveal">
            <div className="x-ba-pair">
              <figure><img src={w.before} alt={`${w.title} before`} loading="lazy" /><figcaption>Before</figcaption></figure>
              <figure><img src={w.after} alt={`${w.title} after`} loading="lazy" /><figcaption className="x-after-cap">After</figcaption></figure>
            </div>
            <div className="x-ba-meta"><span className="x-tag">{w.kind}</span><h3>{w.title}</h3><p>{w.place} · {w.note}</p></div>
          </a>)}
        </div>
        <div className="x-sites">
          {siteWork.map((s) => <a key={s.title} href={s.url} target="_blank" rel="noreferrer" className="x-site x-glass x-reveal">
            <img src={screenshotOf(s.url)} alt={`${s.title} website`} loading="lazy" />
            <div><span className="x-tag">{s.kind}</span><h3>{s.title}</h3><p>{s.industry} · {s.note}</p></div>
          </a>)}
        </div>
      </div>
    </section>

    <section className="x-block x-tight" id="products">
      <div className="x-wrap">
        <div className="x-head x-reveal">
          <div><div className="x-eyebrow">Products</div><h2 className="x-title" style={{ marginTop: 12 }}>Software we've <em>built.</em></h2></div>
          <p className="x-sub">Beyond websites, we design and ship full products: SaaS platforms, learning apps and AI tools.</p>
        </div>
        <div className="x-grid3">
          {products.map((p) => <a key={p.name} href={p.url} target="_blank" rel="noreferrer" className="x-card x-glass x-reveal x-product"><h3>{p.name} ↗</h3><p>{p.what}</p></a>)}
        </div>
      </div>
    </section>

    <section className="x-final" id="contact">
      <div className="x-aurora" style={{ inset: 0 }} />
      <div className="x-wrap" style={{ position: 'relative' }}>
        <div className="x-eyebrow x-reveal">Free · No obligation</div>
        <h2 className="x-reveal">Find out your <em>grade.</em></h2>
        <p className="x-sub x-reveal">See exactly where you're losing customers online, and what fixing it looks like.</p>
        <div className="x-reveal x-contact"><a href="#grade" className="x-btn x-btn-primary">Get my grade →</a><a href={mailHref} className="x-btn x-btn-ghost">Email James</a></div>
      </div>
    </section>

    <footer className="x-footer">
      <div className="x-wrap">
        <span>© {new Date().getFullYear()} Adynex Systems · Northwest Indiana &amp; Chicagoland</span>
        <nav aria-label="Legal"><Link to="/terms">Terms</Link><Link to="/privacy">Privacy</Link><Link to="/refund-cancellation">Refunds</Link><Link to="/accessibility">Accessibility</Link><Link to="/contact">Contact</Link></nav>
      </div>
    </footer>

    <div className={`x-sticky${showSticky ? ' x-show' : ''}`}><a href="#grade" className="x-btn x-btn-primary">Get my grade →</a></div>
  </div>
}
