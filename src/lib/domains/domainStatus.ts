import { normalizeHostname } from '../tenants/normalizeHostname'

export type DomainVerificationStatus = 'pending' | 'verified' | 'failed'

export type DomainCheckResult = {
  hostname: string
  status: DomainVerificationStatus
  message: string
}

export function prepareDomainForVerification(hostname: string): DomainCheckResult {
  const normalizedHost = normalizeHostname(hostname)

  if (!normalizedHost.includes('.')) {
    return {
      hostname: normalizedHost,
      status: 'failed',
      message: 'A custom domain must include a valid top-level domain.',
    }
  }

  return {
    hostname: normalizedHost,
    status: 'pending',
    message: 'DNS verification is ready to run once domain records are connected.',
  }
}
