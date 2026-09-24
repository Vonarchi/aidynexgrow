const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

type GeneratedSiteContext = {
  placeId?: string
  websiteUrl?: string
  sourceSummary?: string
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

type PlaceProfile = {
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
  if (normalized.includes('spa') || normalized.includes('beauty') || normalized.includes('salon')) return 'Beauty and Wellness'
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
    phone: '(555) 010-2026',
    address: 'Local service area',
    rating: 4.8,
    reviewCount: 42,
    hours: ['Monday-Friday: 9:00 AM - 5:00 PM', 'Saturday: By appointment'],
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
  }
}

async function fetchWebsiteProfile(input: OnboardRequest, fallback: PlaceProfile) {
  const websiteUrl = input.websiteUrl ?? normalizeWebsiteUrl(input.businessName)
  if (!websiteUrl) return fallback

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 6000)

  try {
    const response = await fetch(websiteUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AdynexPreviewBot/1.0; +https://www.adynexsystems.com)',
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: controller.signal,
    })
    if (!response.ok) return { ...fallback, websiteUrl }

    const html = (await response.text()).slice(0, 300000)
    const title = cleanHtmlText(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '')
    const description = extractMeta(html, 'description') || extractMeta(html, 'og:description')
    const headings = [...extractTagText(html, 'h1', 4), ...extractTagText(html, 'h2', 6)].filter(Boolean).slice(0, 8)
    const hostname = businessNameFromUrl(websiteUrl)
    const businessName = title ? title.split('|')[0].split('-')[0].trim() : fallback.businessName || hostname
    const sourceText = [title, description, ...headings].filter(Boolean).join(' ')

    return {
      ...fallback,
      websiteUrl,
      businessName: businessName || hostname || fallback.businessName,
      category: inferCategory(sourceText || fallback.businessName),
      sourceTitle: title,
      sourceDescription: description,
      sourceHeadings: headings,
      sourceSummary: [description, ...headings.slice(0, 4)].filter(Boolean).join(' | ') || `Existing website analyzed at ${websiteUrl}.`,
    }
  } catch (error) {
    console.warn('Website analysis failed:', error)
    return { ...fallback, websiteUrl, sourceSummary: `Existing website detected at ${websiteUrl}, but the page could not be fully analyzed.` }
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchPlaceProfile(input: OnboardRequest, fallback: PlaceProfile) {
  const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY')
  if (!apiKey) return fallback

  const fields = 'id,displayName,formattedAddress,nationalPhoneNumber,rating,userRatingCount,types,regularOpeningHours'
  const searchFields = fields.split(',').map((field) => `places.${field}`).join(',')

  try {
    if (input.placeId) {
      const response = await fetch(`https://places.googleapis.com/v1/places/${input.placeId}`, {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': fields,
        },
      })
      if (!response.ok) return fallback
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
      if (!response.ok) return fallback
      const data = await response.json()
      const place = Array.isArray(data.places) ? data.places[0] : null
      return place ? normalizePlace(place, fallback) : fallback
    }
  } catch (error) {
    console.warn('Google Places lookup failed:', error)
  }

  return fallback
}

function fallbackSite(profile: PlaceProfile): GeneratedSiteContext {
  const isUpgradePreview = Boolean(profile.websiteUrl)
  return {
    ...profile,
    heroHeadline: isUpgradePreview ? `Upgrade ${profile.businessName} into a website that converts more visitors.` : `${profile.businessName} deserves a website that turns visitors into customers.`,
    heroSubheadline: isUpgradePreview ? `A generated upgrade preview based on signals found at ${profile.websiteUrl}. Built to sharpen your offer, improve trust, and create a clearer path to new leads.` : `A polished ${profile.category.toLowerCase()} website preview built for credibility, local search, and easier lead capture in ${profile.city}, ${profile.state}.`,
    services: isUpgradePreview ? ['Clearer homepage offer', 'Stronger lead capture path', 'Mobile-first service sections', 'Local SEO and trust signals'] : ['Professional service pages', 'Lead capture and contact forms', 'Mobile-friendly layout', 'Google-ready local SEO'],
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
            content: 'Return only valid JSON for a local business website preview. Keep language professional, specific, and concise.',
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
                metaTitle: 'string',
                metaDescription: 'string',
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
      metaTitle: text(generated.metaTitle, fallback.metaTitle),
      metaDescription: text(generated.metaDescription, fallback.metaDescription),
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
    const profile = await fetchPlaceProfile({ ...input, businessName: websiteProfile.businessName }, websiteProfile)
    const site = await generateCopyWithOpenAI(profile, fallbackSite(profile))

    return jsonResponse(site)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to generate onboarding preview.'
    return jsonResponse({ error: message }, 400)
  }
})
