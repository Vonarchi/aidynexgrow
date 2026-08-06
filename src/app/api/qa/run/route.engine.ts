import { runWebsiteQa } from '../../../../lib/qa/runWebsiteQa'
import { resolveTenantByHostname } from '../../../../lib/tenants/resolveTenant'

export async function POST(request: Request) {
  const body = await request.json()
  const tenant = await resolveTenantByHostname(String(body.hostname ?? 'preview.aidynex.local'))

  if (!tenant) {
    return Response.json({ error: 'Tenant not found.' }, { status: 404 })
  }

  return Response.json({ checks: runWebsiteQa(tenant) })
}
