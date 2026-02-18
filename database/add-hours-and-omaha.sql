-- =================================================================
-- Migration: Add hours_description column + Omaha NE city & clinics
-- Run as postgres role in Supabase SQL Editor (RLS prevents writes)
-- Date: February 2026
-- =================================================================

-- =================================================================
-- 1. ADD hours_description COLUMN
-- =================================================================

ALTER TABLE clinics ADD COLUMN IF NOT EXISTS hours_description TEXT;

-- =================================================================
-- 2. DEFAULT: Set all 24/7 clinics
-- =================================================================

UPDATE clinics
SET hours_description = 'Open 24 hours, 7 days a week'
WHERE is_24_7 = true AND hours_description IS NULL;

-- =================================================================
-- 3. LINCOLN, NE — Specific hours + corrected phone numbers
-- =================================================================

UPDATE clinics
SET hours_description = 'Mon–Fri 6pm–7am · Sat 12pm–Mon 7am',
    phone = '(402) 523-2697'
WHERE slug = 'ves-lincoln-ne';

UPDATE clinics
SET hours_description = 'Mon–Fri 7am–7pm · Sat–Sun 8am–5pm',
    phone = '(402) 423-9100'
WHERE slug = 'namc-lincoln-ne';

-- =================================================================
-- 4. SPRINGFIELD, MO — Specific hours
-- =================================================================

UPDATE clinics
SET hours_description = 'Mon–Fri 6pm–8am · Sat–Sun 24hrs'
WHERE slug = 'evc-springfield-mo';

UPDATE clinics
SET hours_description = 'Mon–Fri 7:30am–5:30pm · Sat 8am–12pm'
WHERE slug = 'spring-valley-vet-springfield';

UPDATE clinics
SET hours_description = 'Mon–Fri 8am–5pm'
WHERE slug = 'glenstone-vet-springfield';

-- =================================================================
-- 5. RICHMOND, VA — 4 are 24/7 (already set above), UrgentVet specific
-- =================================================================

UPDATE clinics
SET hours_description = 'Mon–Fri 3pm–11pm · Sat–Sun 10am–8pm'
WHERE slug = 'urgentvet-carytown-va';

-- =================================================================
-- 6. PORT CHARLOTTE, FL — Complex schedule
-- =================================================================

UPDATE clinics
SET hours_description = 'Tue–Thu 5pm–8am · Fri 5pm–Mon 8am (continuous) · Sat–Sun 24hrs'
WHERE slug = 'vec-port-charlotte-fl';

UPDATE clinics
SET hours_description = 'Call to confirm hours'
WHERE slug = 'charlotte-animal-hospital-fl';

-- =================================================================
-- 7. JACKSONVILLE BEACH, FL — All 4 are 24/7 (already set in step 2)
-- =================================================================

-- =================================================================
-- 8. HUNTSVILLE, AL — 1 is 24/7 (already set), 2 others
-- =================================================================

UPDATE clinics
SET hours_description = 'Call to confirm hours'
WHERE slug IN ('north-alabama-vet-emergency', 'madison-vet-emergency-athens');

-- =================================================================
-- 9. FREDERICK, MD — 1 is 24/7 (already set), 2 others
-- =================================================================

UPDATE clinics
SET hours_description = 'Call to confirm hours'
WHERE slug IN ('care-vet-center-frederick', 'veturgency-frederick-md');

-- =================================================================
-- 10. GAINESVILLE, GA — No 24/7, both after-hours
-- =================================================================

UPDATE clinics
SET hours_description = 'Call to confirm hours'
WHERE slug IN ('animal-emergency-gainesville-ga', 'north-ga-vet-specialists-buford');

-- =================================================================
-- 11. FLOWOOD, MS — 1 is 24/7 (already set), 1 other
-- =================================================================

UPDATE clinics
SET hours_description = 'Call to confirm hours'
WHERE slug = 'flowood-pet-hospital';

-- =================================================================
-- 12. WESTCHESTER & ROCHESTER, NY — Bulk update
-- =================================================================

UPDATE clinics
SET hours_description = 'Call to confirm hours'
WHERE city IN ('Westchester', 'Rochester')
  AND state = 'NY'
  AND is_24_7 = false
  AND hours_description IS NULL;

-- (24/7 clinics in NY already set in step 2)

-- =================================================================
-- 13. CATCH-ALL: Any remaining clinics without hours_description
-- =================================================================

UPDATE clinics
SET hours_description = 'Call to confirm hours'
WHERE hours_description IS NULL AND is_24_7 = false;

-- =================================================================
-- 14. INSERT OMAHA, NE — City + 4 clinics
-- =================================================================

INSERT INTO cities (name, state, slug, clinic_count) VALUES
  ('Omaha', 'NE', 'omaha', 4)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO clinics (
  name, slug, address, city, state, zip_code, phone, website,
  is_24_7, availability_type, latitude, longitude,
  exotic_pets_accepted, has_exotic_specialist,
  services_offered, has_surgery_suite, has_icu, has_specialists,
  payment_methods, accepts_care_credit, accepts_pet_insurance,
  cost_tier, parking_type, wheelchair_accessible,
  verification_status, hours_description
) VALUES

-- 1. VCA MidWest Veterinary Referral & Emergency Center
(
  'VCA MidWest Veterinary Referral & Emergency Center',
  'vca-midwest-omaha-ne',
  '9706 Mockingbird Dr',
  'Omaha',
  'NE',
  '68127',
  '(402) 614-9000',
  NULL,
  false,
  'emergency-only',
  NULL,
  NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'icu-critical-care', 'overnight-monitoring', 'ultrasound-imaging', 'ct-scan', 'mri', 'blood-transfusions'],
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
  'Sun 4pm–Fri 6am (closed Fri–Sun)'
),

-- 2. Urgent Pet Care – Millard (West Omaha)
(
  'Urgent Pet Care – Millard',
  'urgent-pet-care-millard-omaha',
  '4257 S 144th St',
  'Omaha',
  'NE',
  '68137',
  '(402) 991-9444',
  NULL,
  false,
  'urgent-care',
  NULL,
  NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'ultrasound-imaging', 'overnight-monitoring'],
  true,
  false,
  false,
  ARRAY['cash', 'credit-card', 'care-credit'],
  true,
  false,
  'moderate',
  'free-lot',
  true,
  'verified',
  'Mon–Sat 8am–12am · Sun 8am–10pm'
),

-- 3. Urgent Pet Care – Papillion
(
  'Urgent Pet Care – Papillion',
  'urgent-pet-care-papillion-ne',
  '8455 S 73rd Plaza',
  'Omaha',
  'NE',
  '68046',
  '(402) 597-2911',
  NULL,
  false,
  'urgent-care',
  NULL,
  NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'ultrasound-imaging', 'overnight-monitoring'],
  true,
  false,
  false,
  ARRAY['cash', 'credit-card', 'care-credit'],
  true,
  false,
  'moderate',
  'free-lot',
  true,
  'verified',
  'Mon–Sat 8am–12am · Sun 8am–10pm'
),

-- 4. Southpaw Veterinary Clinic & Emergency Care
(
  'Southpaw Veterinary Clinic & Emergency Care',
  'southpaw-vet-omaha-ne',
  '19102 Q St, Suite 115',
  'Omaha',
  'NE',
  '68135',
  '(402) 830-3700',
  NULL,
  false,
  'extended-hours',
  NULL,
  NULL,
  ARRAY['dogs', 'cats', 'birds', 'reptiles', 'small-mammals'],
  true,
  ARRAY['emergency-surgery', 'ultrasound-imaging'],
  true,
  false,
  false,
  ARRAY['cash', 'credit-card', 'care-credit'],
  true,
  false,
  'moderate',
  'free-lot',
  true,
  'verified',
  'Every day 7am–10pm'
)

ON CONFLICT (slug) DO NOTHING;

-- =================================================================
-- 15. UPDATE CITY CLINIC COUNTS (safety net)
-- =================================================================

UPDATE cities
SET clinic_count = (
    SELECT COUNT(*)
    FROM clinics
    WHERE clinics.city = cities.name AND clinics.state = cities.state AND clinics.is_active = true
)
WHERE slug IN ('omaha', 'lincoln');

-- =================================================================
-- VERIFICATION
-- =================================================================

SELECT name, city, state, hours_description, is_24_7
FROM clinics
WHERE city IN ('Omaha', 'Lincoln', 'Springfield', 'Richmond', 'Port Charlotte')
ORDER BY city, name;

SELECT name, state, slug, clinic_count FROM cities WHERE slug = 'omaha';
