import { isSupabaseConfigured, supabase } from './supabase'
import type { GeneratedSiteContext } from '../types/generatedSite'

export type AgentOnboardingInput = {
  businessName: string
  placeId?: string
  websiteUrl?: string
}

function normalizeWebsiteUrl(value?: string) {
  const candidate = value?.trim()
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

function inferCategory(name: string) {
  const normalized = name.toLowerCase()
  if (normalized.includes('hvac') || normalized.includes('air') || normalized.includes('heating')) return 'HVAC Services'
  if (normalized.includes('restaurant') || normalized.includes('cafe') || normalized.includes('kitchen')) return 'Restaurant'
  if (normalized.includes('spa') || normalized.includes('beauty') || normalized.includes('salon')) return 'Beauty and Wellness'
  if (normalized.includes('church') || normalized.includes('ministry')) return 'Church or Ministry'
  if (normalized.includes('realty') || normalized.includes('real estate')) return 'Real Estate'
  return 'Local Business'
}

export function createFallbackSiteContext(input: AgentOnboardingInput): GeneratedSiteContext {
  const websiteUrl = input.websiteUrl ?? normalizeWebsiteUrl(input.businessName)
  const submittedName = input.businessName.trim()
  const businessName = websiteUrl && normalizeWebsiteUrl(submittedName) ? businessNameFromUrl(websiteUrl) : submittedName || businessNameFromUrl(websiteUrl) || 'Your Business'
  const category = inferCategory(businessName)
  const city = 'Your City'
  const state = 'Your State'

  return {
    placeId: input.placeId,
    websiteUrl,
    sourceSummary: websiteUrl ? `Generated from the existing website at ${websiteUrl}.` : undefined,
    readinessScore: websiteUrl ? 64 : 58,
    opportunities: websiteUrl ? ['Clarify the homepage offer', 'Add stronger lead capture', 'Improve mobile-first service sections', 'Strengthen trust and proof points'] : ['Create a professional online presence', 'Add clear service pages', 'Add contact and lead capture', 'Prepare local SEO basics'],
    recommendedActions: websiteUrl ? ['Upgrade the homepage message', 'Add conversion-focused calls to action', 'Create a stronger services section', 'Add analytics and follow-up automation'] : ['Launch a professional five-page site', 'Connect a contact form', 'Set up basic SEO', 'Prepare your Business Launch Membership'],
    businessName,
    category,
    city,
    state,
    phone: '(555) 010-2026',
    address: 'Local service area',
    rating: 4.8,
    reviewCount: 42,
    hours: ['Monday-Friday: 9:00 AM - 5:00 PM', 'Saturday: By appointment'],
    heroHeadline: `${businessName} deserves a website that works as hard as you do.`,
    heroSubheadline: `A polished ${category.toLowerCase()} website preview built to earn trust, explain your services, and turn visitors into leads.`,
    services: ['Professional service pages', 'Lead capture and contact forms', 'Mobile-friendly layout', 'Google-ready local SEO'],
    metaTitle: `${businessName} | ${category} Website Preview`,
    metaDescription: `Review a professional website preview for ${businessName}, designed to build credibility, improve discoverability, and capture more customer inquiries.`,
    colors: {
      primary: '#2D2A32',
      accent: '#FFB84D',
      background: '#FFFBF5',
      text: '#2D2A32',
    },
    images: [],
    recommendedPlan: 'Launch',
  }
}

export async function generateAgenticSiteContext(input: AgentOnboardingInput): Promise<GeneratedSiteContext> {
  const payload = { ...input, websiteUrl: input.websiteUrl ?? normalizeWebsiteUrl(input.businessName) }
  const fallback = createFallbackSiteContext(payload)
  if (!isSupabaseConfigured || !supabase) return fallback

  const { data, error } = await supabase.functions.invoke('agent-onboard', {
    body: payload,
  })

  if (error || !data) return fallback
  return { ...fallback, ...(data as Partial<GeneratedSiteContext>) }
}
