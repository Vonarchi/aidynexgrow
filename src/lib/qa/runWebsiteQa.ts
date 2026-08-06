import type { WebsiteTenant } from '../../types/website'

export type WebsiteQaCheck = {
  id: string
  label: string
  status: 'pass' | 'warning' | 'fail'
  message: string
}

export function runWebsiteQa(tenant: WebsiteTenant): WebsiteQaCheck[] {
  const hasPublishedPage = tenant.pages.some((page) => page.status === 'published')
  const hasContactDetails = Boolean(tenant.organization.email && tenant.organization.phone)

  return [
    {
      id: 'published-page',
      label: 'Published page exists',
      status: hasPublishedPage ? 'pass' : 'warning',
      message: hasPublishedPage ? 'At least one published page is available.' : 'Publish a page before launch.',
    },
    {
      id: 'contact-details',
      label: 'Contact details',
      status: hasContactDetails ? 'pass' : 'fail',
      message: hasContactDetails ? 'Phone and email are present.' : 'Phone and email are required for launch.',
    },
  ]
}
