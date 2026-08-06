create extension if not exists pgcrypto;

do $$
begin
  create type public.engine_role as enum (
    'super_admin',
    'admin',
    'project_manager',
    'content_editor',
    'designer',
    'qa_reviewer',
    'domain_specialist',
    'support_agent',
    'client'
  );
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.engine_website_status as enum (
    'onboarding',
    'waiting_for_content',
    'ready_for_build',
    'building',
    'internal_review',
    'client_review',
    'revisions',
    'ready_to_publish',
    'published',
    'paused',
    'archived'
  );
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.engine_publication_status as enum ('draft', 'preview', 'published', 'unpublished');
exception when duplicate_object then null;
end $$;

create table if not exists public.engine_organizations (
  id uuid primary key default gen_random_uuid(),
  legal_name text not null,
  public_name text not null,
  slug text not null unique,
  status text not null default 'lead',
  primary_contact_name text,
  primary_contact_email text,
  primary_contact_phone text,
  city text,
  state text,
  service_areas text[] not null default '{}',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.engine_organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.engine_organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.engine_role not null default 'client',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table if not exists public.engine_website_templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  industry text not null,
  name text not null,
  description text,
  version integer not null default 1,
  status text not null default 'draft',
  thumbnail_url text,
  preview_url text,
  default_theme jsonb not null default '{}',
  default_navigation jsonb not null default '[]',
  supported_section_types text[] not null default '{}',
  schema_version text not null default 'phase-1',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug, version)
);

create table if not exists public.engine_websites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.engine_organizations(id) on delete cascade,
  template_id uuid references public.engine_website_templates(id) on delete set null,
  name text not null,
  slug text not null,
  status public.engine_website_status not null default 'onboarding',
  publication_status public.engine_publication_status not null default 'draft',
  theme_overrides jsonb not null default '{}',
  feature_flags jsonb not null default '{}',
  published_version_id uuid,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table if not exists public.engine_domains (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.engine_websites(id) on delete cascade,
  hostname text not null unique,
  domain_type text not null default 'custom',
  is_primary boolean not null default false,
  verification_status text not null default 'pending',
  ssl_status text not null default 'pending',
  dns_records jsonb not null default '[]',
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.engine_website_pages (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.engine_websites(id) on delete cascade,
  title text not null,
  slug text not null,
  page_type text not null default 'standard',
  status public.engine_publication_status not null default 'draft',
  seo_title text,
  seo_description text,
  og_image_url text,
  structured_data jsonb not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (website_id, slug)
);

create table if not exists public.engine_website_sections (
  id uuid primary key default gen_random_uuid(),
  website_page_id uuid not null references public.engine_website_pages(id) on delete cascade,
  parent_section_id uuid references public.engine_website_sections(id) on delete cascade,
  section_type text not null,
  variant text not null default 'default',
  sort_order integer not null default 0,
  content jsonb not null default '{}',
  settings jsonb not null default '{}',
  visibility_rules jsonb not null default '{}',
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.engine_navigation_items (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.engine_websites(id) on delete cascade,
  label text not null,
  href text not null,
  parent_id uuid references public.engine_navigation_items(id) on delete cascade,
  sort_order integer not null default 0,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.engine_forms (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.engine_websites(id) on delete cascade,
  name text not null,
  form_type text not null default 'contact',
  schema jsonb not null default '{}',
  notification_settings jsonb not null default '{}',
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.engine_form_submissions (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.engine_forms(id) on delete cascade,
  website_id uuid not null references public.engine_websites(id) on delete cascade,
  payload jsonb not null,
  source_path text not null default '/',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.engine_website_versions (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.engine_websites(id) on delete cascade,
  version_number integer not null,
  snapshot jsonb not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (website_id, version_number)
);

alter table public.engine_websites
  add constraint engine_websites_published_version_id_fkey
  foreign key (published_version_id) references public.engine_website_versions(id) on delete set null;

create table if not exists public.engine_publication_events (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.engine_websites(id) on delete cascade,
  version_id uuid references public.engine_website_versions(id) on delete set null,
  event_type text not null,
  status text not null default 'queued',
  message text,
  metadata jsonb not null default '{}',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.engine_qa_checks (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.engine_websites(id) on delete cascade,
  version_id uuid references public.engine_website_versions(id) on delete cascade,
  check_type text not null,
  status text not null default 'pending',
  severity text not null default 'warning',
  message text,
  metadata jsonb not null default '{}',
  checked_by uuid references auth.users(id) on delete set null,
  checked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.engine_feature_flags (
  id uuid primary key default gen_random_uuid(),
  website_id uuid references public.engine_websites(id) on delete cascade,
  flag_key text not null,
  is_enabled boolean not null default false,
  settings jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (website_id, flag_key)
);

create index if not exists engine_organization_members_user_idx on public.engine_organization_members(user_id);
create index if not exists engine_websites_organization_idx on public.engine_websites(organization_id);
create index if not exists engine_domains_website_idx on public.engine_domains(website_id);
create index if not exists engine_pages_website_idx on public.engine_website_pages(website_id);
create index if not exists engine_sections_page_order_idx on public.engine_website_sections(website_page_id, sort_order);
create index if not exists engine_navigation_website_idx on public.engine_navigation_items(website_id);
create index if not exists engine_forms_website_idx on public.engine_forms(website_id);
create index if not exists engine_submissions_website_idx on public.engine_form_submissions(website_id, created_at desc);
create index if not exists engine_versions_website_idx on public.engine_website_versions(website_id, version_number desc);
create index if not exists engine_publication_events_website_idx on public.engine_publication_events(website_id, created_at desc);
create index if not exists engine_qa_checks_website_idx on public.engine_qa_checks(website_id, status);

create trigger set_engine_organizations_updated_at before update on public.engine_organizations for each row execute function private.set_updated_at();
create trigger set_engine_organization_members_updated_at before update on public.engine_organization_members for each row execute function private.set_updated_at();
create trigger set_engine_website_templates_updated_at before update on public.engine_website_templates for each row execute function private.set_updated_at();
create trigger set_engine_websites_updated_at before update on public.engine_websites for each row execute function private.set_updated_at();
create trigger set_engine_domains_updated_at before update on public.engine_domains for each row execute function private.set_updated_at();
create trigger set_engine_website_pages_updated_at before update on public.engine_website_pages for each row execute function private.set_updated_at();
create trigger set_engine_website_sections_updated_at before update on public.engine_website_sections for each row execute function private.set_updated_at();
create trigger set_engine_navigation_items_updated_at before update on public.engine_navigation_items for each row execute function private.set_updated_at();
create trigger set_engine_forms_updated_at before update on public.engine_forms for each row execute function private.set_updated_at();
create trigger set_engine_feature_flags_updated_at before update on public.engine_feature_flags for each row execute function private.set_updated_at();

alter table public.engine_organizations enable row level security;
alter table public.engine_organization_members enable row level security;
alter table public.engine_website_templates enable row level security;
alter table public.engine_websites enable row level security;
alter table public.engine_domains enable row level security;
alter table public.engine_website_pages enable row level security;
alter table public.engine_website_sections enable row level security;
alter table public.engine_navigation_items enable row level security;
alter table public.engine_forms enable row level security;
alter table public.engine_form_submissions enable row level security;
alter table public.engine_website_versions enable row level security;
alter table public.engine_publication_events enable row level security;
alter table public.engine_qa_checks enable row level security;
alter table public.engine_feature_flags enable row level security;

create policy "Engine admins can manage organizations"
  on public.engine_organizations for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('super_admin', 'admin'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('super_admin', 'admin'));

create policy "Organization members can read their organizations"
  on public.engine_organizations for select
  using (
    exists (
      select 1
      from public.engine_organization_members members
      where members.organization_id = engine_organizations.id
        and members.user_id = auth.uid()
        and members.is_active
    )
  );

create policy "Engine admins can manage all organization members"
  on public.engine_organization_members for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('super_admin', 'admin'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('super_admin', 'admin'));

create policy "Organization members can read sibling memberships"
  on public.engine_organization_members for select
  using (
    user_id = auth.uid()
    or exists (
      select 1
      from public.engine_organization_members self_membership
      where self_membership.organization_id = engine_organization_members.organization_id
        and self_membership.user_id = auth.uid()
        and self_membership.is_active
    )
  );

create policy "Published templates are readable"
  on public.engine_website_templates for select
  using (status = 'active' or (auth.jwt() -> 'app_metadata' ->> 'role') in ('super_admin', 'admin', 'project_manager', 'content_editor', 'designer'));

create policy "Engine admins can manage templates"
  on public.engine_website_templates for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('super_admin', 'admin'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('super_admin', 'admin'));

create policy "Organization members can read website records"
  on public.engine_websites for select
  using (
    exists (
      select 1
      from public.engine_organization_members members
      where members.organization_id = engine_websites.organization_id
        and members.user_id = auth.uid()
        and members.is_active
    )
    or (auth.jwt() -> 'app_metadata' ->> 'role') in ('super_admin', 'admin', 'project_manager', 'content_editor', 'designer', 'qa_reviewer', 'domain_specialist', 'support_agent')
  );

create policy "Engine staff can manage websites"
  on public.engine_websites for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('super_admin', 'admin', 'project_manager', 'content_editor', 'designer'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('super_admin', 'admin', 'project_manager', 'content_editor', 'designer'));

create policy "Public can read published domains"
  on public.engine_domains for select
  using (verification_status = 'verified');

create policy "Engine staff can manage domains"
  on public.engine_domains for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('super_admin', 'admin', 'domain_specialist'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('super_admin', 'admin', 'domain_specialist'));

create policy "Public can read published pages"
  on public.engine_website_pages for select
  using (status = 'published');

create policy "Public can read enabled published sections"
  on public.engine_website_sections for select
  using (
    is_enabled
    and exists (
      select 1 from public.engine_website_pages pages
      where pages.id = engine_website_sections.website_page_id
        and pages.status = 'published'
    )
  );

create policy "Public can read enabled navigation"
  on public.engine_navigation_items for select
  using (is_enabled);

create policy "Public can read enabled forms"
  on public.engine_forms for select
  using (is_enabled);

create policy "Anyone can submit enabled public forms"
  on public.engine_form_submissions for insert
  with check (
    exists (
      select 1 from public.engine_forms forms
      where forms.id = engine_form_submissions.form_id
        and forms.website_id = engine_form_submissions.website_id
        and forms.is_enabled
    )
  );

create policy "Engine staff can manage website content"
  on public.engine_website_pages for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('super_admin', 'admin', 'project_manager', 'content_editor', 'designer'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('super_admin', 'admin', 'project_manager', 'content_editor', 'designer'));

create policy "Engine staff can manage sections"
  on public.engine_website_sections for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('super_admin', 'admin', 'project_manager', 'content_editor', 'designer'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('super_admin', 'admin', 'project_manager', 'content_editor', 'designer'));

create policy "Engine staff can manage remaining engine records"
  on public.engine_navigation_items for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('super_admin', 'admin', 'project_manager', 'content_editor', 'designer'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('super_admin', 'admin', 'project_manager', 'content_editor', 'designer'));

create policy "Engine staff can manage forms"
  on public.engine_forms for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('super_admin', 'admin', 'project_manager', 'content_editor'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('super_admin', 'admin', 'project_manager', 'content_editor'));

create policy "Engine staff can read submissions"
  on public.engine_form_submissions for select
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('super_admin', 'admin', 'project_manager', 'support_agent'));

create policy "Engine staff can manage versions"
  on public.engine_website_versions for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('super_admin', 'admin', 'project_manager', 'content_editor', 'designer'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('super_admin', 'admin', 'project_manager', 'content_editor', 'designer'));

create policy "Engine staff can manage publication events"
  on public.engine_publication_events for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('super_admin', 'admin', 'project_manager'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('super_admin', 'admin', 'project_manager'));

create policy "Engine staff can manage QA"
  on public.engine_qa_checks for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('super_admin', 'admin', 'project_manager', 'qa_reviewer'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('super_admin', 'admin', 'project_manager', 'qa_reviewer'));

create policy "Engine staff can manage feature flags"
  on public.engine_feature_flags for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('super_admin', 'admin'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('super_admin', 'admin'));

insert into storage.buckets (id, name, public)
values
  ('engine-public-assets', 'engine-public-assets', true),
  ('engine-private-uploads', 'engine-private-uploads', false)
on conflict (id) do nothing;
