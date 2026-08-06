import { createTemplateConfig } from '../shared/createTemplateConfig'

export const roofingTemplateConfig = createTemplateConfig({
  id: 'template-roofing-v1',
  industry: 'Roofing',
  name: 'Roofing Contractor',
  slug: 'roofing',
  description: 'A trust-building template for roof repair, replacement, inspections, and storm restoration.',
  services: [
    { name: 'Roof Replacement', description: 'Clear replacement options for asphalt, metal, and specialty roofing systems.', icon: 'RR' },
    { name: 'Storm Damage Repair', description: 'Urgent repair messaging for leaks, wind damage, and insurance-ready documentation.', icon: '!' },
    { name: 'Roof Inspections', description: 'Inspection and estimate flows designed to turn search traffic into appointments.', icon: 'RI' },
  ],
})
