import type { FinalCtaSectionContent } from '../../../types/sections'

type FinalCtaSectionProps = {
  content: FinalCtaSectionContent
}

export function FinalCtaSection({ content }: FinalCtaSectionProps) {
  return (
    <section className="bg-[linear-gradient(135deg,var(--tenant-primary),var(--tenant-secondary))] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        {content.eyebrow ? <p className="text-sm font-bold uppercase tracking-[0.24em] text-white/75">{content.eyebrow}</p> : null}
        <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{content.heading}</h2>
        {content.description ? <p className="mt-4 max-w-2xl text-lg leading-8 text-white/80">{content.description}</p> : null}
        <a
          href={content.primary_cta.href}
          className="mt-8 inline-flex items-center justify-center rounded-[var(--tenant-button-radius)] bg-white px-7 py-3 text-sm font-black text-[var(--tenant-primary)] shadow-xl transition hover:scale-[1.02]"
        >
          {content.primary_cta.label}
        </a>
      </div>
    </section>
  )
}
