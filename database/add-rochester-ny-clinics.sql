-- =================================================================
-- Migration: Rochester, NY — 5 emergency/urgent care clinics
-- Run as postgres role in Supabase SQL Editor (RLS prevents anon writes)
-- Date: March 2026
-- =================================================================
-- Pre-check confirmed: all 5 slugs are NEW (none exist in DB)
-- Pre-check confirmed: Rochester city record EXISTS (id: a595d1eb-8013-4e9a-89c6-8c88daede11d, clinic_count: 7)
-- NOTE: cities table has UNIQUE on slug only — not (slug, state)
-- NOTE: trigger auto-updates clinic_count for city='Rochester' clinics only
--       East Rochester, Henrietta, Webster clinics won't auto-increment Rochester's count
-- =================================================================

-- 1. Rochester Emergency Veterinary Services (24/7, featured)
INSERT INTO clinics (slug, name, address, city, state, zip_code, phone, is_24_7, hours_detail, hours_description, availability_type, timezone, has_exotic_specialist, accepts_walk_ins, requires_call_ahead, verification_status, is_active, is_featured)
VALUES (
  'rochester-emergency-veterinary-services',
  'Rochester Emergency Veterinary Services',
  '445 West Commercial St',
  'East Rochester',
  'NY',
  '14445',
  '(585) 775-0020',
  true,
  '{"monday":"24hr","tuesday":"24hr","wednesday":"24hr","thursday":"24hr","friday":"24hr","saturday":"24hr","sunday":"24hr"}'::jsonb,
  'Open 24 hours, 7 days a week',
  'emergency-only',
  'America/New_York',
  false,
  true,
  false,
  'verified',
  true,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- 2. ARK Veterinary Hospital & Urgent Care (Henrietta)
INSERT INTO clinics (slug, name, address, city, state, zip_code, phone, is_24_7, hours_detail, hours_description, availability_type, timezone, has_exotic_specialist, accepts_walk_ins, requires_call_ahead, verification_status, is_active, is_featured)
VALUES (
  'ark-veterinary-hospital-henrietta',
  'ARK Veterinary Hospital & Urgent Care',
  '35 Finn Rd',
  'Henrietta',
  'NY',
  '14467',
  '(585) 487-8700',
  false,
  '{"monday":{"open":"08:00","close":"20:00","overnight":false},"tuesday":{"open":"08:00","close":"20:00","overnight":false},"wednesday":{"open":"08:00","close":"20:00","overnight":false},"thursday":{"open":"08:00","close":"20:00","overnight":false},"friday":{"open":"08:00","close":"20:00","overnight":false},"saturday":{"open":"08:00","close":"20:00","overnight":false},"sunday":{"open":"09:00","close":"20:00","overnight":false}}'::jsonb,
  'Mon–Sat 8am–8pm · Sun 9am–8pm',
  'urgent-care',
  'America/New_York',
  true,
  false,
  true,
  'verified',
  true,
  false
)
ON CONFLICT (slug) DO NOTHING;

-- 3. Animal Hospital of Pittsford (Rochester city, unverified)
INSERT INTO clinics (slug, name, address, city, state, zip_code, phone, is_24_7, hours_detail, hours_description, availability_type, timezone, has_exotic_specialist, accepts_walk_ins, requires_call_ahead, verification_status, is_active, is_featured)
VALUES (
  'animal-hospital-of-pittsford',
  'Animal Hospital of Pittsford',
  '2816 Monroe Ave',
  'Rochester',
  'NY',
  '14618',
  '(585) 271-7700',
  false,
  '{"monday":{"open":"07:30","close":"18:00","overnight":false},"tuesday":{"open":"07:30","close":"18:00","overnight":false},"wednesday":{"open":"07:30","close":"18:00","overnight":false},"thursday":{"open":"07:30","close":"18:00","overnight":false},"friday":{"open":"07:30","close":"17:00","overnight":false},"saturday":{"open":"14:00","close":"20:00","overnight":false},"sunday":{"open":"09:00","close":"17:00","overnight":false}}'::jsonb,
  'Mon–Fri 7:30am–6pm · Sat urgent care 2pm–8pm · Sun urgent care 9am–5pm',
  'urgent-care',
  'America/New_York',
  false,
  false,
  true,
  'unverified',
  true,
  false
)
ON CONFLICT (slug) DO NOTHING;

-- 4. Animal Intermediate Care (Webster)
INSERT INTO clinics (slug, name, address, city, state, zip_code, phone, is_24_7, hours_detail, hours_description, availability_type, timezone, has_exotic_specialist, accepts_walk_ins, requires_call_ahead, verification_status, is_active, is_featured)
VALUES (
  'animal-intermediate-care-webster',
  'Animal Intermediate Care',
  '896 Ridge Rd',
  'Webster',
  'NY',
  '14580',
  '(585) 684-7901',
  false,
  '{"monday":{"open":"11:00","close":"18:30","overnight":false},"tuesday":{"open":"11:00","close":"18:30","overnight":false},"wednesday":{"open":"11:00","close":"18:30","overnight":false},"thursday":{"open":"11:00","close":"18:30","overnight":false},"friday":"closed","saturday":"closed","sunday":{"open":"11:00","close":"18:30","overnight":false}}'::jsonb,
  'Sun–Thu 11am–6:30pm · Closed Fri–Sat',
  'urgent-care',
  'America/New_York',
  false,
  true,
  false,
  'verified',
  true,
  false
)
ON CONFLICT (slug) DO NOTHING;

-- 5. Ridgemont Animal Hospital (Rochester city)
INSERT INTO clinics (slug, name, address, city, state, zip_code, phone, is_24_7, hours_detail, hours_description, availability_type, timezone, has_exotic_specialist, accepts_walk_ins, requires_call_ahead, verification_status, is_active, is_featured)
VALUES (
  'ridgemont-animal-hospital-rochester',
  'Ridgemont Animal Hospital',
  '4200 W Ridge Rd',
  'Rochester',
  'NY',
  '14626',
  '(585) 225-2133',
  false,
  '{"monday":{"open":"08:30","close":"18:00","overnight":false},"tuesday":{"open":"08:30","close":"18:00","overnight":false},"wednesday":{"open":"08:30","close":"18:00","overnight":false},"thursday":{"open":"08:30","close":"16:00","overnight":false},"friday":{"open":"08:30","close":"17:30","overnight":false},"saturday":"closed","sunday":"closed"}'::jsonb,
  'Mon–Wed 8:30am–6pm · Thu 8:30am–4pm · Fri 8:30am–5:30pm · Closed weekends',
  'emergency-only',
  'America/New_York',
  false,
  true,
  false,
  'verified',
  true,
  false
)
ON CONFLICT (slug) DO NOTHING;

-- =================================================================
-- Update Rochester city record
-- NOTE: cities table has UNIQUE constraint on slug only (not slug+state)
-- The trigger will auto-update clinic_count for city='Rochester' clinics,
-- but East Rochester / Henrietta / Webster won't be included in that count.
-- Rochester city currently has clinic_count=7 from prior data.
-- The 2 new Rochester-city clinics (animal-hospital-of-pittsford, ridgemont)
-- will be picked up by the trigger automatically.
-- We do NOT set clinic_count manually here — let the trigger handle it.
-- =================================================================

-- Force a sync of Rochester's clinic_count to pick up any new additions
UPDATE cities
SET clinic_count = (
  SELECT COUNT(*)
  FROM clinics
  WHERE clinics.city = 'Rochester'
    AND clinics.state = 'NY'
    AND clinics.is_active = true
)
WHERE slug = 'rochester' AND state = 'NY';

-- =================================================================
-- VERIFICATION — Run after inserts to confirm all 5 exist
-- =================================================================

SELECT
  slug,
  name,
  city,
  is_24_7,
  CASE WHEN hours_detail IS NOT NULL THEN 'has_hours' ELSE 'no_hours' END AS hours_status,
  verification_status,
  is_featured
FROM clinics
WHERE slug IN (
  'rochester-emergency-veterinary-services',
  'ark-veterinary-hospital-henrietta',
  'animal-hospital-of-pittsford',
  'animal-intermediate-care-webster',
  'ridgemont-animal-hospital-rochester'
)
ORDER BY is_24_7 DESC, name;

-- Check updated Rochester city record
SELECT id, name, slug, clinic_count FROM cities WHERE slug = 'rochester';
