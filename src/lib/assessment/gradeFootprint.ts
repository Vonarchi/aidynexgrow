// Grades a business's digital footprint from REAL scan signals only.
// Anything we could not check is marked "not checked" and left out of the score — never guessed.

export type WebsiteSignals = {
  url: string
  reachable: boolean
  https: boolean
  responseMs?: number
  htmlKb?: number
  hasViewport: boolean
  hasTitle: boolean
  hasMetaDescription: boolean
  h1Count: number
  hasLocalBusinessSchema: boolean
  hasOgImage: boolean
  hasClickToCall: boolean
  hasContactForm: boolean
  hasPdfMenu: boolean
  hasOrderingOrBooking: boolean
  copyrightYear?: number
  builder?: string
  socialLinks: { network: string; url: string }[]
}

export type GoogleSignals = {
  found: boolean
  rating?: number
  reviewCount?: number
  hasHours: boolean
  hasPhone: boolean
  hasWebsite: boolean
  photoCount?: number
  businessStatus?: string
}

export type FootprintSignals = {
  scannedAt?: string
  website: WebsiteSignals | null
  google: GoogleSignals | null
  googleChecked: boolean
}

export type Finding = { ok: boolean; text: string }

export type CategoryKey = 'website' | 'google' | 'reviews' | 'search' | 'social'

export type CategoryGrade = {
  key: CategoryKey
  label: string
  earned: number
  possible: number
  checked: boolean
  findings: Finding[]
}

export type LetterGrade = 'A' | 'B' | 'C' | 'D' | 'F'

export type FootprintGrade = {
  score: number
  letter: LetterGrade
  categories: CategoryGrade[]
  biggestProblem?: CategoryGrade
  needsUpgrade: boolean
  partial: boolean
}

const CURRENT_YEAR = new Date().getFullYear()

function category(key: CategoryKey, label: string, possible: number, checked: boolean): CategoryGrade {
  return { key, label, earned: 0, possible, checked, findings: [] }
}

function check(cat: CategoryGrade, ok: boolean, points: number, pass: string, fail: string) {
  if (ok) cat.earned += points
  cat.findings.push({ ok, text: ok ? pass : fail })
}

function gradeWebsite(site: WebsiteSignals | null, googleSaysWebsite: boolean): CategoryGrade {
  const cat = category('website', 'Website experience', 30, true)
  if (!site) {
    cat.findings.push({ ok: false, text: googleSaysWebsite ? 'A website is listed, but we could not scan it.' : 'No website found. Customers who search for you have nowhere to land.' })
    return cat
  }
  if (!site.reachable) {
    cat.findings.push({ ok: false, text: `Your website (${site.url}) did not load for us. Visitors may be hitting an error.` })
    return cat
  }
  cat.earned += 8
  cat.findings.push({ ok: true, text: 'Website loads.' })
  check(cat, site.https, 4, 'Secure (https).', 'Not secure. Browsers warn visitors before they enter.')
  check(cat, site.hasViewport, 6, 'Set up for phones.', 'Not built for phones. Visitors have to pinch and zoom.')
  const fast = (site.responseMs ?? 99999) < 2500 && (site.htmlKb ?? 0) < 800
  check(cat, fast, 4, 'Loads quickly.', `Slow to load${site.responseMs ? ` (${(site.responseMs / 1000).toFixed(1)}s)` : ''}. Every extra second loses visitors.`)
  check(cat, site.hasClickToCall, 4, 'One-tap call button.', 'No tap-to-call button for phone visitors.')
  check(cat, site.hasContactForm || site.hasOrderingOrBooking, 4, 'Visitors can reach you, book or order online.', 'No way to book, order or send a message from the site.')
  if (site.hasPdfMenu) cat.findings.push({ ok: false, text: 'Menu is a PDF. Hard to read on a phone and invisible to Google.' })
  if (site.copyrightYear && site.copyrightYear < CURRENT_YEAR - 2) cat.findings.push({ ok: false, text: `Footer says ${site.copyrightYear}. The site looks unmaintained.` })
  return cat
}

function gradeGoogle(google: GoogleSignals | null, checked: boolean): CategoryGrade {
  const cat = category('google', 'Google Business Profile', 25, checked)
  if (!checked) { cat.findings.push({ ok: false, text: 'Not checked in this scan.' }); return cat }
  if (!google?.found) { cat.findings.push({ ok: false, text: 'No Google Business Profile found. You are invisible on Google Maps.' }); return cat }
  cat.earned += 8
  cat.findings.push({ ok: true, text: 'Listed on Google Maps.' })
  check(cat, google.hasHours, 4, 'Hours are listed.', 'No hours listed. People assume you are closed.')
  check(cat, google.hasPhone, 3, 'Phone number listed.', 'No phone number on your listing.')
  check(cat, google.hasWebsite, 4, 'Website linked.', 'No website linked from your listing.')
  const photos = google.photoCount ?? 0
  if (photos >= 10) check(cat, true, 6, 'Plenty of photos.', '')
  else if (photos >= 3) { cat.earned += 3; cat.findings.push({ ok: false, text: `Only ${photos} photos. Listings with more photos get more clicks.` }) }
  else cat.findings.push({ ok: false, text: 'Few or no photos on your listing.' })
  if (google.businessStatus && google.businessStatus !== 'OPERATIONAL') cat.findings.push({ ok: false, text: 'Google does not show you as open for business.' })
  return cat
}

function gradeReviews(google: GoogleSignals | null, checked: boolean): CategoryGrade {
  const cat = category('reviews', 'Reviews & reputation', 20, checked)
  if (!checked) { cat.findings.push({ ok: false, text: 'Not checked in this scan.' }); return cat }
  if (!google?.found) { cat.findings.push({ ok: false, text: 'No Google reviews found.' }); return cat }
  const rating = google?.rating ?? 0
  const count = google?.reviewCount ?? 0
  if (rating >= 4.5) check(cat, true, 10, `${rating.toFixed(1)}★ rating.`, '')
  else if (rating >= 4.0) { cat.earned += 7; cat.findings.push({ ok: true, text: `${rating.toFixed(1)}★ rating. Good, with room to grow.` }) }
  else if (rating >= 3.5) { cat.earned += 4; cat.findings.push({ ok: false, text: `${rating.toFixed(1)}★ rating is costing you customers.` }) }
  else cat.findings.push({ ok: false, text: rating ? `${rating.toFixed(1)}★ rating is hurting you.` : 'No rating yet.' })
  if (count >= 100) check(cat, true, 10, `${count} reviews.`, '')
  else if (count >= 50) { cat.earned += 7; cat.findings.push({ ok: true, text: `${count} reviews.` }) }
  else if (count >= 20) { cat.earned += 4; cat.findings.push({ ok: false, text: `Only ${count} reviews. An automatic review request would grow this fast.` }) }
  else { cat.earned += count > 0 ? 2 : 0; cat.findings.push({ ok: false, text: `${count} reviews. Competitors with more reviews win the click.` }) }
  return cat
}

function gradeSearch(site: WebsiteSignals | null): CategoryGrade {
  const cat = category('search', 'Search visibility (SEO)', 15, true)
  if (!site?.reachable) { cat.findings.push({ ok: false, text: 'Without a working website, Google has nothing to rank.' }); return cat }
  check(cat, site.hasTitle, 3, 'Page title set.', 'Missing page title.')
  check(cat, site.hasMetaDescription, 3, 'Search description set.', 'No search description. Google writes one for you.')
  check(cat, site.h1Count === 1, 3, 'Clear main headline.', site.h1Count === 0 ? 'No main headline (H1) for Google to read.' : 'Several competing main headlines.')
  check(cat, site.hasLocalBusinessSchema, 3, 'Local business details marked up for Google.', 'No local business markup. Google has to guess your hours, address and type.')
  check(cat, site.hasOgImage, 3, 'Looks good when shared.', 'No share image. Links to your site look blank on Facebook and texts.')
  return cat
}

function gradeSocial(site: WebsiteSignals | null): CategoryGrade {
  const cat = category('social', 'Social media', 10, Boolean(site?.reachable))
  if (!cat.checked) { cat.findings.push({ ok: false, text: 'Not checked (no website to find your social links on).' }); return cat }
  const networks = [...new Set((site?.socialLinks ?? []).map((l) => l.network))]
  cat.earned = networks.length >= 3 ? 10 : networks.length === 2 ? 7 : networks.length === 1 ? 4 : 0
  cat.findings.push(networks.length
    ? { ok: networks.length >= 2, text: `Linked from your site: ${networks.join(', ')}.` }
    : { ok: false, text: 'No social media linked from your website.' })
  return cat
}

export function letterFor(score: number): LetterGrade {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

export function gradeFootprint(signals: FootprintSignals): FootprintGrade {
  const google = signals.google
  const categories = [
    gradeWebsite(signals.website, Boolean(google?.hasWebsite)),
    gradeGoogle(google, signals.googleChecked),
    gradeReviews(google, signals.googleChecked),
    gradeSearch(signals.website),
    gradeSocial(signals.website),
  ]
  const checked = categories.filter((c) => c.checked)
  const possible = checked.reduce((sum, c) => sum + c.possible, 0)
  const earned = checked.reduce((sum, c) => sum + c.earned, 0)
  const score = possible ? Math.round((earned / possible) * 100) : 0
  const biggestProblem = [...checked].sort((a, b) => a.earned / a.possible - b.earned / b.possible)[0]
  return {
    score,
    letter: letterFor(score),
    categories,
    biggestProblem: biggestProblem && biggestProblem.earned < biggestProblem.possible ? biggestProblem : undefined,
    needsUpgrade: score < 80,
    partial: checked.length < categories.length,
  }
}
