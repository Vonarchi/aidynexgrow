-- Business Launch Initiative platform schema
-- Demo records are labeled with DEMO DATA text and can be removed before launch.

create extension if not exists pgcrypto;
create schema if not exists private;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  role text not null default 'customer' check (role in ('customer','admin','staff')),
  preferred_contact_method text,
  city text,
  state text,
  country text,
  timezone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role in ('admin','staff'));
$$;

create or replace function private.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, phone, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), new.email, new.raw_user_meta_data->>'phone', 'customer')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function private.handle_new_user();

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  business_name text not null,
  category text not null,
  description text,
  target_customer text,
  service_area text,
  year_established text,
  employee_count text,
  current_website text,
  google_business_url text,
  social_links text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references public.profiles(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  application_number text not null unique,
  status text not null default 'Application Submitted',
  website_type text,
  primary_goal text,
  requested_pages text[] default '{}',
  requested_features text[] default '{}',
  style_preferences text,
  color_preferences text,
  inspiration_urls text[] default '{}',
  desired_domain text,
  existing_domain text,
  hosting_provider text,
  urgency text,
  content_ready boolean not null default false,
  logo_ready boolean not null default false,
  photos_ready boolean not null default false,
  copywriting_needed boolean not null default false,
  service_interests text[] default '{}',
  internal_score int,
  admin_notes text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references public.applications(id) on delete set null,
  client_id uuid not null references public.profiles(id) on delete cascade,
  business_id uuid references public.businesses(id) on delete set null,
  project_name text not null,
  assigned_to uuid references public.profiles(id) on delete set null,
  status text not null default 'Ready for Production',
  current_stage text not null default 'Content',
  start_date date,
  due_date date,
  preview_url text,
  published_url text,
  domain text,
  hosting_status text,
  platform text,
  allowed_revisions int not null default 1,
  revisions_used int not null default 0,
  client_notes text,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.queue_entries (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  queue_number int not null unique,
  queue_position int not null,
  previous_position int not null,
  priority_level text not null default 'Standard Free' check (priority_level in ('Standard Free','Priority','VIP','Internal','Paused')),
  status text not null default 'Approved',
  content_ready boolean not null default false,
  estimated_start_date date,
  estimated_delivery_date date,
  paused_reason text,
  last_position_update timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  task_name text not null,
  category text,
  completed boolean not null default false,
  completed_at timestamptz,
  assigned_to uuid references public.profiles(id) on delete set null,
  sort_order int not null default 0,
  client_visible boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  uploaded_by uuid not null references public.profiles(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  file_type text,
  category text,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid references public.profiles(id) on delete set null,
  message_type text not null default 'General',
  subject text,
  body text not null,
  attachment_urls text[] default '{}',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.revision_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  revision_round int not null default 1,
  client_notes text not null,
  status text not null default 'Submitted',
  submitted_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.service_catalog (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text,
  benefits text[] default '{}',
  price_type text not null default 'quote' check (price_type in ('fixed','monthly','quote')),
  starting_price numeric,
  monthly_price numeric,
  active boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  service_id uuid references public.service_catalog(id) on delete set null,
  status text not null default 'Requested',
  notes text,
  quoted_price numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  plan_name text not null,
  status text not null default 'pending',
  monthly_amount numeric,
  stripe_customer_id text,
  stripe_subscription_id text,
  start_date date,
  renewal_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.premium_leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  business_id uuid references public.businesses(id) on delete set null,
  project_type text not null,
  problem_description text not null,
  required_features text[] default '{}',
  target_users text,
  payment_required boolean not null default false,
  existing_system text,
  budget_range text,
  desired_timeline text,
  status text not null default 'New',
  assigned_to uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  business_name text not null,
  industry text,
  quote text not null,
  outcome text,
  website_url text,
  image_url text,
  approved boolean not null default false,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  industry text,
  description text,
  image_url text,
  website_url text,
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.site_metrics (
  id uuid primary key default gen_random_uuid(),
  label text not null unique,
  value text not null,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

create or replace function private.log_queue_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' and (old.queue_position is distinct from new.queue_position or old.priority_level is distinct from new.priority_level or old.status is distinct from new.status) then
    insert into public.activity_logs(user_id, action, entity_type, entity_id, metadata)
    values (auth.uid(), 'queue_updated', 'queue_entries', new.id, jsonb_build_object('old_position', old.queue_position, 'new_position', new.queue_position, 'old_status', old.status, 'new_status', new.status));
  end if;
  return new;
end;
$$;

drop trigger if exists queue_change_audit on public.queue_entries;
create trigger queue_change_audit after update on public.queue_entries for each row execute function private.log_queue_change();

create index if not exists idx_applications_applicant on public.applications(applicant_id);
create index if not exists idx_queue_position on public.queue_entries(queue_position);
create index if not exists idx_projects_client on public.projects(client_id);
create index if not exists idx_messages_project on public.messages(project_id);

-- updated_at triggers
create trigger set_profiles_updated_at before update on public.profiles for each row execute function private.set_updated_at();
create trigger set_businesses_updated_at before update on public.businesses for each row execute function private.set_updated_at();
create trigger set_applications_updated_at before update on public.applications for each row execute function private.set_updated_at();
create trigger set_queue_updated_at before update on public.queue_entries for each row execute function private.set_updated_at();
create trigger set_projects_updated_at before update on public.projects for each row execute function private.set_updated_at();
create trigger set_service_catalog_updated_at before update on public.service_catalog for each row execute function private.set_updated_at();
create trigger set_service_requests_updated_at before update on public.service_requests for each row execute function private.set_updated_at();
create trigger set_subscriptions_updated_at before update on public.subscriptions for each row execute function private.set_updated_at();
create trigger set_premium_leads_updated_at before update on public.premium_leads for each row execute function private.set_updated_at();

alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.applications enable row level security;
alter table public.queue_entries enable row level security;
alter table public.projects enable row level security;
alter table public.project_tasks enable row level security;
alter table public.project_files enable row level security;
alter table public.messages enable row level security;
alter table public.revision_requests enable row level security;
alter table public.service_catalog enable row level security;
alter table public.service_requests enable row level security;
alter table public.subscriptions enable row level security;
alter table public.premium_leads enable row level security;
alter table public.testimonials enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.site_metrics enable row level security;
alter table public.activity_logs enable row level security;

-- Public marketing content
create policy "Public can read published portfolio" on public.portfolio_items for select to anon, authenticated using (published = true);
create policy "Public can read approved testimonials" on public.testimonials for select to anon, authenticated using (approved = true);
create policy "Public can read active services" on public.service_catalog for select to anon, authenticated using (active = true);
create policy "Public can read site metrics" on public.site_metrics for select to anon, authenticated using (true);

-- Admin access policies
create policy "Admins manage profiles" on public.profiles for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Admins manage businesses" on public.businesses for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Admins manage applications" on public.applications for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Admins manage queue" on public.queue_entries for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Admins manage projects" on public.projects for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Admins manage project tasks" on public.project_tasks for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Admins manage project files" on public.project_files for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Admins manage messages" on public.messages for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Admins manage revisions" on public.revision_requests for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Admins manage services" on public.service_catalog for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Admins manage service requests" on public.service_requests for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Admins manage subscriptions" on public.subscriptions for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Admins manage premium leads" on public.premium_leads for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Admins manage testimonials" on public.testimonials for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Admins manage portfolio" on public.portfolio_items for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Admins manage site metrics" on public.site_metrics for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Admins read audit log" on public.activity_logs for select to authenticated using (private.is_admin());

-- Customer scoped policies
create policy "Users read own profile" on public.profiles for select to authenticated using (id = auth.uid());
create policy "Users update own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid() and role = private.current_user_role());
create policy "Users create own profile" on public.profiles for insert to authenticated with check (id = auth.uid() and role = 'customer');

create policy "Users manage own businesses" on public.businesses for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "Users manage own applications" on public.applications for all to authenticated using (applicant_id = auth.uid()) with check (applicant_id = auth.uid());
create policy "Users read own queue" on public.queue_entries for select to authenticated using (exists(select 1 from public.applications a where a.id = application_id and a.applicant_id = auth.uid()));
create policy "Users read own projects" on public.projects for select to authenticated using (client_id = auth.uid());
create policy "Users update client fields on own projects" on public.projects for update to authenticated using (client_id = auth.uid()) with check (client_id = auth.uid());
create policy "Users read visible own tasks" on public.project_tasks for select to authenticated using (client_visible and exists(select 1 from public.projects p where p.id = project_id and p.client_id = auth.uid()));
create policy "Users manage own project files" on public.project_files for all to authenticated using (uploaded_by = auth.uid() or exists(select 1 from public.projects p where p.id = project_id and p.client_id = auth.uid())) with check (uploaded_by = auth.uid());
create policy "Users read own messages" on public.messages for select to authenticated using (sender_id = auth.uid() or recipient_id = auth.uid() or exists(select 1 from public.projects p where p.id = project_id and p.client_id = auth.uid()));
create policy "Users send messages on own projects" on public.messages for insert to authenticated with check (sender_id = auth.uid() and exists(select 1 from public.projects p where p.id = project_id and p.client_id = auth.uid()));
create policy "Users manage own revision requests" on public.revision_requests for all to authenticated using (exists(select 1 from public.projects p where p.id = project_id and p.client_id = auth.uid())) with check (exists(select 1 from public.projects p where p.id = project_id and p.client_id = auth.uid()));
create policy "Users manage own service requests" on public.service_requests for all to authenticated using (client_id = auth.uid()) with check (client_id = auth.uid());
create policy "Users read own subscriptions" on public.subscriptions for select to authenticated using (client_id = auth.uid());
create policy "Users create premium leads" on public.premium_leads for insert to authenticated with check (user_id = auth.uid() or user_id is null);
create policy "Users read own premium leads" on public.premium_leads for select to authenticated using (user_id = auth.uid());

insert into public.site_metrics(label, value, sort_order) values
  ('weekly_spots_remaining','12',1),
  ('websites_delivered','37',2),
  ('currently_being_built','18',3),
  ('approved_applications','126',4),
  ('average_turnaround','5-10 business days',5),
  ('current_queue_length','42',6)
on conflict (label) do update set value = excluded.value, sort_order = excluded.sort_order;

insert into public.service_catalog(name, category, description, benefits, price_type, starting_price, monthly_price, active, featured) values
  ('Managed Hosting','Hosting','DEMO DATA: Secure hosting, SSL, backups, uptime monitoring, and launch support.',array['SSL included','Daily backups','Standard support'],'monthly',null,39,true,true),
  ('Business Care','Maintenance','DEMO DATA: Hosting plus monthly updates, security monitoring, and minor content changes.',array['Priority support','Monthly changes','Security checks'],'monthly',null,149,true,true),
  ('Business Growth','Growth','DEMO DATA: Conversion improvements, SEO monitoring, analytics, and automation support.',array['Strategy review','SEO monitoring','Automation guidance'],'monthly',null,399,true,true),
  ('Additional Pages','Website Upgrade','DEMO DATA: Add extra service pages, landing pages, menus, galleries, or location pages.',array['Expanded content','SEO-friendly sections','Clearer offers'],'fixed',150,null,true,false),
  ('Custom Copywriting','Content','DEMO DATA: Professional website copy for your offer, audience, and market.',array['Stronger messaging','Less client workload','Conversion focused'],'fixed',450,null,true,false),
  ('AI Chatbot','Automation','DEMO DATA: Answer FAQs, qualify leads, and route requests automatically.',array['24/7 answers','Lead capture','Reduced admin work'],'quote',null,null,true,true),
  ('Customer Portal','Custom Software','DEMO DATA: Secure portal for customers, bookings, files, payments, or status tracking.',array['Self-service access','Operational visibility','Custom workflows'],'quote',null,null,true,true),
  ('Mobile Application','Custom Software','DEMO DATA: iOS and Android app planning, design, and build.',array['Mobile workflows','Push notifications','Native feel'],'quote',null,null,true,false);

insert into public.portfolio_items(title, industry, description, image_url, website_url, featured, published) values
  ('Summit Legal Group','Professional services','DEMO DATA: Conversion-focused small business website with mobile-first layout and lead capture.','https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80','/demo-sites/summit-legal-group/home',true,true),
  ('Ember Table Kitchen','Restaurants','DEMO DATA: Restaurant website with menu, location, and inquiry funnel.','https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80','/demo-sites/ember-table-kitchen/home',true,true),
  ('Luxe Bloom Studio','Beauty and wellness','DEMO DATA: Salon website with gallery, services, and appointment CTA.','https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80','/demo-sites/luxe-bloom-studio/home',true,true),
  ('Ironclad Roofing','Contractors','DEMO DATA: Contractor website with project gallery and quote request.','https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80','/demo-sites/ironclad-roofing/home',false,true),
  ('Harbor Hope Center','Nonprofits','DEMO DATA: Nonprofit website with donation and volunteer CTAs.','https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80','/demo-sites/harbor-hope-center/home',false,true),
  ('BrightPath Coaching','Coaches','DEMO DATA: Coaching website with booking and testimonials.','https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=900&q=80','/demo-sites/brightpath-coaching/home',false,true),
  ('ArcTemp HVAC','Contractors','Engineered HVAC website for residential and commercial heating, cooling, emergency repair, and maintenance services.','https://arctemphvac.com/assets/hero-bg-C6bAi7fK.jpg','https://arctemphvac.com/',true,true),
  ('CubChatter','Education','Photo flashcard learning app for toddlers and preschoolers with parent and admin areas.','https://image.thum.io/get/width/1200/crop/700/https://cubchatter.com/','https://cubchatter.com/',true,true),
  ('Certifia','Healthcare','Nurse exam prep platform for NCLEX, HESI, and NP practice with quizzes, rationales, and progress tracking.','https://image.thum.io/get/width/1200/crop/700/https://certifia.co/','https://certifia.co/',true,true),
  ('ChartReadi','Education','Trading preparation app with daily reset rituals and market readiness workflows.','https://image.thum.io/get/width/1200/crop/700/https://chartreadi.com/','https://chartreadi.com/',false,true),
  ('ContentCracker','Professional services','Marketing command center experience with account access and campaign workspace positioning.','https://image.thum.io/get/width/1200/crop/700/https://contentcracker.io/','https://contentcracker.io/',false,true),
  ('Books Up Network','Education','Community education platform focused on knowledge, creativity, empowerment, resources, and digital innovation.','https://image.thum.io/get/width/1200/crop/700/https://booksupnetwork.com/','https://booksupnetwork.com/',false,true),
  ('YouTubePays','Education','Creator monetization resource with earnings calculators, platform education, course offers, and creator tools.','https://image.thum.io/get/width/1200/crop/700/https://youtubepays.com/','https://youtubepays.com/',false,true);

insert into public.testimonials(client_name, business_name, industry, quote, outcome, image_url, approved, featured) values
  ('Maya Thompson','Luxe Bloom Studio','Beauty and Wellness','DEMO TESTIMONIAL: The site helped us look established before our grand opening.','23 inquiry requests in the first month','https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=500&q=80',true,true),
  ('Marcus Reed','Ironclad Roofing','Contractors','DEMO TESTIMONIAL: Customers finally had one place to see our work and request quotes.','Quote form became their top lead source','https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=500&q=80',true,true),
  ('Nia Brooks','Harbor Hope Center','Nonprofits','DEMO TESTIMONIAL: The website made it easier for donors and volunteers to understand our mission.','Volunteer submissions increased','https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=500&q=80',true,true),
  ('Evan Carter','BrightPath Coaching','Coaches','DEMO TESTIMONIAL: I stopped sending people to scattered social profiles.','Bookings consolidated into one funnel','https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=500&q=80',true,false);

insert into storage.buckets (id, name, public) values ('project-files', 'project-files', false) on conflict (id) do nothing;

create policy "Users upload project files in own folder" on storage.objects for insert to authenticated with check (bucket_id = 'project-files' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users read own uploaded files" on storage.objects for select to authenticated using (bucket_id = 'project-files' and ((storage.foldername(name))[1] = auth.uid()::text or private.is_admin()));
create policy "Users update own uploaded files" on storage.objects for update to authenticated using (bucket_id = 'project-files' and (storage.foldername(name))[1] = auth.uid()::text) with check (bucket_id = 'project-files' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Admins manage all project files" on storage.objects for all to authenticated using (bucket_id = 'project-files' and private.is_admin()) with check (bucket_id = 'project-files' and private.is_admin());
