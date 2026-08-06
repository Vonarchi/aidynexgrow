import type { WebsiteSection } from './sections'

export type WebsiteStatus =
  | 'onboarding'
  | 'waiting_for_content'
  | 'ready_for_build'
  | 'building'
  | 'internal_review'
  | 'client_review'
  | 'revisions'
  | 'ready_to_publish'
  | 'published'
  | 'paused'
  | 'archived'

export type PublicationStatus = 'draft' | 'preview' | 'published' | 'unpublished'

export type OrganizationSummary = {
  name: string
  phone: string
  email: string
  city: string
  state: string
  serviceAreas: string[]
}

export type TenantTheme = {
  primary: string
  secondary: string
  accent: string
  background?: string
  foreground?: string
  headingFont: string
  bodyFont: string
  buttonRadius?: string
  cardRadius?: string
}

export type WebsitePage = {
  id: string
  title: string
  slug: string
  page_type: string
  status: PublicationStatus
  seo_title?: string
  seo_description?: string
  sections: WebsiteSection[]
}

export interface WebsiteTenant {
  id: string
  hostname: string
  organization: OrganizationSummary
  template: {
    slug: string
    version: number
  }
  theme: TenantTheme
  pages: WebsitePage[]
}

export type PublishedWebsitePage = {
  tenant: WebsiteTenant
  page: WebsitePage
  navigation: { label: string; href: string }[]
  footer: { label: string; href: string }[]
  seo: {
    title: string
    description: string
    canonical?: string
    noindex?: boolean
  }
}
