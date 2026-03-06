# FindEmergencyVet.com — Project Context

## What This Is
Crisis-optimised national directory for emergency veterinary care in the US.
Users are in acute emotional distress — pet emergency, often late at night.
Core product promise: find an open emergency vet and call them within 30 seconds of landing.

## Repo
https://github.com/vibegpt/findemergencyvet
Local: ~/dev/findemergencyvet

## Business Model
SEO-dominant programmatic directory targeting 2,500+ low-competition geographic keywords.
Revenue: display ads, sponsored/featured listings, pay-per-call from clinics.

## Tech Stack
- Next.js (App Router), TypeScript, Tailwind CSS
- Supabase PostgreSQL (separate account — MCP: supabase-findemergencyvet)
- Vercel hosting + ISR
- Google Analytics: G-1ZWQKBJHXM

## Project Structure
```
app/
  [state]/          — state hub pages (e.g. /florida/)
  locations/[state] — city directory pages (primary SEO target)
  clinics/          — individual clinic profiles
  api/nearby/       — geolocation endpoint
  page.tsx          — homepage (server component, fetches from Supabase)
  page-client.tsx   — homepage client component
components/
  FloatingCallButton.tsx
  SharedSections.tsx
  WaitTime.tsx
  clinic/           — clinic card components
  guides/           — resource article components
data/
  keyword-cities.sql
  keywords-by-state.json
  keyword-report.md
database/
  supabase-complete-schema.sql  — master schema
  insert-28-clinics.sql         — clinic seed data
  phase1-cities.sql             — city seed data
  (multiple migration SQL files)
lib/
  supabase.ts       — Supabase client
  state-data.ts     — state metadata
scripts/
  parse-keywords.mjs — keyword processing utilities
```

## Database Schema (Supabase)
4 core tables:
- cities (id, name, state, slug, clinic_count, created_at, updated_at)
- clinics (id, slug, name, address, city, state, zip_code, phone, hours JSON, timezone, is_true_24_7, service_type, verified, verified_date, lat, lng, ...)
- services
- clinic_services (junction)

## Current Status
- Codebase: active, in development
- Supabase DB: live (separate account from other projects)
- Pages: homepage, state pages, city/locations pages, clinic profiles all scaffolded
- Clinic data: being populated via SQL migrations (28+ clinics inserted)
- Google Analytics: connected (G-1ZWQKBJHXM)

## SEO Strategy
Programmatic pages targeting zero-KD local keywords:
- /[state]/ — 50 state hub pages
- /locations/[state]/[city]/ — 500+ city directory pages (PRIMARY)
- /clinics/[slug]/ — 1,500+ clinic profiles
- /guides/ — resource articles for informational queries

Top priority keywords (KD 0):
- emergency vet gainesville ga (140/mo, $3.19 CPC)
- emergency vet flowood ms (110/mo)
- emergency vet mechanicsville va (110/mo)
- emergency vet jacksonville beach (70/mo, $4.42 CPC)

## Critical Issues (from tech spec)
1. Open/closed status must be computed dynamically from hours JSON + timezone — not static
2. Clinic data needs phone/website verification before publishing pages
3. robots.txt and sitemap.xml must be submitted to Google Search Console
4. Fonts may be render-blocking — switch to next/font self-hosted
5. Add canonical tags, Open Graph tags, ItemList schema on city pages

## Performance Targets
- LCP: < 1.2s (crisis UX — user needs info NOW)
- Time to first call tap: < 30 seconds
- Total page weight: < 200KB

## Rules for This Project
- Open/closed accuracy is non-negotiable — wrong status destroys trust
- Never publish a page with unverified clinic data
- Call button must work without JavaScript (use tel: href)
- Mobile-first — majority of crisis users are on phone
- ISR revalidation: city pages hourly, state pages daily

## Expansion Path
1. Verify and publish top 20 priority city pages
2. Scale to 500+ cities programmatically
3. Add resource/guide articles for informational query capture
4. Monetise once organic traffic established

Last updated: 2026-02-19
