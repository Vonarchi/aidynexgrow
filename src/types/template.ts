import type { SectionType, WebsiteSection } from './sections'
import type { TenantTheme } from './website'

export type TemplateStatus = 'draft' | 'internal' | 'active' | 'deprecated' | 'archived'

export type TemplatePageConfig = {
  page_type: string
  name: string
  slug: string
  sort_order: number
  is_required: boolean
  default_sections: WebsiteSection[]
}

export type WebsiteTemplateConfig = {
  id: string
  industry: string
  name: string
  slug: string
  description: string
  version: number
  status: TemplateStatus
  thumbnail_url?: string
  preview_url?: string
  default_theme: TenantTheme
  default_navigation: { label: string; href: string }[]
  pages: TemplatePageConfig[]
  supported_section_types: SectionType[]
  features: string[]
  required_business_fields: string[]
  recommended_business_fields: string[]
}
