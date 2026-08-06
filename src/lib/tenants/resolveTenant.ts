import { normalizeHostname } from './normalizeHostname'
import { hvacTemplateConfig } from '../../templates/hvac/template.config'
import type { WebsiteTenant } from '../../types/website'

const demoTenant: WebsiteTenant = {
  id: 'tenant-demo-arctemp',
  hostname: 'preview.aidynex.local',
  organization: {
    name: 'ArcTemp HVAC',
    phone: '(555) 014-2234',
    email: 'hello@arctemphvac.example',
    city: 'Dallas',
    state: 'TX',
    serviceAreas: ['Dallas', 'Plano', 'Frisco'],
  },
  template: {
    slug: hvacTemplateConfig.slug,
    version: hvacTemplateConfig.version,
  },
  theme: hvacTemplateConfig.default_theme,
  pages: hvacTemplateConfig.pages.map((page) => ({
    id: `demo-${page.page_type}`,
    title: page.name,
    slug: page.slug,
    page_type: page.page_type,
    status: 'published',
    seo_title: 'ArcTemp HVAC | Heating and Cooling Services',
    seo_description: 'Fast local HVAC service, AC repair, heating support, and seasonal maintenance.',
    sections: page.default_sections,
  })),
}

const hostAliases = new Set(['localhost', '127.0.0.1', 'preview.aidynex.local'])

export async function resolveTenantByHostname(hostname: string): Promise<WebsiteTenant | null> {
  const normalizedHost = normalizeHostname(hostname)

  if (hostAliases.has(normalizedHost)) {
    return demoTenant
  }

  if (normalizedHost === normalizeHostname(demoTenant.hostname)) {
    return demoTenant
  }

  return null
}
