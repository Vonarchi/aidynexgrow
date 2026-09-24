export type AgentStepStatus = 'pending' | 'running' | 'complete' | 'error'

export type AgentStep = {
  id: 'research' | 'seo' | 'visual'
  label: string
  message: string
  status: AgentStepStatus
}

export type GeneratedSiteContext = {
  placeId?: string
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
