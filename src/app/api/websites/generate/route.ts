import { generateWebsiteDraft } from '../../../../lib/generation/generateWebsiteDraft'

export async function POST(request: Request) {
  const body = await request.json()
  const draft = await generateWebsiteDraft({
    templateSlug: String(body.templateSlug ?? 'hvac'),
    organizationName: String(body.organizationName ?? 'New Business'),
    phone: String(body.phone ?? ''),
    email: String(body.email ?? 'client@example.com'),
    city: String(body.city ?? ''),
    state: String(body.state ?? ''),
    serviceAreas: Array.isArray(body.serviceAreas) ? body.serviceAreas.map(String) : [],
  })

  return Response.json({ draft })
}
