import { isSupabaseConfigured, supabase } from './supabase'
import type { GeneratedSiteContext } from '../types/generatedSite'

export type AgentOnboardingInput = {
  businessName: string
  placeId?: string
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
  const businessName = input.businessName.trim() || 'Your Business'
  const category = inferCategory(businessName)
  const city = 'Your City'
  const state = 'Your State'

  return {
    placeId: input.placeId,
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
    heroSubheadline: `A polished ${category.toLowerCase()} website concept built to earn trust, explain your services, and turn visitors into leads.`,
    services: ['Professional service pages', 'Lead capture and contact forms', 'Mobile-friendly layout', 'Google-ready local SEO'],
    metaTitle: `${businessName} | ${category} Website Concept`,
    metaDescription: `Review a professional website concept for ${businessName}, designed to build credibility, improve discoverability, and capture more customer inquiries.`,
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
  const fallback = createFallbackSiteContext(input)
  if (!isSupabaseConfigured || !supabase) return fallback

  const { data, error } = await supabase.functions.invoke('agent-onboard', {
    body: input,
  })

  if (error || !data) return fallback
  return { ...fallback, ...(data as Partial<GeneratedSiteContext>) }
}
