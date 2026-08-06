import { createContactFormSubmission } from '../../../../lib/forms/contactFormService'

export async function POST(request: Request) {
  const body = await request.json()
  const result = await createContactFormSubmission({
    websiteId: String(body.websiteId ?? ''),
    name: String(body.name ?? ''),
    email: String(body.email ?? ''),
    phone: body.phone ? String(body.phone) : undefined,
    message: String(body.message ?? ''),
    sourcePath: String(body.sourcePath ?? '/'),
  })

  return Response.json(result, { status: 201 })
}
