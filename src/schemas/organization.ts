import { z } from 'zod'

export const organizationSchema = z.object({
  legal_name: z.string().min(1),
  public_name: z.string().min(1),
  slug: z.string().min(1),
  status: z.enum(['lead', 'active', 'paused', 'archived']),
  primary_contact_name: z.string().optional(),
  primary_contact_email: z.string().email().optional(),
  primary_contact_phone: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(2),
  service_areas: z.array(z.string()).default([]),
})

export type OrganizationInput = z.infer<typeof organizationSchema>
