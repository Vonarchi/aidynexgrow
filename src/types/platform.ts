export type UserRole = 'customer' | 'admin' | 'staff'

export type ApplicationStatus =
  | 'Application Submitted'
  | 'Under Review'
  | 'More Information Needed'
  | 'Approved'
  | 'Waitlisted'
  | 'Declined'
  | 'Content Required'
  | 'Ready for Production'
  | 'In Queue'
  | 'Design Started'
  | 'Development'
  | 'Internal Review'
  | 'Client Review'
  | 'Revision Requested'
  | 'Revision in Progress'
  | 'Approved for Launch'
  | 'Awaiting Domain'
  | 'Published'
  | 'Maintenance Active'
  | 'Completed'
  | 'Paused'
  | 'Cancelled'

export type PriorityLevel = 'Standard Free' | 'Priority' | 'VIP' | 'Internal' | 'Paused'

export type Profile = {
  id: string
  full_name: string
  email: string
  phone?: string
  role: UserRole
  preferred_contact_method?: string
  city?: string
  state?: string
  country?: string
  timezone?: string
}

export type Business = {
  id: string
  owner_id: string
  business_name: string
  category: string
  description: string
  target_customer?: string
  service_area?: string
  year_established?: string
  employee_count?: string
  current_website?: string
  google_business_url?: string
  social_links?: string[]
}

export type Application = {
  id: string
  applicant_id: string
  business_id: string
  application_number: string
  status: ApplicationStatus
  website_type: string
  primary_goal: string
  requested_pages: string[]
  requested_features: string[]
  style_preferences?: string
  color_preferences?: string
  inspiration_urls?: string[]
  desired_domain?: string
  existing_domain?: string
  hosting_provider?: string
  urgency?: string
  content_ready: boolean
  logo_ready: boolean
  photos_ready: boolean
  copywriting_needed: boolean
  service_interests: string[]
  internal_score?: number
  admin_notes?: string
  submitted_at: string
  approved_at?: string
  demo?: boolean
}

export type QueueEntry = {
  id: string
  application_id: string
  project_id?: string
  queue_number: number
  queue_position: number
  previous_position: number
  priority_level: PriorityLevel
  status: string
  content_ready: boolean
  estimated_start_date: string
  estimated_delivery_date: string
  paused_reason?: string
  last_position_update: string
}

export type ProjectTask = {
  id: string
  project_id: string
  task_name: string
  category: string
  completed: boolean
  client_visible: boolean
  sort_order: number
}

export type Project = {
  id: string
  application_id: string
  client_id: string
  business_id: string
  project_name: string
  assigned_to?: string
  status: ApplicationStatus
  current_stage: string
  start_date?: string
  due_date?: string
  preview_url?: string
  published_url?: string
  domain?: string
  hosting_status?: string
  platform?: string
  allowed_revisions: number
  revisions_used: number
  client_notes?: string
  internal_notes?: string
  tasks?: ProjectTask[]
}

export type Message = {
  id: string
  project_id: string
  sender_id: string
  recipient_id?: string
  message_type: string
  subject: string
  body: string
  attachment_urls?: string[]
  read_at?: string
  created_at: string
}

export type ServiceCatalogItem = {
  id: string
  name: string
  category: string
  description: string
  benefits: string[]
  price_type: 'fixed' | 'monthly' | 'quote'
  starting_price?: number
  monthly_price?: number
  active: boolean
  featured: boolean
}

export type ServiceRequest = {
  id: string
  client_id: string
  project_id?: string
  service_id: string
  status: string
  notes?: string
  quoted_price?: number
  created_at: string
}

export type PremiumLead = {
  id: string
  user_id?: string
  business_id?: string
  project_type: string
  problem_description: string
  required_features: string[]
  target_users: string
  payment_required: boolean
  existing_system?: string
  budget_range: string
  desired_timeline: string
  status: string
  assigned_to?: string
  created_at: string
}

export type PortfolioItem = {
  id: string
  title: string
  industry: string
  description: string
  image_url: string
  website_url: string
  featured: boolean
  published: boolean
}

export type Testimonial = {
  id: string
  client_name: string
  business_name: string
  industry: string
  quote: string
  outcome: string
  website_url?: string
  image_url: string
  approved: boolean
  featured: boolean
}

export type SiteMetric = {
  id: string
  label: string
  value: string
  sort_order: number
}

export type ApplicationDraft = Record<string, unknown> & {
  full_name?: string
  email?: string
  phone?: string
  preferred_contact_method?: string
  city?: string
  state?: string
  country?: string
  timezone?: string
  business_name?: string
  category?: string
  year_established?: string
  description?: string
  target_customer?: string
  service_area?: string
  employee_count?: string
  current_website?: string
  social_links?: string
  google_business_url?: string
  website_type?: string
  primary_goal?: string
  requested_pages?: string[]
  requested_features?: string[]
  style_preferences?: string
  color_preferences?: string
  current_marketing_challenges?: string
  inspiration_urls?: string
  desired_domain?: string
  existing_domain?: string
  hosting_provider?: string
  urgency?: string
  logo_ready?: string
  photos_ready?: string
  content_ready?: string
  copywriting_needed?: string
  need_logo?: string
  need_graphics?: string
  ready_30_days?: string
  authorized_decision_maker?: string
  build_option_interest?: string
  service_interests?: string[]
  agreements?: string[]
  consents?: string[]
}

export type PlatformSnapshot = {
  profiles: Profile[]
  businesses: Business[]
  applications: Application[]
  queueEntries: QueueEntry[]
  projects: Project[]
  messages: Message[]
  services: ServiceCatalogItem[]
  serviceRequests: ServiceRequest[]
  premiumLeads: PremiumLead[]
  portfolio: PortfolioItem[]
  testimonials: Testimonial[]
  metrics: SiteMetric[]
}
