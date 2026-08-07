import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check, CheckCircle2, ClipboardCheck, Globe2, Info, Laptop, MessageSquare, Search, ShieldCheck, Smartphone, Sparkles, Wrench } from 'lucide-react'
import { Footer, PageShell, SiteHeader } from '../components/Layout'
import { Badge, CTAButton, FeatureCard, Section } from '../components/UI'
import { demoData } from '../data/demoData'
import { getPlatformSnapshot } from '../lib/platformService'
import type { PlatformSnapshot, PortfolioItem } from '../types/platform'

const included = [
  ['Professionally designed homepage', 'A polished first impression built around your business, offer, and next step.'],
  ['Up to five standard pages', 'Common pages include Home, About, Services, Work, Contact, FAQ, or similar standard content pages.'],
  ['Mobile-responsive design', 'Your site automatically adapts to phones, tablets, laptops, and desktop screens.'],
  ['Contact or lead-capture form', 'Give visitors a clear way to request information, quotes, appointments, or next steps.'],
  ['Click-to-call functionality', 'Phone links are formatted so mobile visitors can contact your business quickly.'],
  ['Social media links', 'Connect visitors to your existing business profiles where appropriate.'],
  ['Google Maps integration', 'Help customers understand your service area or physical location.'],
  ['Basic search-engine setup', 'Includes page titles, descriptions, heading structure, image alt text, and search-friendly page organization. Rankings are not guaranteed.'],
  ['SSL security', 'The launched site should use secure HTTPS when hosted on an approved platform.'],
  ['One standard revision round', 'A focused round of changes is included so the final site reflects your approved content and goals.'],
  ['Website launch assistance', 'Support for final checks, launch coordination, and next-step guidance.'],
] as const
const qualifies = ['Legitimate businesses, organizations, ministries, professionals, and entrepreneurs', 'Businesses that can provide accurate contact and service information', 'Applicants prepared to submit content and feedback promptly', 'Businesses willing to maintain an approved hosting arrangement for a launched website', 'Owners ready to launch within the stated production window']
const notRightFit = ['You need advanced custom software under the standard website offer', 'You need unlimited revisions', 'You cannot provide required business information', 'You are not prepared to respond during onboarding', 'You expect paid third-party services to be included at no cost']
const categories = ['View All', 'Professional Services', 'Restaurants', 'Beauty and Wellness', 'Contractors', 'Transportation', 'Nonprofits', 'Churches', 'Coaches', 'Real Estate', 'Retail', 'Education', 'Healthcare']
const trustItems = [
  ['Professional Designs', Sparkles],
  ['Mobile Responsive', Smartphone],
  ['Lead Capture Ready', MessageSquare],
  ['Secure Hosting Options', ShieldCheck],
  ['No Upfront Design Fee', CheckCircle2],
] as const
const process = [
  ['Apply', 'Tell us about your business, your goals, and the type of website you need.'],
  ['Get Approved', 'We review your application, confirm eligibility, and explain the available launch options.'],
  ['Complete Onboarding', 'Upload your logo, photos, services, contact details, and business information through a guided onboarding process.'],
  ['Review and Launch', 'Review your website, submit the included revision, select your hosting option, and approve it for launch.'],
] as const
const offers = [
  {
    title: 'Standard Website Build',
    label: 'No Upfront Design Fee',
    features: ['Up to five standard pages', 'Standard professional layout', 'Mobile-responsive design', 'Contact form', 'One revision round', 'Standard production queue', 'Client provides final content and assets'],
    cta: 'Apply for Standard Build',
    to: '/apply',
  },
  {
    title: 'Priority Website Build',
    label: 'Enhanced Launch Support',
    features: ['Faster production scheduling', 'Expanded customization', 'Additional revision rounds', 'Copy assistance', 'Premium layout options', 'Priority queue', 'Enhanced onboarding support'],
    cta: 'Explore Priority Build',
    to: '/apply',
  },
  {
    title: 'Business Growth Plan',
    label: 'Ongoing Services',
    features: ['Website', 'Managed hosting', 'Maintenance', 'Analytics', 'Enhanced SEO setup', 'Appointment booking', 'AI chatbot option', 'Email automation', 'CRM integration', 'Priority support'],
    cta: 'View Growth Options',
    to: '#growth-services',
  },
  {
    title: 'Custom Software',
    label: 'Custom Quote',
    features: ['Customer portals', 'Employee dashboards', 'Scheduling systems', 'Marketplace platforms', 'Restaurant ordering', 'Membership platforms', 'Mobile applications', 'AI-powered business tools'],
    cta: 'Request a Consultation',
    to: '/software-consultation',
  },
] as const
const platformFeatures = [
  ['Managed Hosting', 'Launch on a secure hosting arrangement with SSL and ongoing platform support.'],
  ['Website Maintenance', 'Keep content, plugins, security, and routine updates from becoming a distraction.'],
  ['Appointment Booking', 'Add scheduling paths that reduce back-and-forth and help customers take action.'],
  ['Lead Management', 'Route inquiries into a more organized follow-up process as your business grows.'],
  ['AI Chatbot', 'Support common questions and lead qualification with automation when it fits the business.'],
  ['Email Automation', 'Prepare follow-up, onboarding, and customer communication workflows.'],
  ['Reputation Tools', 'Support review collection, credibility signals, and customer trust-building.'],
  ['Custom Business Software', 'Plan portals, dashboards, ordering systems, mobile apps, and operational tools.'],
] as const
const faq = [
  ['Is the website really free?', 'The standard website design and initial build have no upfront design fee for approved applicants. Domain registration, hosting, premium integrations, custom functionality, maintenance, and ongoing support may require separate payment.'],
  ['What do I have to pay for?', 'The website design and initial build are free for approved applicants. Managed hosting with us is required for launch at $34/month, and you may also pay for approved add-ons such as domain registration, premium tools, custom software, or extra services.'],
  ['Do I have to purchase hosting?', 'Yes. A website needs hosting to exist online, and approved websites launched through this program use our managed hosting at $34 per month. This covers secure hosting, SSL, basic monitoring, and standard launch support.'],
  ['Can I use my existing domain?', 'Yes. We can help connect an existing domain during launch.'],
  ['How long will the website take?', 'Timing depends on application review, content readiness, queue capacity, and the selected launch option. You will receive next-step guidance after review.'],
  ['How many pages are included?', 'The standard website build includes up to five standard pages for approved applicants. Larger scopes may require a premium plan or custom quote.'],
  ['What information do I need to provide?', 'Be prepared to provide accurate contact information, services, business details, logo files, photos, desired pages, and any existing domain or hosting information.'],
  ['How many revisions are included?', 'Standard website builds include one standard revision round. Additional revisions may require an upgraded plan or separate approval.'],
  ['Can you write my content?', 'Basic guidance is included. Custom copywriting is available as an optional paid service.'],
  ['Can you build an online store?', 'Basic ecommerce may be possible as an upgrade. Large stores and marketplaces are custom paid projects.'],
  ['What happens after the website launches?', 'You can keep managing it yourself or request hosting, maintenance, SEO, analytics, automation, and growth services.'],
  ['Can I upgrade later?', 'Yes. You can add hosting, maintenance, SEO, booking, automation, custom pages, web applications, or mobile apps later.'],
  ['Do you build web applications?', 'Yes. Customer portals, dashboards, marketplaces, booking systems, AI tools, and mobile apps are quoted separately.'],
  ['Who owns the completed website?', 'Ownership and access details are handled in the project terms and depend on selected hosting, tools, and third-party services.'],
  ['Are all applications approved?', 'No. Applications are reviewed for fit, readiness, capacity, and scope. Approval is not guaranteed.'],
  ['Do you guarantee leads or search rankings?', 'No. The site is built to improve credibility, clarity, and discoverability, but leads, revenue, approvals, completion dates, and search placement are not guaranteed.'],
  ['What happens if I do not submit my content?', 'Projects waiting on content can be paused or skipped temporarily so ready projects can keep moving.'],
  ['Can an existing website be redesigned?', 'Yes. Existing websites can be reviewed during the application process, but redesign scope and migration needs may affect the launch path.'],
]

const heroSequence = [
  { src: '/hero-cinematic/eye-surveillance.png', className: 'cinematic-eye-frame', position: 'object-[52%_50%]' },
  { src: '/hero-cinematic/flooded-futuristic-city.png', className: 'cinematic-flood-frame', position: 'object-[52%_50%]' },
  { src: '/hero-cinematic/robot-delivering-groceries.png', className: 'cinematic-grocery-robot-frame', position: 'object-[45%_50%] sm:object-center' },
  { src: '/hero-cinematic/autonomous-mercedes.png', className: 'cinematic-mercedes-frame', position: 'object-[54%_50%]' },
  { src: '/hero-cinematic/mercedes-delivery-pod.png', className: 'cinematic-delivery-pod-frame', position: 'object-[54%_50%]' },
  { src: '/hero-cinematic/cyber-robot.png', className: 'cinematic-cyber-frame', position: 'object-[52%_50%]' },
  { src: '/hero-cinematic/cyber-dog-black.png', className: 'cinematic-cyber-dog-frame', position: 'object-[42%_50%] sm:object-center' },
  { src: '/hero-cinematic/cyber-dog-rider.png', className: 'cinematic-cyber-rider-frame', position: 'object-[48%_50%] sm:object-center' },
  { src: '/hero-cinematic/iridescent-supra.png', className: 'cinematic-supra-frame', position: 'object-[58%_50%] sm:object-center' },
  { src: '/hero-cinematic/iridescent-supra-wide.png', className: 'cinematic-supra-wide-frame', position: 'object-[52%_50%]' },
  { src: '/hero-cinematic/friends-laughing.png', className: 'cinematic-friends-frame', position: 'object-[58%_50%] sm:object-center' },
  { src: '/hero-cinematic/living-room.png', className: 'cinematic-living-frame', position: 'object-[50%_50%]' },
  { src: '/hero-cinematic/sports-expo-red.png', className: 'cinematic-expo-frame', position: 'object-[50%_50%]' },
  { src: '/hero-cinematic/youtube-pays-portrait-a.png', className: 'cinematic-youtube-a-frame', position: 'object-[50%_42%]' },
  { src: '/hero-cinematic/youtube-pays-portrait-b.png', className: 'cinematic-youtube-b-frame', position: 'object-[50%_42%]' },
  { src: '/hero-cinematic/righteousness-wall.png', className: 'cinematic-wall-frame', position: 'object-[28%_50%] sm:object-center' },
]
const postHeroExampleTitles = ['ArcTemp HVAC', 'CubChatter', 'Certifia']
const gradientButtonClass = 'primary-gradient primary-glow cta-pulse-glow inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-extrabold text-white transition duration-200 hover:scale-[1.03] hover:brightness-110'
const isConceptPortfolioItem = (item: PortfolioItem) => item.description.toLowerCase().includes('demo data') || item.website_url.includes('/demo-sites/')

function KineticHeadline() {
  const words = ['Creating', 'Tomorrow.']
  return <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl text-balance">
    <motion.span className="animated-gradient-text block text-5xl font-black uppercase tracking-[0.18em] sm:text-7xl lg:text-8xl" initial={{ opacity: 0, y: 30, scale: .92 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .65, ease: 'easeOut' }}>YOUR BUSINESS DESERVES MORE</motion.span>
    <span className="mt-5 block">
      {words.map((word, index) => <motion.span key={word} className="mr-[0.18em] inline-block" initial={{ opacity: 0, y: 30, scale: .9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: .2 + index * .1, duration: .55, ease: 'easeOut' }}>{word}</motion.span>)}
      <motion.span className="inline-block text-gold-500" initial={{ opacity: 0, y: 30, scale: .9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: .45, duration: .55, ease: 'easeOut' }}>Today.</motion.span>
    </span>
  </h1>
}

function WebsiteExampleCard({ item, getUrl, compact = false }: { item: PortfolioItem; getUrl: (title: string, fallbackUrl: string) => string; compact?: boolean }) {
  return <article className="flavor-card reveal-lift overflow-hidden rounded-[1.25rem] border border-orange-100/80 bg-white shadow-[0_18px_45px_rgba(45,42,50,.08)]">
    <img src={item.image_url} alt={`${item.title} website example`} className={compact ? 'h-44 w-full object-cover' : 'h-52 w-full object-cover'} />
    <div className={compact ? 'p-5' : 'p-6'}>
      <Badge tone="green">Client Website</Badge>
      <h3 className="mt-4 text-xl font-bold text-navy-950">{item.title}</h3>
      <p className="mt-2 text-sm font-semibold text-slate-700">{item.industry}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{item.description.replace('DEMO DATA: ', '')}</p>
      {!compact && <Link to={getUrl(item.title, item.website_url)} className="mt-5 inline-flex items-center gap-2 rounded-full bg-navy-950 px-4 py-2 text-sm font-semibold text-white">View Website <ArrowRight size={15} /></Link>}
    </div>
  </article>
}

export function LandingPage() {
  const [snapshot, setSnapshot] = useState<PlatformSnapshot>(demoData)
  const [selectedCategory, setSelectedCategory] = useState('View All')
  useEffect(() => { getPlatformSnapshot().then(setSnapshot).catch(() => setSnapshot(demoData)) }, [])
  const realPortfolio = snapshot.portfolio.filter((item) => !isConceptPortfolioItem(item))
  const visiblePortfolio = selectedCategory === 'View All' ? realPortfolio : realPortfolio.filter((item) => item.industry.toLowerCase() === selectedCategory.toLowerCase())
  const approvedTestimonials = snapshot.testimonials.filter((item) => item.approved && !item.quote.toLowerCase().includes('demo testimonial'))
  const getPortfolioUrl = (fallbackUrl: string) => fallbackUrl && fallbackUrl !== '#' ? fallbackUrl : '/#examples'
  const scrollToIncluded = () => document.getElementById('what-is-included')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const postHeroExamples = postHeroExampleTitles.map((title) => realPortfolio.find((item) => item.title === title) ?? demoData.portfolio.find((item) => item.title === title)).filter((item): item is PortfolioItem => Boolean(item))

  return <PageShell tone="dark"><SiteHeader />
    <section className="relative isolate overflow-hidden bg-navy-950 text-white">
      {heroSequence.map((frame) => <img key={frame.src} src={frame.src} alt="" aria-hidden="true" className={`cinematic-frame ${frame.className} ${frame.position} absolute inset-0 -z-30 h-full w-full object-cover opacity-0`} />)}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-navy-950/62 via-navy-950/28 to-violet-500/18" />
      <div className="navy-shell animated-gradient-mesh absolute inset-0 -z-20 opacity-20 mix-blend-overlay" />
      <div className="cinematic-rain absolute inset-0 -z-10 opacity-0" aria-hidden="true" />
      <div className="cinematic-lightning absolute inset-0 -z-10 opacity-0" aria-hidden="true" />
      <div className="cinematic-light-streak absolute inset-0 -z-10 opacity-0" aria-hidden="true" />
      <div className="cinematic-lens-flare absolute inset-0 -z-10 opacity-0" aria-hidden="true" />
      <div className="cinematic-white-flash absolute inset-0 -z-10 opacity-0" aria-hidden="true" />
      <div className="cinematic-black-flash absolute inset-0 -z-10 opacity-0" aria-hidden="true" />
      <div className="border-b border-white/10 bg-navy-950/25 px-4 py-3 text-center text-sm text-white backdrop-blur-md"><span className="font-semibold">Limited weekly build capacity.</span> <span className="text-gold-500">Applications are reviewed in the order they are completed and approved.</span></div>
      <div className="mx-auto flex min-h-[840px] max-w-7xl items-end px-4 pb-14 pt-28 sm:min-h-[780px] sm:items-center sm:px-6 sm:py-20 lg:min-h-[820px] lg:px-8 lg:py-28">
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 16.8, duration: .9, ease: 'easeOut' }} className="max-w-4xl rounded-[2rem] border border-white/15 bg-navy-950/28 p-5 shadow-2xl shadow-navy-950/25 backdrop-blur-[2px] sm:p-8 lg:p-10">
          <Badge tone="gold">Business Launch Initiative</Badge>
          <KineticHeadline />
          <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-200">Receive a professionally designed, mobile-friendly website with no upfront website design fee. Build credibility, make it easier for customers to find you, and establish a digital home your business can grow from.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={scrollToIncluded} className={gradientButtonClass}>Get My Free Website <ArrowRight size={18} /></button><a href="#examples" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20">See Examples <ArrowRight size={16} /></a></div>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-300">Website design and initial build included for approved applicants. Managed hosting is required for launch at $34/month. Domain registration, premium integrations, maintenance, and advanced services may require separate payment.</p>
          <p className="mt-6 text-sm font-semibold text-gold-500">Professional Website. No Upfront Design Fee.</p>
          <p className="mt-2 text-sm text-slate-300">Built to help your business get discovered, earn trust, and grow.</p>
        </motion.div>
      </div>
    </section>

    <div className="cinematic-divider" aria-hidden="true" />
    <section className="flavor-section bg-cloud-50 px-4 pb-12 pt-8 text-navy-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-5 md:grid-cols-3">{postHeroExamples.map((item) => <WebsiteExampleCard key={item.id} item={item} getUrl={(_, fallbackUrl) => getPortfolioUrl(fallbackUrl)} compact />)}</div>
        <div className="mt-9 text-center">
          <p className="mb-4 text-lg font-semibold text-navy-900">No design skills needed. We build it for you.</p>
          <button type="button" onClick={scrollToIncluded} className={gradientButtonClass}>Get My Free Website <ArrowRight size={18} /></button>
        </div>
      </div>
    </section>

    <div className="flavor-section bg-white px-4 py-5 text-navy-950"><div className="mx-auto grid max-w-7xl gap-3 text-sm font-semibold sm:grid-cols-5">{trustItems.map(([item, Icon]) => <div key={item} className="flavor-card reveal-lift flex items-center justify-center gap-2 rounded-full bg-cloud-100 px-4 py-3 text-center"><Icon size={16} className="text-royal-700" />{item}</div>)}</div></div>

    <Section eyebrow="Process" title="How It Works" className="flavor-section bg-cloud-50" >
      <div id="how-it-works" className="glow-process-line relative grid gap-5 md:grid-cols-4 md:before:absolute md:before:left-[12%] md:before:right-[12%] md:before:top-10 md:before:h-px md:before:bg-blue-100">{process.map(([title, body], i) => <div key={title} className="relative"><FeatureCard title={`Step ${i + 1}: ${title}`} body={body} icon={<span className="font-bold">{i + 1}</span>} /></div>)}</div>
    </Section>

    <Section eyebrow="Included Scope" title="What Is Included" className="flavor-section bg-white">
      <div id="what-is-included" className="scroll-mt-28" />
      <div id="included" className="scroll-mt-28" />
      <div className="flavor-card reveal-lift mb-8 rounded-[1.5rem] border border-orange-100 bg-cloud-50 p-6 shadow-sm">
        <h3 className="text-2xl font-bold text-navy-950">Here&apos;s Exactly What You Get — <span className="animated-gradient-text">Free</span></h3>
        <p className="mt-3 max-w-4xl text-lg font-medium leading-8 text-slate-700">Your website design and build are 100% free. Hosting is required for any website to exist online, and our managed hosting is $34/month; custom features and premium integrations are optional upgrades later.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{included.map(([item, detail]) => <details key={item} className="flavor-card reveal-lift group rounded-2xl border bg-cloud-50 p-4 text-sm shadow-sm open:bg-white"><summary className="flex cursor-pointer list-none items-start gap-3 font-semibold text-navy-950"><Check className="mt-0.5 shrink-0 text-emerald-500" size={18} />{item}<Info className="ml-auto shrink-0 text-slate-400 transition group-open:text-royal-700" size={16} /></summary><p className="mt-3 pl-8 leading-6 text-slate-600">{detail}</p></details>)}</div>
      <div className="flavor-card reveal-lift mt-8 rounded-[1.5rem] bg-navy-950 p-6 leading-7 text-white shadow-xl"><p>The website design and initial standard build are included for approved businesses. Managed hosting with us is required for launch at $34/month because every live website needs hosting. Domain registration, premium integrations, custom functionality, additional revisions, maintenance, ongoing support, and advanced marketing services may require separate payment.</p><div className="mt-6"><Link to="/apply" className={gradientButtonClass}>Apply for My Free Website <ArrowRight size={18} /></Link><p className="mt-3 text-sm font-medium text-slate-300">Takes 2 minutes. No credit card, no obligation.</p></div></div>
    </Section>

    <Section eyebrow="Qualification" title="Who This Program Is Designed For" className="flavor-section bg-cloud-50"><div className="grid gap-8 lg:grid-cols-2"><div className="flavor-card reveal-lift rounded-3xl bg-white p-7 shadow-sm"><h3 className="text-xl font-bold text-navy-950">A Strong Fit For</h3><ul className="mt-5 grid gap-3 text-sm text-slate-700">{qualifies.map((item) => <li key={item} className="flex gap-3"><Check className="shrink-0 text-emerald-500" size={18} />{item}</li>)}</ul></div><div className="flavor-card reveal-lift rounded-3xl bg-navy-950 p-7 text-white"><h3 className="text-xl font-bold">This May Not Be the Right Fit If</h3><ul className="mt-5 grid gap-3 text-sm text-slate-300">{notRightFit.map((item) => <li key={item} className="flex gap-3"><Info className="shrink-0 text-gold-500" size={18} />{item}</li>)}</ul><p className="mt-6 text-gold-500">Premium services and custom software are available when the standard website scope is not enough.</p></div></div></Section>

    <Section eyebrow="Website Examples" title="Real Website Examples by Industry" className="flavor-section bg-white"><div id="examples" className="mb-6 flex flex-wrap gap-2">{categories.map((cat) => <button key={cat} onClick={() => setSelectedCategory(cat)} className={`rounded-full px-3 py-2 text-xs font-semibold transition hover:-translate-y-0.5 hover:shadow-lg ${selectedCategory === cat ? 'bg-navy-950 text-white' : 'bg-blue-50 text-royal-700'}`}>{cat}</button>)}</div><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{visiblePortfolio.map((item) => <article key={item.id} className="flavor-card reveal-lift overflow-hidden rounded-3xl border bg-white shadow-sm"><img src={item.image_url} alt={`${item.title} website example`} className="h-52 w-full object-cover transition duration-300 hover:scale-105" /><div className="p-6"><Badge tone="green">Client Website</Badge><h3 className="mt-4 text-xl font-bold text-navy-950">{item.title}</h3><p className="mt-2 text-sm font-semibold text-slate-700">{item.industry}</p><p className="mt-2 text-sm leading-6 text-slate-600">{item.description.replace('DEMO DATA: ', '')}</p><Link to={getPortfolioUrl(item.website_url)} className="mt-5 inline-flex items-center gap-2 rounded-full bg-navy-950 px-4 py-2 text-sm font-semibold text-white">View Website <ArrowRight size={15} /></Link></div></article>)}{visiblePortfolio.length === 0 && <div className="flavor-card reveal-lift rounded-3xl border border-dashed bg-cloud-50 p-8 text-slate-600 lg:col-span-3">More website examples for this category can be added as new approved examples become available.</div>}</div></Section>

    <Section eyebrow="Launch Paths" title="Choose Your Business Launch Path" className="flavor-section bg-cloud-50"><div id="packages" className="grid gap-5 lg:grid-cols-4">{offers.map((offer) => <div key={offer.title} className="flavor-card reveal-lift flex rounded-3xl border bg-white p-6 shadow-sm"><div className="flex w-full flex-col"><Badge tone={offer.title === 'Custom Software' ? 'gold' : 'blue'}>{offer.label}</Badge><h3 className="mt-4 text-xl font-bold uppercase tracking-wide text-navy-950">{offer.title}</h3><ul className="mt-5 grid gap-3 text-sm text-slate-700">{offer.features.map((item) => <li key={item} className="flex gap-2"><Check className="mt-0.5 shrink-0 text-emerald-500" size={16} />{item}</li>)}</ul><Link to={offer.to} className="mt-auto inline-flex rounded-full bg-navy-950 px-4 py-3 text-center text-sm font-semibold text-white">{offer.cta}</Link></div></div>)}</div><p className="flavor-card reveal-lift mt-8 rounded-3xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700">Advanced services, recurring hosting, third-party tools, and custom functionality are separate from the standard website build and should be reviewed before approval.</p></Section>

    <Section eyebrow="Business Launch Platform" title="More Than a Website" className="flavor-section bg-white"><div id="growth-services" className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]"><div className="flavor-card reveal-lift rounded-3xl bg-navy-950 p-8 text-white"><Laptop className="mb-5 text-gold-500" size={42} /><p className="text-lg leading-8 text-slate-200">Your website is the foundation. As your business grows, the Business Launch Initiative can help you add the tools needed to attract leads, manage customers, automate communication, accept appointments, and operate more efficiently.</p><Link to="/software-consultation" className="mt-7 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-navy-950">Explore Growth Services</Link></div><div className="grid gap-4 sm:grid-cols-2">{platformFeatures.map(([title, body]) => <div key={title} className="flavor-card reveal-lift rounded-3xl border bg-cloud-50 p-5"><Wrench className="mb-4 text-royal-700" size={22} /><h3 className="font-bold text-navy-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{body}</p></div>)}</div></div></Section>

    <Section eyebrow="Program Status" title="Applications Are Currently Open" className="flavor-section" dark><div className="grid gap-5 md:grid-cols-3"><div className="flavor-card reveal-lift rounded-3xl border border-white/10 bg-white/5 p-6"><ClipboardCheck className="mb-4 text-gold-500" /><h3 className="text-xl font-bold text-white">Applications currently open</h3><p className="mt-2 text-sm leading-6 text-slate-300">Applicants can submit business information for review.</p></div><div className="flavor-card reveal-lift rounded-3xl border border-white/10 bg-white/5 p-6"><Search className="mb-4 text-gold-500" /><h3 className="text-xl font-bold text-white">Applications reviewed for fit</h3><p className="mt-2 text-sm leading-6 text-slate-300">Eligibility, readiness, capacity, and scope are reviewed before approval.</p></div><div className="flavor-card reveal-lift rounded-3xl border border-white/10 bg-white/5 p-6"><ShieldCheck className="mb-4 text-gold-500" /><h3 className="text-xl font-bold text-white">Limited weekly production capacity</h3><p className="mt-2 text-sm leading-6 text-slate-300">Approved projects are scheduled based on onboarding readiness and available production capacity.</p></div></div></Section>

    <Section eyebrow="Client Stories" title="Social Proof" className="flavor-section bg-white">{approvedTestimonials.length ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">{approvedTestimonials.map((item) => <div key={item.id} className="flavor-card reveal-lift rounded-3xl border bg-white p-6 shadow-sm"><img src={item.image_url} alt={`${item.client_name} testimonial`} className="mb-5 h-24 w-full rounded-2xl object-cover" /><p className="text-sm leading-6 text-slate-700">“{item.quote}”</p><p className="mt-4 font-bold text-navy-950">{item.client_name}</p><p className="text-sm text-slate-500">{item.business_name} · {item.industry}</p>{item.website_url && <a href={item.website_url} className="mt-4 inline-flex text-sm font-semibold text-royal-700">View Website</a>}</div>)}</div> : <div className="flavor-card reveal-lift rounded-3xl border border-dashed bg-cloud-50 p-10 text-center"><Globe2 className="mx-auto mb-4 text-royal-700" size={36} /><h3 className="text-2xl font-bold text-navy-950">Client stories will appear here as participating businesses launch.</h3><p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">This section is ready for approved testimonials, project types, client photos or logos, and website links once real launch stories are available.</p></div>}</Section>

    <Section eyebrow="FAQ" title="Frequently Asked Questions" className="flavor-section bg-cloud-50"><div id="faq" className="grid gap-4 lg:grid-cols-2">{faq.map(([q, a]) => <details key={q} className="flavor-card reveal-lift rounded-2xl border bg-white p-5"><summary className="cursor-pointer font-bold text-navy-950">{q}</summary><p className="mt-3 text-sm leading-6 text-slate-600">{a}</p></details>)}</div></Section>

    <div className="cinematic-divider" aria-hidden="true" />
    <section className="flavor-section navy-shell px-4 py-20 text-center text-white"><Globe2 className="mx-auto mb-5 text-gold-500" size={42} /><h2 className="shimmer-heading mx-auto max-w-3xl text-4xl font-bold tracking-tight">Ready to Start Your Business Launch?</h2><p className="mx-auto mt-7 max-w-2xl text-slate-300">Complete the application and our team will review your business information, readiness, and available launch options.</p><div className="mt-8"><CTAButton to="/apply" variant="secondary">Start My Application</CTAButton></div></section>
    <Footer />
  </PageShell>
}
