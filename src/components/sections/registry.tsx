import { FinalCtaSection } from './cta/FinalCtaSection'
import { HeroSection } from './hero/HeroSection'
import { ServicesGridSection } from './services/ServicesGridSection'
import type { ReactElement } from 'react'
import type { WebsiteSection } from '../../types/sections'
import type { WebsiteTenant } from '../../types/website'

type SectionRendererProps<TSection extends WebsiteSection = WebsiteSection> = {
  section: TSection
  tenant: WebsiteTenant
}

type Registry = {
  [TSection in WebsiteSection['section_type']]?: (props: SectionRendererProps<Extract<WebsiteSection, { section_type: TSection }>>) => ReactElement
}

export const sectionRegistry: Registry = {
  hero: ({ section, tenant }) => <HeroSection content={section.content} tenant={tenant} />,
  services_grid: ({ section }) => <ServicesGridSection content={section.content} />,
  final_cta: ({ section }) => <FinalCtaSection content={section.content} />,
}

export function renderWebsiteSection(section: WebsiteSection, tenant: WebsiteTenant) {
  const Renderer = sectionRegistry[section.section_type] as ((props: SectionRendererProps) => ReactElement) | undefined

  if (!Renderer || !section.is_enabled) {
    return null
  }

  return <Renderer key={section.id} section={section} tenant={tenant} />
}
