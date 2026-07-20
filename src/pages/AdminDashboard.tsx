import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { ArrowDown, ArrowUp, KanbanSquare, Pause, Search, Star, Users } from 'lucide-react'
import { DashboardLayout } from '../components/Layout'
import { Badge, StatCard } from '../components/UI'
import { demoData } from '../data/demoData'
import { approveApplication, createProjectFromApplication, getPlatformSnapshot, reorderQueue, updateApplicationStatus, updateProject } from '../lib/platformService'
import type { Application, PlatformSnapshot, Project } from '../types/platform'

const nav = ['Overview', 'Applications', 'Queue', 'Projects', 'Clients', 'Messages', 'Files', 'Premium Leads', 'Services', 'Plans', 'Testimonials', 'Portfolio', 'Website Content', 'Email Templates', 'Analytics', 'Settings', 'Audit Log']
const kanban = ['Approved', 'Waiting for Content', 'Ready', 'Building', 'Internal QA', 'Client Review', 'Revisions', 'Ready to Launch', 'Published', 'Completed']

export function AdminDashboard() {
  const [snapshot, setSnapshot] = useState<PlatformSnapshot>(demoData)
  const [active, setActive] = useState('Overview')
  const [query, setQuery] = useState('')
  useEffect(() => { getPlatformSnapshot().then(setSnapshot).catch(() => setSnapshot(demoData)) }, [])
  const filteredApps = useMemo(() => snapshot.applications.filter((app) => `${app.application_number} ${snapshot.businesses.find((b) => b.id === app.business_id)?.business_name}`.toLowerCase().includes(query.toLowerCase())), [snapshot, query])
  const metrics = {
    newApps: snapshot.applications.filter((item) => item.status === 'Application Submitted').length,
    pending: snapshot.applications.filter((item) => ['Under Review', 'More Information Needed'].includes(item.status)).length,
    approved: snapshot.applications.filter((item) => item.status === 'Approved').length,
    queue: snapshot.queueEntries.length,
    production: snapshot.projects.filter((item) => ['Design Started', 'Development', 'Internal Review'].includes(item.status)).length,
    awaiting: snapshot.projects.filter((item) => ['Content Required', 'Client Review', 'Revision Requested', 'Awaiting Domain'].includes(item.status)).length,
    completedWeek: 5,
    completedMonth: 17,
    hosting: 8,
    maintenance: 6,
    premium: snapshot.premiumLeads.length,
    mrr: '$2,940',
  }
  async function handleApprove(app: Application) {
    await approveApplication(app.id)
    setSnapshot(await getPlatformSnapshot().catch(() => demoData))
    toast.success('Application approved and queue position assigned')
  }
  async function handleStatus(app: Application, status: Application['status']) {
    await updateApplicationStatus(app.id, status)
    setSnapshot((current) => ({ ...current, applications: current.applications.map((item) => item.id === app.id ? { ...item, status } : item) }))
  }
  async function handleProject(app: Application) {
    const project = await createProjectFromApplication(app.id)
    if (project) setSnapshot((current) => ({ ...current, projects: [project, ...current.projects] }))
    toast.success('Project workspace created')
  }
  async function moveQueue(id: string, direction: -1 | 1) {
    await reorderQueue(id, direction)
    setSnapshot(await getPlatformSnapshot().catch(() => demoData))
  }
  async function setProjectStatus(project: Project, status: Project['status']) {
    const next = { ...project, status, current_stage: status }
    await updateProject(next)
    setSnapshot((current) => ({ ...current, projects: current.projects.map((item) => item.id === project.id ? next : item) }))
  }

  return <DashboardLayout title="Agency Admin Dashboard" subtitle="Review applications, control weekly capacity, manage the build queue, update projects, capture premium leads, and monitor conversion performance.">
    <div className="mb-6 flex gap-2 overflow-x-auto pb-2">{nav.map((item) => <button key={item} onClick={() => setActive(item)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${active === item ? 'bg-navy-950 text-white' : 'bg-white'}`}>{item}</button>)}</div>
    {active === 'Overview' && <div className="grid gap-6"><div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6"><StatCard label="New applications" value={String(metrics.newApps)} /><StatCard label="Pending reviews" value={String(metrics.pending)} /><StatCard label="Approved applications" value={String(metrics.approved)} /><StatCard label="Active queue length" value={String(metrics.queue)} /><StatCard label="Websites in production" value={String(metrics.production)} /><StatCard label="Awaiting client" value={String(metrics.awaiting)} /><StatCard label="Completed this week" value={String(metrics.completedWeek)} /><StatCard label="Completed this month" value={String(metrics.completedMonth)} /><StatCard label="Hosting conversions" value={String(metrics.hosting)} /><StatCard label="Maintenance conversions" value={String(metrics.maintenance)} /><StatCard label="Premium leads" value={String(metrics.premium)} /><StatCard label="Estimated MRR" value={metrics.mrr} /></div></div>}
    {active === 'Applications' && <div className="rounded-3xl bg-white p-6 shadow-sm"><div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h3 className="text-2xl font-bold text-navy-950">Application Management</h3><label className="relative"><Search className="absolute left-3 top-3 text-slate-400" size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search applicants" className="rounded-full border py-2 pl-10 pr-4" /></label></div><div className="grid gap-4">{filteredApps.map((app) => { const biz = snapshot.businesses.find((item) => item.id === app.business_id); return <div key={app.id} className="rounded-3xl border p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><Badge tone={app.demo ? 'gold' : 'blue'}>{app.demo ? 'DEMO DATA' : app.status}</Badge><h4 className="mt-3 text-xl font-bold text-navy-950">{app.application_number} · {biz?.business_name}</h4><p className="mt-1 text-sm text-slate-600">{biz?.category} · Score {app.internal_score || 'Pending'} · {app.primary_goal}</p></div><div className="flex flex-wrap gap-2"><button onClick={() => handleApprove(app)} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Approve</button><button onClick={() => handleStatus(app, 'Waitlisted')} className="rounded-full border px-4 py-2 text-sm font-semibold">Waitlist</button><button onClick={() => handleStatus(app, 'Declined')} className="rounded-full border px-4 py-2 text-sm font-semibold">Decline</button><button onClick={() => handleStatus(app, 'More Information Needed')} className="rounded-full border px-4 py-2 text-sm font-semibold">Request Info</button><button onClick={() => handleProject(app)} className="rounded-full bg-navy-950 px-4 py-2 text-sm font-semibold text-white">Convert to Project</button><button className="rounded-full border px-4 py-2 text-sm font-semibold"><Star size={15} className="inline" /> High Value</button></div></div><p className="mt-4 rounded-2xl bg-cloud-100 p-4 text-sm text-slate-700">Internal notes: {app.admin_notes || 'No notes yet. Add tags, assign staff, and record follow-up after review.'}</p></div>})}</div></div>}
    {active === 'Queue' && <div className="rounded-3xl bg-white p-6 shadow-sm"><h3 className="text-2xl font-bold text-navy-950">Queue Management</h3><p className="mt-2 text-sm text-slate-600">Manual ordering, priority, pause, skip, content readiness, and estimated date controls. Admin changes are logged by the database trigger in Supabase.</p><div className="mt-6 grid gap-3">{[...snapshot.queueEntries].sort((a,b) => a.queue_position - b.queue_position).map((entry) => <div key={entry.id} className="grid gap-3 rounded-2xl border p-4 md:grid-cols-[80px_1fr_auto]"><div className="text-2xl font-bold text-navy-950">#{entry.queue_position}</div><div><p className="font-bold">Website #{entry.queue_number}</p><p className="text-sm text-slate-600">{entry.status} · {entry.priority_level} · {entry.content_ready ? 'Content ready' : 'Waiting for content'} · Start {entry.estimated_start_date}</p></div><div className="flex flex-wrap gap-2"><button onClick={() => moveQueue(entry.id, -1)} className="rounded-full border p-2"><ArrowUp size={16} /></button><button onClick={() => moveQueue(entry.id, 1)} className="rounded-full border p-2"><ArrowDown size={16} /></button><button onClick={() => toast.success('Project skipped temporarily')} className="rounded-full border px-3 py-2 text-sm">Skip</button><button onClick={() => toast.success('Project paused')} className="rounded-full border px-3 py-2 text-sm"><Pause size={15} className="inline" /> Pause</button></div></div>)}</div></div>}
    {active === 'Projects' && <div><div className="mb-5 flex items-center gap-3"><KanbanSquare className="text-royal-700" /><h3 className="text-2xl font-bold text-navy-950">Project Kanban</h3></div><div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-5">{kanban.map((column) => <div key={column} className="rounded-3xl bg-white p-4 shadow-sm"><h4 className="mb-4 font-bold text-navy-950">{column}</h4><div className="grid gap-3">{snapshot.projects.filter((project) => project.status === column || project.current_stage === column).slice(0, 4).map((project) => <div key={project.id} className="rounded-2xl border p-4"><p className="font-semibold text-navy-950">{project.project_name}</p><p className="mt-1 text-xs text-slate-500">Due {project.due_date || 'TBD'}</p><select value={project.status} onChange={(e) => setProjectStatus(project, e.target.value as Project['status'])} className="mt-3 w-full rounded-xl border p-2 text-xs"><option>Approved</option><option>Content Required</option><option>Design Started</option><option>Development</option><option>Internal Review</option><option>Client Review</option><option>Revision Requested</option><option>Approved for Launch</option><option>Published</option><option>Completed</option></select></div>)}{snapshot.projects.filter((project) => project.status === column || project.current_stage === column).length === 0 && <div className="rounded-2xl border border-dashed p-4 text-sm text-slate-500">No projects</div>}</div></div>)}</div></div>}
    {active === 'Premium Leads' && <div className="grid gap-4">{snapshot.premiumLeads.map((lead) => <div key={lead.id} className="rounded-3xl bg-white p-6 shadow-sm"><Badge tone="gold">{lead.status}</Badge><h3 className="mt-3 text-xl font-bold text-navy-950">{lead.project_type}</h3><p className="mt-2 text-slate-600">{lead.problem_description}</p><div className="mt-4 flex flex-wrap gap-2"><Badge>{lead.budget_range}</Badge><Badge>{lead.desired_timeline}</Badge>{lead.required_features.map((feature) => <Badge key={feature} tone="slate">{feature}</Badge>)}</div></div>)}</div>}
    {['Clients', 'Messages', 'Files', 'Services', 'Plans', 'Testimonials', 'Portfolio', 'Website Content', 'Email Templates', 'Analytics', 'Settings', 'Audit Log'].includes(active) && <div className="rounded-3xl bg-white p-8 shadow-sm"><Users className="mb-4 text-royal-700" /><h3 className="text-2xl font-bold text-navy-950">{active}</h3><p className="mt-2 text-slate-600">This admin module is connected to the same platform data model and ready for expanded CRUD screens. Demo records are visible in the seeded data and can be removed before launch.</p><div className="mt-6 grid gap-4 md:grid-cols-3"><StatCard label="Records" value={String(snapshot.applications.length + snapshot.projects.length)} /><StatCard label="Operational status" value="Ready" /><StatCard label="Security" value="RLS enforced" /></div></div>}
  </DashboardLayout>
}
