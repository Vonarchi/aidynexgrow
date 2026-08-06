export type PublishWebsiteVersionInput = {
  websiteId: string
  versionId: string
  requestedBy: string
}

export type PublishWebsiteVersionResult = {
  publicationId: string
  websiteId: string
  versionId: string
  status: 'queued'
}

export async function publishWebsiteVersion(input: PublishWebsiteVersionInput): Promise<PublishWebsiteVersionResult> {
  return {
    publicationId: `pub-${input.websiteId}-${Date.now()}`,
    websiteId: input.websiteId,
    versionId: input.versionId,
    status: 'queued',
  }
}
