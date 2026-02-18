-- =================================================================
-- Migration: Add Trussville, AL and Post Falls, ID
-- Run as postgres role in Supabase SQL Editor (RLS prevents writes)
-- Date: February 2026
-- =================================================================

-- =================================================================
-- 1. INSERT CITIES
-- =================================================================

INSERT INTO cities (name, state, slug, clinic_count) VALUES
  ('Trussville', 'AL', 'trussville', 3),
  ('Post Falls', 'ID', 'post-falls', 2)
ON CONFLICT (slug) DO NOTHING;

-- =================================================================
-- 2. INSERT TRUSSVILLE, AL — 3 clinics
-- =================================================================

INSERT INTO clinics (
  name, slug, address, city, state, zip_code, phone, website,
  is_24_7, availability_type, latitude, longitude,
  exotic_pets_accepted, has_exotic_specialist,
  services_offered, has_surgery_suite, has_icu, has_specialists,
  payment_methods, accepts_care_credit, accepts_pet_insurance,
  cost_tier, parking_type, wheelchair_accessible,
  verification_status, hours_description
) VALUES

-- 1. Emergency Pet Care Trussville
(
  'Emergency Pet Care Trussville',
  'emergency-pet-care-trussville-al',
  '7299 Gadsden Hwy',
  'Trussville',
  'AL',
  '35173',
  '(205) 661-2273',
  'https://trussvilleemergencypetcare.com',
  false,
  'emergency-only',
  NULL,
  NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'overnight-monitoring'],
  true,
  false,
  false,
  ARRAY['cash', 'credit-card'],
  false,
  false,
  'moderate',
  'free-lot',
  true,
  'verified',
  'Mon 24hrs · Tue–Thu 6pm–7am · Fri–Sun 24hrs'
),

-- 2. Veterinary Specialists of Birmingham (VSB)
(
  'Veterinary Specialists of Birmingham',
  'vsb-birmingham-al',
  '146 Resource Center Pkwy',
  'Trussville',
  'AL',
  '35242',
  '(205) 967-9107',
  'https://vsbham.com',
  true,
  'true-24-7',
  NULL,
  NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'icu-critical-care', 'overnight-monitoring', 'ultrasound-imaging', 'ct-scan'],
  true,
  true,
  true,
  ARRAY['cash', 'credit-card', 'care-credit'],
  true,
  true,
  'premium',
  'free-lot',
  true,
  'verified',
  'Open 24 hours, 7 days a week'
),

-- 3. Steel City Emergency Vets
(
  'Steel City Emergency Vets',
  'steel-city-emergency-vets-hoover-al',
  '1900 Hoover Ct',
  'Trussville',
  'AL',
  '35226',
  '(205) 413-8989',
  NULL,
  true,
  'true-24-7',
  NULL,
  NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'overnight-monitoring'],
  true,
  false,
  false,
  ARRAY['cash', 'credit-card'],
  false,
  false,
  'moderate',
  'free-lot',
  true,
  'verified',
  'Open 24 hours, 7 days a week'
)

ON CONFLICT (slug) DO NOTHING;

-- =================================================================
-- 3. INSERT POST FALLS, ID — 2 clinics
-- =================================================================

INSERT INTO clinics (
  name, slug, address, city, state, zip_code, phone, website,
  is_24_7, availability_type, latitude, longitude,
  exotic_pets_accepted, has_exotic_specialist,
  services_offered, has_surgery_suite, has_icu, has_specialists,
  payment_methods, accepts_care_credit, accepts_pet_insurance,
  cost_tier, parking_type, wheelchair_accessible,
  verification_status, hours_description
) VALUES

-- 1. Emergency Pet Care — Post Falls
(
  'Emergency Pet Care — Post Falls',
  'emergency-pet-care-post-falls-id',
  '3046 E Seltice Way',
  'Post Falls',
  'ID',
  '83854',
  '(208) 777-2707',
  'https://emergencypetcarecda.com',
  false,
  'emergency-only',
  NULL,
  NULL,
  ARRAY['dogs', 'cats', 'birds', 'reptiles', 'small-mammals'],
  true,
  ARRAY['emergency-surgery', 'overnight-monitoring'],
  true,
  false,
  false,
  ARRAY['cash', 'credit-card'],
  false,
  false,
  'budget',
  'free-lot',
  true,
  'verified',
  'Mon–Fri 5pm–8am · Sat–Sun 24hrs'
),

-- 2. Emergency Veterinary Hospital of Coeur d'Alene (EVH)
(
  'Emergency Veterinary Hospital of Coeur d''Alene',
  'evh-coeur-dalene-id',
  '1336 W Kathleen Ave',
  'Post Falls',
  'ID',
  '83815',
  '(208) 930-1888',
  'https://ervetcda.com',
  true,
  'true-24-7',
  NULL,
  NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'icu-critical-care', 'overnight-monitoring', 'ultrasound-imaging'],
  true,
  true,
  true,
  ARRAY['cash', 'credit-card', 'care-credit'],
  true,
  true,
  'moderate',
  'free-lot',
  true,
  'verified',
  'Open 24 hours, 7 days a week'
)

ON CONFLICT (slug) DO NOTHING;

-- =================================================================
-- 4. UPDATE CITY CLINIC COUNTS (safety net)
-- =================================================================

UPDATE cities
SET clinic_count = (
    SELECT COUNT(*)
    FROM clinics
    WHERE clinics.city = cities.name AND clinics.state = cities.state AND clinics.is_active = true
)
WHERE slug IN ('trussville', 'post-falls');

-- =================================================================
-- VERIFICATION
-- =================================================================

SELECT name, city, state, hours_description, is_24_7
FROM clinics
WHERE city IN ('Trussville', 'Post Falls')
ORDER BY city, name;

SELECT name, state, slug, clinic_count FROM cities WHERE slug IN ('trussville', 'post-falls');
