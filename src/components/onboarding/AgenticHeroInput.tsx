import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Bot, CheckCircle2, Loader2, Search, WandSparkles } from 'lucide-react'
import { generateAgenticSiteContext } from '../../lib/agentOnboarding'
import type { AgentStep, GeneratedSiteContext } from '../../types/generatedSite'

const initialSteps: AgentStep[] = [
  { id: 'research', label: 'Research Agent', message: 'Waiting for a business name...', status: 'pending' },
  { id: 'seo', label: 'SEO Agent', message: 'Ready to generate localized copy...', status: 'pending' },
  { id: 'visual', label: 'Visual Agent', message: 'Ready to assemble a responsive preview...', status: 'pending' },
]

const runningMessages: Record<AgentStep['id'], string> = {
  research: 'Research Agent: Querying Google Business Profile...',
  seo: 'SEO Agent: Generating localized copy...',
  visual: 'Visual Agent: Assembling responsive layout frame...',
}

function updateStep(steps: AgentStep[], id: AgentStep['id'], status: AgentStep['status'], message?: string) {
  return steps.map((step) => step.id === id ? { ...step, status, message: message ?? step.message } : step)
}

function StepIcon({ status }: { status: AgentStep['status'] }) {
  if (status === 'complete') return <CheckCircle2 size={16} className="text-emerald-400" />
  if (status === 'running') return <Loader2 size={16} className="animate-spin text-gold-500" />
  return <span className="size-2 rounded-full bg-white/30" />
}

export function AgenticHeroInput({ onGenerated }: { onGenerated: (context: GeneratedSiteContext) => void }) {
  const [businessName, setBusinessName] = useState('')
  const [steps, setSteps] = useState<AgentStep[]>(initialSteps)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  async function runAgents() {
    const trimmedName = businessName.trim()
    if (!trimmedName || isGenerating) return

    setError('')
    setIsGenerating(true)
    setSteps(initialSteps)

    try {
      setSteps((current) => updateStep(current, 'research', 'running', runningMessages.research))
      await new Promise((resolve) => setTimeout(resolve, 650))
      setSteps((current) => updateStep(current, 'research', 'complete', `Research Agent: Found profile signals for ${trimmedName}.`))

      setSteps((current) => updateStep(current, 'seo', 'running', `SEO Agent: Generating localized copy for ${trimmedName}...`))
      await new Promise((resolve) => setTimeout(resolve, 650))
      setSteps((current) => updateStep(current, 'seo', 'complete', 'SEO Agent: Headlines, service bullets, and meta tags drafted.'))

      setSteps((current) => updateStep(current, 'visual', 'running', runningMessages.visual))
      const context = await generateAgenticSiteContext({ businessName: trimmedName })
      setSteps((current) => updateStep(current, 'visual', 'complete', 'Visual Agent: Preview assembled and ready.'))
      onGenerated(context)
    } catch (agentError) {
      setError(agentError instanceof Error ? agentError.message : 'The preview could not be generated. Try again.')
      setSteps((current) => current.map((step) => step.status === 'running' ? { ...step, status: 'error' } : step))
    } finally {
      setIsGenerating(false)
    }
  }

  return <div className="grid gap-5 lg:grid-cols-[1fr_.9fr]">
    <div className="flavor-card reveal-lift rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-amber-700"><WandSparkles size={14} /> AI Preview Builder</div>
      <h3 className="text-3xl font-black tracking-tight text-navy-950 sm:text-4xl">Start with your business name.</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">Search for a business, then let the onboarding agents assemble a first website preview before the full application.</p>
      <label className="mt-6 block text-sm font-bold text-navy-950">Business name or Google Business profile</label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input value={businessName} onChange={(event) => setBusinessName(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void runAgents() }} placeholder="Example: Johnson Family HVAC" className="w-full rounded-full border border-slate-200 bg-cloud-50 py-4 pl-12 pr-4 text-sm font-semibold outline-none transition focus:border-royal-600 focus:ring-4 focus:ring-blue-100" />
        </div>
        <button type="button" onClick={runAgents} disabled={!businessName.trim() || isGenerating} className="primary-gradient primary-glow inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-black text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60">{isGenerating ? 'Building...' : 'Generate Preview'} <ArrowRight size={16} /></button>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">Google Places can be enabled with `GOOGLE_PLACES_API_KEY`. Without it, the agents use a clean fallback preview.</p>
      {error && <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
    </div>

    <div className="overflow-hidden rounded-[2rem] bg-navy-950 p-5 font-mono text-xs text-slate-200 shadow-2xl shadow-navy-950/20">
      <div className="mb-4 flex items-center gap-2 text-gold-500"><Bot size={16} /><span className="font-bold uppercase tracking-[0.18em]">Agent Execution Feed</span></div>
      <div className="grid gap-3">
        {steps.map((step, index) => <motion.div key={step.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .08 }} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
          <span className="mt-1 grid size-5 place-items-center"><StepIcon status={step.status} /></span>
          <div>
            <p className="font-bold text-white">{step.label}</p>
            <p className="mt-1 leading-5 text-slate-300">{step.message}</p>
          </div>
        </motion.div>)}
      </div>
    </div>
  </div>
}
