import type { WebsiteTemplateConfig } from '../../types/template'

type CreateTemplateConfigInput = {
  id: string
  industry: string
  name: string
  slug: string
  description: string
  services: { name: string; description: string; icon?: string }[]
}

export function createTemplateConfig(input: CreateTemplateConfigInput): WebsiteTemplateConfig {
  return {
    id: input.id,
    industry: input.industry,
    name: input.name,
    slug: input.slug,
    description: input.description,
    version: 1,
    status: 'active',
    default_theme: {
      primary: '#ff6b6b',
      secondary: '#7b61ff',
      accent: '#ffb84d',
      background: '#fffbf5',
      foreground: '#2d2a32',
      headingFont: 'Inter, system-ui, sans-serif',
      bodyFont: 'Inter, system-ui, sans-serif',
      buttonRadius: '999px',
      cardRadius: '24px',
    },
    default_navigation: [
      { label: 'Services', href: '#services' },
      { label: 'Reviews', href: '#reviews' },
      { label: 'Contact', href: '#contact' },
    ],
    pages: [
      {
        page_type: 'home',
        name: 'Home',
        slug: '/',
        sort_order: 0,
        is_required: true,
        default_sections: [
          {
            id: `${input.slug}-hero`,
            section_type: 'hero',
            variant: 'split',
            sort_order: 0,
            is_enabled: true,
            content: {
              eyebrow: input.industry,
              heading: `Trusted ${input.industry.toLowerCase()} services built for your local market.`,
              highlighted_text: 'Ready when customers need you.',
              description: 'A fast, credible website foundation with clear services, local proof, and conversion-focused calls to action.',
              primary_cta: { label: 'Request a Quote', href: '#contact' },
              secondary_cta: { label: 'View Services', href: '#services' },
              trust_items: ['Mobile ready', 'Local SEO foundation', 'Built for lead capture'],
            },
          },
          {
            id: `${input.slug}-services`,
            section_type: 'services_grid',
            variant: 'cards',
            sort_order: 10,
            is_enabled: true,
            content: {
              eyebrow: 'Services',
              heading: `Popular ${input.industry.toLowerCase()} services`,
              description: 'Template defaults are generated first, then adjusted for each tenant through content overrides.',
              services: input.services,
            },
          },
          {
            id: `${input.slug}-cta`,
            section_type: 'final_cta',
            variant: 'centered',
            sort_order: 90,
            is_enabled: true,
            content: {
              eyebrow: 'Get Started',
              heading: 'Ready to turn visitors into customers?',
              description: 'This section becomes tenant-specific once the generation workflow has collected business details.',
              primary_cta: { label: 'Contact Us', href: '#contact' },
            },
          },
        ],
      },
    ],
    supported_section_types: ['hero', 'services_grid', 'testimonials', 'faq', 'contact_form', 'quote_form', 'final_cta', 'footer'],
    features: ['local-seo', 'lead-capture', 'service-area-pages', 'reviews-ready'],
    required_business_fields: ['business_name', 'phone', 'email', 'city', 'state', 'services'],
    recommended_business_fields: ['service_areas', 'business_hours', 'reviews', 'license_numbers', 'brand_photos'],
  }
}
