-- =================================================================
-- Migration: Populate hours_detail JSONB for existing non-24/7 clinics
-- This enables dynamic open/closed computation instead of "Call for Hours"
-- Run as postgres role in Supabase SQL Editor
-- Date: 2026-02-19
-- =================================================================

-- =================================================================
-- HOW hours_detail WORKS
-- Each day is one of:
--   '24hr'    (open all day)
--   'closed'  (not open)
--   { open: "HH:MM", close: "HH:MM", overnight: boolean }
--   overnight = true when close time is next day (e.g. open 18:00, close 08:00)
-- =================================================================

-- =================================================================
-- OMAHA, NE
-- =================================================================

-- VCA MidWest: "Sun 4pm–Fri 6am (closed Fri–Sun)"
-- Open Sun 16:00 through Fri 06:00 continuously. Fri/Sat: closed.
UPDATE clinics SET hours_detail = '{
  "monday":    {"open": "00:00", "close": "06:00", "overnight": false},
  "tuesday":   {"open": "00:00", "close": "06:00", "overnight": false},
  "wednesday": {"open": "00:00", "close": "06:00", "overnight": false},
  "thursday":  {"open": "00:00", "close": "06:00", "overnight": false},
  "friday":    "closed",
  "saturday":  "closed",
  "sunday":    {"open": "16:00", "close": "23:59", "overnight": false}
}'::jsonb
WHERE slug = 'vca-midwest-omaha-ne';

-- Urgent Pet Care Millard: "Mon–Sat 8am–12am · Sun 8am–10pm"
-- Note: 12am = midnight = 00:00 next day, so overnight = true Mon-Sat
UPDATE clinics SET hours_detail = '{
  "monday":    {"open": "08:00", "close": "00:00", "overnight": true},
  "tuesday":   {"open": "08:00", "close": "00:00", "overnight": true},
  "wednesday": {"open": "08:00", "close": "00:00", "overnight": true},
  "thursday":  {"open": "08:00", "close": "00:00", "overnight": true},
  "friday":    {"open": "08:00", "close": "00:00", "overnight": true},
  "saturday":  {"open": "08:00", "close": "00:00", "overnight": true},
  "sunday":    {"open": "08:00", "close": "22:00", "overnight": false}
}'::jsonb
WHERE slug = 'urgent-pet-care-millard-omaha';

-- Urgent Pet Care Papillion: "Mon–Sat 8am–12am · Sun 8am–10pm" (same pattern)
UPDATE clinics SET hours_detail = '{
  "monday":    {"open": "08:00", "close": "00:00", "overnight": true},
  "tuesday":   {"open": "08:00", "close": "00:00", "overnight": true},
  "wednesday": {"open": "08:00", "close": "00:00", "overnight": true},
  "thursday":  {"open": "08:00", "close": "00:00", "overnight": true},
  "friday":    {"open": "08:00", "close": "00:00", "overnight": true},
  "saturday":  {"open": "08:00", "close": "00:00", "overnight": true},
  "sunday":    {"open": "08:00", "close": "22:00", "overnight": false}
}'::jsonb
WHERE slug = 'urgent-pet-care-papillion-ne';

-- Southpaw Veterinary: "Every day 7am–10pm"
UPDATE clinics SET hours_detail = '{
  "monday":    {"open": "07:00", "close": "22:00", "overnight": false},
  "tuesday":   {"open": "07:00", "close": "22:00", "overnight": false},
  "wednesday": {"open": "07:00", "close": "22:00", "overnight": false},
  "thursday":  {"open": "07:00", "close": "22:00", "overnight": false},
  "friday":    {"open": "07:00", "close": "22:00", "overnight": false},
  "saturday":  {"open": "07:00", "close": "22:00", "overnight": false},
  "sunday":    {"open": "07:00", "close": "22:00", "overnight": false}
}'::jsonb
WHERE slug = 'southpaw-vet-omaha-ne';

-- =================================================================
-- LINCOLN, NE
-- =================================================================

-- VES Lincoln: "Mon–Fri 6pm–7am · Sat 12pm–Mon 7am"
-- Mon-Fri: open 18:00, close 07:00 next day (overnight)
-- Sat: open 12:00, overnight through Mon 07:00
-- Sun: continuous (overnight from Sat still active)
UPDATE clinics SET hours_detail = '{
  "monday":    {"open": "18:00", "close": "07:00", "overnight": true},
  "tuesday":   {"open": "18:00", "close": "07:00", "overnight": true},
  "wednesday": {"open": "18:00", "close": "07:00", "overnight": true},
  "thursday":  {"open": "18:00", "close": "07:00", "overnight": true},
  "friday":    {"open": "18:00", "close": "07:00", "overnight": true},
  "saturday":  {"open": "12:00", "close": "07:00", "overnight": true},
  "sunday":    "24hr"
}'::jsonb
WHERE slug = 'ves-lincoln-ne';

-- NAMC Lincoln: "Mon–Fri 7am–7pm · Sat–Sun 8am–5pm"
UPDATE clinics SET hours_detail = '{
  "monday":    {"open": "07:00", "close": "19:00", "overnight": false},
  "tuesday":   {"open": "07:00", "close": "19:00", "overnight": false},
  "wednesday": {"open": "07:00", "close": "19:00", "overnight": false},
  "thursday":  {"open": "07:00", "close": "19:00", "overnight": false},
  "friday":    {"open": "07:00", "close": "19:00", "overnight": false},
  "saturday":  {"open": "08:00", "close": "17:00", "overnight": false},
  "sunday":    {"open": "08:00", "close": "17:00", "overnight": false}
}'::jsonb
WHERE slug = 'namc-lincoln-ne';

-- =================================================================
-- SPRINGFIELD, MO
-- =================================================================

-- EVC Springfield: "Mon–Fri 6pm–8am · Sat–Sun 24hrs"
UPDATE clinics SET hours_detail = '{
  "monday":    {"open": "18:00", "close": "08:00", "overnight": true},
  "tuesday":   {"open": "18:00", "close": "08:00", "overnight": true},
  "wednesday": {"open": "18:00", "close": "08:00", "overnight": true},
  "thursday":  {"open": "18:00", "close": "08:00", "overnight": true},
  "friday":    {"open": "18:00", "close": "08:00", "overnight": true},
  "saturday":  "24hr",
  "sunday":    "24hr"
}'::jsonb
WHERE slug = 'evc-springfield-mo';

-- Spring Valley Vet Springfield: "Mon–Fri 7:30am–5:30pm · Sat 8am–12pm"
UPDATE clinics SET hours_detail = '{
  "monday":    {"open": "07:30", "close": "17:30", "overnight": false},
  "tuesday":   {"open": "07:30", "close": "17:30", "overnight": false},
  "wednesday": {"open": "07:30", "close": "17:30", "overnight": false},
  "thursday":  {"open": "07:30", "close": "17:30", "overnight": false},
  "friday":    {"open": "07:30", "close": "17:30", "overnight": false},
  "saturday":  {"open": "08:00", "close": "12:00", "overnight": false},
  "sunday":    "closed"
}'::jsonb
WHERE slug = 'spring-valley-vet-springfield';

-- Glenstone Vet Springfield: "Mon–Fri 8am–5pm"
UPDATE clinics SET hours_detail = '{
  "monday":    {"open": "08:00", "close": "17:00", "overnight": false},
  "tuesday":   {"open": "08:00", "close": "17:00", "overnight": false},
  "wednesday": {"open": "08:00", "close": "17:00", "overnight": false},
  "thursday":  {"open": "08:00", "close": "17:00", "overnight": false},
  "friday":    {"open": "08:00", "close": "17:00", "overnight": false},
  "saturday":  "closed",
  "sunday":    "closed"
}'::jsonb
WHERE slug = 'glenstone-vet-springfield';

-- =================================================================
-- RICHMOND, VA
-- =================================================================

-- UrgentVet Carytown: "Mon–Fri 3pm–11pm · Sat–Sun 10am–8pm"
UPDATE clinics SET hours_detail = '{
  "monday":    {"open": "15:00", "close": "23:00", "overnight": false},
  "tuesday":   {"open": "15:00", "close": "23:00", "overnight": false},
  "wednesday": {"open": "15:00", "close": "23:00", "overnight": false},
  "thursday":  {"open": "15:00", "close": "23:00", "overnight": false},
  "friday":    {"open": "15:00", "close": "23:00", "overnight": false},
  "saturday":  {"open": "10:00", "close": "20:00", "overnight": false},
  "sunday":    {"open": "10:00", "close": "20:00", "overnight": false}
}'::jsonb
WHERE slug = 'urgentvet-carytown-va';

-- =================================================================
-- PORT CHARLOTTE, FL
-- =================================================================

-- VEC Port Charlotte: "Tue–Thu 5pm–8am · Fri 5pm–Mon 8am (continuous)"
-- Tue: open 17:00, close 08:00 Wed (overnight)
-- Wed: open 17:00, close 08:00 Thu (overnight) — actually continuous from Tue
-- Thu: open 17:00, close 08:00 Fri (overnight)
-- Fri: open 17:00, continuous through Mon 08:00
-- Sat/Sun: 24hr (within the Fri-Mon continuous block)
-- Mon: close at 08:00
UPDATE clinics SET hours_detail = '{
  "monday":    {"open": "00:00", "close": "08:00", "overnight": false},
  "tuesday":   {"open": "17:00", "close": "08:00", "overnight": true},
  "wednesday": {"open": "17:00", "close": "08:00", "overnight": true},
  "thursday":  {"open": "17:00", "close": "08:00", "overnight": true},
  "friday":    {"open": "17:00", "close": "23:59", "overnight": false},
  "saturday":  "24hr",
  "sunday":    "24hr"
}'::jsonb
WHERE slug = 'vec-port-charlotte-fl';

-- =================================================================
-- VERIFICATION — run after migration to confirm hours_detail populated
-- =================================================================
SELECT 
  slug,
  city,
  state,
  is_24_7,
  hours_description,
  CASE WHEN hours_detail IS NOT NULL THEN 'HAS_STRUCTURED_HOURS' ELSE 'CALL_FOR_HOURS_FALLBACK' END as status_engine_tier
FROM clinics
WHERE is_24_7 = false
ORDER BY city, name;

-- Summary count
SELECT 
  CASE WHEN hours_detail IS NOT NULL THEN 'structured_hours' ELSE 'call_for_hours_fallback' END as tier,
  COUNT(*) as count
FROM clinics
WHERE is_active = true
GROUP BY 1;
