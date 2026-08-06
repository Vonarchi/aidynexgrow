import { createTemplateConfig } from '../shared/createTemplateConfig'

export const plumbingTemplateConfig = createTemplateConfig({
  id: 'template-plumbing-v1',
  industry: 'Plumbing',
  name: 'Plumbing Local Service',
  slug: 'plumbing',
  description: 'A conversion-ready template for emergency plumbing, drain cleaning, installs, and water heater services.',
  services: [
    { name: 'Emergency Plumbing', description: 'Same-day messaging for urgent leaks, backups, and broken fixtures.', icon: '!' },
    { name: 'Drain Cleaning', description: 'Clear service pages for clogged drains, sewer lines, and recurring blockages.', icon: 'DC' },
    { name: 'Water Heaters', description: 'Repair and replacement content for tank and tankless systems.', icon: 'WH' },
  ],
})
