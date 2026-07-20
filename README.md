# Business Launch Initiative

A React, TypeScript, Tailwind CSS, and Supabase platform for a digital agency offering free professional website builds to small businesses.

## Features

- Premium public landing page with live activity, portfolio, testimonials, FAQ, and connected CTAs
- Multi-step application form with autosave, file upload plumbing, consent capture, and confirmation
- Supabase authentication with email/password, password reset, magic link support, and protected dashboards
- Customer dashboard with application status, queue position, project timeline, messages, revisions, files, upgrades, billing, and support
- Admin dashboard for application review, approval, queue ordering, project Kanban, premium leads, services, content, analytics, and settings
- Supabase migration with RLS policies, audit logging, private file bucket, public marketing data, and demo seed content
- Local demo fallback when Supabase environment variables are not configured

## Setup

1. Copy `.env.example` to `.env` and add your Supabase project URL and publishable key.
2. Apply `supabase/migrations/20260719000000_business_launch_initiative.sql` to your Supabase project.
3. Run `npm install` if dependencies are not installed.
4. Run `npm run dev`.

Demo mode works without Supabase keys. Use `demo.client@example.com` or `admin@example.com` from the auth page shortcuts.

## Demo Data

Seeded demo records are clearly marked with `DEMO DATA` or `DEMO TESTIMONIAL` in descriptions and notes so they can be removed before launch.
