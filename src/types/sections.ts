export type SectionType =
  | 'hero'
  | 'services_grid'
  | 'testimonials'
  | 'faq'
  | 'contact_form'
  | 'quote_form'
  | 'final_cta'
  | 'footer'

export type SectionCta = {
  label: string
  href: string
}

export type WebsiteSectionBase<TType extends SectionType, TContent, TSettings = Record<string, unknown>> = {
  id: string
  section_type: TType
  variant: string
  sort_order: number
  content: TContent
  settings?: TSettings
  visibility_rules?: Record<string, unknown>
  is_enabled: boolean
}

export type HeroSectionContent = {
  eyebrow?: string
  heading: string
  highlighted_text?: string
  description?: string
  primary_cta?: SectionCta
  secondary_cta?: SectionCta
  background_image?: string
  image?: string
  trust_items?: string[]
  alignment?: 'left' | 'center'
}

export type ServiceItemContent = {
  name: string
  description: string
  icon?: string
  image?: string
  link?: string
  featured?: boolean
}

export type ServicesGridSectionContent = {
  eyebrow?: string
  heading: string
  description?: string
  services: ServiceItemContent[]
}

export type FinalCtaSectionContent = {
  eyebrow?: string
  heading: string
  description?: string
  primary_cta: SectionCta
}

export type WebsiteSection =
  | WebsiteSectionBase<'hero', HeroSectionContent>
  | WebsiteSectionBase<'services_grid', ServicesGridSectionContent>
  | WebsiteSectionBase<'final_cta', FinalCtaSectionContent>
  | WebsiteSectionBase<Exclude<SectionType, 'hero' | 'services_grid' | 'final_cta'>, Record<string, unknown>>
