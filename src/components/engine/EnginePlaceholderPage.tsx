type EnginePlaceholderPageProps = {
  eyebrow: string
  title: string
  description: string
}

export function EnginePlaceholderPage({ eyebrow, title, description }: EnginePlaceholderPageProps) {
  return (
    <main className="min-h-screen bg-cloud-50 px-4 py-20 text-navy-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-gold-500/20 bg-white/80 p-8 shadow-[0_24px_70px_rgba(196,77,255,.12)]">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-gold-500">{eyebrow}</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-navy-800">{description}</p>
      </div>
    </main>
  )
}
