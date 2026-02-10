-- =================================================================
-- FIX: Re-insert Richmond VA (5) + Frederick MD (3) clinics
-- These clinics are missing from the database.
-- Run this in Supabase SQL Editor.
-- =================================================================

-- Step 1: Check what exists (run this first to diagnose)
SELECT 'cities' as table_name, name, state, slug, clinic_count
FROM cities WHERE slug IN ('richmond', 'frederick');

SELECT 'clinics' as table_name, name, city, state, is_active
FROM clinics WHERE city IN ('Richmond', 'Frederick')
ORDER BY city, name;

-- =================================================================
-- Step 2: Delete any partial/broken Richmond + Frederick clinic rows
-- (safe to re-run — only deletes if they exist)
-- =================================================================

DELETE FROM clinics WHERE slug IN (
  'bluepearl-richmond-va',
  'vvc-midlothian-va',
  'vvc-short-pump-va',
  'partner-vesc-richmond-va',
  'urgentvet-carytown-richmond',
  'partner-vesc-frederick-md',
  'care-vet-center-frederick',
  'veturgency-frederick-md'
);

-- =================================================================
-- Step 3: Insert Richmond VA clinics (5)
-- =================================================================

INSERT INTO clinics (
  name, slug, address, city, state, zip_code, phone, website,
  is_24_7, availability_type, latitude, longitude,
  exotic_pets_accepted, has_exotic_specialist,
  services_offered, has_surgery_suite, has_icu, has_specialists,
  payment_methods, accepts_care_credit, accepts_pet_insurance,
  cost_tier, parking_type, wheelchair_accessible,
  verification_status
) VALUES

-- BluePearl Pet Hospital - Richmond (24/7, Verified)
(
  'BluePearl Pet Hospital - Richmond',
  'bluepearl-richmond-va',
  '5918 West Broad St',
  'Richmond',
  'VA',
  '23230',
  '(804) 716-4700',
  'https://bluepearlvet.com/hospital/richmond-va',
  true,
  'true-24-7',
  NULL, NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'icu-critical-care', 'overnight-monitoring', 'ultrasound-imaging', 'ct-scan'],
  true, true, true,
  ARRAY['cash', 'credit-card', 'care-credit', 'scratchpay'],
  true, true,
  'premium',
  'free-lot',
  true,
  'verified'
),

-- Virginia Veterinary Centers - Midlothian (24/7, Verified)
(
  'Virginia Veterinary Centers - Midlothian',
  'vvc-midlothian-va',
  '12077 Hull Street Rd',
  'Richmond',
  'VA',
  '23112',
  '(804) 744-9800',
  NULL,
  true,
  'true-24-7',
  NULL, NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'icu-critical-care', 'overnight-monitoring', 'ultrasound-imaging'],
  true, true, true,
  ARRAY['cash', 'credit-card', 'care-credit'],
  true, true,
  'premium',
  'free-lot',
  true,
  'verified'
),

-- Virginia Veterinary Centers - Short Pump (24/7, Verified)
(
  'Virginia Veterinary Centers - Short Pump',
  'vvc-short-pump-va',
  '4300 Greybull Dr',
  'Richmond',
  'VA',
  '23233',
  '(804) 353-9000',
  NULL,
  true,
  'true-24-7',
  NULL, NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'icu-critical-care', 'overnight-monitoring', 'ultrasound-imaging'],
  true, true, true,
  ARRAY['cash', 'credit-card', 'care-credit'],
  true, true,
  'premium',
  'free-lot',
  true,
  'verified'
),

-- Partner Veterinary Emergency & Specialty Center (24/7, Verified)
(
  'Partner Veterinary Emergency & Specialty Center',
  'partner-vesc-richmond-va',
  '6506 W Broad St',
  'Richmond',
  'VA',
  '23230',
  '(804) 206-9122',
  NULL,
  true,
  'true-24-7',
  NULL, NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'icu-critical-care', 'overnight-monitoring', 'ultrasound-imaging'],
  true, true, true,
  ARRAY['cash', 'credit-card', 'care-credit'],
  true, true,
  'premium',
  'free-lot',
  true,
  'verified'
),

-- UrgentVet - Carytown (Urgent Care, Unverified)
(
  'UrgentVet - Carytown',
  'urgentvet-carytown-richmond',
  '3531 Ellwood Ave',
  'Richmond',
  'VA',
  '23221',
  '(804) 362-0202',
  NULL,
  false,
  'urgent-care',
  NULL, NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['ultrasound-imaging'],
  false, false, false,
  ARRAY['cash', 'credit-card'],
  false, false,
  'moderate',
  'unknown',
  false,
  'unverified'
);

-- =================================================================
-- Step 4: Insert Frederick MD clinics (3)
-- =================================================================

INSERT INTO clinics (
  name, slug, address, city, state, zip_code, phone, website,
  is_24_7, availability_type, latitude, longitude,
  exotic_pets_accepted, has_exotic_specialist,
  services_offered, has_surgery_suite, has_icu, has_specialists,
  payment_methods, accepts_care_credit, accepts_pet_insurance,
  cost_tier, parking_type, wheelchair_accessible,
  verification_status
) VALUES

-- Partner Veterinary Emergency & Specialty Center - Frederick (24/7, Verified)
(
  'Partner Veterinary Emergency & Specialty Center - Frederick',
  'partner-vesc-frederick-md',
  '7330 Guilford Dr',
  'Frederick',
  'MD',
  '21704',
  '(301) 200-8185',
  NULL,
  true,
  'true-24-7',
  NULL, NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'icu-critical-care', 'overnight-monitoring', 'ultrasound-imaging'],
  true, true, true,
  ARRAY['cash', 'credit-card', 'care-credit', 'scratchpay'],
  true, true,
  'premium',
  'free-lot',
  true,
  'verified'
),

-- CARE Veterinary Center (After-Hours, Verified)
(
  'CARE Veterinary Center',
  'care-vet-center-frederick',
  '1080 W. Patrick St',
  'Frederick',
  'MD',
  '21703',
  '(301) 662-2273',
  NULL,
  false,
  'emergency-only',
  NULL, NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'ultrasound-imaging', 'overnight-monitoring'],
  true, false, false,
  ARRAY['credit-card', 'care-credit'],
  true, false,
  'moderate',
  'free-lot',
  false,
  'verified'
),

-- VetUrgency (Urgent Care, Unverified)
(
  'VetUrgency',
  'veturgency-frederick-md',
  '434 Prospect Blvd',
  'Frederick',
  'MD',
  '21701',
  '(301) 288-8387',
  NULL,
  false,
  'urgent-care',
  NULL, NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['ultrasound-imaging'],
  false, false, false,
  ARRAY['cash', 'credit-card'],
  false, false,
  'budget',
  'unknown',
  false,
  'unverified'
);

-- =================================================================
-- Step 5: Update clinic counts
-- =================================================================

UPDATE cities
SET clinic_count = (
    SELECT COUNT(*)
    FROM clinics
    WHERE clinics.city = cities.name
      AND clinics.state = cities.state
      AND clinics.is_active = true
)
WHERE slug IN ('richmond', 'frederick');

-- =================================================================
-- Step 6: Verify
-- =================================================================

SELECT city, state, COUNT(*) as clinic_count,
       COUNT(*) FILTER (WHERE is_24_7 = true) as twenty_four_seven_count,
       COUNT(*) FILTER (WHERE verification_status = 'verified') as verified_count
FROM clinics
WHERE city IN ('Richmond', 'Frederick')
GROUP BY city, state
ORDER BY city;

-- Expected:
-- Frederick, MD: 3 clinics (1 true 24/7, 2 verified)
-- Richmond, VA:  5 clinics (4 true 24/7, 4 verified)
