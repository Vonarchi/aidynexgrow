import { z } from 'zod'
import { websiteSectionSchema } from './sections'

export const tenantThemeSchema = z.object({
  primary: z.string().min(1),
  secondary: z.string().min(1),
  accent: z.string().min(1),
  background: z.string().optional(),
  foreground: z.string().optional(),
  headingFont: z.string().min(1),
  bodyFont: z.string().min(1),
  buttonRadius: z.string().optional(),
  cardRadius: z.string().optional(),
})

export const websitePageSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  page_type: z.string().min(1),
  status: z.enum(['draft', 'preview', 'published', 'unpublished']),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  sections: z.array(websiteSectionSchema),
})

export const websiteTenantSchema = z.object({
  id: z.string().min(1),
  hostname: z.string().min(1),
  organization: z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email(),
    city: z.string().min(1),
    state: z.string().min(1),
    serviceAreas: z.array(z.string()),
  }),
  template: z.object({
    slug: z.string().min(1),
    version: z.number().int().positive(),
  }),
  theme: tenantThemeSchema,
  pages: z.array(websitePageSchema),
})

export type WebsiteTenantInput = z.infer<typeof websiteTenantSchema>
