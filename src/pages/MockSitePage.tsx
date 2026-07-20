import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Mail, MapPin, Menu, Phone, Star } from 'lucide-react'
import { useMemo, useState } from 'react'
import { getMockSite, getMockSitePath, mockSitePages, type MockSitePageKey } from '../data/mockSites'

function isMockPage(value?: string): value is MockSitePageKey {
  return value === 'home' || value === 'about' || value === 'services' || value === 'work' || value === 'contact'
}

export function MockSitePage() {
  const { slug, page } = useParams()
  const site = getMockSite(slug)
  const currentPage: MockSitePageKey = isMockPage(page) ? page : 'home'
  const [menuOpen, setMenuOpen] = useState(false)
  const content = site.pages[currentPage]
  const nextPage = useMemo(() => {
    const index = mockSitePages.findIndex((item) => item.key === currentPage)
    return mockSitePages[(index + 1) % mockSitePages.length]
  }, [currentPage])

  if (!slug) return <Navigate to={getMockSitePath(site.slug)} replace />

  return <div className="min-h-screen bg-white text-slate-950">
    <div className="border-b border-slate-200 bg-slate-950 px-4 py-3 text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-sm">
        <Link to="/#examples" className="inline-flex items-center gap-2 text-slate-200 hover:text-white"><ArrowLeft size={16} /> Back to Business Launch examples</Link>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">Demo mock site · 5 pages</span>
      </div>
    </div>

    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link to={getMockSitePath(site.slug)} className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl text-lg font-black text-white" style={{ backgroundColor: site.accent }}>{site.name.split(' ').map((word) => word[0]).slice(0, 2).join('')}</span>
          <span><span className="block text-lg font-black tracking-tight">{site.name}</span><span className="text-sm text-slate-500">{site.industry}</span></span>
        </Link>
        <nav className="hidden items-center gap-2 lg:flex">
          {mockSitePages.map((item) => <Link key={item.key} to={getMockSitePath(site.slug, item.key)} className={`rounded-full px-4 py-2 text-sm font-semibold ${item.key === currentPage ? 'text-white' : 'text-slate-600 hover:bg-slate-100'}`} style={item.key === currentPage ? { backgroundColor: site.accent } : undefined}>{item.label}</Link>)}
        </nav>
        <div className="hidden items-center gap-3 lg:flex"><a href={`tel:${site.phone}`} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold">{site.phone}</a><Link to={getMockSitePath(site.slug, 'contact')} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white">Get Started <ArrowRight size={15} /></Link></div>
        <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open demo site menu"><Menu /></button>
      </div>
      {menuOpen && <div className="border-t border-slate-200 px-4 py-4 lg:hidden"><div className="grid gap-2">{mockSitePages.map((item) => <Link key={item.key} onClick={() => setMenuOpen(false)} to={getMockSitePath(site.slug, item.key)} className={`rounded-2xl px-4 py-3 text-sm font-semibold ${item.key === currentPage ? 'text-white' : 'bg-slate-50'}`} style={item.key === currentPage ? { backgroundColor: site.accent } : undefined}>{item.label}</Link>)}</div></div>}
    </header>

    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-950" />
        <img src={site.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/86 to-slate-950/45" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 text-white sm:px-6 lg:grid-cols-[1fr_.8fr] lg:px-8 lg:py-28">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-amber-200">{content.eyebrow}</p>
            <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">{content.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">{content.body}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link to={getMockSitePath(site.slug, 'contact')} className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white" style={{ backgroundColor: site.accent }}>Request a Consultation <ArrowRight size={16} /></Link><Link to={getMockSitePath(site.slug, 'services')} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-bold text-white hover:bg-white/10">View Services</Link></div>
          </div>
          <div className="self-end rounded-[2rem] border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
            <div className="rounded-[1.5rem] bg-white p-6 text-slate-950 shadow-2xl">
              <p className="text-sm font-bold" style={{ color: site.accent }}>Website Preview</p>
              <h2 className="mt-3 text-2xl font-black">{site.name}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{site.summary}</p>
              <div className="mt-6 grid grid-cols-3 gap-3">{site.stats.map((stat) => <div key={stat.label} className="rounded-2xl bg-slate-50 p-3 text-center"><p className="text-xl font-black">{stat.value}</p><p className="text-[11px] text-slate-500">{stat.label}</p></div>)}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[.7fr_1.3fr]">
          <div className="rounded-[2rem] bg-white p-7 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-400">Page Content</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">{mockSitePages.find((item) => item.key === currentPage)?.label} page</h2>
            <p className="mt-4 leading-7 text-slate-600">This is a functional demo page, not a static image. Use the navigation to browse all five pages included in this mock website.</p>
            <div className="mt-6 grid gap-3">
              <p className="flex items-center gap-3 text-sm"><MapPin size={17} style={{ color: site.accent }} /> {site.city}</p>
              <p className="flex items-center gap-3 text-sm"><Phone size={17} style={{ color: site.accent }} /> {site.phone}</p>
              <p className="flex items-center gap-3 text-sm"><Mail size={17} style={{ color: site.accent }} /> {site.email}</p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {content.bullets.map((bullet, index) => <div key={bullet} className="rounded-[2rem] bg-white p-7 shadow-sm"><div className="mb-5 grid size-12 place-items-center rounded-2xl text-white" style={{ backgroundColor: site.accent }}>{index + 1}</div><h3 className="text-xl font-black">{bullet}</h3><p className="mt-3 text-sm leading-6 text-slate-600">A polished section that can be customized with real copy, images, forms, testimonials, and calls to action for this business.</p></div>)}
            <div className="rounded-[2rem] bg-slate-950 p-7 text-white shadow-sm md:col-span-2"><Star className="mb-4 text-amber-300" /><h3 className="text-2xl font-black">Built through the Business Launch Initiative</h3><p className="mt-3 max-w-2xl text-slate-300">This sample demonstrates a standard five-page website scope: Home, About, Services, Work, and Contact. Premium features like booking, ecommerce, portals, automations, and advanced integrations can be added as upgrades.</p></div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-[0.22em]" style={{ color: site.accent }}>Services Snapshot</p><h2 className="mt-3 text-3xl font-black tracking-tight">What this business can promote</h2></div><Link to={getMockSitePath(site.slug, nextPage.key)} className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-bold">Next page: {nextPage.label} <ArrowRight size={15} /></Link></div>
          <div className="grid gap-4 md:grid-cols-4">{site.services.map((service) => <div key={service} className="rounded-3xl border border-slate-200 p-5"><Check className="mb-4" style={{ color: site.accent }} /><h3 className="font-black">{service}</h3><p className="mt-2 text-sm leading-6 text-slate-600">Clear, scannable service copy helps visitors choose the right next step.</p></div>)}</div>
        </div>
      </section>
    </main>

    <footer className="bg-slate-950 px-4 py-12 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="text-xl font-black">{site.name}</p><p className="mt-2 text-sm text-slate-400">Demo website built for preview purposes.</p></div>
        <Link to="/apply" className="rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950">Apply for a Free Website</Link>
      </div>
    </footer>
  </div>
}
