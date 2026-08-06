import { prepareDomainForVerification } from '../../../../lib/domains/domainStatus'

export async function POST(request: Request) {
  const body = await request.json()
  const result = prepareDomainForVerification(String(body.hostname ?? ''))

  return Response.json(result, { status: result.status === 'failed' ? 400 : 202 })
}
