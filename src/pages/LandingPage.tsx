import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, PhoneCall, Smartphone } from 'lucide-react'
import { AgenticHeroInput } from '../components/onboarding/AgenticHeroInput'
import './landing.css'

// Contact details shown on the page. Leave PHONE empty to hide the "Text James" buttons.
const EMAIL = 'james@adynexsystems.com'
const PHONE = ''

const smsHref = PHONE ? `sms:${PHONE}?&body=${encodeURIComponent("Hi James! I'd like a free preview for my business: ")}` : ''
const mailHref = `mailto:${EMAIL}?subject=${encodeURIComponent('Free preview request')}&body=${encodeURIComponent('Business name:\nWebsite (if any):\nPhone:')}`

const problems = [
  { icon: Smartphone, title: 'Hard to use on a phone', body: 'Tiny text, pinch-to-zoom, PDF menus. People give up and tap the next result.' },
  { icon: MapPin, title: 'Wrong info on Google', body: 'Old hours, missing photos, no website link. Your Google listing is your real homepage.' },
  { icon: PhoneCall, title: 'No easy way to act', body: 'No call button, no directions, no ordering. Every extra step costs you a customer.' },
]

const pillars = [
  ['01', 'Analyze', 'We look at how your business shows up and runs today: website, Google, calls, bookings and follow-up. Then we show you where you are losing customers or time.'],
  ['02', 'Upgrade', 'A fast, beautiful mobile website and a fixed-up Google presence. You see a free preview before you pay anything.'],
  ['03', 'Automate', 'Systems that answer, remind, follow up and collect reviews for you, so nothing slips through the cracks.'],
] as const

const automations = [
  ['Missed call', 'Instant text back', 'Never lose a missed call', "When you can't pick up, the caller automatically gets a text so you keep the customer instead of losing them to the next search result."],
  ['Visit', 'Review request', 'More 5-star reviews', 'Happy customers get a friendly text asking for a Google review at the right moment. More reviews means more people find you.'],
  ['Booking', 'Reminders', 'Fewer no-shows', 'Automatic appointment confirmations and reminders by text and email, so your schedule stays full.'],
  ['New lead', 'Follow-up', 'Every lead followed up', 'Form fills and inquiries get an instant reply and a follow-up sequence, and land in one simple list on your phone.'],
  ['Phone call', 'AI receptionist', 'An AI front desk', "Answers common questions, takes messages and books appointments 24/7, in your business's voice."],
  ['Order', 'Paid & ready', 'Online ordering & payments', "Customers order and pay from their phone; you get a text when it's in. No expensive new hardware."],
] as const

const plans = [
  { tag: 'Quick win', name: 'Google Fix', amt: '$297', small: '', when: 'One time · done in 48 hours', hot: false, cta: 'Get the Google Fix',
    items: ['Google Business Profile cleanup: hours, photos, categories, links', 'Mobile one-page menu or services page', 'Call + directions buttons', 'Counter QR code to your menu'] },
  { tag: 'Founding client · 5 spots', name: 'Website Makeover', amt: '$497', small: '+ $99/mo', when: 'Founding rate (regularly $750) · live in 7 days', hot: true, cta: 'Claim a founding spot',
    items: ['Everything in Google Fix', 'Full custom mobile website, your brand', 'Online ordering or booking link', 'Hosting, security and unlimited small updates (text us changes)', 'Monthly Google post'] },
  { tag: 'Automation', name: 'Business Systems', amt: 'From $497', small: 'setup', when: '+ monthly care · quoted after your free check', hot: false, cta: 'Book a free check',
    items: ['Missed-call text back', 'Automatic review requests', 'Booking reminders & lead follow-up', 'AI receptionist & online ordering', 'Connected to the tools you already use'] },
]

const faqs = [
  ['Is the preview really free?', "Yes. We build a preview of your new site at no cost and with no obligation. If you don't love it, you walk away."],
  ['Do I need to know anything technical?', 'No. We handle design, hosting, Google and your domain. You tell us about your business and text us when something changes.'],
  ['I already have a website. Can you still help?', "Absolutely. Most of our work is upgrading existing sites. We'll keep your domain and make the move seamless."],
  ['What does the $99/month cover?', 'Hosting, security, and unlimited small updates: new prices, specials, holiday hours, photos. Plus a monthly Google post to keep your listing active. Cancel anytime.'],
  ['What if I need more than a website?', 'That is where Business Systems come in: missed-call text back, review requests, reminders, follow-up, AI phone answering and online ordering. Start with a free 15-minute check.'],
  ['How do I pay?', "Securely online by card, after you've seen and approved your preview."],
] as const

function BeforeAfter() {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState(50)
  const touched = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      let t0: number | null = null
      const sweep = (t: number) => {
        if (touched.current) return
        t0 ??= t
        const p = Math.min((t - t0) / 2600, 1)
        setPos(50 + Math.sin(p * Math.PI * 2) * 32 * (1 - p))
        if (p < 1) raf = requestAnimationFrame(sweep)
      }
      raf = requestAnimationFrame(sweep)
    }, { threshold: 0.5 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [])

  return <div className="x-ba-wrap x-reveal" id="see">
    <div className="x-ba-label"><span style={{ color: 'var(--danger)' }}>◀ Before</span><span style={{ color: 'var(--mint)' }}>After ▶</span></div>
    <div className="x-ba" ref={ref} style={{ '--pos': `${pos}%` } as CSSProperties}>
      <div className="x-pane">
        <div className="x-old">
          <div className="x-old-bar">★ Welcome to Maple &amp; Main Pancake House ★</div>
          <div className="x-old-marq">*** NEW HOURS!!! Click here for our menu (PDF) *** Best pancakes in town since 1978 ***</div>
          <div className="x-old-cols">
            <div className="x-old-side"><span>Home</span><span>Menu (PDF)</span><span>Directions</span><span>Guestbook</span><span>Links</span></div>
            <div className="x-old-main">
              <h3>Welcome to our Website!</h3>
              <p>We serve breakfast and lunch. Please call us for hours. Our menu is available below for download.</p>
              <span className="x-old-pdf">📄 Download Menu (2.4 MB)</span>
              <div className="x-old-img">[ image ]</div>
              <p>Thank you for visiting!!!</p>
            </div>
          </div>
          <div className="x-old-foot">© 2014 · Best viewed in Internet Explorer · Visitors: <span className="x-counter">004817</span></div>
        </div>
        <span className="x-flag" style={{ left: '4%', top: '24%' }}>PDF menu</span>
        <span className="x-flag" style={{ left: '30%', bottom: '16%' }}>Not mobile-friendly</span>
        <span className="x-flag" style={{ left: '6%', bottom: '6%' }}>Last updated 2014</span>
      </div>
      <div className="x-pane x-after">
        <div className="x-new">
          <div className="x-new-nav"><b>Maple &amp; Main</b><span>Menu · Order · Visit · (219) 555-0142</span></div>
          <div className="x-new-body">
            <div className="x-new-eb">Since 1978 · Schererville, IN</div>
            <h4>Breakfast worth the <em>drive.</em></h4>
            <p>Buttermilk stacks, Dutch babies and coffee that keeps coming. Order ahead and skip the wait.</p>
            <div className="x-new-btns"><span>Order pickup →</span><span>View menu</span></div>
            <div className="x-new-meta"><div><b>Open today</b>6:30am–2:30pm</div><div><b>★ 4.8</b>Google reviews</div></div>
          </div>
          <PancakeStack />
        </div>
        <span className="x-win" style={{ right: '4%', top: '20%' }}>One-tap ordering</span>
        <span className="x-win" style={{ right: '4%', bottom: '8%' }}>Built for phones</span>
      </div>
      <div className="x-handle"><div className="x-knob">⇆</div></div>
      <input type="range" min={0} max={100} value={pos} aria-label="Drag to compare before and after"
        onPointerDown={() => { touched.current = true }} onChange={(e) => { touched.current = true; setPos(Number(e.target.value)) }} />
    </div>
    <p className="x-ba-hint">Drag the slider. This is an example. We'll build one of <em>your</em> business, free.</p>
  </div>
}

function PancakeStack() {
  return <svg className="x-stack" viewBox="0 0 440 400" aria-hidden="true">
    <defs>
      <linearGradient id="adx-pk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f3c27a" /><stop offset=".55" stopColor="#c9772f" /><stop offset="1" stopColor="#7a3f14" /></linearGradient>
      <radialGradient id="adx-pt" cx=".45" cy=".4" r=".7"><stop offset="0" stopColor="#e9a95a" /><stop offset=".7" stopColor="#b8662a" /><stop offset="1" stopColor="#8a4719" /></radialGradient>
      <linearGradient id="adx-sy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a24a12" stopOpacity=".95" /><stop offset="1" stopColor="#5e2306" stopOpacity=".9" /></linearGradient>
      <radialGradient id="adx-pl" cx=".5" cy=".4" r=".6"><stop offset="0" stopColor="#fbf4ea" /><stop offset="1" stopColor="#cdbfae" /></radialGradient>
    </defs>
    <ellipse cx="220" cy="330" rx="210" ry="56" fill="url(#adx-pl)" /><ellipse cx="220" cy="322" rx="170" ry="40" fill="#e8dccb" />
    <path d="M70 300 a150 40 0 0 0 300 0 v-34 a150 40 0 0 1 -300 0z" fill="url(#adx-pk)" />
    <path d="M66 258 a154 40 0 0 0 308 0 v-34 a154 40 0 0 1 -308 0z" fill="url(#adx-pk)" />
    <path d="M72 216 a148 38 0 0 0 296 0 v-34 a148 38 0 0 1 -296 0z" fill="url(#adx-pk)" />
    <path d="M68 174 a152 39 0 0 0 304 0 v-34 a152 39 0 0 1 -304 0z" fill="url(#adx-pk)" />
    <ellipse cx="220" cy="140" rx="152" ry="39" fill="url(#adx-pt)" />
    <path d="M110 140 c10 26 2 70 14 98 c6 14 18 10 18 -6 c0 -30 14 -40 30 -62 c20 22 4 60 24 66 c14 4 14 -24 22 -40 c10 24 26 30 34 6 c8 30 0 70 16 76 c14 5 14 -40 30 -66 c12 -20 30 -40 46 -58 a152 39 0 0 0 -234 -14z" fill="url(#adx-sy)" />
    <rect x="190" y="108" width="62" height="34" rx="9" fill="#fff4cf" transform="rotate(-6 221 125)" />
  </svg>
}

function ContactButtons({ primaryLabel = 'Text James →' }: { primaryLabel?: string }) {
  return <div className="x-contact">
    {smsHref && <a className="x-btn x-btn-primary" href={smsHref}>{primaryLabel}</a>}
    <a className={`x-btn ${smsHref ? 'x-btn-ghost' : 'x-btn-primary'}`} href={mailHref}>{smsHref ? EMAIL : `Email James · ${EMAIL}`}</a>
  </div>
}

export function LandingPage() {
  const navigate = useNavigate()
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
      const see = document.getElementById('see'), final = document.getElementById('contact')
      if (!see || !final) return
      setShowSticky(see.getBoundingClientRect().bottom < 0 && final.getBoundingClientRect().top > window.innerHeight)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll) }
  }, [])

  const openGeneratedPreview = (site: { businessName: string; websiteUrl?: string }) => {
    const params = new URLSearchParams({ businessName: site.businessName })
    if (site.websiteUrl) params.set('websiteUrl', site.websiteUrl)
    navigate(`/preview?${params.toString()}`)
  }

  return <div className="adx" ref={rootRef}>
    <header className="x-header">
      <nav className="x-nav x-glass" aria-label="Main">
        <a href="#top" className="x-brand"><span className="x-logo" />Adynex Systems</a>
        <div className="x-nav-links"><a href="#see">See it</a><a href="#how">How it works</a><a href="#automations">Automations</a><a href="#pricing">Pricing</a><Link to="/auth">Client login</Link></div>
        <a href="#try" className="x-btn x-btn-primary">Free preview</a>
      </nav>
    </header>

    <section className="x-hero" id="top">
      <div className="x-aurora" />
      <div className="x-wrap x-hero-grid">
        <div className="x-reveal">
          <span className="x-pill x-glass"><b>5 founding spots</b> NW Indiana &amp; Chicagoland</span>
          <h1>Your business, <em>upgraded</em> in 48 hours.</h1>
          <p className="x-sub">Customers judge you on their phone before they ever walk in. We build you a fast, beautiful mobile site and fix your Google listing. <strong style={{ color: 'var(--text)' }}>You see a free preview of your new site before you pay a cent.</strong></p>
          <div className="x-ctas">
            <a href="#try" className="x-btn x-btn-primary">Get my free preview →</a>
            <a href="#see" className="x-btn x-btn-ghost">See the difference</a>
          </div>
          <div className="x-trust"><span>Free preview first</span><span>Live in 48 hours</span><span>No long contracts</span></div>
        </div>
        <BeforeAfter />
      </div>
    </section>

    <section className="x-block x-tight" id="try">
      <div className="x-wrap">
        <div className="x-try x-glass x-reveal">
          <div>
            <div className="x-eyebrow">Try it right now</div>
            <h2>Type your business name. <span className="x-em">Watch</span> your preview build.</h2>
            <p className="x-sub">Our AI assembles a first draft of your new website in seconds. James then hand-finishes your real preview and sends it to you within 24 hours.</p>
          </div>
          <AgenticHeroInput onGenerated={openGeneratedPreview} />
        </div>
      </div>
    </section>

    <section className="x-block x-tight">
      <div className="x-wrap">
        <div className="x-head x-reveal">
          <div><div className="x-eyebrow">Why Adynex</div><h2 className="x-title" style={{ marginTop: 12 }}>Technology moves fast.<br />We keep you <em>ahead of it.</em></h2></div>
          <p className="x-sub">You run the business. We modernize everything around it, so you never have to figure out the tech yourself.</p>
        </div>
        <div className="x-grid3">
          {pillars.map(([n, t, b]) => <div key={t} className="x-card x-glass x-reveal"><div className="x-num">{n}</div><h3>{t}</h3><p>{b}</p></div>)}
        </div>
      </div>
    </section>

    <section className="x-block x-tight">
      <div className="x-wrap">
        <div className="x-head x-reveal">
          <div><div className="x-eyebrow">The problem</div><h2 className="x-title" style={{ marginTop: 12 }}>Your website is your<br /><em>first impression.</em></h2></div>
          <p className="x-sub">Great businesses lose customers every day to competitors with better-looking phone screens. Not better food. Not better service. Better screens.</p>
        </div>
        <div className="x-grid3">
          {problems.map(({ icon: Icon, title, body }) => <div key={title} className="x-card x-glass x-reveal"><div className="x-ico"><Icon size={20} /></div><h3>{title}</h3><p>{body}</p></div>)}
        </div>
      </div>
    </section>

    <section className="x-block x-tight" id="how">
      <div className="x-wrap">
        <div className="x-head x-reveal">
          <div><div className="x-eyebrow">How it works</div><h2 className="x-title" style={{ marginTop: 12 }}>See it first. <em>Then</em> decide.</h2></div>
          <p className="x-sub">No sales pitch, no risk. You'll know exactly what you're getting before you spend anything.</p>
        </div>
        <div className="x-grid3">
          <div className="x-card x-glass x-reveal"><div className="x-num">01</div><h3>Free preview</h3><p>Send us your business name. Within 24 hours we build a real preview of your new site and send you a personal link.</p></div>
          <div className="x-card x-glass x-reveal"><div className="x-num">02</div><h3>Say yes</h3><p>Love it? Pick a plan and pay securely online. Want changes? Tell us and we'll adjust it.</p></div>
          <div className="x-card x-glass x-reveal"><div className="x-num">03</div><h3>Live in 48 hours</h3><p>Your site goes live, your Google listing gets fixed, and you get a QR code for your counter. Done.</p></div>
        </div>
      </div>
    </section>

    <section className="x-block x-tight" id="automations">
      <div className="x-wrap">
        <div className="x-head x-reveal">
          <div><div className="x-eyebrow">Beyond the website</div><h2 className="x-title" style={{ marginTop: 12 }}>Systems that work<br /><em>while you sleep.</em></h2></div>
          <p className="x-sub">A great website brings customers in. Automation makes sure none of them slip through the cracks. We set it up, connect it to the tools you already use, and run it for you.</p>
        </div>
        <div className="x-grid3">
          {automations.map(([from, to, title, body]) => <div key={title} className="x-card x-glass x-reveal">
            <div className="x-flow"><span>{from}</span><i>→</i><span className="x-end">{to}</span></div><h3>{title}</h3><p>{body}</p>
          </div>)}
        </div>
        <div className="x-banner x-glass x-reveal"><div><b>Not sure what to automate?</b><span>Get a free 15-minute Business Systems Check. We'll find the 2–3 tasks costing you the most time and money.</span></div><a href="#contact" className="x-btn x-btn-primary">Book a free check</a></div>
      </div>
    </section>

    <section className="x-block x-tight" id="pricing">
      <div className="x-wrap">
        <div className="x-head x-reveal">
          <div><div className="x-eyebrow">Pricing</div><h2 className="x-title" style={{ marginTop: 12 }}>Simple, honest <em>pricing.</em></h2></div>
          <p className="x-sub">One-time setup, optional monthly care. No contracts. Cancel the monthly plan anytime.</p>
        </div>
        <div className="x-grid3">
          {plans.map((p) => <div key={p.name} className={`x-price x-glass x-reveal${p.hot ? ' x-hot' : ''}`}>
            <span className="x-tag">{p.tag}</span>
            <h3>{p.name}</h3>
            <div className="x-amt" style={p.amt.length > 5 ? { fontSize: 40 } : undefined}>{p.amt} {p.small && <small>{p.small}</small>}</div>
            <div className="x-when">{p.when}</div>
            <ul>{p.items.map((i) => <li key={i}>{i}</li>)}</ul>
            <a href="#contact" className={`x-btn ${p.hot ? 'x-btn-primary' : 'x-btn-ghost'}`}>{p.cta}</a>
          </div>)}
        </div>
        <p className="x-note x-reveal">Growing fast? Ongoing growth plans with SEO, booking, CRM and monthly reviews run $99–$249/mo after launch.</p>
      </div>
    </section>

    <section className="x-block x-tight">
      <div className="x-wrap">
        <div className="x-guar x-glass x-reveal">
          <div className="x-seal"><div><b>7</b>DAYS</div></div>
          <div><h3>See it before you pay a cent.</h3><p>Your preview is always free. You only pay once you approve it, and your Makeover goes live within 7 days.</p></div>
          <a href="#try" className="x-btn x-btn-primary">Start free</a>
        </div>
      </div>
    </section>

    <section className="x-block x-tight">
      <div className="x-wrap x-founder">
        <div className="x-reveal">
          <div className="x-eyebrow">Who you're working with</div>
          <blockquote>"Local businesses are the backbone of our community. They deserve to look as <em>good</em> online as they are in person."</blockquote>
          <p className="x-who"><b>James Archibald, MBA</b> · Founder, Adynex Systems<br />Designer, developer and automation builder. Former healthcare operations manager who ran a team of 25, so I build systems around how real businesses actually work. Local to Northwest Indiana.</p>
        </div>
        <div className="x-facts x-reveal">
          <div className="x-fact x-glass"><b>You talk to me</b><span>No call centers, no account managers. One person who knows your business.</span></div>
          <div className="x-fact x-glass"><b>Local</b><span>Schererville-based. I can come to you.</span></div>
          <div className="x-fact x-glass"><b>Fast</b><span>Previews in 24 hours. Google Fix live in 48.</span></div>
          <div className="x-fact x-glass"><b>Yours</b><span>No long contracts. Your site, your domain.</span></div>
        </div>
      </div>
    </section>

    <section className="x-block x-tight" id="faq">
      <div className="x-wrap">
        <div className="x-reveal" style={{ textAlign: 'center', marginBottom: 40 }}><div className="x-eyebrow">Questions</div><h2 className="x-title" style={{ marginTop: 12 }}>Good <em>questions.</em></h2></div>
        <div className="x-faq">
          {faqs.map(([q, a]) => <details key={q} className="x-glass x-reveal"><summary>{q}</summary><p>{a}</p></details>)}
        </div>
      </div>
    </section>

    <section className="x-final" id="contact">
      <div className="x-aurora" style={{ inset: 0 }} />
      <div className="x-wrap" style={{ position: 'relative' }}>
        <div className="x-eyebrow x-reveal">Free · No obligation · 24 hours</div>
        <h2 className="x-reveal">See your new site<br /><em>before</em> you pay.</h2>
        <p className="x-sub x-reveal">{smsHref ? 'Text' : 'Email'} your business name. James will send your free preview within 24 hours.</p>
        <div className="x-reveal"><ContactButtons /></div>
      </div>
    </section>

    <footer className="x-footer">
      <div className="x-wrap">
        <span>© {new Date().getFullYear()} Adynex Systems · Northwest Indiana &amp; Chicagoland · Previews shown are examples.</span>
        <nav aria-label="Legal"><Link to="/terms">Terms</Link><Link to="/privacy">Privacy</Link><Link to="/refund-cancellation">Refunds</Link><Link to="/accessibility">Accessibility</Link><Link to="/contact">Contact</Link></nav>
      </div>
    </footer>

    <div className={`x-sticky${showSticky ? ' x-show' : ''}`}><a href="#try" className="x-btn x-btn-primary">Get my free preview →</a></div>
  </div>
}
