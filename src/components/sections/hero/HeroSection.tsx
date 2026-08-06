import type { HeroSectionContent } from '../../../types/sections'
import type { WebsiteTenant } from '../../../types/website'

type HeroSectionProps = {
  content: HeroSectionContent
  tenant: WebsiteTenant
}

export function HeroSection({ content, tenant }: HeroSectionProps) {
  const alignmentClass = content.alignment === 'center' ? 'mx-auto text-center items-center' : 'items-start'

  return (
    <section className="relative isolate overflow-hidden bg-[var(--tenant-background)] px-4 py-24 text-[var(--tenant-foreground)] sm:px-6 lg:px-8">
      {content.background_image ? (
        <img src={content.background_image} alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-20" />
      ) : null}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,var(--tenant-primary),var(--tenant-secondary))] opacity-10" />
      <div className={`mx-auto flex max-w-6xl flex-col gap-6 ${alignmentClass}`}>
        {content.eyebrow ? <p className="text-sm font-bold uppercase tracking-[0.24em] text-[var(--tenant-accent)]">{content.eyebrow}</p> : null}
        <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
          {content.heading}{' '}
          {content.highlighted_text ? (
            <span className="bg-[linear-gradient(135deg,var(--tenant-primary),var(--tenant-secondary))] bg-clip-text text-transparent">
              {content.highlighted_text}
            </span>
          ) : null}
        </h1>
        {content.description ? <p className="max-w-2xl text-lg leading-8 opacity-80">{content.description}</p> : null}
        <div className="flex flex-col gap-3 sm:flex-row">
          {content.primary_cta ? (
            <a
              href={content.primary_cta.href}
              className="inline-flex items-center justify-center rounded-[var(--tenant-button-radius)] bg-[linear-gradient(135deg,var(--tenant-primary),var(--tenant-secondary))] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02]"
            >
              {content.primary_cta.label}
            </a>
          ) : null}
          {content.secondary_cta ? (
            <a
              href={content.secondary_cta.href}
              className="inline-flex items-center justify-center rounded-[var(--tenant-button-radius)] border border-current px-6 py-3 text-sm font-bold opacity-80 transition hover:opacity-100"
            >
              {content.secondary_cta.label}
            </a>
          ) : null}
        </div>
        {content.trust_items?.length ? (
          <div className="flex flex-wrap gap-2 pt-4">
            {content.trust_items.map((item) => <span key={item} className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold shadow-sm">{item}</span>)}
          </div>
        ) : null}
        <p className="sr-only">Tenant website for {tenant.organization.name}</p>
      </div>
    </section>
  )
}
