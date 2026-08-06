import { createTemplateConfig } from '../shared/createTemplateConfig'

export const restaurantTemplateConfig = createTemplateConfig({
  id: 'template-restaurant-v1',
  industry: 'Restaurant',
  name: 'Restaurant Local Brand',
  slug: 'restaurant',
  description: 'A warm local restaurant template for menus, reservations, catering, events, and location details.',
  services: [
    { name: 'Dining Experience', description: 'A homepage story that makes the atmosphere, food, and service feel inviting.', icon: 'DE' },
    { name: 'Menus', description: 'Structured menu sections prepared for seasonal specials and featured dishes.', icon: 'MN' },
    { name: 'Catering & Events', description: 'Lead capture for private events, catering orders, and group reservations.', icon: '+' },
  ],
})
