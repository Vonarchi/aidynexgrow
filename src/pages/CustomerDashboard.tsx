import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { CheckCircle2, Circle, RefreshCcw, Send, ShoppingBag, UploadCloud } from 'lucide-react'
import { DashboardLayout } from '../components/Layout'
import { Badge, EmptyState, ServiceCard, StatCard } from '../components/UI'
import { demoData } from '../data/demoData'
import { useAuth } from '../lib/auth'
import { getPlatformSnapshot, requestService, sendMessage, updateProject } from '../lib/platformService'
import type { PlatformSnapshot, Project, ServiceCatalogItem } from '../types/platform'

const tabs = ['Overview', 'Application Status', 'Onboarding Checklist', 'Website Build Progress', 'Files and Assets', 'Messages', 'Revisions', 'Hosting and Services', 'Billing', 'Support']
const projectStages = ['Application Submitted', 'Under Review', 'Approved', 'Awaiting Onboarding', 'Content Collection', 'Design in Progress', 'Client Review', 'Revision', 'Ready to Launch', 'Launched', 'On Hold', 'Declined']

function normalizeStage(status?: string) {
  if (!status) return 'Application Submitted'
  if (['Published', 'Completed', 'Maintenance Active'].includes(status)) return 'Launched'
  if (status === 'Approved for Launch') return 'Ready to Launch'
  if (status === 'Revision Requested' || status === 'Revision in Progress') return 'Revision'
  if (status === 'Design Started' || status === 'Development' || status === 'Internal Review' || status === 'Ready for Production') return 'Design in Progress'
  if (status === 'Content Required') return 'Content Collection'
  if (status === 'Paused' || status === 'Cancelled') return 'On Hold'
  return projectStages.includes(status) ? status : 'Under Review'
}

function checklistStatus(done: boolean, waitingOnStaff = false) {
  if (done) return 'Completed'
  return waitingOnStaff ? 'Staff Review' : 'Pending'
}

export function CustomerDashboard() {
  const { user, profile } = useAuth()
  const [snapshot, setSnapshot] = useState<PlatformSnapshot>(demoData)
  const [active, setActive] = useState('Overview')
  const [message, setMessage] = useState('')
  const [revision, setRevision] = useState({ page: '', section: '', priority: 'Standard', description: '' })
  useEffect(() => { getPlatformSnapshot().then(setSnapshot).catch(() => setSnapshot(demoData)) }, [])
  const application = useMemo(() => snapshot.applications.find((item) => item.applicant_id === user?.id), [snapshot, user])
  const business = application ? snapshot.businesses.find((item) => item.id === application.business_id) : undefined
  const queue = application ? snapshot.queueEntries.find((item) => item.application_id === application.id) : undefined
  const project = application ? snapshot.projects.find((item) => item.application_id === application.id) : undefined
  const messages = snapshot.messages.filter((item) => item.project_id === project?.id)
  const currentStage = normalizeStage(project?.status || application?.status)
  const stageIndex = Math.max(0, projectStages.indexOf(currentStage))
  const completion = Math.round(((stageIndex + 1) / projectStages.length) * 100)
  const nextAction = !application ? 'Start or submit your application' : !application.content_ready ? 'Prepare business content and onboarding assets' : currentStage === 'Client Review' ? 'Review the website preview' : currentStage === 'Revision' ? 'Watch for revision updates' : currentStage === 'Ready to Launch' ? 'Approve final launch details' : currentStage === 'Launched' ? 'Review hosting and growth services' : 'Watch for the next project update'
  const checklist = [
    { label: 'Business information completed', status: checklistStatus(Boolean(business)), required: true, owner: 'Client', notes: business ? 'Business profile is available.' : 'Submit your application details.' },
    { label: 'Logo uploaded', status: checklistStatus(Boolean(application?.logo_ready)), required: true, owner: 'Client', notes: application?.logo_ready ? 'Logo readiness marked yes.' : 'Upload or request logo help.' },
    { label: 'Brand colors selected', status: checklistStatus(Boolean(application?.color_preferences)), required: false, owner: 'Client', notes: application?.color_preferences || 'Add preferred colors when available.' },
    { label: 'Business photos uploaded', status: checklistStatus(Boolean(application?.photos_ready)), required: true, owner: 'Client', notes: application?.photos_ready ? 'Photo readiness marked yes.' : 'Upload or request photo guidance.' },
    { label: 'Services submitted', status: checklistStatus(Boolean(business?.description)), required: true, owner: 'Client', notes: business?.description || 'Provide services, products, or offers.' },
    { label: 'About section submitted', status: checklistStatus(Boolean(business?.target_customer)), required: true, owner: 'Client', notes: business?.target_customer || 'Share audience and business background.' },
    { label: 'Contact information confirmed', status: checklistStatus(Boolean(profile?.email || user?.email)), required: true, owner: 'Client', notes: profile?.email || user?.email || 'Confirm email and phone details.' },
    { label: 'Domain selected', status: checklistStatus(Boolean(project?.domain || application?.desired_domain)), required: false, owner: 'Client', notes: project?.domain || application?.desired_domain || 'Add desired or existing domain.' },
    { label: 'Hosting option selected', status: checklistStatus(Boolean(project?.hosting_status && project.hosting_status !== 'Not selected')), required: true, owner: 'Client', notes: project?.hosting_status || 'Select hosting before launch.' },
    { label: 'Homepage approved', status: checklistStatus(['Approved for Launch', 'Published', 'Completed'].includes(project?.status || ''), Boolean(project)), required: true, owner: 'Client', notes: project?.preview_url ? 'Review the preview when ready.' : 'Preview will appear after design.' },
    { label: 'Final revision submitted', status: checklistStatus(Boolean(project && project.revisions_used > 0), Boolean(project)), required: false, owner: 'Client', notes: project ? `${project.revisions_used} of ${project.allowed_revisions} revision rounds used.` : 'Available after project creation.' },
    { label: 'Launch approved', status: checklistStatus(['Approved for Launch', 'Published', 'Completed'].includes(project?.status || ''), Boolean(project)), required: true, owner: 'Client', notes: project?.published_url || 'Approve final launch when ready.' },
  ]

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
    if (!project) return toast.error('Project workspace is not ready yet')
    if (!revision.description.trim()) return toast.error('Describe the requested change')
    const revisionNote = `Revision request: ${revision.description.trim()}${revision.page ? ` Page: ${revision.page}.` : ''}${revision.section ? ` Section: ${revision.section}.` : ''} Priority: ${revision.priority}.`
    const next: Project = { ...project, status: 'Revision Requested', current_stage: 'Revisions', revisions_used: Math.min(project.allowed_revisions, project.revisions_used + 1), client_notes: [project.client_notes, revisionNote].filter(Boolean).join('\n') }
    await updateProject(next)
    setSnapshot((current) => ({ ...current, projects: current.projects.map((item) => item.id === next.id ? next : item) }))
    setRevision({ page: '', section: '', priority: 'Standard', description: '' })
    toast.success('Revision request submitted')
  }

  return <DashboardLayout title="Client Dashboard" subtitle="Track your application status, onboarding checklist, build progress, files, messages, revisions, hosting, services, billing, and support.">
    <div className="mb-6 flex gap-2 overflow-x-auto pb-2">{tabs.map((tab) => <button key={tab} onClick={() => setActive(tab)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${active === tab ? 'bg-navy-950 text-white' : 'bg-white'}`}>{tab}</button>)}</div>
    {!application && <EmptyState title="No application connected yet" body="Start an application to unlock project status, onboarding, files, messages, revisions, and service options in the client portal." action={<a href="/apply" className="inline-flex rounded-full bg-navy-950 px-5 py-3 font-semibold text-white">Start My Application</a>} />}
    {application && active === 'Overview' && <div className="grid gap-6"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5"><StatCard label="Current stage" value={currentStage} /><StatCard label="Completion" value={`${completion}%`} /><StatCard label="Next required action" value={nextAction} /><StatCard label="Project reference" value={project?.id || application.application_number} /><StatCard label="Estimated launch window" value={queue?.estimated_delivery_date || project?.due_date || 'Pending'} /></div><div className="rounded-3xl bg-white p-6 shadow-sm"><h3 className="text-xl font-bold text-navy-950">Website Build Progress</h3><div className="mt-5 h-3 rounded-full bg-cloud-100"><div className="h-3 rounded-full bg-royal-600" style={{ width: `${completion}%` }} /></div><div className="mt-6 grid gap-3 md:grid-cols-4">{projectStages.map((stage, index) => <div key={stage} className={`rounded-2xl p-4 text-sm font-semibold ${index <= stageIndex ? 'bg-blue-50 text-royal-700' : 'bg-cloud-100 text-slate-600'}`}>{stage}</div>)}</div></div></div>}
    {application && active === 'Application Status' && <div className="rounded-3xl bg-white p-6 shadow-sm"><h3 className="text-2xl font-bold text-navy-950">{application.application_number}</h3><p className="mt-2 text-slate-700">{business?.business_name || 'Business pending'} · {business?.category || 'Industry pending'}</p><div className="mt-6 grid gap-4 md:grid-cols-2"><StatCard label="Application status" value={application.status} /><StatCard label="Website type" value={application.website_type || 'Pending'} /><StatCard label="Primary goal" value={application.primary_goal || 'Pending'} /><StatCard label="Desired pages" value={(application.requested_pages || []).join(', ') || 'Pending'} /><StatCard label="Requested features" value={(application.requested_features || []).join(', ') || 'Pending'} /><StatCard label="Service interests" value={(application.service_interests || []).join(', ') || 'Pending'} /></div></div>}
    {application && active === 'Onboarding Checklist' && <div className="rounded-3xl bg-white p-6 shadow-sm"><h3 className="text-2xl font-bold text-navy-950">Onboarding Checklist</h3><p className="mt-2 text-sm text-slate-700">Checklist status is based on the information currently available in your application and project record.</p><div className="mt-6 grid gap-3">{checklist.map((item) => <div key={item.label} className="grid gap-3 rounded-2xl border p-4 md:grid-cols-[1fr_auto_auto] md:items-center"><div className="flex gap-3"><span className={item.status === 'Completed' ? 'text-emerald-600' : 'text-slate-400'}>{item.status === 'Completed' ? <CheckCircle2 size={20} /> : <Circle size={20} />}</span><div><p className="font-semibold text-navy-950">{item.label}</p><p className="mt-1 text-sm text-slate-600">{item.notes}</p></div></div><Badge tone={item.required ? 'gold' : 'slate'}>{item.required ? 'Required' : 'Optional'}</Badge><Badge tone={item.status === 'Completed' ? 'green' : 'blue'}>{item.status} · {item.owner}</Badge></div>)}</div></div>}
    {application && active === 'Website Build Progress' && <div className="grid gap-6 lg:grid-cols-[1fr_.8fr]">{project ? <><div className="rounded-3xl bg-white p-6 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-4"><div><h3 className="text-2xl font-bold text-navy-950">{project.project_name}</h3><p className="mt-2 text-slate-700">{currentStage} · {project.current_stage}</p></div><Badge tone="gold">{Math.max(0, project.allowed_revisions - project.revisions_used)} of {project.allowed_revisions} included revision rounds remaining</Badge></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{project.tasks?.map((task) => <label key={task.id} className="flex gap-3 rounded-2xl border p-3 text-sm"><input type="checkbox" checked={task.completed} readOnly />{task.task_name}</label>)}</div><div className="mt-6 flex flex-wrap gap-3"><a href={project.preview_url || '#'} className="rounded-full bg-navy-950 px-5 py-3 font-semibold text-white">Open Preview URL</a><button onClick={approveProject} className="rounded-full bg-emerald-600 px-5 py-3 font-semibold text-white">Approve Website</button><button onClick={() => setActive('Revisions')} className="rounded-full border px-5 py-3 font-semibold">Request Revision</button></div></div><div className="rounded-3xl bg-white p-6 shadow-sm"><h3 className="font-bold text-navy-950">Project Details</h3><div className="mt-4 grid gap-3 text-sm text-slate-700"><p><b>Domain:</b> {project.domain || 'Pending'}</p><p><b>Hosting:</b> {project.hosting_status || 'Not selected'}</p><p><b>Preview:</b> {project.preview_url || 'Pending'}</p><p><b>Published:</b> {project.published_url || 'Not launched'}</p><p><b>Client-visible notes:</b> {project.client_notes || 'No client notes yet.'}</p></div></div></> : <EmptyState title="Project workspace pending" body="Your project workspace will appear here after your application is approved and converted into a website build." />}</div>}
    {application && active === 'Files and Assets' && <EmptyState title="Secure file center" body="Upload logos, photos, brand guides, menus, service lists, documents, written content, or annotated screenshots. Files use the private project-files storage bucket when Supabase is configured." action={<label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-navy-950 px-5 py-3 font-semibold text-white"><UploadCloud size={18} /> Upload Files<input className="hidden" type="file" multiple /></label>} />}
    {active === 'Messages' && <div className="grid gap-6 lg:grid-cols-[1fr_.8fr]"><div className="grid gap-3">{messages.length ? messages.map((item) => <div key={item.id} className="rounded-3xl bg-white p-5 shadow-sm"><Badge>{item.message_type}</Badge><h3 className="mt-3 font-bold text-navy-950">{item.subject}</h3><p className="mt-2 text-sm text-slate-600">{item.body}</p></div>) : <EmptyState title="No messages yet" body="Project messages will appear here." />}</div><div className="rounded-3xl bg-white p-6 shadow-sm"><h3 className="font-bold text-navy-950">Send a message</h3><textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} className="mt-4 w-full rounded-2xl border p-4" placeholder="Ask a question or send project notes..." /><button onClick={submitMessage} className="mt-4 inline-flex items-center gap-2 rounded-full bg-navy-950 px-5 py-3 font-semibold text-white"><Send size={16} /> Send</button></div></div>}
    {application && active === 'Revisions' && <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]"><div className="rounded-3xl bg-white p-6 shadow-sm"><RefreshCcw className="mb-4 text-royal-700" /><h3 className="text-2xl font-bold text-navy-950">Revision Allowance</h3><p className="mt-2 text-sm text-slate-700">{project ? `${Math.max(0, project.allowed_revisions - project.revisions_used)} of ${project.allowed_revisions} included revision rounds remaining.` : 'Revision requests become available after a project workspace is created.'}</p><p className="mt-4 text-sm text-slate-600">Requests outside the included scope may require clarification, a plan upgrade, or a custom quote.</p></div><div className="rounded-3xl bg-white p-6 shadow-sm"><h3 className="font-bold text-navy-950">Request a Revision</h3><div className="mt-4 grid gap-4 sm:grid-cols-2"><input value={revision.page} onChange={(e) => setRevision({ ...revision, page: e.target.value })} className="rounded-2xl border p-4" placeholder="Page" /><input value={revision.section} onChange={(e) => setRevision({ ...revision, section: e.target.value })} className="rounded-2xl border p-4" placeholder="Section" /><select value={revision.priority} onChange={(e) => setRevision({ ...revision, priority: e.target.value })} className="rounded-2xl border p-4"><option>Standard</option><option>High</option><option>Needs clarification</option></select></div><textarea value={revision.description} onChange={(e) => setRevision({ ...revision, description: e.target.value })} rows={6} className="mt-4 w-full rounded-2xl border p-4" placeholder="Describe the requested change..." /><button onClick={requestRevision} className="mt-4 rounded-full bg-navy-950 px-5 py-3 font-semibold text-white">Submit Revision Request</button></div></div>}
    {active === 'Hosting and Services' && <div><div className="mb-6 rounded-3xl bg-navy-950 p-7 text-white"><ShoppingBag className="mb-3 text-gold-500" /><h3 className="text-2xl font-bold">Hosting and Growth Services</h3><p className="mt-2 text-slate-300">Service requests are recorded now; Stripe-backed payment collection can be connected in a later phase.</p></div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{snapshot.services.map((item) => <ServiceCard key={item.id} item={item} onRequest={handleService} />)}</div></div>}
    {active === 'Billing' && <EmptyState title="Billing placeholder" body="Hosting, maintenance, subscription, and Stripe customer records will appear here once payments are connected." action={<button className="rounded-full bg-navy-950 px-5 py-3 font-semibold text-white">Request Billing Help</button>} />}
    {active === 'Support' && <div className="grid gap-5 md:grid-cols-3"><StatCard label="Email" value="support@example.com" /><StatCard label="Phone" value="Call from mobile" /><StatCard label="Response target" value="Next business update" /></div>}
  </DashboardLayout>
}
