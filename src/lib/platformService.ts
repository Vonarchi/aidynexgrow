import { toast } from 'sonner'
import { demoData } from '../data/demoData'
import type { Application, ApplicationDraft, Message, PlatformSnapshot, PremiumLead, Project, QueueEntry, ServiceRequest } from '../types/platform'
import { isSupabaseConfigured, supabase } from './supabase'
import { uid } from './utils'

const storageKey = 'bli-platform-local-state'
const draftKey = 'bli-application-draft'

type TableName = 'profiles' | 'businesses' | 'applications' | 'queue_entries' | 'projects' | 'messages' | 'service_catalog' | 'service_requests' | 'premium_leads' | 'portfolio_items' | 'testimonials' | 'site_metrics'

function loadLocal(): PlatformSnapshot {
  const stored = localStorage.getItem(storageKey)
  if (!stored) return demoData
  try {
    return JSON.parse(stored) as PlatformSnapshot
  } catch {
    return demoData
  }
}

function saveLocal(snapshot: PlatformSnapshot) {
  localStorage.setItem(storageKey, JSON.stringify(snapshot))
}

function toSnapshot(rows: Record<string, unknown[]>): PlatformSnapshot {
  return {
    profiles: (rows.profiles as any[]) ?? demoData.profiles,
    businesses: (rows.businesses as any[]) ?? demoData.businesses,
    applications: (rows.applications as any[]) ?? demoData.applications,
    queueEntries: ((rows.queue_entries as any[]) ?? demoData.queueEntries).map((entry) => ({ ...entry, queue_position: Number(entry.queue_position), previous_position: Number(entry.previous_position) })),
    projects: (rows.projects as any[]) ?? demoData.projects,
    messages: (rows.messages as any[]) ?? demoData.messages,
    services: (rows.service_catalog as any[]) ?? demoData.services,
    serviceRequests: (rows.service_requests as any[]) ?? demoData.serviceRequests,
    premiumLeads: (rows.premium_leads as any[]) ?? demoData.premiumLeads,
    portfolio: (rows.portfolio_items as any[]) ?? demoData.portfolio,
    testimonials: (rows.testimonials as any[]) ?? demoData.testimonials,
    metrics: (rows.site_metrics as any[]) ?? demoData.metrics,
  }
}

export async function getPlatformSnapshot(): Promise<PlatformSnapshot> {
  if (!isSupabaseConfigured || !supabase) return loadLocal()
  const client = supabase

  const tables: TableName[] = ['profiles', 'businesses', 'applications', 'queue_entries', 'projects', 'messages', 'service_catalog', 'service_requests', 'premium_leads', 'portfolio_items', 'testimonials', 'site_metrics']
  const result = await Promise.all(tables.map(async (table) => {
    const { data, error } = await client.from(table).select('*')
    if (error) throw error
    return [table, data ?? []] as const
  }))

  return toSnapshot(Object.fromEntries(result))
}

export function saveDraft(draft: ApplicationDraft) {
  localStorage.setItem(draftKey, JSON.stringify({ ...draft, saved_at: new Date().toISOString() }))
}

export function loadDraft(): ApplicationDraft {
  const stored = localStorage.getItem(draftKey)
  if (!stored) return {}
  try { return JSON.parse(stored) as ApplicationDraft } catch { return {} }
}

export function clearDraft() {
  localStorage.removeItem(draftKey)
}

export async function uploadApplicationFiles(files: FileList | null, userId: string) {
  if (!files?.length) return []
  if (!isSupabaseConfigured || !supabase) {
    return Array.from(files).map((file) => ({ name: file.name, url: URL.createObjectURL(file), type: file.type }))
  }
  const client = supabase
  const uploads = await Promise.all(Array.from(files).map(async (file) => {
    const path = `${userId}/${Date.now()}-${file.name}`
    const { error } = await client.storage.from('project-files').upload(path, file, { upsert: false })
    if (error) throw error
    return { name: file.name, url: path, type: file.type }
  }))
  return uploads
}

export async function submitApplication(draft: ApplicationDraft, userId?: string) {
  const applicantId = userId || 'local-demo-user'
  const applicationNumber = `BLI-${Math.floor(10000 + Math.random() * 89999)}`
  const businessId = uid('biz')
  const appId = uid('app')
  const profile = {
    id: applicantId,
    full_name: draft.full_name || 'New Applicant',
    email: draft.email || 'applicant@example.com',
    phone: draft.phone,
    role: 'customer',
    preferred_contact_method: draft.preferred_contact_method,
    city: draft.city,
    state: draft.state,
    country: draft.country,
    timezone: draft.timezone,
  }
  const business = {
    id: businessId,
    owner_id: applicantId,
    business_name: draft.business_name || 'New Business',
    category: draft.category || 'Small Business',
    description: draft.description || '',
    target_customer: draft.target_customer,
    service_area: draft.service_area,
    year_established: draft.year_established,
    employee_count: draft.employee_count,
    current_website: draft.current_website,
    google_business_url: draft.google_business_url,
    social_links: String(draft.social_links || '').split('\n').map((item) => item.trim()).filter(Boolean),
  }
  const application: Application = {
    id: appId,
    applicant_id: applicantId,
    business_id: businessId,
    application_number: applicationNumber,
    status: 'Application Submitted',
    website_type: draft.website_type || 'Business website',
    primary_goal: draft.primary_goal || 'Attract customers and generate leads',
    requested_pages: draft.requested_pages || [],
    requested_features: draft.requested_features || [],
    style_preferences: draft.style_preferences,
    color_preferences: draft.color_preferences,
    inspiration_urls: String(draft.inspiration_urls || '').split('\n').map((item) => item.trim()).filter(Boolean),
    desired_domain: draft.desired_domain,
    existing_domain: draft.existing_domain,
    hosting_provider: draft.hosting_provider,
    urgency: draft.urgency,
    content_ready: draft.content_ready === 'Yes',
    logo_ready: draft.logo_ready === 'Yes',
    photos_ready: draft.photos_ready === 'Yes',
    copywriting_needed: draft.copywriting_needed === 'Yes',
    service_interests: [draft.build_option_interest, ...(draft.service_interests || [])].filter((item): item is string => Boolean(item)),
    admin_notes: [
      draft.current_marketing_challenges ? `Current marketing challenges: ${draft.current_marketing_challenges}` : '',
      draft.ready_30_days ? `Ready within 30 days: ${draft.ready_30_days}` : '',
      draft.authorized_decision_maker ? `Authorized decision maker: ${draft.authorized_decision_maker}` : '',
    ].filter(Boolean).join('\n'),
    submitted_at: new Date().toISOString(),
  }

  if (isSupabaseConfigured && supabase && userId) {
    await supabase.from('profiles').upsert(profile)
    const { error: bizError } = await supabase.from('businesses').insert(business)
    if (bizError) throw bizError
    const { error: appError } = await supabase.from('applications').insert(application)
    if (appError) throw appError
  } else {
    const snapshot = loadLocal()
    snapshot.profiles = [...snapshot.profiles.filter((p) => p.id !== applicantId), profile as any]
    snapshot.businesses = [business as any, ...snapshot.businesses]
    snapshot.applications = [application, ...snapshot.applications]
    saveLocal(snapshot)
  }

  clearDraft()
  return { application, queuePosition: 42, estimatedReviewTime: '1-2 business days' }
}

export async function approveApplication(applicationId: string) {
  const start = '2026-07-26'
  const delivery = '2026-08-04'
  if (isSupabaseConfigured && supabase) {
    const { data: app, error } = await supabase.from('applications').update({ status: 'Approved', approved_at: new Date().toISOString() }).eq('id', applicationId).select().single()
    if (error) throw error
    const { count } = await supabase.from('queue_entries').select('*', { count: 'exact', head: true })
    const queuePosition = (count ?? 0) + 1
    const queue = { application_id: applicationId, queue_number: 2000 + queuePosition, queue_position: queuePosition, previous_position: queuePosition, priority_level: 'Standard Free', status: 'Approved', content_ready: app.content_ready, estimated_start_date: start, estimated_delivery_date: delivery }
    const { error: queueError } = await supabase.from('queue_entries').insert(queue)
    if (queueError) throw queueError
    return
  }
  const snapshot = loadLocal()
  const application = snapshot.applications.find((item) => item.id === applicationId)
  if (!application) return
  application.status = 'Approved'
  application.approved_at = new Date().toISOString()
  const position = snapshot.queueEntries.length + 1
  snapshot.queueEntries.push({ id: uid('queue'), application_id: applicationId, queue_number: 2000 + position, queue_position: position, previous_position: position, priority_level: 'Standard Free', status: 'Approved', content_ready: application.content_ready, estimated_start_date: start, estimated_delivery_date: delivery, last_position_update: new Date().toISOString() })
  saveLocal(snapshot)
}

export async function updateApplicationStatus(applicationId: string, status: Application['status']) {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('applications').update({ status }).eq('id', applicationId)
    if (error) throw error
    return
  }
  const snapshot = loadLocal()
  const application = snapshot.applications.find((item) => item.id === applicationId)
  if (application) application.status = status
  saveLocal(snapshot)
}

export async function updateQueueEntry(entry: QueueEntry) {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('queue_entries').update(entry).eq('id', entry.id)
    if (error) throw error
    return
  }
  const snapshot = loadLocal()
  snapshot.queueEntries = snapshot.queueEntries.map((item) => item.id === entry.id ? entry : item)
  saveLocal(snapshot)
}

export async function reorderQueue(entryId: string, direction: -1 | 1) {
  const snapshot = loadLocal()
  const sorted = [...snapshot.queueEntries].sort((a, b) => a.queue_position - b.queue_position)
  const index = sorted.findIndex((entry) => entry.id === entryId)
  const target = index + direction
  if (index < 0 || target < 0 || target >= sorted.length) return
  const current = sorted[index]
  const next = sorted[target]
  const currentPosition = current.queue_position
  current.previous_position = current.queue_position
  next.previous_position = next.queue_position
  current.queue_position = next.queue_position
  next.queue_position = currentPosition
  current.last_position_update = new Date().toISOString()
  next.last_position_update = new Date().toISOString()
  saveLocal({ ...snapshot, queueEntries: sorted })
  if (isSupabaseConfigured && supabase) {
    await Promise.all([updateQueueEntry(current), updateQueueEntry(next)])
  }
}

export async function createProjectFromApplication(applicationId: string) {
  const snapshot = isSupabaseConfigured ? await getPlatformSnapshot() : loadLocal()
  const application = snapshot.applications.find((item) => item.id === applicationId)
  if (!application) return undefined
  const business = snapshot.businesses.find((item) => item.id === application.business_id)
  const project: Project = {
    id: uid('project'),
    application_id: applicationId,
    client_id: application.applicant_id,
    business_id: application.business_id,
    project_name: `${business?.business_name || 'Business'} Website Build`,
    status: 'Ready for Production',
    current_stage: 'Content',
    preview_url: '',
    domain: application.desired_domain,
    hosting_status: 'Not selected',
    platform: 'React + Supabase',
    allowed_revisions: 1,
    revisions_used: 0,
    client_notes: 'Project created from approved application.',
    internal_notes: 'Confirm content readiness before moving into production.',
  }
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('projects').insert(project)
    if (error) throw error
  } else {
    snapshot.projects = [project, ...snapshot.projects]
    saveLocal(snapshot)
  }
  return project
}

export async function updateProject(project: Project) {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('projects').update(project).eq('id', project.id)
    if (error) throw error
    return
  }
  const snapshot = loadLocal()
  snapshot.projects = snapshot.projects.map((item) => item.id === project.id ? project : item)
  saveLocal(snapshot)
}

export async function sendMessage(message: Omit<Message, 'id' | 'created_at'>) {
  const payload: Message = { ...message, id: uid('msg'), created_at: new Date().toISOString() }
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('messages').insert(payload)
    if (error) throw error
  } else {
    const snapshot = loadLocal()
    snapshot.messages = [payload, ...snapshot.messages]
    saveLocal(snapshot)
  }
  return payload
}

export async function requestService(payload: Omit<ServiceRequest, 'id' | 'created_at' | 'status'>) {
  const request: ServiceRequest = { ...payload, id: uid('service-request'), status: 'Requested', created_at: new Date().toISOString() }
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('service_requests').insert(request)
    if (error) throw error
  } else {
    const snapshot = loadLocal()
    snapshot.serviceRequests = [request, ...snapshot.serviceRequests]
    saveLocal(snapshot)
  }
  toast.success('Service request added to your project')
  return request
}

export async function createPremiumLead(payload: Omit<PremiumLead, 'id' | 'created_at' | 'status'>) {
  const lead: PremiumLead = { ...payload, id: uid('lead'), status: 'New', created_at: new Date().toISOString() }
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('premium_leads').insert(lead)
    if (error) throw error
  } else {
    const snapshot = loadLocal()
    snapshot.premiumLeads = [lead, ...snapshot.premiumLeads]
    saveLocal(snapshot)
  }
  return lead
}
