import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.110.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

type ApplicationDraft = Record<string, unknown>

function text(value: unknown, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

function textList(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => text(item)).filter(Boolean)
  return text(value).split('\n').map((item) => item.trim()).filter(Boolean)
}

function boolFromYes(value: unknown) {
  return text(value).toLowerCase() === 'yes'
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function findExistingUserByEmail(supabaseAdmin: ReturnType<typeof createClient>, email: string) {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 })
  if (error) throw error
  return data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase())
}

async function findOrCreateApplicant(supabaseAdmin: ReturnType<typeof createClient>, draft: ApplicationDraft) {
  const email = text(draft.email).toLowerCase()
  if (!email) throw new Error('Email address is required.')

  const fullName = text(draft.full_name, 'New Applicant')
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      phone: text(draft.phone),
    },
  })

  if (data.user) return data.user
  if (!error) throw new Error('Unable to create applicant account.')

  const existingUser = await findExistingUserByEmail(supabaseAdmin, email)
  if (existingUser) return existingUser
  throw error
}

async function sendEmail({ to, subject, html, textBody }: { to: string; subject: string; html: string; textBody: string }) {
  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  const fromEmail = Deno.env.get('RESEND_FROM_EMAIL')
  if (!resendApiKey || !fromEmail) return { skipped: true }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to,
      subject,
      html,
      text: textBody,
    }),
  })

  if (!response.ok) {
    const message = await response.text()
    console.error('Resend email failed:', message)
    return { skipped: false, error: message }
  }

  return { skipped: false }
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405)

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !serviceRoleKey) throw new Error('Supabase function environment is not configured.')

    const { draft } = await request.json() as { draft?: ApplicationDraft }
    if (!draft) throw new Error('Application draft is required.')

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const applicant = await findOrCreateApplicant(supabaseAdmin, draft)
    const applicantId = applicant.id
    const businessId = crypto.randomUUID()
    const applicationId = crypto.randomUUID()
    const applicationNumber = `BLI-${Math.floor(10000 + Math.random() * 89999)}`
    const submittedAt = new Date().toISOString()

    const profile = {
      id: applicantId,
      full_name: text(draft.full_name, 'New Applicant'),
      email: text(draft.email).toLowerCase(),
      phone: text(draft.phone) || null,
      role: 'customer',
      preferred_contact_method: text(draft.preferred_contact_method) || null,
      city: text(draft.city) || null,
      state: text(draft.state) || null,
      country: text(draft.country) || null,
      timezone: text(draft.timezone) || null,
    }

    const business = {
      id: businessId,
      owner_id: applicantId,
      business_name: text(draft.business_name, 'New Business'),
      category: text(draft.category, 'Small Business'),
      description: text(draft.description),
      target_customer: text(draft.target_customer) || null,
      service_area: text(draft.service_area) || null,
      year_established: text(draft.year_established) || null,
      employee_count: text(draft.employee_count) || null,
      current_website: text(draft.current_website) || null,
      google_business_url: text(draft.google_business_url) || null,
      social_links: textList(draft.social_links),
    }

    const application = {
      id: applicationId,
      applicant_id: applicantId,
      business_id: businessId,
      application_number: applicationNumber,
      status: 'Application Submitted',
      website_type: text(draft.website_type, 'Business website'),
      primary_goal: text(draft.primary_goal, 'Attract customers and generate leads'),
      requested_pages: textList(draft.requested_pages),
      requested_features: textList(draft.requested_features),
      style_preferences: text(draft.style_preferences) || null,
      color_preferences: text(draft.color_preferences) || null,
      inspiration_urls: textList(draft.inspiration_urls),
      desired_domain: text(draft.desired_domain) || null,
      existing_domain: text(draft.existing_domain) || null,
      hosting_provider: text(draft.hosting_provider) || null,
      urgency: text(draft.urgency) || null,
      content_ready: boolFromYes(draft.content_ready),
      logo_ready: boolFromYes(draft.logo_ready),
      photos_ready: boolFromYes(draft.photos_ready),
      copywriting_needed: boolFromYes(draft.copywriting_needed),
      service_interests: [text(draft.build_option_interest), ...textList(draft.service_interests)].filter(Boolean),
      admin_notes: [
        text(draft.current_marketing_challenges) ? `Current marketing challenges: ${text(draft.current_marketing_challenges)}` : '',
        text(draft.ready_30_days) ? `Ready within 30 days: ${text(draft.ready_30_days)}` : '',
        text(draft.authorized_decision_maker) ? `Authorized decision maker: ${text(draft.authorized_decision_maker)}` : '',
      ].filter(Boolean).join('\n'),
      submitted_at: submittedAt,
    }

    const { error: profileError } = await supabaseAdmin.from('profiles').upsert(profile)
    if (profileError) throw profileError

    const { error: businessError } = await supabaseAdmin.from('businesses').insert(business)
    if (businessError) throw businessError

    const { error: applicationError } = await supabaseAdmin.from('applications').insert(application)
    if (applicationError) throw applicationError

    await sendEmail({
      to: profile.email,
      subject: 'Your Business Launch application was received',
      html: `<p>Hi ${profile.full_name},</p><p>We received your Business Launch Initiative application for ${business.business_name}.</p><p>Your reference number is <strong>${applicationNumber}</strong>.</p><p>Our team will review your application and prepare your Business Growth Assessment.</p>`,
      textBody: `Hi ${profile.full_name},\n\nWe received your Business Launch Initiative application for ${business.business_name}.\n\nReference number: ${applicationNumber}\n\nOur team will review your application and prepare your Business Growth Assessment.`,
    })

    const adminEmail = Deno.env.get('ADMIN_NOTIFICATION_EMAIL')
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: `New Business Launch application: ${business.business_name}`,
        html: `<p>A new application was submitted.</p><p><strong>${business.business_name}</strong><br>${profile.full_name}<br>${profile.email}<br>${profile.phone ?? ''}</p><p>Reference: <strong>${applicationNumber}</strong></p>`,
        textBody: `A new application was submitted.\n\nBusiness: ${business.business_name}\nApplicant: ${profile.full_name}\nEmail: ${profile.email}\nPhone: ${profile.phone ?? ''}\nReference: ${applicationNumber}`,
      })
    }

    return jsonResponse({ application, queuePosition: 42, estimatedReviewTime: '1-2 business days' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Application submission failed.'
    console.error(message)
    return jsonResponse({ error: message }, 400)
  }
})
