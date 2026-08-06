import { z } from 'zod'

const ctaSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
})

export const heroSectionSchema = z.object({
  id: z.string().min(1),
  section_type: z.literal('hero'),
  variant: z.string().min(1),
  sort_order: z.number().int().nonnegative(),
  is_enabled: z.boolean(),
  content: z.object({
    eyebrow: z.string().optional(),
    heading: z.string().min(1),
    highlighted_text: z.string().optional(),
    description: z.string().optional(),
    primary_cta: ctaSchema.optional(),
    secondary_cta: ctaSchema.optional(),
    background_image: z.string().optional(),
    image: z.string().optional(),
    trust_items: z.array(z.string()).optional(),
    alignment: z.enum(['left', 'center']).optional(),
  }),
  settings: z.record(z.string(), z.unknown()).optional(),
  visibility_rules: z.record(z.string(), z.unknown()).optional(),
})

export const servicesGridSectionSchema = z.object({
  id: z.string().min(1),
  section_type: z.literal('services_grid'),
  variant: z.string().min(1),
  sort_order: z.number().int().nonnegative(),
  is_enabled: z.boolean(),
  content: z.object({
    eyebrow: z.string().optional(),
    heading: z.string().min(1),
    description: z.string().optional(),
    services: z.array(z.object({
      name: z.string().min(1),
      description: z.string().min(1),
      icon: z.string().optional(),
      image: z.string().optional(),
      link: z.string().optional(),
      featured: z.boolean().optional(),
    })).min(1),
  }),
  settings: z.record(z.string(), z.unknown()).optional(),
  visibility_rules: z.record(z.string(), z.unknown()).optional(),
})

export const finalCtaSectionSchema = z.object({
  id: z.string().min(1),
  section_type: z.literal('final_cta'),
  variant: z.string().min(1),
  sort_order: z.number().int().nonnegative(),
  is_enabled: z.boolean(),
  content: z.object({
    eyebrow: z.string().optional(),
    heading: z.string().min(1),
    description: z.string().optional(),
    primary_cta: ctaSchema,
  }),
  settings: z.record(z.string(), z.unknown()).optional(),
  visibility_rules: z.record(z.string(), z.unknown()).optional(),
})

export const websiteSectionSchema = z.discriminatedUnion('section_type', [
  heroSectionSchema,
  servicesGridSectionSchema,
  finalCtaSectionSchema,
])

export type ValidWebsiteSection = z.infer<typeof websiteSectionSchema>
