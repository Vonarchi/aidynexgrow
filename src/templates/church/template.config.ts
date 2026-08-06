import { createTemplateConfig } from '../shared/createTemplateConfig'

export const churchTemplateConfig = createTemplateConfig({
  id: 'template-church-v1',
  industry: 'Church',
  name: 'Church Community',
  slug: 'church',
  description: 'A welcoming website template for service times, ministries, sermons, events, and newcomer connection.',
  services: [
    { name: 'Service Times', description: 'Clear weekly worship information for visitors and members.', icon: 'ST' },
    { name: 'Ministries', description: 'Structured cards for children, youth, outreach, and community groups.', icon: '+' },
    { name: 'Events & Sermons', description: 'Prepared sections for event promotion and sermon archive integration.', icon: 'ES' },
  ],
})
