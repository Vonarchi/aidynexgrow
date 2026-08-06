import { resolveTenantByHostname } from '../tenants/resolveTenant'
import type { PublishedWebsitePage } from '../../types/website'

function normalizePathname(pathname: string) {
  const normalized = pathname.trim() || '/'
  return normalized === '' ? '/' : normalized
}

export async function getPublishedWebsitePageByHostname(hostname: string, pathname: string): Promise<PublishedWebsitePage | null> {
  const tenant = await resolveTenantByHostname(hostname)

  if (!tenant) {
    return null
  }

  const normalizedPath = normalizePathname(pathname)
  const page = tenant.pages.find((item) => item.slug === normalizedPath && item.status === 'published') ?? tenant.pages.find((item) => item.slug === '/')

  if (!page) {
    return null
  }

  const title = page.seo_title ?? `${page.title} | ${tenant.organization.name}`
  const description = page.seo_description ?? `${tenant.organization.name} in ${tenant.organization.city}, ${tenant.organization.state}.`

  return {
    tenant,
    page,
    navigation: [
      { label: 'Home', href: '/' },
      { label: 'Services', href: '#services' },
      { label: 'Contact', href: '#contact' },
    ],
    footer: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
    seo: {
      title,
      description,
      canonical: `https://${tenant.hostname}${page.slug}`,
    },
  }
}
