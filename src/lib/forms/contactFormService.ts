export type ContactFormSubmissionInput = {
  websiteId: string
  name: string
  email: string
  phone?: string
  message: string
  sourcePath: string
}

export type ContactFormSubmissionResult = {
  id: string
  status: 'accepted'
}

export async function createContactFormSubmission(input: ContactFormSubmissionInput): Promise<ContactFormSubmissionResult> {
  if (!input.name || !input.email || !input.message) {
    throw new Error('Name, email, and message are required.')
  }

  return {
    id: `contact-${input.websiteId}-${Date.now()}`,
    status: 'accepted',
  }
}
