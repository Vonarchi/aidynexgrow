import { WebsitePageRenderer } from '../../../components/website-renderer/WebsitePageRenderer'
import { getPublishedWebsitePageByHostname } from '../../../lib/publishing/getPublishedWebsitePageByHostname'

type PublicSitePageProps = {
  params?: {
    path?: string[]
  }
}

export default async function PublicSitePage({ params }: PublicSitePageProps) {
  const hostname = typeof window === 'undefined' ? 'preview.aidynex.local' : window.location.hostname
  const pathname = `/${params?.path?.join('/') ?? ''}`.replace(/\/$/, '') || '/'
  const websitePage = await getPublishedWebsitePageByHostname(hostname, pathname)

  return <WebsitePageRenderer websitePage={websitePage} />
}
