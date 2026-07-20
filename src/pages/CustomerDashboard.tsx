import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Send, ShoppingBag, UploadCloud } from 'lucide-react'
import { DashboardLayout } from '../components/Layout'
import { Badge, EmptyState, ServiceCard, StatCard } from '../components/UI'
import { demoData } from '../data/demoData'
import { useAuth } from '../lib/auth'
import { getPlatformSnapshot, requestService, sendMessage, updateProject } from '../lib/platformService'
import type { PlatformSnapshot, Project, ServiceCatalogItem } from '../types/platform'

const tabs = ['Overview', 'Application', 'Queue', 'Project', 'Files', 'Messages', 'Upgrades', 'Billing', 'Support']
const timeline = ['Application', 'Approval', 'Content', 'Queue', 'Build', 'Review', 'Launch']

export function CustomerDashboard() {
  const { user } = useAuth()
  const [snapshot, setSnapshot] = useState<PlatformSnapshot>(demoData)
  const [active, setActive] = useState('Overview')
  const [message, setMessage] = useState('')
  useEffect(() => { getPlatformSnapshot().then(setSnapshot).catch(() => setSnapshot(demoData)) }, [])
  const application = useMemo(() => snapshot.applications.find((item) => item.applicant_id === user?.id) ?? snapshot.applications[0], [snapshot, user])
  const business = snapshot.businesses.find((item) => item.id === application?.business_id) ?? snapshot.businesses[0]
  const queue = snapshot.queueEntries.find((item) => item.application_id === application?.id) ?? snapshot.queueEntries[0]
  const project = snapshot.projects.find((item) => item.application_id === application?.id) ?? snapshot.projects[0]
  const messages = snapshot.messages.filter((item) => item.project_id === project?.id)
  const movement = queue ? Math.max(0, queue.previous_position - queue.queue_position) : 0

  async function handleService(item: ServiceCatalogItem) {
    if (!user) return toast.error('Please sign in')
    await requestService({ client_id: user.id, project_id: project?.id, service_id: item.id, notes: `Interested in ${item.name}` })
  }
  async function submitMessage() {
    if (!project || !user || !message.trim()) return
    const sent = await sendMessage({ project_id: project.id, sender_id: user.id, message_type: 'General', subject: 'Client message', body: message })
    setSnapshot((current) => ({ ...current, messages: [sent, ...current.messages] }))
    setMessage('')
    toast.success('Message sent')
  }
  async function approveProject() {
    if (!project) return
    const next: Project = { ...project, status: 'Approved for Launch', current_stage: 'Launch' }
    await updateProject(next)
    setSnapshot((current) => ({ ...current, projects: current.projects.map((item) => item.id === next.id ? next : item) }))
    toast.success('Website approved for publication')
  }
  async function requestRevision() {
    if (!project) return
    const next: Project = { ...project, status: 'Revision Requested', current_stage: 'Revisions', revisions_used: Math.min(project.allowed_revisions, project.revisions_used + 1) }
    await updateProject(next)
    setSnapshot((current) => ({ ...current, projects: current.projects.map((item) => item.id === next.id ? next : item) }))
    toast.success('Revision request submitted')
  }

  return <DashboardLayout title="Client Dashboard" subtitle="Track your application, queue movement, project milestones, files, messages, revisions, and optional growth services.">
    <div className="mb-6 flex gap-2 overflow-x-auto pb-2">{tabs.map((tab) => <button key={tab} onClick={() => setActive(tab)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${active === tab ? 'bg-navy-950 text-white' : 'bg-white'}`}>{tab}</button>)}</div>
    {active === 'Overview' && <div className="grid gap-6"><div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6"><StatCard label="Application status" value={application?.status || 'Not submitted'} /><StatCard label="Current queue position" value={`#${queue?.queue_position ?? '--'}`} note={`Previous: #${queue?.previous_position ?? '--'}`} /><StatCard label="Estimated start window" value={queue?.estimated_start_date || 'Pending'} /><StatCard label="Project stage" value={project?.current_stage || 'Intake'} /><StatCard label="Items needing attention" value={queue?.content_ready ? '0' : 'Content'} /><StatCard label="Latest message" value={messages[0]?.subject || 'No messages'} /></div><div className="rounded-3xl bg-white p-6 shadow-sm"><h3 className="text-xl font-bold text-navy-950">Progress Timeline</h3><div className="mt-6 grid gap-3 md:grid-cols-7">{timeline.map((item, index) => <div key={item} className={`rounded-2xl p-4 text-sm font-semibold ${index <= 3 ? 'bg-blue-50 text-royal-700' : 'bg-cloud-100'}`}>{item}</div>)}</div>{movement > 0 && <p className="mt-5 text-sm font-semibold text-emerald-700">You moved up {movement} positions since your last visit.</p>}</div></div>}
    {active === 'Application' && <div className="rounded-3xl bg-white p-6 shadow-sm"><h3 className="text-2xl font-bold text-navy-950">{application?.application_number}</h3><p className="mt-2 text-slate-600">{business?.business_name} · {business?.category}</p><div className="mt-6 grid gap-4 md:grid-cols-2"><StatCard label="Website type" value={application?.website_type || 'Pending'} /><StatCard label="Primary goal" value={application?.primary_goal || 'Pending'} /><StatCard label="Pages" value={(application?.requested_pages || []).join(', ')} /><StatCard label="Service interests" value={(application?.service_interests || []).join(', ')} /></div></div>}
    {active === 'Queue' && <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]"><div className="rounded-3xl bg-navy-950 p-8 text-white"><p className="text-slate-300">Current position</p><p className="mt-2 text-7xl font-bold">#{queue?.queue_position}</p><p className="mt-4 text-gold-500">{movement ? `You moved up ${movement} positions since your last visit.` : 'Position will update as projects move.'}</p></div><div className="rounded-3xl bg-white p-6 shadow-sm"><div className="grid gap-4 sm:grid-cols-2"><StatCard label="Projects ahead" value={String(Math.max(0, (queue?.queue_position || 1) - 1))} /><StatCard label="Estimated build week" value={queue?.estimated_start_date || 'Pending'} /><StatCard label="Queue last updated" value={queue?.last_position_update?.slice(0, 10) || 'Pending'} /><StatCard label="Priority status" value={queue?.priority_level || 'Standard Free'} /></div></div></div>}
    {active === 'Project' && project && <div className="grid gap-6 lg:grid-cols-[1fr_.8fr]"><div className="rounded-3xl bg-white p-6 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-4"><div><h3 className="text-2xl font-bold text-navy-950">{project.project_name}</h3><p className="mt-2 text-slate-600">{project.status} · {project.current_stage}</p></div><Badge tone="gold">{project.allowed_revisions - project.revisions_used} of {project.allowed_revisions} included revision rounds remaining</Badge></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{project.tasks?.map((task) => <label key={task.id} className="flex gap-3 rounded-2xl border p-3 text-sm"><input type="checkbox" checked={task.completed} readOnly />{task.task_name}</label>)}</div><div className="mt-6 flex flex-wrap gap-3"><a href={project.preview_url || '#'} className="rounded-full bg-navy-950 px-5 py-3 font-semibold text-white">Open Preview URL</a><button onClick={approveProject} className="rounded-full bg-emerald-600 px-5 py-3 font-semibold text-white">Approve Website</button><button onClick={requestRevision} className="rounded-full border px-5 py-3 font-semibold">Request Included Revision</button></div></div><div className="rounded-3xl bg-white p-6 shadow-sm"><h3 className="font-bold text-navy-950">Project Details</h3><div className="mt-4 grid gap-3 text-sm"><p><b>Domain:</b> {project.domain || 'Pending'}</p><p><b>Hosting:</b> {project.hosting_status || 'Not selected'}</p><p><b>Preview:</b> {project.preview_url || 'Pending'}</p><p><b>Published:</b> {project.published_url || 'Not launched'}</p><p><b>Client-visible notes:</b> {project.client_notes}</p></div></div></div>}
    {active === 'Files' && <EmptyState title="Secure file center" body="Upload logo, photos, brochures, written content, annotated screenshots, menus, or brand guides. Files use the secure project-files storage bucket when Supabase is configured." action={<label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-navy-950 px-5 py-3 font-semibold text-white"><UploadCloud size={18} /> Upload Files<input className="hidden" type="file" multiple /></label>} />}
    {active === 'Messages' && <div className="grid gap-6 lg:grid-cols-[1fr_.8fr]"><div className="grid gap-3">{messages.length ? messages.map((item) => <div key={item.id} className="rounded-3xl bg-white p-5 shadow-sm"><Badge>{item.message_type}</Badge><h3 className="mt-3 font-bold text-navy-950">{item.subject}</h3><p className="mt-2 text-sm text-slate-600">{item.body}</p></div>) : <EmptyState title="No messages yet" body="Project messages will appear here." />}</div><div className="rounded-3xl bg-white p-6 shadow-sm"><h3 className="font-bold text-navy-950">Send a message</h3><textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} className="mt-4 w-full rounded-2xl border p-4" placeholder="Ask a question or send project notes..." /><button onClick={submitMessage} className="mt-4 inline-flex items-center gap-2 rounded-full bg-navy-950 px-5 py-3 font-semibold text-white"><Send size={16} /> Send</button></div></div>}
    {active === 'Upgrades' && <div><div className="mb-6 rounded-3xl bg-navy-950 p-7 text-white"><ShoppingBag className="mb-3 text-gold-500" /><h3 className="text-2xl font-bold">Enhance Your Website</h3><p className="mt-2 text-slate-300">Stripe-ready service requests are recorded now; payment collection can be connected later.</p></div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{snapshot.services.map((item) => <ServiceCard key={item.id} item={item} onRequest={handleService} />)}</div></div>}
    {active === 'Billing' && <EmptyState title="Billing placeholder" body="Hosting, maintenance, subscription, and Stripe customer records will appear here once payments are connected." action={<button className="rounded-full bg-navy-950 px-5 py-3 font-semibold text-white">Request Billing Help</button>} />}
    {active === 'Support' && <div className="grid gap-5 md:grid-cols-3"><StatCard label="Email" value="support@example.com" /><StatCard label="Phone" value="Call from mobile" /><StatCard label="Response target" value="1 business day" /></div>}
  </DashboardLayout>
}
