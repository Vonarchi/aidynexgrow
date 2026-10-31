const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

type GeneratedSiteContext = {
  placeId?: string
  websiteUrl?: string
  sourceSummary?: string
  readinessScore?: number
  opportunities?: string[]
  recommendedActions?: string[]
  businessName: string
  category: string
  city: string
  state: string
  phone?: string
  address?: string
  rating?: number
  reviewCount?: number
  hours?: string[]
  heroHeadline: string
  heroSubheadline: string
  services: string[]
  metaTitle: string
  metaDescription: string
  colors: {
    primary: string
    accent: string
    background: string
    text: string
  }
  images: string[]
  recommendedPlan: 'Launch' | 'Accelerate' | 'Scale' | 'Enterprise'
}

type OnboardRequest = {
  placeId?: string
  businessName?: string
  websiteUrl?: string
}

type WebsiteSignals = {
  url: string
  reachable: boolean
  https: boolean
  responseMs?: number
  htmlKb?: number
  hasViewport: boolean
  hasTitle: boolean
  hasMetaDescription: boolean
  h1Count: number
  hasLocalBusinessSchema: boolean
  hasOgImage: boolean
  hasClickToCall: boolean
  hasContactForm: boolean
  hasPdfMenu: boolean
  hasOrderingOrBooking: boolean
  copyrightYear?: number
  builder?: string
  socialLinks: { network: string; url: string }[]
}

type GoogleSignals = {
  found: boolean
  rating?: number
  reviewCount?: number
  hasHours: boolean
  hasPhone: boolean
  hasWebsite: boolean
  photoCount?: number
  businessStatus?: string
}

type PlaceProfile = {
  websiteSignals?: WebsiteSignals
  googleSignals?: GoogleSignals
  placeId?: string
  websiteUrl?: string
  sourceSummary?: string
  sourceTitle?: string
  sourceDescription?: string
  sourceHeadings?: string[]
  businessName: string
  category: string
  city: string
  state: string
  phone?: string
  address?: string
  rating?: number
  reviewCount?: number
  hours?: string[]
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function text(value: unknown, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

function inferCategory(name: string) {
  const normalized = name.toLowerCase()
  if (normalized.includes('hvac') || normalized.includes('air') || normalized.includes('heating')) return 'HVAC Services'
  if (normalized.includes('restaurant') || normalized.includes('cafe') || normalized.includes('kitchen')) return 'Restaurant'
  if (normalized.includes('spa') || normalized.includes('barber') || normalized.includes('beauty') || normalized.includes('salon')) return 'Beauty and Wellness'
  if (normalized.includes('church') || normalized.includes('ministry')) return 'Church or Ministry'
  if (normalized.includes('realty') || normalized.includes('real estate')) return 'Real Estate'
  return 'Local Business'
}

function normalizeWebsiteUrl(value?: string) {
  const candidate = text(value)
  if (!candidate || candidate.includes(' ')) return undefined
  if (!candidate.includes('.') && !candidate.startsWith('http')) return undefined
  try {
    const url = new URL(candidate.startsWith('http') ? candidate : `https://${candidate}`)
    return url.href
  } catch {
    return undefined
  }
}

function businessNameFromUrl(url?: string) {
  if (!url) return ''
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function cleanHtmlText(value: string) {
  return decodeHtml(value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim())
}

function extractMeta(html: string, name: string) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`<meta[^>]+(?:name|property)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>|<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${escaped}["'][^>]*>`, 'i')
  const match = html.match(pattern)
  return cleanHtmlText(match?.[1] || match?.[2] || '')
}

function extractTagText(html: string, tag: string, limit = 5) {
  const matches = [...html.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi'))]
  return matches.map((match) => cleanHtmlText(match[1])).filter(Boolean).slice(0, limit)
}

const SOCIAL_PATTERNS: [string, RegExp][] = [
  ['Facebook', /https?:\/\/(?:www\.|m\.)?facebook\.com\/[^"'\s<>]+/i],
  ['Instagram', /https?:\/\/(?:www\.)?instagram\.com\/[^"'\s<>]+/i],
  ['TikTok', /https?:\/\/(?:www\.)?tiktok\.com\/@[^"'\s<>]+/i],
  ['YouTube', /https?:\/\/(?:www\.)?youtube\.com\/[^"'\s<>]+/i],
  ['X', /https?:\/\/(?:www\.)?(?:twitter|x)\.com\/[^"'\s<>]+/i],
  ['LinkedIn', /https?:\/\/(?:www\.)?linkedin\.com\/[^"'\s<>]+/i],
  ['Yelp', /https?:\/\/(?:www\.)?yelp\.com\/biz\/[^"'\s<>]+/i],
]

function extractWebsiteSignals(html: string, url: string, responseMs: number): WebsiteSignals {
  const lower = html.toLowerCase()
  const years = [...html.matchAll(/(?:©|&copy;|copyright)\s*(?:\d{4}\s*[-–]\s*)?(\d{4})/gi)].map((m) => Number(m[1])).filter((y) => y > 1995 && y < 2100)
  const builders: [string, string][] = [['wix.com', 'Wix'], ['squarespace', 'Squarespace'], ['godaddy', 'GoDaddy'], ['weebly', 'Weebly'], ['wp-content', 'WordPress'], ['shopify', 'Shopify']]
  return {
    url,
    reachable: true,
    https: url.startsWith('https://'),
    responseMs,
    htmlKb: Math.round(html.length / 1024),
    hasViewport: /<meta[^>]+name=["']viewport["']/i.test(html),
    hasTitle: /<title[^>]*>\s*[^<\s][^<]*<\/title>/i.test(html),
    hasMetaDescription: Boolean(extractMeta(html, 'description')),
    h1Count: (html.match(/<h1[\s>]/gi) ?? []).length,
    hasLocalBusinessSchema: /application\/ld\+json/i.test(html) && /"@type"\s*:\s*"(?:LocalBusiness|Restaurant|Dentist|MedicalBusiness|HomeAndConstructionBusiness|HVACBusiness|Plumber|RoofingContractor|BeautySalon|HairSalon|AutoRepair|Store|ProfessionalService|[A-Za-z]*Business)"/i.test(html),
    hasOgImage: Boolean(extractMeta(html, 'og:image')),
    hasClickToCall: /href=["']tel:/i.test(html),
    hasContactForm: /<form[\s>]/i.test(html),
    hasPdfMenu: /href=["'][^"']*menu[^"']*\.pdf/i.test(html) || /href=["'][^"']*\.pdf["'][^>]*>[^<]*menu/i.test(html),
    hasOrderingOrBooking: /(order online|order now|online ordering|book now|book online|schedule (?:an )?appointment|reserve|reservation|doordash|ubereats|grubhub|toasttab|opentable|calendly|vagaro|booksy|square\.site)/i.test(lower),
    copyrightYear: years.length ? Math.max(...years) : undefined,
    builder: builders.find(([needle]) => lower.includes(needle))?.[1],
    socialLinks: SOCIAL_PATTERNS.flatMap(([network, pattern]) => {
      const match = html.match(pattern)
      return match && !/sharer|share\?|intent\/|plugins/i.test(match[0]) ? [{ network, url: match[0] }] : []
    }),
  }
}

function unreachableSignals(url: string): WebsiteSignals {
  return { url, reachable: false, https: url.startsWith('https://'), hasViewport: false, hasTitle: false, hasMetaDescription: false, h1Count: 0, hasLocalBusinessSchema: false, hasOgImage: false, hasClickToCall: false, hasContactForm: false, hasPdfMenu: false, hasOrderingOrBooking: false, socialLinks: [] }
}

function fallbackProfile(input: OnboardRequest): PlaceProfile {
  const websiteUrl = input.websiteUrl ?? normalizeWebsiteUrl(input.businessName)
  const submittedName = text(input.businessName)
  const businessName = websiteUrl && normalizeWebsiteUrl(submittedName) ? businessNameFromUrl(websiteUrl) : text(submittedName, businessNameFromUrl(websiteUrl) || 'Your Business')
  return {
    placeId: input.placeId,
    websiteUrl,
    businessName,
    category: inferCategory(businessName),
    city: 'Your City',
    state: 'Your State',
  }
}

function cityStateFromAddress(address?: string) {
  if (!address) return { city: 'Your City', state: 'Your State' }
  const parts = address.split(',').map((part) => part.trim()).filter(Boolean)
  const city = parts.length >= 3 ? parts[parts.length - 3] : 'Your City'
  const stateMatch = parts.length >= 2 ? parts[parts.length - 2].match(/\b[A-Z]{2}\b/) : null
  return { city, state: stateMatch?.[0] ?? 'Your State' }
}

function normalizePlace(place: Record<string, unknown>, fallback: PlaceProfile): PlaceProfile {
  const address = text(place.formattedAddress, fallback.address)
  const { city, state } = cityStateFromAddress(address)
  const types = Array.isArray(place.types) ? place.types.map((item) => text(item)).filter(Boolean) : []
  const hours = place.regularOpeningHours && typeof place.regularOpeningHours === 'object' && 'weekdayDescriptions' in place.regularOpeningHours
    ? (place.regularOpeningHours.weekdayDescriptions as string[])
    : fallback.hours

  return {
    ...fallback,
    placeId: text(place.id, fallback.placeId),
    businessName: text(place.displayName && typeof place.displayName === 'object' && 'text' in place.displayName ? place.displayName.text : '', fallback.businessName),
    category: types[0]?.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()) || fallback.category,
    city,
    state,
    phone: text(place.nationalPhoneNumber, fallback.phone),
    address,
    rating: typeof place.rating === 'number' ? place.rating : fallback.rating,
    reviewCount: typeof place.userRatingCount === 'number' ? place.userRatingCount : fallback.reviewCount,
    hours,
    websiteUrl: fallback.websiteUrl ?? (text(place.websiteUri) || undefined),
    googleSignals: {
      found: true,
      rating: typeof place.rating === 'number' ? place.rating : undefined,
      reviewCount: typeof place.userRatingCount === 'number' ? place.userRatingCount : undefined,
      hasHours: Array.isArray(hours) && hours.length > 0,
      hasPhone: Boolean(text(place.nationalPhoneNumber)),
      hasWebsite: Boolean(text(place.websiteUri)),
      photoCount: Array.isArray(place.photos) ? place.photos.length : 0,
      businessStatus: text(place.businessStatus) || undefined,
    },
  }
}

async function fetchWebsiteProfile(input: OnboardRequest, fallback: PlaceProfile) {
  const websiteUrl = input.websiteUrl ?? normalizeWebsiteUrl(input.businessName)
  if (!websiteUrl) return fallback

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 6000)

  const startedAt = Date.now()
  try {
    const response = await fetch(websiteUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AdynexPreviewBot/1.0; +https://www.adynexsystems.com)',
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: controller.signal,
    })
    if (!response.ok) return { ...fallback, websiteUrl, websiteSignals: unreachableSignals(websiteUrl) }

    const fullHtml = await response.text()
    const websiteSignals = extractWebsiteSignals(fullHtml, response.url || websiteUrl, Date.now() - startedAt)
    websiteSignals.htmlKb = Math.round(fullHtml.length / 1024)
    const html = fullHtml.slice(0, 300000)
    const title = cleanHtmlText(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '')
    const description = extractMeta(html, 'description') || extractMeta(html, 'og:description')
    const headings = [...extractTagText(html, 'h1', 4), ...extractTagText(html, 'h2', 6)].filter(Boolean).slice(0, 8)
    const hostname = businessNameFromUrl(websiteUrl)
    const businessName = title ? title.split('|')[0].split('-')[0].trim() : fallback.businessName || hostname
    const sourceText = [title, description, ...headings].filter(Boolean).join(' ')

    return {
      ...fallback,
      websiteUrl,
      websiteSignals,
      businessName: businessName || hostname || fallback.businessName,
      category: inferCategory(sourceText || fallback.businessName),
      sourceTitle: title,
      sourceDescription: description,
      sourceHeadings: headings,
      sourceSummary: [description, ...headings.slice(0, 4)].filter(Boolean).join(' | ') || `Existing website analyzed at ${websiteUrl}.`,
    }
  } catch (error) {
    console.warn('Website analysis failed:', error)
    return { ...fallback, websiteUrl, websiteSignals: unreachableSignals(websiteUrl), sourceSummary: `Existing website detected at ${websiteUrl}, but the page could not be fully analyzed.` }
  } finally {
    clearTimeout(timeout)
  }
}

const notFoundOnGoogle: GoogleSignals = { found: false, hasHours: false, hasPhone: false, hasWebsite: false }

async function fetchPlaceProfile(input: OnboardRequest, fallback: PlaceProfile) {
  const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY')
  if (!apiKey) return fallback

  const fields = 'id,displayName,formattedAddress,nationalPhoneNumber,rating,userRatingCount,types,regularOpeningHours,websiteUri,photos,businessStatus'
  const searchFields = fields.split(',').map((field) => `places.${field}`).join(',')

  try {
    if (input.placeId) {
      const response = await fetch(`https://places.googleapis.com/v1/places/${input.placeId}`, {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': fields,
        },
      })
      if (!response.ok) return { ...fallback, googleSignals: notFoundOnGoogle }
      return normalizePlace(await response.json(), fallback)
    }

    if (input.businessName) {
      const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': searchFields,
        },
        body: JSON.stringify({ textQuery: input.businessName, maxResultCount: 1 }),
      })
      if (!response.ok) return { ...fallback, googleSignals: notFoundOnGoogle }
      const data = await response.json()
      const place = Array.isArray(data.places) ? data.places[0] : null
      return place ? normalizePlace(place, fallback) : { ...fallback, googleSignals: notFoundOnGoogle }
    }
  } catch (error) {
    console.warn('Google Places lookup failed:', error)
  }

  return fallback
}

function customerCopy(profile: PlaceProfile) {
  const c = profile.category.toLowerCase()
  const where = profile.city && profile.city !== 'Your City' ? ` in ${profile.city}` : ''
  if (/dent|medical|clinic|doctor|health|chiro|physical/.test(c)) return { heroHeadline: 'Gentle care for the whole family.', heroSubheadline: `Modern, comfortable care${where}. New patients welcome, and booking takes a minute.`, services: ['New patient visits', 'Preventive care', 'Same-week appointments'] }
  if (/hvac|heating|air|plumb|roof|electric|contractor|repair|clean|landscap|construction/.test(c)) return { heroHeadline: 'Fast, honest service when you need it.', heroSubheadline: `Licensed local pros${where}. Upfront pricing, on-time arrivals and work we stand behind.`, services: ['Emergency service', 'Repairs & installs', 'Free estimates'] }
  if (/beauty|salon|barber|spa|nail|wellness|hair/.test(c)) return { heroHeadline: 'Look good. Feel even better.', heroSubheadline: `Skilled stylists and a space made for you${where}. Book online in seconds.`, services: ['Cuts & styling', 'Color & treatments', 'Online booking'] }
  if (/restaurant|cafe|food|bakery|pizza|grill|kitchen|diner|\bbar\b/.test(c)) return { heroHeadline: 'Great food, close to home.', heroSubheadline: `Fresh plates, friendly faces and easy online ordering${where}. Order ahead and skip the wait.`, services: ['Dine in', 'Order pickup', 'Catering & events'] }
  if (/church|ministry|worship/.test(c)) return { heroHeadline: "There's a place for you here.", heroSubheadline: `A welcoming church family${where}. Join us this Sunday, in person or online.`, services: ['Sunday service', 'Youth & family', 'Give online'] }
  return { heroHeadline: `${profile.businessName}, ready when you are.`, heroSubheadline: `Trusted local service${where}. Get in touch today and see why customers keep coming back.`, services: ['What we do', 'Why customers choose us', 'Get in touch'] }
}

function fallbackSite(profile: PlaceProfile): GeneratedSiteContext {
  const isUpgradePreview = Boolean(profile.websiteUrl)
  const readinessScore = isUpgradePreview
    ? Math.min(92, 48 + (profile.sourceTitle ? 10 : 0) + (profile.sourceDescription ? 14 : 0) + ((profile.sourceHeadings?.length ?? 0) > 0 ? 10 : 0) + (profile.websiteUrl?.startsWith('https://') ? 8 : 0))
    : 58
  return {
    ...profile,
    readinessScore,
    opportunities: isUpgradePreview
      ? ['Clarify the above-the-fold offer', 'Make the primary call to action easier to find', 'Add stronger proof, reviews, or credibility signals', 'Create a clearer conversion path for visitors']
      : ['Create a professional website foundation', 'Add lead capture and contact forms', 'Build service pages around customer intent', 'Set up basic local SEO'],
    recommendedActions: isUpgradePreview
      ? ['Rewrite the hero section around the strongest customer outcome', 'Add a conversion-focused lead form or booking path', 'Improve service sections and trust signals', 'Add analytics and automated customer follow-up']
      : ['Launch a professional five-page website', 'Add a contact form and click-to-call paths', 'Set up basic SEO and Google-ready structure', 'Prepare launch membership and onboarding assets'],
    ...customerCopy(profile),
    metaTitle: `${profile.businessName} | ${profile.category} in ${profile.city}, ${profile.state}`,
    metaDescription: isUpgradePreview ? `Generated website upgrade preview for ${profile.businessName}, based on the current website and focused on clearer messaging, lead capture, and conversion.` : `Discover ${profile.businessName}, a ${profile.category.toLowerCase()} serving ${profile.city}, ${profile.state}. Request information, view services, and connect online.`,
    colors: {
      primary: '#2D2A32',
      accent: '#FFB84D',
      background: '#FFFBF5',
      text: '#2D2A32',
    },
    images: [],
    recommendedPlan: isUpgradePreview ? 'Accelerate' : profile.category.toLowerCase().includes('restaurant') ? 'Accelerate' : 'Launch',
  }
}

async function generateCopyWithOpenAI(profile: PlaceProfile, fallback: GeneratedSiteContext) {
  const apiKey = Deno.env.get('OPENAI_API_KEY')
  if (!apiKey) return fallback

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: Deno.env.get('OPENAI_MODEL') || 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: 'Return only valid JSON for a local business website preview. heroHeadline, heroSubheadline and services are the business\'s OWN website copy, written to its customers (not a pitch to the owner). opportunities and recommendedActions are notes to the owner. Never invent facts such as years in business, awards, prices or reviews. Keep language warm, specific and concise.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              businessName: profile.businessName,
              websiteUrl: profile.websiteUrl,
              sourceSummary: profile.sourceSummary,
              sourceTitle: profile.sourceTitle,
              sourceDescription: profile.sourceDescription,
              sourceHeadings: profile.sourceHeadings,
              category: profile.category,
              city: profile.city,
              state: profile.state,
              requiredShape: {
                heroHeadline: 'string',
                heroSubheadline: 'string',
                services: ['string', 'string', 'string', 'string'],
                opportunities: ['string', 'string', 'string', 'string'],
                recommendedActions: ['string', 'string', 'string', 'string'],
                metaTitle: 'string',
                metaDescription: 'string',
                readinessScore: 'number from 1 to 100',
                recommendedPlan: 'Launch | Accelerate | Scale | Enterprise',
              },
            }),
          },
        ],
      }),
    })

    if (!response.ok) return fallback
    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    const generated = typeof content === 'string' ? JSON.parse(content) : {}

    return {
      ...fallback,
      heroHeadline: text(generated.heroHeadline, fallback.heroHeadline),
      heroSubheadline: text(generated.heroSubheadline, fallback.heroSubheadline),
      services: Array.isArray(generated.services) && generated.services.length ? generated.services.map((item: unknown) => text(item)).filter(Boolean).slice(0, 6) : fallback.services,
      opportunities: Array.isArray(generated.opportunities) && generated.opportunities.length ? generated.opportunities.map((item: unknown) => text(item)).filter(Boolean).slice(0, 6) : fallback.opportunities,
      recommendedActions: Array.isArray(generated.recommendedActions) && generated.recommendedActions.length ? generated.recommendedActions.map((item: unknown) => text(item)).filter(Boolean).slice(0, 6) : fallback.recommendedActions,
      metaTitle: text(generated.metaTitle, fallback.metaTitle),
      metaDescription: text(generated.metaDescription, fallback.metaDescription),
      readinessScore: typeof generated.readinessScore === 'number' ? Math.max(1, Math.min(100, Math.round(generated.readinessScore))) : fallback.readinessScore,
      recommendedPlan: ['Launch', 'Accelerate', 'Scale', 'Enterprise'].includes(generated.recommendedPlan) ? generated.recommendedPlan : fallback.recommendedPlan,
    } satisfies GeneratedSiteContext
  } catch (error) {
    console.warn('OpenAI copy generation failed:', error)
    return fallback
  }
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405)

  try {
    const input = await request.json() as OnboardRequest
    if (!text(input.businessName) && !text(input.placeId) && !text(input.websiteUrl)) throw new Error('A business name, website URL, or placeId is required.')

    const fallback = fallbackProfile(input)
    const websiteProfile = await fetchWebsiteProfile(input, fallback)
    let profile = await fetchPlaceProfile({ ...input, businessName: websiteProfile.businessName }, websiteProfile)
    if (!profile.websiteSignals && profile.websiteUrl) {
      const scanned = await fetchWebsiteProfile({ ...input, websiteUrl: profile.websiteUrl }, profile)
      profile = { ...profile, websiteSignals: scanned.websiteSignals, sourceSummary: scanned.sourceSummary ?? profile.sourceSummary }
    }
    const { websiteSignals, googleSignals, ...publicProfile } = profile
    const site = await generateCopyWithOpenAI(publicProfile, fallbackSite(publicProfile))

    return jsonResponse({
      ...site,
      signals: {
        scannedAt: new Date().toISOString(),
        website: websiteSignals ?? null,
        google: googleSignals ?? null,
        googleChecked: Boolean(Deno.env.get('GOOGLE_PLACES_API_KEY')),
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to generate onboarding preview.'
    return jsonResponse({ error: message }, 400)
  }
})
