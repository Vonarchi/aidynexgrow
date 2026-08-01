import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { ArrowDown, ArrowUp, KanbanSquare, Pause, Search, Users } from 'lucide-react'
import { DashboardLayout } from '../components/Layout'
import { Badge, StatCard } from '../components/UI'
import { demoData } from '../data/demoData'
import { approveApplication, createProjectFromApplication, getPlatformSnapshot, reorderQueue, updateApplicationStatus, updateProject, updateQueueEntry } from '../lib/platformService'
import type { Application, PlatformSnapshot, Project, QueueEntry } from '../types/platform'

const nav = ['Overview', 'Applications', 'Leads', 'Projects', 'Clients', 'Build Queue', 'Messages', 'Support Requests', 'Services', 'Payments', 'Website Examples', 'Settings']
const kanban = ['Approved', 'Awaiting Content', 'Ready for Build', 'In Design', 'Internal Review', 'Client Review', 'Revision', 'Ready to Launch', 'Launched', 'On Hold']
const appStatuses: Application['status'][] = ['Application Submitted', 'Under Review', 'More Information Needed', 'Approved', 'Waitlisted', 'Declined', 'Content Required']
const projectStatuses: Project['status'][] = ['Approved', 'Content Required', 'Ready for Production', 'Design Started', 'Development', 'Internal Review', 'Client Review', 'Revision Requested', 'Approved for Launch', 'Published', 'Paused', 'Completed']

function projectColumn(project: Project) {
  if (project.status === 'Content Required') return 'Awaiting Content'
  if (project.status === 'Ready for Production') return 'Ready for Build'
  if (project.status === 'Design Started' || project.status === 'Development') return 'In Design'
  if (project.status === 'Revision Requested' || project.status === 'Revision in Progress') return 'Revision'
  if (project.status === 'Approved for Launch') return 'Ready to Launch'
  if (project.status === 'Published' || project.status === 'Completed' || project.status === 'Maintenance Active') return 'Launched'
  if (project.status === 'Paused' || project.status === 'Cancelled') return 'On Hold'
  return project.status === 'Internal Review' || project.status === 'Client Review' || project.status === 'Approved' ? project.status : 'Approved'
}

export function AdminDashboard() {
  const [snapshot, setSnapshot] = useState<PlatformSnapshot>(demoData)
  const [active, setActive] = useState('Overview')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  useEffect(() => { getPlatformSnapshot().then(setSnapshot).catch(() => setSnapshot(demoData)) }, [])
  const filteredApps = useMemo(() => snapshot.applications.filter((app) => {
    const biz = snapshot.businesses.find((b) => b.id === app.business_id)
    const matchesQuery = `${app.application_number} ${biz?.business_name} ${biz?.category} ${app.primary_goal}`.toLowerCase().includes(query.toLowerCase())
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter
    return matchesQuery && matchesStatus
  }), [snapshot, query, statusFilter])
  const metrics = {
    newApps: snapshot.applications.filter((item) => item.status === 'Application Submitted').length,
    awaitingReview: snapshot.applications.filter((item) => ['Application Submitted', 'Under Review', 'More Information Needed'].includes(item.status)).length,
    approvedProjects: snapshot.projects.filter((item) => ['Approved', 'Ready for Production', 'Design Started', 'Development', 'Internal Review', 'Client Review', 'Revision Requested', 'Approved for Launch'].includes(item.status)).length,
    waitingClient: snapshot.projects.filter((item) => ['Content Required', 'Client Review', 'Revision Requested', 'Awaiting Domain'].includes(item.status)).length,
    production: snapshot.projects.filter((item) => ['Design Started', 'Development', 'Internal Review'].includes(item.status)).length,
    awaitingApproval: snapshot.projects.filter((item) => item.status === 'Client Review' || item.status === 'Approved for Launch').length,
    upcomingLaunches: snapshot.projects.filter((item) => item.due_date && !['Published', 'Completed', 'Cancelled'].includes(item.status)).length,
    activeHosting: snapshot.projects.filter((item) => item.hosting_status && item.hosting_status !== 'Not selected').length,
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
  async function setQueueStatus(entry: QueueEntry, status: string) {
    const next = { ...entry, status, priority_level: status === 'Paused' ? 'Paused' as const : entry.priority_level, paused_reason: status === 'Paused' ? entry.paused_reason || 'Paused by admin' : entry.paused_reason, last_position_update: new Date().toISOString() }
    await updateQueueEntry(next)
    setSnapshot((current) => ({ ...current, queueEntries: current.queueEntries.map((item) => item.id === next.id ? next : item) }))
    toast.success('Build queue updated')
  }
  async function setProjectStatus(project: Project, status: Project['status']) {
    const next = { ...project, status, current_stage: status }
    await updateProject(next)
    setSnapshot((current) => ({ ...current, projects: current.projects.map((item) => item.id === project.id ? next : item) }))
  }

  return <DashboardLayout title="Agency Admin Dashboard" subtitle="Review applications, control weekly capacity, manage the build queue, update projects, capture premium leads, and monitor conversion performance.">
    <div className="mb-6 flex gap-2 overflow-x-auto pb-2">{nav.map((item) => <button key={item} onClick={() => setActive(item)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${active === item ? 'bg-navy-950 text-white' : 'bg-white'}`}>{item}</button>)}</div>
    {active === 'Overview' && <div className="grid gap-6"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><StatCard label="New applications" value={String(metrics.newApps)} /><StatCard label="Applications awaiting review" value={String(metrics.awaitingReview)} /><StatCard label="Approved projects" value={String(metrics.approvedProjects)} /><StatCard label="Projects waiting on client information" value={String(metrics.waitingClient)} /><StatCard label="Websites in production" value={String(metrics.production)} /><StatCard label="Websites awaiting approval" value={String(metrics.awaitingApproval)} /><StatCard label="Upcoming launches" value={String(metrics.upcomingLaunches)} /><StatCard label="Active hosting clients" value={String(metrics.activeHosting)} /></div></div>}
    {active === 'Applications' && <div className="rounded-3xl bg-white p-6 shadow-sm"><div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><h3 className="text-2xl font-bold text-navy-950">Application Management</h3><div className="flex flex-col gap-3 sm:flex-row"><label className="relative"><Search className="absolute left-3 top-3 text-slate-400" size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search applicants" className="w-full rounded-full border py-2 pl-10 pr-4" /></label><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-full border px-4 py-2"><option>All</option>{appStatuses.map((status) => <option key={status}>{status}</option>)}</select></div></div><div className="grid gap-4">{filteredApps.map((app) => { const biz = snapshot.businesses.find((item) => item.id === app.business_id); const project = snapshot.projects.find((item) => item.application_id === app.id); return <div key={app.id} className="rounded-3xl border p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><Badge tone={app.demo ? 'gold' : 'blue'}>{app.demo ? 'DEMO DATA' : app.status}</Badge><h4 className="mt-3 text-xl font-bold text-navy-950">{app.application_number} · {biz?.business_name || 'Business pending'}</h4><p className="mt-1 text-sm text-slate-600">{biz?.category || 'Industry pending'} · {app.primary_goal}</p><div className="mt-4 grid gap-2 text-sm text-slate-700 md:grid-cols-2"><p><b>Pages:</b> {(app.requested_pages || []).join(', ') || 'Pending'}</p><p><b>Features:</b> {(app.requested_features || []).join(', ') || 'Pending'}</p><p><b>Content:</b> {app.content_ready ? 'Ready' : 'Needed'}</p><p><b>Project:</b> {project ? project.project_name : 'Not created'}</p></div></div><div className="grid gap-2 sm:min-w-56"><select value={app.status} onChange={(e) => handleStatus(app, e.target.value as Application['status'])} className="rounded-full border px-4 py-2 text-sm">{appStatuses.map((status) => <option key={status}>{status}</option>)}</select><button onClick={() => handleApprove(app)} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Approve</button><button onClick={() => handleStatus(app, 'More Information Needed')} className="rounded-full border px-4 py-2 text-sm font-semibold">Request More Information</button><button onClick={() => handleProject(app)} className="rounded-full bg-navy-950 px-4 py-2 text-sm font-semibold text-white">Convert to Client Project</button></div></div><p className="mt-4 whitespace-pre-line rounded-2xl bg-cloud-100 p-4 text-sm text-slate-700">Internal notes: {app.admin_notes || 'No notes yet. Add tags, assign staff, and record follow-up after review.'}</p></div>})}{filteredApps.length === 0 && <div className="rounded-2xl border border-dashed p-6 text-sm text-slate-600">No applications match this search and status filter.</div>}</div></div>}
    {active === 'Build Queue' && <div className="rounded-3xl bg-white p-6 shadow-sm"><h3 className="text-2xl font-bold text-navy-950">Build Queue</h3><p className="mt-2 text-sm text-slate-600">Manual ordering, priority, pause, skip, content readiness, and status controls. Admin changes are logged by the database trigger in Supabase when connected.</p><div className="mt-6 grid gap-3">{[...snapshot.queueEntries].sort((a,b) => a.queue_position - b.queue_position).map((entry) => { const app = snapshot.applications.find((item) => item.id === entry.application_id); const biz = snapshot.businesses.find((item) => item.id === app?.business_id); return <div key={entry.id} className="grid gap-3 rounded-2xl border p-4 lg:grid-cols-[80px_1fr_auto] lg:items-center"><div className="text-2xl font-bold text-navy-950">#{entry.queue_position}</div><div><p className="font-bold">{biz?.business_name || `Website #${entry.queue_number}`}</p><p className="text-sm text-slate-600">{biz?.category || 'Industry pending'} · {entry.status} · {entry.priority_level} · {entry.content_ready ? 'Content ready' : 'Waiting for content'} · Start {entry.estimated_start_date || 'Pending'}</p></div><div className="flex flex-wrap gap-2"><button onClick={() => moveQueue(entry.id, -1)} className="rounded-full border p-2" aria-label="Move up"><ArrowUp size={16} /></button><button onClick={() => moveQueue(entry.id, 1)} className="rounded-full border p-2" aria-label="Move down"><ArrowDown size={16} /></button><select value={entry.status} onChange={(e) => setQueueStatus(entry, e.target.value)} className="rounded-full border px-3 py-2 text-sm"><option>Approved</option><option>Awaiting Content</option><option>Ready for Build</option><option>In Design</option><option>Internal Review</option><option>Client Review</option><option>Ready to Launch</option><option>Skipped</option><option>Paused</option></select><button onClick={() => setQueueStatus(entry, 'Skipped')} className="rounded-full border px-3 py-2 text-sm">Skip</button><button onClick={() => setQueueStatus(entry, 'Paused')} className="rounded-full border px-3 py-2 text-sm"><Pause size={15} className="inline" /> Pause</button></div></div>})}</div></div>}
    {active === 'Projects' && <div><div className="mb-5 flex items-center gap-3"><KanbanSquare className="text-royal-700" /><h3 className="text-2xl font-bold text-navy-950">Project Board</h3></div><div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-5">{kanban.map((column) => { const projects = snapshot.projects.filter((project) => projectColumn(project) === column); return <div key={column} className="rounded-3xl bg-white p-4 shadow-sm"><h4 className="mb-4 font-bold text-navy-950">{column}</h4><div className="grid gap-3">{projects.map((project) => { const app = snapshot.applications.find((item) => item.id === project.application_id); const biz = snapshot.businesses.find((item) => item.id === project.business_id); const missingItems = [app && !app.content_ready ? 'Content' : '', app && !app.logo_ready ? 'Logo' : '', app && !app.photos_ready ? 'Photos' : '', !project.hosting_status || project.hosting_status === 'Not selected' ? 'Hosting' : ''].filter(Boolean).join(', ') || 'None'; return <div key={project.id} className="rounded-2xl border p-4"><p className="font-semibold text-navy-950">{biz?.business_name || project.project_name}</p><p className="mt-1 text-xs text-slate-500">{biz?.category || 'Industry pending'} · Ref {project.id.slice(0, 8)}</p><div className="mt-3 grid gap-1 text-xs text-slate-600"><p><b>Assigned:</b> {project.assigned_to || 'Unassigned'}</p><p><b>Plan:</b> {(app?.service_interests || [])[0] || 'Standard Build'}</p><p><b>Due:</b> {project.due_date || 'TBD'}</p><p><b>Missing:</b> {missingItems}</p><p><b>Client response:</b> {project.client_notes ? 'Has notes' : 'No recent note'}</p></div><select value={project.status} onChange={(e) => setProjectStatus(project, e.target.value as Project['status'])} className="mt-3 w-full rounded-xl border p-2 text-xs">{projectStatuses.map((status) => <option key={status}>{status}</option>)}</select></div>})}{projects.length === 0 && <div className="rounded-2xl border border-dashed p-4 text-sm text-slate-500">No projects</div>}</div></div>})}</div></div>}
    {active === 'Leads' && <div className="grid gap-4">{snapshot.premiumLeads.map((lead) => <div key={lead.id} className="rounded-3xl bg-white p-6 shadow-sm"><Badge tone="gold">{lead.status}</Badge><h3 className="mt-3 text-xl font-bold text-navy-950">{lead.project_type}</h3><p className="mt-2 text-slate-600">{lead.problem_description}</p><div className="mt-4 flex flex-wrap gap-2"><Badge>{lead.budget_range}</Badge><Badge>{lead.desired_timeline}</Badge>{lead.required_features.map((feature) => <Badge key={feature} tone="slate">{feature}</Badge>)}</div></div>)}</div>}
    {['Clients', 'Messages', 'Support Requests', 'Services', 'Payments', 'Website Examples', 'Settings'].includes(active) && <div className="rounded-3xl bg-white p-8 shadow-sm"><Users className="mb-4 text-royal-700" /><h3 className="text-2xl font-bold text-navy-950">{active}</h3><p className="mt-2 text-slate-600">This admin module is prepared for expanded CRUD screens using the existing platform data model, RLS policies, and service layer.</p><div className="mt-6 grid gap-4 md:grid-cols-3"><StatCard label="Applications" value={String(snapshot.applications.length)} /><StatCard label="Projects" value={String(snapshot.projects.length)} /><StatCard label="Security" value="RLS enforced" /></div></div>}
  </DashboardLayout>
}
