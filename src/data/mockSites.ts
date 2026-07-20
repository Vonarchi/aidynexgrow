export type MockSitePageKey = 'home' | 'about' | 'services' | 'work' | 'contact'

export type MockSite = {
  slug: string
  name: string
  industry: string
  tagline: string
  summary: string
  accent: string
  image: string
  city: string
  phone: string
  email: string
  services: string[]
  stats: { label: string; value: string }[]
  pages: Record<MockSitePageKey, { title: string; eyebrow: string; body: string; bullets: string[] }>
}

export const mockSitePages: { key: MockSitePageKey; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'about', label: 'About' },
  { key: 'services', label: 'Services' },
  { key: 'work', label: 'Work' },
  { key: 'contact', label: 'Contact' },
]

export const mockSites: MockSite[] = [
  {
    slug: 'summit-legal-group',
    name: 'Summit Legal Group',
    industry: 'Professional Services',
    tagline: 'Clear guidance for growing businesses and families.',
    summary: 'A polished law firm website with trust-building proof, practice area pages, consultation capture, and local SEO structure.',
    accent: '#174ae6',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80',
    city: 'Charlotte, NC',
    phone: '(704) 555-0188',
    email: 'hello@summitlegal.demo',
    services: ['Business formation', 'Contracts', 'Estate planning', 'Real estate closings'],
    stats: [{ label: 'Practice Areas', value: '8' }, { label: 'Avg. Response', value: '1 day' }, { label: 'Consultations', value: 'Free' }],
    pages: {
      home: { title: 'Legal help that feels strategic, responsive, and clear.', eyebrow: 'Trusted Local Counsel', body: 'Summit Legal Group helps clients make confident decisions with practical legal guidance and modern communication.', bullets: ['Book a consultation online', 'Practice-area lead capture', 'Attorney credibility blocks'] },
      about: { title: 'A client-first firm built around clarity.', eyebrow: 'About the Firm', body: 'The firm combines polished presentation with simple explanations, transparent next steps, and a professional team profile.', bullets: ['Attorney bios', 'Credentials and affiliations', 'Local service-area focus'] },
      services: { title: 'Practice areas organized for conversion.', eyebrow: 'Services', body: 'Each service section explains the problem, the process, and the next action a visitor should take.', bullets: ['Business law', 'Estate planning', 'Real estate', 'Contract review'] },
      work: { title: 'A resource center for common legal questions.', eyebrow: 'Client Resources', body: 'The sample work page can become case studies, FAQs, articles, or downloadable intake resources.', bullets: ['FAQ accordion', 'Downloadable checklist', 'Consultation CTA'] },
      contact: { title: 'Schedule a confidential consultation.', eyebrow: 'Contact', body: 'The contact page gives prospects multiple conversion paths without feeling crowded or aggressive.', bullets: ['Secure inquiry form', 'Click-to-call phone', 'Map and office hours'] },
    },
  },
  {
    slug: 'ember-table-kitchen',
    name: 'Ember Table Kitchen',
    industry: 'Restaurants',
    tagline: 'Seasonal plates, warm hospitality, and memorable nights out.',
    summary: 'A restaurant demo with menu highlights, reservation CTAs, private dining, location details, and mobile-first ordering paths.',
    accent: '#d97706',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=80',
    city: 'Nashville, TN',
    phone: '(615) 555-0144',
    email: 'reservations@embertable.demo',
    services: ['Dinner service', 'Weekend brunch', 'Private dining', 'Catering'],
    stats: [{ label: 'Menu Items', value: '42' }, { label: 'Private Rooms', value: '2' }, { label: 'Rating', value: '4.8' }],
    pages: {
      home: { title: 'A modern dining destination with a reservation-first homepage.', eyebrow: 'Restaurant Demo', body: 'This mockup presents the food, mood, and reservation CTA immediately for mobile visitors.', bullets: ['Reservation button', 'Menu previews', 'Location card'] },
      about: { title: 'A story-rich page for the chef, concept, and community.', eyebrow: 'Our Story', body: 'Restaurants can use the about page to explain their concept, source ingredients, and highlight the team.', bullets: ['Chef profile', 'Ingredient sourcing', 'Press mentions'] },
      services: { title: 'Menus, catering, and private dining in one place.', eyebrow: 'Dining Options', body: 'Clear cards help visitors choose between dine-in, catering, events, and seasonal specials.', bullets: ['Dinner menu', 'Brunch menu', 'Private event packages'] },
      work: { title: 'Gallery moments that make guests hungry.', eyebrow: 'Gallery', body: 'A visual gallery creates confidence before guests reserve, order, or call.', bullets: ['Food photography', 'Dining room shots', 'Event setup previews'] },
      contact: { title: 'Reserve, call, or find the restaurant fast.', eyebrow: 'Visit Us', body: 'Mobile-first contact details reduce friction for high-intent customers.', bullets: ['Click-to-call', 'Google Maps area', 'Hours and parking notes'] },
    },
  },
  {
    slug: 'luxe-bloom-studio',
    name: 'Luxe Bloom Studio',
    industry: 'Beauty and Wellness',
    tagline: 'Beauty services designed around confidence and calm.',
    summary: 'A salon and beauty studio demo with service menus, appointment booking prompts, gallery proof, and package upsells.',
    accent: '#be185d',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=80',
    city: 'Dallas, TX',
    phone: '(214) 555-0119',
    email: 'book@luxebloom.demo',
    services: ['Hair styling', 'Color services', 'Makeup', 'Bridal packages'],
    stats: [{ label: 'Services', value: '18' }, { label: 'Booking', value: 'Online' }, { label: 'Reviews', value: '250+' }],
    pages: {
      home: { title: 'A refined beauty brand with appointment-focused design.', eyebrow: 'Studio Demo', body: 'The homepage blends premium visuals, social proof, and direct booking prompts.', bullets: ['Book now CTA', 'Service highlights', 'Review strip'] },
      about: { title: 'Introduce the artists behind the experience.', eyebrow: 'About Luxe Bloom', body: 'The about page builds personal trust with stylist bios, values, and studio standards.', bullets: ['Team bios', 'Studio philosophy', 'Sanitation standards'] },
      services: { title: 'Service menus built for easy decisions.', eyebrow: 'Services', body: 'Packages, starting prices, and add-ons are organized clearly for mobile browsing.', bullets: ['Hair and color', 'Makeup services', 'Bridal packages'] },
      work: { title: 'A portfolio that turns scrolling into booking.', eyebrow: 'Lookbook', body: 'Before-and-after galleries and featured styles help visitors picture their own result.', bullets: ['Before and after', 'Seasonal looks', 'Client features'] },
      contact: { title: 'Make booking easy from any device.', eyebrow: 'Book a Visit', body: 'The contact page routes clients to appointments, calls, location info, and social channels.', bullets: ['Booking form', 'Click-to-call', 'Instagram link'] },
    },
  },
  {
    slug: 'ironclad-roofing',
    name: 'Ironclad Roofing',
    industry: 'Contractors',
    tagline: 'Roofing, repairs, and inspections with no-pressure estimates.',
    summary: 'A contractor website demo with service-area SEO, emergency CTAs, quote request flow, insurance trust blocks, and project proof.',
    accent: '#0f766e',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=80',
    city: 'Atlanta, GA',
    phone: '(404) 555-0167',
    email: 'quotes@ironcladroofing.demo',
    services: ['Roof replacement', 'Storm repair', 'Inspections', 'Gutters'],
    stats: [{ label: 'Inspections', value: 'Free' }, { label: 'Warranty', value: '10 yr' }, { label: 'Response', value: '24 hr' }],
    pages: {
      home: { title: 'A lead-generation site for high-value service calls.', eyebrow: 'Contractor Demo', body: 'The homepage focuses on trust, emergency availability, and quote requests.', bullets: ['Emergency CTA', 'Service-area proof', 'Financing callout'] },
      about: { title: 'A contractor story that reduces buyer hesitation.', eyebrow: 'About Ironclad', body: 'Licenses, warranty details, crew standards, and local roots build credibility quickly.', bullets: ['Licensed and insured', 'Warranty promise', 'Local crew profile'] },
      services: { title: 'Every service gets a clear conversion path.', eyebrow: 'Services', body: 'Roofing, repairs, inspections, and gutters are separated for SEO and clarity.', bullets: ['Roof replacement', 'Storm damage', 'Gutter systems'] },
      work: { title: 'Project proof for homeowners comparing contractors.', eyebrow: 'Recent Projects', body: 'Before-and-after cards make the quality of work visible before a prospect calls.', bullets: ['Before and after', 'Neighborhood labels', 'Materials used'] },
      contact: { title: 'Turn urgent visitors into quote requests.', eyebrow: 'Request an Estimate', body: 'The contact page is built around fast calls, photo uploads, and inspection scheduling.', bullets: ['Quote request form', 'Photo upload ready', 'Service-area map'] },
    },
  },
  {
    slug: 'harbor-hope-center',
    name: 'Harbor Hope Center',
    industry: 'Nonprofits',
    tagline: 'Community support, volunteer programs, and donor impact.',
    summary: 'A nonprofit demo with mission storytelling, donation CTAs, volunteer forms, programs, and impact reporting sections.',
    accent: '#2563eb',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1400&q=80',
    city: 'Phoenix, AZ',
    phone: '(602) 555-0196',
    email: 'connect@harborhope.demo',
    services: ['Food pantry', 'Volunteer programs', 'Youth support', 'Community events'],
    stats: [{ label: 'Families Served', value: '1.2k' }, { label: 'Volunteers', value: '180' }, { label: 'Programs', value: '6' }],
    pages: {
      home: { title: 'A mission-led homepage that turns attention into action.', eyebrow: 'Nonprofit Demo', body: 'The homepage balances emotional storytelling with direct donation and volunteer CTAs.', bullets: ['Donate CTA', 'Volunteer CTA', 'Impact metrics'] },
      about: { title: 'Tell the mission with transparency and care.', eyebrow: 'Our Mission', body: 'The about page explains who the organization serves and how donors can trust the work.', bullets: ['Mission statement', 'Leadership notes', 'Annual impact'] },
      services: { title: 'Programs organized by community need.', eyebrow: 'Programs', body: 'Visitors can quickly understand programs, eligibility, schedules, and next steps.', bullets: ['Food pantry', 'Youth support', 'Community events'] },
      work: { title: 'Impact stories that donors and volunteers remember.', eyebrow: 'Impact', body: 'Stories, statistics, and testimonials show how support becomes real outcomes.', bullets: ['Community stories', 'Impact numbers', 'Partner highlights'] },
      contact: { title: 'Make it easy to donate, volunteer, or ask for help.', eyebrow: 'Get Involved', body: 'The contact page supports donors, volunteers, partners, and community members.', bullets: ['Volunteer form', 'Donation routing', 'Partner inquiries'] },
    },
  },
  {
    slug: 'brightpath-coaching',
    name: 'BrightPath Coaching',
    industry: 'Coaches',
    tagline: 'Coaching programs for leaders ready to move with clarity.',
    summary: 'A coaching website demo with program pages, consultation booking, lead magnet sections, testimonials, and premium positioning.',
    accent: '#7c3aed',
    image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=1400&q=80',
    city: 'Austin, TX',
    phone: '(512) 555-0128',
    email: 'hello@brightpath.demo',
    services: ['Leadership coaching', 'Team workshops', 'Career strategy', 'Executive intensives'],
    stats: [{ label: 'Programs', value: '4' }, { label: 'Session Type', value: 'Virtual' }, { label: 'Clients', value: '300+' }],
    pages: {
      home: { title: 'A coaching website that sells clarity, not complexity.', eyebrow: 'Coaching Demo', body: 'The homepage highlights the promise, programs, proof, and a discovery-call funnel.', bullets: ['Discovery call CTA', 'Program preview', 'Outcome-focused copy'] },
      about: { title: 'Position the coach as credible and approachable.', eyebrow: 'About the Coach', body: 'The about page uses story, credentials, and philosophy to build trust before a call.', bullets: ['Coach bio', 'Credentials', 'Process overview'] },
      services: { title: 'Programs packaged for different client needs.', eyebrow: 'Programs', body: 'Each program card clarifies audience, outcome, and next step.', bullets: ['1:1 coaching', 'Team workshops', 'Executive intensive'] },
      work: { title: 'Proof through outcomes, testimonials, and resources.', eyebrow: 'Results', body: 'The work page can highlight testimonials, client wins, podcasts, and downloadable guides.', bullets: ['Client wins', 'Testimonials', 'Lead magnet'] },
      contact: { title: 'Invite the right prospects into a consultation.', eyebrow: 'Start Here', body: 'The contact page asks qualifying questions and routes visitors to a discovery call.', bullets: ['Consultation form', 'Calendar-ready CTA', 'Email and phone'] },
    },
  },
]

export function getMockSite(slug?: string) {
  return mockSites.find((site) => site.slug === slug) ?? mockSites[0]
}

export function getMockSitePath(slug: string, page: MockSitePageKey = 'home') {
  return `/demo-sites/${slug}/${page}`
}
