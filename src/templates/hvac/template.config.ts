import { createTemplateConfig } from '../shared/createTemplateConfig'

export const hvacTemplateConfig = createTemplateConfig({
  id: 'template-hvac-v1',
  industry: 'HVAC',
  name: 'HVAC Local Service',
  slug: 'hvac',
  description: 'A lead-focused website template for heating, cooling, emergency repair, and maintenance companies.',
  services: [
    { name: 'AC Repair', description: 'Fast diagnostics and repair for cooling issues during peak season.', icon: 'AC' },
    { name: 'Heating Service', description: 'Furnace, heat pump, and seasonal heating support for local homeowners.', icon: 'HT' },
    { name: 'Maintenance Plans', description: 'Recurring tune-ups that keep equipment efficient and reliable.', icon: 'MP' },
  ],
})
