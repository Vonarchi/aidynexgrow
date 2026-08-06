export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type EngineRole =
  | 'super_admin'
  | 'admin'
  | 'project_manager'
  | 'content_editor'
  | 'designer'
  | 'qa_reviewer'
  | 'domain_specialist'
  | 'support_agent'
  | 'client'

export type DatabaseRecord = {
  id: string
  created_at: string
  updated_at?: string
}

export type EngineDatabase = {
  profiles: DatabaseRecord & { email: string; full_name: string; role: EngineRole; is_active: boolean }
  organizations: DatabaseRecord & { legal_name: string; public_name: string; slug: string; status: string }
  websites: DatabaseRecord & { organization_id: string; template_id?: string; status: string; publication_status: string }
  domains: DatabaseRecord & { website_id: string; hostname: string; domain_type: string; verification_status: string }
  website_pages: DatabaseRecord & { website_id: string; title: string; slug: string; page_type: string; status: string }
  website_sections: DatabaseRecord & { website_page_id: string; section_type: string; content: Json; settings: Json }
}
