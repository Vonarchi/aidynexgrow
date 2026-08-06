import { websiteSectionSchema } from '../../schemas/sections'
import type { WebsiteSection } from '../../types/sections'

export type SectionValidationResult = {
  valid: boolean
  errors: string[]
}

export function validateWebsiteSection(section: WebsiteSection): SectionValidationResult {
  const result = websiteSectionSchema.safeParse(section)

  if (result.success) {
    return { valid: true, errors: [] }
  }

  return {
    valid: false,
    errors: result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
  }
}
