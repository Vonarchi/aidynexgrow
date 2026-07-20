import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Globe2 } from 'lucide-react'
import { Footer, PageShell, SiteHeader } from '../components/Layout'
import { Badge, CTAButton, FeatureCard, Section, StatCard } from '../components/UI'
import { demoData, maintenancePlans } from '../data/demoData'
import { getMockSitePath, mockSites } from '../data/mockSites'
import { getPlatformSnapshot } from '../lib/platformService'
import { metricValue } from '../lib/utils'
import type { PlatformSnapshot } from '../types/platform'

const included = ['Professional homepage', 'Up to five standard pages', 'Mobile-responsive design', 'Contact or lead form', 'Social media links', 'Google Maps integration', 'Basic search-engine setup', 'SSL security', 'One revision round', 'Website launch assistance']
const qualifies = ['Legitimate small business, nonprofit, professional, creator, or organization', 'Business must provide accurate information', 'Business must provide logo, images, services, and website content', 'Applicant must respond within required deadlines', 'Project must fit within the standard free website scope', 'Applicant must agree to the project terms']
const notIncluded = ['Large online stores', 'Custom marketplaces', 'Complex membership platforms', 'Mobile applications', 'Advanced web applications', 'Custom databases', 'Extensive copywriting', 'Unlimited revisions', 'Advanced integrations', 'Paid stock media', 'Domain registration fees', 'Third-party software fees']
const faq = [
  ['Is the website really free?', 'The standard website design and initial build have no upfront design fee for approved applicants. Paid costs may apply for domains, hosting, premium integrations, custom functionality, or ongoing support.'],
  ['What do I have to pay for?', 'You only pay for optional or required third-party costs such as domain registration, hosting, premium tools, custom software, or add-on services you approve.'],
  ['Do I have to purchase hosting?', 'No. Hosting is optional, although managed hosting is available if you want us to handle SSL, backups, monitoring, and support.'],
  ['Can I use my existing domain?', 'Yes. We can help connect an existing domain during launch.'],
  ['How long will the website take?', 'Most approved standard builds are estimated at 5-10 business days after content is ready and the project enters production.'],
  ['How many revisions are included?', 'Free projects include one revision round by default. Additional revision rounds are available as paid upgrades.'],
  ['Can you write my content?', 'Basic guidance is included. Custom copywriting is available as an optional paid service.'],
  ['Can you build an online store?', 'Basic ecommerce may be possible as an upgrade. Large stores and marketplaces are custom paid projects.'],
  ['What happens after the website launches?', 'You can keep managing it yourself or request hosting, maintenance, SEO, analytics, automation, and growth services.'],
  ['Can I upgrade later?', 'Yes. You can add hosting, maintenance, SEO, booking, automation, custom pages, web applications, or mobile apps later.'],
  ['Do you build web applications?', 'Yes. Customer portals, dashboards, marketplaces, booking systems, AI tools, and mobile apps are quoted separately.'],
  ['Who owns the completed website?', 'Ownership and access details are handled in the project terms and depend on selected hosting, tools, and third-party services.'],
  ['What happens if I do not submit my content?', 'Projects waiting on content can be paused or skipped temporarily so ready projects can keep moving.'],
  ['Can I lose my place in line?', 'Delayed responses or missing content can affect queue position, but your dashboard will show what is needed.'],
]

export function LandingPage() {
  const [snapshot, setSnapshot] = useState<PlatformSnapshot>(demoData)
  useEffect(() => { getPlatformSnapshot().then(setSnapshot).catch(() => setSnapshot(demoData)) }, [])
  const spots = metricValue(snapshot.metrics, 'weekly_spots_remaining', '12')
  const categories = ['Professional services', 'Restaurants', 'Beauty and wellness', 'Contractors', 'Transportation', 'Nonprofits', 'Churches', 'Coaches', 'Real estate', 'Retail', 'Education', 'Healthcare']
  const getPortfolioDemoUrl = (title: string, fallbackUrl: string) => fallbackUrl && fallbackUrl !== '#' ? fallbackUrl : getMockSitePath(mockSites.find((site) => site.name === title)?.slug ?? mockSites[0].slug)

  return <PageShell tone="dark"><SiteHeader />
    <div className="navy-shell">
      <div className="border-b border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-white"><span className="font-semibold">Now accepting applications for this week’s free website builds.</span> <span className="text-gold-500">{spots} of 20 weekly build spots remaining</span></div>
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-28">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }} className="self-center">
          <Badge tone="gold">Limited weekly build capacity. Applications are processed in the order they are approved.</Badge>
          <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl text-balance">Your Business Deserves More Than a Social Media Page.</h1>
          <p className="mt-6 max-w-2xl text-xl text-slate-200">We’ll build your professional website at no upfront design cost.</p>
          <p className="mt-4 max-w-2xl leading-8 text-slate-300">Apply today and receive a modern, mobile-friendly website built to help your business look credible, attract customers, and grow.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><CTAButton to="/apply" variant="secondary">Apply for My Free Website</CTAButton><a href="#examples" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white hover:bg-white/10">View Website Examples <ArrowRight size={16} /></a></div>
          <p className="mt-6 text-sm font-semibold text-gold-500">FREE. FREE. FREE. Your Business Website Is On Us.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .7, delay: .15 }} className="relative min-h-[520px]">
          <div className="absolute inset-x-8 top-6 rounded-[2rem] border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur-xl animate-float"><div className="rounded-[1.5rem] bg-white p-4 text-navy-950"><div className="mb-4 flex gap-2"><span className="size-3 rounded-full bg-red-400" /><span className="size-3 rounded-full bg-yellow-400" /><span className="size-3 rounded-full bg-green-400" /></div><div className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl bg-navy-950 p-5 text-white"><p className="text-xs text-gold-500">Website Preview</p><h3 className="mt-8 text-2xl font-bold">Premium Local Brand</h3><p className="mt-3 text-sm text-slate-300">Mobile-first website, quote capture, maps, SEO setup.</p></div><div className="grid gap-3"><div className="rounded-2xl bg-cloud-100 p-4"><p className="text-xs text-slate-500">Conversion Score</p><p className="text-2xl font-bold">94%</p></div><div className="rounded-2xl bg-blue-50 p-4"><p className="text-xs text-slate-500">Leads This Week</p><p className="text-2xl font-bold text-royal-700">28</p></div></div></div></div></div>
          <div className="absolute bottom-10 left-0 w-52 rounded-[2rem] border border-white/15 bg-white p-3 shadow-2xl"><div className="rounded-[1.5rem] bg-navy-950 p-4 text-white"><p className="text-xs text-gold-500">Mobile Ready</p><div className="mt-5 space-y-3"><div className="h-20 rounded-2xl bg-white/10" /><div className="h-3 rounded bg-white/20" /><div className="h-3 w-2/3 rounded bg-white/20" /><button className="mt-3 w-full rounded-full bg-gold-500 py-2 text-xs font-bold text-navy-950">Request Quote</button></div></div></div>
          <div className="absolute bottom-0 right-0 rounded-3xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur-xl"><p className="text-sm text-slate-300">Build Queue</p><p className="mt-1 text-3xl font-bold">#{metricValue(snapshot.metrics, 'current_queue_length', '42')}</p><p className="mt-2 text-xs text-teal-400">Website-generation effect active</p></div>
        </motion.div>
      </section>
    </div>

    <div className="bg-white px-4 py-5 text-navy-950"><div className="mx-auto grid max-w-7xl gap-3 text-center text-sm font-semibold sm:grid-cols-5">{['Professional Designs', 'Mobile Responsive', 'Fast Turnaround', 'Secure Hosting Options', 'No Upfront Design Fee'].map((item) => <div key={item} className="rounded-full bg-cloud-100 px-4 py-3">{item}</div>)}</div></div>

    <Section eyebrow="Process" title="How It Works" className="bg-cloud-50" >
      <div id="how-it-works" className="grid gap-5 md:grid-cols-4">{[['Apply', 'Tell us about your business and the website you need.'], ['Get Approved', 'We review your application and confirm whether it qualifies.'], ['Follow Your Build', 'Track your place in line and watch your project progress.'], ['Launch', 'Review your website, request your included revision, and publish.']].map(([title, body], i) => <FeatureCard key={title} title={`Step ${i + 1}: ${title}`} body={body} icon={<span className="font-bold">{i + 1}</span>} />)}</div>
    </Section>

    <Section eyebrow="Included Scope" title="What Is Included" className="bg-white">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{included.map((item) => <div key={item} className="rounded-2xl border bg-cloud-50 p-4 text-sm font-semibold"><Check className="mb-3 text-emerald-500" />{item}</div>)}</div>
      <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900">The website design and initial build are free. Domain registration, premium integrations, custom functionality, hosting, ongoing support, and maintenance may require separate payment.</div>
    </Section>

    <Section eyebrow="Qualification" title="Who Qualifies" className="bg-cloud-50"><div className="grid gap-8 lg:grid-cols-2"><div className="rounded-3xl bg-white p-7 shadow-sm"><h3 className="text-xl font-bold text-navy-950">Qualification Criteria</h3><ul className="mt-5 grid gap-3 text-sm text-slate-700">{qualifies.map((item) => <li key={item} className="flex gap-3"><Check className="shrink-0 text-emerald-500" size={18} />{item}</li>)}</ul></div><div className="rounded-3xl bg-navy-950 p-7 text-white"><h3 className="text-xl font-bold">What Is Not Included</h3><div className="mt-5 flex flex-wrap gap-2">{notIncluded.map((item) => <Badge key={item} tone="slate">{item}</Badge>)}</div><p className="mt-6 text-gold-500">These services are still available as paid upgrades.</p></div></div></Section>

    <Section eyebrow="Portfolio" title="Website Examples" className="bg-white"><div id="examples" className="mb-6 flex flex-wrap gap-2">{categories.map((cat) => <Badge key={cat}>{cat}</Badge>)}</div><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{snapshot.portfolio.map((item) => <article key={item.id} className="overflow-hidden rounded-3xl border bg-white shadow-sm"><img src={item.image_url} alt="" className="h-52 w-full object-cover" /><div className="p-6"><Badge tone="gold">Built through the Business Launch Initiative</Badge><h3 className="mt-4 text-xl font-bold text-navy-950">{item.title}</h3><p className="mt-2 text-sm text-slate-600">{item.industry} · {item.description}</p><Link to={getPortfolioDemoUrl(item.title, item.website_url)} className="mt-5 inline-flex items-center gap-2 rounded-full bg-navy-950 px-4 py-2 text-sm font-semibold text-white">View Demo <ArrowRight size={15} /></Link></div></article>)}</div></Section>

    <Section eyebrow="Offer Ladder" title="Free Website Versus Premium Growth Options" className="bg-cloud-50"><div id="packages" className="grid gap-5 lg:grid-cols-4">{[
      ['Free Website', ['Up to five pages', 'Standard layout', 'Mobile responsive', 'Contact form', 'One revision', 'Standard queue', 'Customer supplies content']],
      ['Priority Website', ['Faster turnaround', 'Expanded customization', 'Three revision rounds', 'Copy assistance', 'Premium design options', 'Priority queue']],
      ['Business Growth Package', ['Website', 'Hosting', 'Maintenance', 'Analytics', 'SEO setup', 'Appointment booking', 'AI chatbot', 'Email automation', 'CRM integration']],
      ['Custom Software', ['Customer portals', 'Employee dashboards', 'Scheduling systems', 'Marketplace applications', 'Restaurant ordering', 'Membership platforms', 'Mobile apps', 'AI-powered tools']],
    ].map(([title, features]) => <div key={title as string} className="rounded-3xl border bg-white p-6 shadow-sm"><h3 className="text-xl font-bold text-navy-950">{title}</h3><ul className="mt-5 grid gap-3 text-sm text-slate-700">{(features as string[]).map((item) => <li key={item} className="flex gap-2"><Check className="mt-0.5 text-emerald-500" size={16} />{item}</li>)}</ul><Link to={title === 'Custom Software' ? '/software-consultation' : '/apply'} className="mt-6 inline-flex rounded-full bg-navy-950 px-4 py-3 text-sm font-semibold text-white">{title === 'Custom Software' ? 'Request a Quote' : 'Apply Now'}</Link></div>)}</div><div className="mt-8 grid gap-4 md:grid-cols-3">{maintenancePlans.map((plan) => <StatCard key={plan.name} label={plan.name} value={plan.price} note={plan.description} />)}</div></Section>

    <Section eyebrow="Live Activity" title="Live Build Activity" dark><div className="grid gap-5 md:grid-cols-5"><StatCard label="Websites completed this week" value={metricValue(snapshot.metrics, 'websites_delivered', '37')} /><StatCard label="Applications received" value={metricValue(snapshot.metrics, 'approved_applications', '126')} /><StatCard label="Currently in production" value={metricValue(snapshot.metrics, 'currently_being_built', '18')} /><StatCard label="Average turnaround" value={metricValue(snapshot.metrics, 'average_turnaround', '5-10 business days')} /><StatCard label="Current queue length" value={metricValue(snapshot.metrics, 'current_queue_length', '42')} /></div><div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6"><h3 className="mb-4 font-bold text-white">Public Queue Preview</h3><div className="grid gap-3 md:grid-cols-4">{snapshot.queueEntries.slice(0, 4).map((entry) => <div key={entry.id} className="rounded-2xl bg-white/10 p-4 text-sm"><p className="font-semibold">Website #{entry.queue_number}</p><p className="text-slate-300">{entry.status}</p></div>)}</div></div></Section>

    <Section eyebrow="Proof" title="Placeholder Testimonials Until Real Results Are Added" className="bg-white"><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">{snapshot.testimonials.map((item) => <div key={item.id} className="rounded-3xl border bg-white p-6 shadow-sm"><img src={item.image_url} alt="" className="mb-5 h-24 w-full rounded-2xl object-cover" /><p className="text-sm leading-6 text-slate-700">“{item.quote}”</p><p className="mt-4 font-bold text-navy-950">{item.client_name}</p><p className="text-sm text-slate-500">{item.business_name} · {item.industry}</p><Badge tone="green">{item.outcome}</Badge></div>)}</div></Section>

    <Section eyebrow="FAQ" title="Frequently Asked Questions" className="bg-cloud-50"><div id="faq" className="grid gap-4 lg:grid-cols-2">{faq.map(([q, a]) => <details key={q} className="rounded-2xl border bg-white p-5"><summary className="cursor-pointer font-bold text-navy-950">{q}</summary><p className="mt-3 text-sm leading-6 text-slate-600">{a}</p></details>)}</div></Section>

    <section className="navy-shell px-4 py-20 text-center text-white"><Globe2 className="mx-auto mb-5 text-gold-500" size={42} /><h2 className="text-4xl font-bold tracking-tight">Ready to Put Your Business Online?</h2><p className="mt-4 text-slate-300">Complete the application in approximately five minutes.</p><div className="mt-8"><CTAButton to="/apply" variant="secondary">Start My Free Website Application</CTAButton></div></section>
    <Footer />
  </PageShell>
}
