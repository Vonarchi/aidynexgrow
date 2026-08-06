import { getTemplateConfigBySlug } from '../../templates'
import type { WebsiteTenant } from '../../types/website'

export type GenerateWebsiteDraftInput = {
  templateSlug: string
  organizationName: string
  phone: string
  email: string
  city: string
  state: string
  serviceAreas: string[]
}

export async function generateWebsiteDraft(input: GenerateWebsiteDraftInput): Promise<WebsiteTenant> {
  const template = getTemplateConfigBySlug(input.templateSlug)

  if (!template) {
    throw new Error(`Template not found: ${input.templateSlug}`)
  }

  return {
    id: `draft-${input.templateSlug}-${Date.now()}`,
    hostname: 'preview.aidynex.local',
    organization: {
      name: input.organizationName,
      phone: input.phone,
      email: input.email,
      city: input.city,
      state: input.state,
      serviceAreas: input.serviceAreas,
    },
    template: {
      slug: template.slug,
      version: template.version,
    },
    theme: template.default_theme,
    pages: template.pages.map((page) => ({
      id: `draft-page-${page.page_type}`,
      title: page.name,
      slug: page.slug,
      page_type: page.page_type,
      status: 'draft',
      sections: page.default_sections,
    })),
  }
}
