import type { CategoryKey, FootprintGrade } from '../lib/assessment/gradeFootprint'

// Adynex offer lineup (Nov 2026). Checkout links are live Stripe Payment Links.
// Monthly plans start 30 days after purchase, so the first month is free.

export type OfferKey = 'kiokitchen' | 'google_fix' | 'website_makeover' | 'ai_front_desk' | 'cinematic_ad' | 'ad_studio' | 'all_in_growth'

export type Offer = {
  key: OfferKey
  name: string
  result: string
  setup?: number
  monthly?: number
  when: string
  items: string[]
  checkout: string
  fixes: CategoryKey[]
}

export const offers: Record<OfferKey, Offer> = {
  kiokitchen: {
    key: 'kiokitchen', name: 'KioKitchen Online Ordering', result: 'Take orders from your phone with zero commission',
    monthly: 99, when: 'Digital menu free forever · first month of ordering free',
    items: ['Free QR digital menu', 'Online ordering and payments', 'No per-order fees, ever', 'Orders straight to your phone'],
    checkout: 'https://buy.stripe.com/fZu3cvcmm6qM2iad2IdQQ06', fixes: [],
  },
  google_fix: {
    key: 'google_fix', name: 'Google Fix', result: 'Show up right on Google Maps',
    setup: 297, when: 'Live in 48 hours',
    items: ['Google profile cleanup: hours, photos, categories, links', 'Mobile one-page menu or services page', 'Call + directions buttons', 'Counter QR code'],
    checkout: 'https://buy.stripe.com/3cIeVd8662aw8Gy5AgdQQ00', fixes: ['google'],
  },
  website_makeover: {
    key: 'website_makeover', name: 'Website Makeover', result: 'A site that turns visitors into customers',
    setup: 497, monthly: 99, when: 'Live in 7 days · founding rate (regularly $750)',
    items: ['Custom mobile website in your brand', 'Everything in Google Fix', 'Online ordering or booking', 'Local SEO setup', 'Hosting, security, unlimited small updates'],
    checkout: 'https://buy.stripe.com/5kQ00jgCCaH2cWO7IodQQ01', fixes: ['website', 'search'],
  },
  ai_front_desk: {
    key: 'ai_front_desk', name: 'AI Front Desk', result: 'Never miss a customer again',
    setup: 497, monthly: 149, when: 'Running in 7 days',
    items: ['Missed-call text back', 'AI receptionist: answers & books 24/7', 'Automatic Google review requests', 'Instant lead follow-up', 'Weekly results report to your phone'],
    checkout: 'https://buy.stripe.com/4gM9ATaeeg1me0S5AgdQQ02', fixes: ['reviews'],
  },
  cinematic_ad: {
    key: 'cinematic_ad', name: 'Cinematic Ad', result: 'An ad people stop scrolling for',
    setup: 297, when: 'Delivered in 5 days',
    items: ['30-second cinematic commercial', '3 vertical cuts for Reels, TikTok, Shorts', 'Original music and sound', 'Yours to run anywhere'],
    checkout: 'https://buy.stripe.com/aFabJ1aee9CY1e6geUdQQ03', fixes: ['social'],
  },
  ad_studio: {
    key: 'ad_studio', name: 'Ad Studio', result: 'Fresh, scroll-stopping content every month',
    monthly: 199, when: 'First month free',
    items: ['2 new cinematic ads every month', 'Cut for Reels, TikTok, Shorts', '8 ready-to-post social posts', 'Cancel anytime'],
    checkout: 'https://buy.stripe.com/8x25kDeuu5mI9KCfaQdQQ04', fixes: ['social'],
  },
  all_in_growth: {
    key: 'all_in_growth', name: 'All-In Growth', result: 'Everything, done for you',
    setup: 997, monthly: 299, when: 'Save $294 up front and $148 every month',
    items: ['Website Makeover', 'Google Fix', 'AI Front Desk', 'Ad Studio: 2 cinematic ads a month', 'One setup, one monthly price'],
    checkout: 'https://buy.stripe.com/9B65kD4TU3eA1e65AgdQQ05', fixes: ['website', 'google', 'reviews', 'search', 'social'],
  },
}

export const priceLabel = (o: Offer) => [o.setup ? `$${o.setup}` : '', o.monthly ? `${o.setup ? '+ ' : ''}$${o.monthly}/mo` : ''].filter(Boolean).join(' ')

// Pick what this business actually needs, based on its weakest areas.
export function recommendFor(grade: FootprintGrade): { primary: Offer; extras: Offer[] } {
  const weak = grade.categories.filter((c) => c.checked && c.earned / c.possible < 0.7).map((c) => c.key)
  const picks: OfferKey[] = []
  if (weak.includes('website') || weak.includes('search')) picks.push('website_makeover')
  else if (weak.includes('google')) picks.push('google_fix')
  if (weak.includes('reviews')) picks.push('ai_front_desk')
  if (weak.includes('social')) picks.push('ad_studio')
  if (picks.length >= 3) return { primary: offers.all_in_growth, extras: picks.map((k) => offers[k]) }
  if (!picks.length) return { primary: offers.ai_front_desk, extras: [offers.ad_studio] }
  const [first, ...rest] = picks
  return { primary: offers[first], extras: rest.map((k) => offers[k]) }
}

export const isRestaurant = (category: string) => /restaurant|cafe|food|bakery|pizza|grill|kitchen|diner|\bbar\b|bbq|wings|taco|burger/i.test(category)
