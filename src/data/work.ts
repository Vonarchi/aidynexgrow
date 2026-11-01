// "Our work" and "Products" shown on the homepage.
// Keep labels honest: `kind` says whether something is client work, a preview/demo, a concept, or our own product.

export type WorkKind = 'Client site' | 'Upgrade preview' | 'Demo' | 'Concept'

export type BeforeAfterWork = {
  title: string
  place: string
  kind: WorkKind
  before: string
  after: string
  href: string
  note: string
}

export type SiteWork = {
  title: string
  industry: string
  kind: WorkKind
  url: string
  note: string
}

export type Product = {
  name: string
  what: string
  url: string
}

const shot = (url: string) => `https://image.thum.io/get/width/1200/crop/760/noanimate/${url}`
export const screenshotOf = shot

export const beforeAfterWork: BeforeAfterWork[] = [
  {
    title: 'Kutanovski Dental',
    place: 'Crown Point, IN',
    kind: 'Upgrade preview',
    before: '/p/kutanovski-dental/before.png',
    after: '/p/kutanovski-dental/after.png',
    href: '/p/kutanovski-dental/',
    note: 'Image-led, cinematic family-dentistry site with one-tap booking.',
  },
  {
    title: 'Maple & Main Pancake House',
    place: 'Restaurant demo',
    kind: 'Demo',
    before: '/p/maple-main-demo/before.png',
    after: '/p/maple-main-demo/after.png',
    href: '/p/maple-main-demo/',
    note: 'PDF menu and a 2014 layout, rebuilt for phones with pickup ordering.',
  },
]

export const siteWork: SiteWork[] = [
  { title: 'ArcTemp HVAC', industry: 'Home services', kind: 'Client site', url: 'https://arctemphvac.com/', note: 'Heating, cooling and emergency repair with quote capture.' },
  { title: 'Noir Steakhouse', industry: 'Restaurant', kind: 'Concept', url: 'https://restuarant-khaki-eight.vercel.app/', note: 'Reservations, menu, private events and online ordering.' },
  { title: 'Lumiere Spa', industry: 'Beauty & wellness', kind: 'Concept', url: 'https://beauty-n-wellness-ml4n.vercel.app/', note: 'Treatments, memberships, gift cards and booking.' },
  { title: 'Blackstone & Vale', industry: 'Law firm', kind: 'Concept', url: 'https://law-firm-zip1.vercel.app/', note: 'Practice areas, case results and consultation intake.' },
  { title: 'Maison Arc', industry: 'Real estate', kind: 'Concept', url: 'https://real-estate-ruddy-three.vercel.app/', note: 'Listings, neighborhood guides and private showings.' },
  { title: 'Apex Transit Group', industry: 'Transportation', kind: 'Concept', url: 'https://transportation-cyan.vercel.app/', note: 'Freight services, coverage, tracking and quotes.' },
  { title: 'Hope Forward', industry: 'Nonprofit', kind: 'Concept', url: 'https://non-for-profit.vercel.app/', note: 'Mission, programs, impact, donations and volunteering.' },
]

export const products: Product[] = [
  { name: 'Certifia', what: 'Nurse exam prep for NCLEX, HESI and NP with rationales and progress tracking.', url: 'https://certifia.co/' },
  { name: 'CubChatter', what: 'Photo flashcard learning app for toddlers and preschoolers.', url: 'https://cubchatter.com/' },
  { name: 'ContentCracker', what: 'AI content engine: carousels, video and scheduled posting for brands.', url: 'https://contentcracker.io/' },
  { name: 'ChartReadi', what: 'Daily readiness and reset workflows for traders.', url: 'https://chartreadi.com/' },
  { name: 'YouTubePays', what: 'Creator monetization calculators, education and tools.', url: 'https://youtubepays.com/' },
]
