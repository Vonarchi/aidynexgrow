import { churchTemplateConfig } from './church/template.config'
import { hvacTemplateConfig } from './hvac/template.config'
import { plumbingTemplateConfig } from './plumbing/template.config'
import { restaurantTemplateConfig } from './restaurant/template.config'
import { roofingTemplateConfig } from './roofing/template.config'

export const websiteTemplateConfigs = [
  hvacTemplateConfig,
  roofingTemplateConfig,
  plumbingTemplateConfig,
  restaurantTemplateConfig,
  churchTemplateConfig,
]

export function getTemplateConfigBySlug(slug: string) {
  return websiteTemplateConfigs.find((template) => template.slug === slug) ?? null
}
