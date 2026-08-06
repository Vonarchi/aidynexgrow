import { renderWebsiteSection } from '../sections/registry'
import { TenantThemeProvider } from './TenantThemeProvider'
import type { PublishedWebsitePage } from '../../types/website'

type WebsitePageRendererProps = {
  websitePage: PublishedWebsitePage | null
}

export function WebsitePageRenderer({ websitePage }: WebsitePageRendererProps) {
  if (!websitePage) {
    return (
      <main className="min-h-screen bg-cloud-50 px-4 py-24 text-center text-navy-950">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-gold-500">Website Engine</p>
        <h1 className="mt-4 text-4xl font-black">No published website found.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-navy-800">
          This hostname is ready for tenant resolution once the website record, domain, and published page are connected.
        </p>
      </main>
    )
  }

  const { tenant, page, navigation, footer, seo } = websitePage

  return (
    <TenantThemeProvider theme={tenant.theme}>
      <main className="min-h-screen bg-[var(--tenant-background)] text-[var(--tenant-foreground)]">
        <header className="border-b border-black/5 bg-white/80 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <a href="/" className="text-lg font-black">{tenant.organization.name}</a>
            <div className="hidden items-center gap-5 text-sm font-bold md:flex">
              {navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
            </div>
          </nav>
        </header>
        <div aria-label={`${seo.title}: ${seo.description}`}>
          {page.sections
            .slice()
            .sort((first, second) => first.sort_order - second.sort_order)
            .map((section) => renderWebsiteSection(section, tenant))}
        </div>
        <footer className="bg-[var(--tenant-foreground)] px-4 py-10 text-white sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm opacity-80 md:flex-row md:items-center md:justify-between">
            <p>&copy; {new Date().getFullYear()} {tenant.organization.name}. All rights reserved.</p>
            <div className="flex flex-wrap gap-4">
              {footer.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
            </div>
          </div>
        </footer>
      </main>
    </TenantThemeProvider>
  )
}
