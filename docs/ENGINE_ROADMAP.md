# Adynex Engine — Premium Upgrade & Ship Plan

Owner: James Archibald · Engine architect: Banneker (AI team) · Repo: `Vonarchi/aidynexgrow`
Last reviewed: 2026-10-31

Goal: turn the Adynex web building engine from "basic AI output" into an engine whose sites look art-directed, are built on real business data, and keep improving every month — then ship it.

---

## 1. Where the engine stands today (audit, 2026-10-31)

**Builds:** ✅ `npm run build` (Vite app) and ✅ `npm run engine:build` (Next.js engine) both pass. Lint passes.

**What's real**
- Agentic onboarding: business name / URL → website scrape (title, meta, H1/H2) → Google Places lookup → GPT copy → preview with readiness score.
- Multi-tenant engine skeleton: templates (restaurant, HVAC, plumbing, roofing, church), section schemas (zod), hostname → tenant resolution, publish/QA/domain API stubs, Supabase migrations with RLS.
- Customer + admin dashboards (Vite app, demo mode without Supabase).

**Why output looks "basic AI"**
| Gap | Detail |
|---|---|
| Thin section library | Renderer supports only 3 sections (hero, services grid, final CTA); schemas declare 8. |
| One look for everyone | Every template shares the same colors, fonts and radii (`createTemplateConfig`). No per-client brand. |
| Generic copy | One-shot `gpt-4o-mini` JSON; no strategy, no industry playbook, no critique pass. |
| No real imagery | `images: []` — no photos, logos or generated visuals. |
| Two generation paths | `/api/websites/generate` fills static templates with no AI; the preview uses a separate Supabase edge function. |

**Ship blockers**
1. **Two apps, one deploy.** `vercel.json` rewrites everything to the Vite `index.html`, so the Next.js engine (admin, client portal, preview, APIs) never deploys. 26 engine pages are still placeholders.
2. **Unprotected APIs.** `generate`, `publish`, `qa/run`, `domains/verify` have no auth.
3. **Demo content presented as real.** Landing page labels seeded demo portfolio items "Real Website Examples" / "Client Website". Replace with real work or relabel before launch.
4. ~~Fabricated fallback data~~ — fixed in this PR (no more fake phone, 4.8★ rating, 42 reviews, or hours in previews).
5. Payments/email not wired (Stripe, Resend placeholders). No tests. 690 KB JS bundle (needs code splitting).

---

## 2. What will make Adynex output exclusive

Competitors (Wix ADI, Durable, 10Web, Hostinger AI, Lovable) generate a plausible page from a prompt. Adynex wins by being **true, on-brand, art-directed, and alive**.

1. **Truth Layer — real data, zero fabrication.** Every fact on a site comes from a source: Google Business Profile (hours, phone, address, real reviews with attribution, photos), the existing website, menus, socials. A facts ledger stores each fact with its source; anything unverified is flagged for the owner instead of invented.
2. **Brand DNA extraction.** Pull logo, palette (color extraction from logo/site/photos), typography and tone of voice from what the business already has → per-client design tokens. No two clients share a theme.
3. **Art-direction system.** A curated premium section library (target: 15 section types × 3 variants each — hero, story, menu, gallery, reviews, services, service-areas, booking, FAQ, team, offers, before/after, map/hours, CTA, footer), vetted type pairings, spacing scale and motion presets. An "Art Director" agent chooses a layout recipe per industry and brand instead of a fixed template.
4. **Multi-agent generation pipeline.** Strategist (offer + biggest problem, using James's sell formula) → Copywriter → Art Director → SEO → Critic. Use a frontier model with structured outputs; keep templates as guardrails, not the ceiling.
5. **Visual asset pipeline.** Real photos first (GBP, site, socials); fill gaps with on-brand generated hero images and short video loops (Higgsfield / GPT Image), with upscaling and background removal. Never stock-generic.
6. **Quality Gate (the differentiator).** Every site is screenshotted and scored before anyone sees it: Lighthouse ≥ 95, accessibility, contrast, broken links, copy checks, plus a vision-model design critique. Below threshold → auto-revise and re-score. Ship only what passes.
7. **Industry conversion playbooks.** Restaurants: menu + KioKitchen ordering + reservations. HVAC/plumbing/roofing: sticky emergency call bar, financing, service-area pages. Salons: booking. Medical/dental: insurance, new-patient forms. Churches: service times, giving, events.
8. **Local SEO engine.** Auto `LocalBusiness` JSON-LD schema, service × city pages, NAP consistency, sitemap, Core Web Vitals budget, Google Business Profile sync.
9. **Upgrade Reveal.** Side-by-side "current site vs. Adynex upgrade" with a before/after score — the engine's own sales asset for outreach links.
10. **Living site.** Monthly re-score, seasonal promos, refreshed reviews, headline A/B tests, and one recommended add-on (SEO, social, ads, strategy) → turns one sale into a growing subscription.

---

## 3. Milestones

| # | Milestone | Done when |
|---|---|---|
| M1 | **Ship-ready foundation** | One Next.js app on Vercel (Vite pages migrated in); APIs behind Supabase auth; demo content removed/relabeled; Supabase prod project; Stripe checkout for packages; smoke tests. |
| M2 | **Premium engine v2** | Truth Layer + facts ledger; Brand DNA tokens; section library v1 (8 types × 3 variants); unified generation pipeline on a frontier model. |
| M3 | **Quality Gate + Upgrade Reveal** | Automated scoring + critique-revise loop; before/after page shareable by link. |
| M4 | **Services as add-ons** | Local SEO pages + schema, GBP sync, social content, ads/video, strategy reports sold as monthly add-ons with re-scoring. |

## 4. Working rules for the AI team

- All code changes go on a branch with a pull request. James merges. Nothing deploys to production without his OK.
- Never fabricate business facts, reviews, ratings, phone numbers, or client work.
- Each PR: passes `npm run build`, `npm run engine:build`, `npm run lint`, and states what it changes in plain English.
