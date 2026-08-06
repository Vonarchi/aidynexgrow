import type { ServicesGridSectionContent } from '../../../types/sections'

type ServicesGridSectionProps = {
  content: ServicesGridSectionContent
}

export function ServicesGridSection({ content }: ServicesGridSectionProps) {
  return (
    <section className="bg-[var(--tenant-surface)] px-4 py-20 text-[var(--tenant-foreground)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          {content.eyebrow ? <p className="text-sm font-bold uppercase tracking-[0.24em] text-[var(--tenant-accent)]">{content.eyebrow}</p> : null}
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{content.heading}</h2>
          {content.description ? <p className="mt-4 text-lg leading-8 opacity-75">{content.description}</p> : null}
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {content.services.map((service) => (
            <article
              key={service.name}
              className="rounded-[var(--tenant-card-radius)] border border-black/5 bg-white/85 p-6 shadow-[0_18px_50px_rgba(45,42,50,.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(45,42,50,.12)]"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--tenant-primary),var(--tenant-secondary))] text-xl text-white">
                {service.icon ?? '•'}
              </div>
              <h3 className="text-xl font-black">{service.name}</h3>
              <p className="mt-3 leading-7 opacity-75">{service.description}</p>
              {service.link ? <a href={service.link} className="mt-5 inline-flex text-sm font-bold text-[var(--tenant-primary)]">Learn more</a> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
