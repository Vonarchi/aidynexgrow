import { publishWebsiteVersion } from '../../../../lib/publishing/publishWebsiteVersion'

export async function POST(request: Request) {
  const body = await request.json()
  const result = await publishWebsiteVersion({
    websiteId: String(body.websiteId ?? ''),
    versionId: String(body.versionId ?? ''),
    requestedBy: String(body.requestedBy ?? ''),
  })

  return Response.json(result, { status: 202 })
}
