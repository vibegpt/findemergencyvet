-- =================================================================
-- NY HUB-AND-SPOKE EXPANSION
-- Adds 6 new NY city records, re-categorizes existing clinics
-- to their correct cities, and adds new clinic entries.
-- Run this in Supabase SQL Editor.
-- =================================================================

-- =================================================================
-- STEP 1: ADD NEW CITY RECORDS
-- =================================================================

INSERT INTO cities (name, state, slug, clinic_count) VALUES
  ('Buffalo', 'NY', 'buffalo', 0),
  ('Albany', 'NY', 'albany', 0),
  ('Syracuse', 'NY', 'syracuse', 0),
  ('Long Island', 'NY', 'long-island', 0),
  ('NYC', 'NY', 'nyc', 0),
  ('Ithaca', 'NY', 'ithaca', 0)
ON CONFLICT (slug) DO NOTHING;

-- =================================================================
-- STEP 2: RE-CATEGORIZE EXISTING CLINICS TO CORRECT CITIES
-- These clinics were grouped under Westchester/Rochester
-- but actually belong to other NY cities.
-- =================================================================

-- Move Buffalo-area clinics from Rochester → Buffalo
UPDATE clinics SET city = 'Buffalo'
WHERE slug IN (
  'bluepearl-buffalo',
  'orchard-park-vet',
  'green-acres-vet'
);

-- Move Syracuse clinic from Rochester → Syracuse
UPDATE clinics SET city = 'Syracuse'
WHERE slug = 'vmc-cny-syracuse';

-- Move Ithaca clinic from Rochester → Ithaca
UPDATE clinics SET city = 'Ithaca'
WHERE slug = 'cornell-vet-ithaca';

-- Move NYC clinic from Westchester → NYC
UPDATE clinics SET city = 'NYC'
WHERE slug = 'amc-nyc';

-- =================================================================
-- STEP 3: ADD NEW CLINICS FOR EACH REGION
-- =================================================================

-- -----------------------------------------------------------------
-- BUFFALO (3 new clinics + 3 re-categorized = 6 total)
-- -----------------------------------------------------------------
INSERT INTO clinics (
  name, slug, address, city, state, zip_code, phone, website,
  is_24_7, availability_type, latitude, longitude,
  exotic_pets_accepted, has_exotic_specialist,
  services_offered, has_surgery_suite, has_icu, has_specialists,
  payment_methods, accepts_care_credit, accepts_pet_insurance,
  cost_tier, parking_type, wheelchair_accessible,
  verification_status
) VALUES
(
  'Buffalo Veterinary Emergency & Critical Care',
  'buffalo-vet-emergency',
  '4821 Genesee St',
  'Buffalo',
  'NY',
  '14225',
  '(716) 839-4044',
  NULL,
  true,
  'true-24-7',
  42.9460,
  -78.7545,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'icu-critical-care', 'overnight-monitoring', 'ultrasound-imaging'],
  true,
  true,
  false,
  ARRAY['cash', 'credit-card', 'pet-insurance', 'care-credit'],
  true,
  true,
  'moderate',
  'free-lot',
  true,
  'unverified'
),
(
  'Greater Buffalo Veterinary Emergency Services',
  'greater-buffalo-vet-emergency',
  '4036 Transit Rd',
  'Buffalo',
  'NY',
  '14221',
  '(716) 636-6400',
  NULL,
  false,
  'extended-hours',
  42.9803,
  -78.7082,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'ultrasound-imaging', 'oxygen-therapy'],
  true,
  false,
  false,
  ARRAY['cash', 'credit-card', 'pet-insurance', 'care-credit'],
  true,
  true,
  'moderate',
  'free-lot',
  true,
  'unverified'
),
(
  'Amherst Animal Hospital Emergency Services',
  'amherst-animal-emergency',
  '2685 Niagara Falls Blvd',
  'Buffalo',
  'NY',
  '14228',
  '(716) 691-1100',
  NULL,
  false,
  'extended-hours',
  43.0370,
  -78.8620,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['ultrasound-imaging'],
  false,
  false,
  false,
  ARRAY['cash', 'credit-card', 'pet-insurance'],
  false,
  true,
  'moderate',
  'free-lot',
  true,
  'unverified'
)
ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------------------------
-- ALBANY (4 new clinics)
-- -----------------------------------------------------------------
INSERT INTO clinics (
  name, slug, address, city, state, zip_code, phone, website,
  is_24_7, availability_type, latitude, longitude,
  exotic_pets_accepted, has_exotic_specialist,
  services_offered, has_surgery_suite, has_icu, has_specialists,
  payment_methods, accepts_care_credit, accepts_pet_insurance,
  cost_tier, parking_type, wheelchair_accessible,
  verification_status
) VALUES
(
  'Capital District Veterinary Referral Hospital',
  'capital-district-vet-referral',
  '222 Troy Schenectady Rd',
  'Albany',
  'NY',
  '12110',
  '(518) 785-1094',
  NULL,
  true,
  'true-24-7',
  42.7496,
  -73.7684,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'icu-critical-care', 'overnight-monitoring', 'ultrasound-imaging', 'cardiology', 'oncology'],
  true,
  true,
  true,
  ARRAY['cash', 'credit-card', 'pet-insurance', 'care-credit'],
  true,
  true,
  'premium',
  'free-lot',
  true,
  'unverified'
),
(
  'Upstate Veterinary Specialties',
  'upstate-vet-specialties',
  '152 Sparrowbush Rd',
  'Albany',
  'NY',
  '12110',
  '(518) 783-3198',
  NULL,
  true,
  'true-24-7',
  42.7500,
  -73.7520,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'icu-critical-care', 'overnight-monitoring', 'ultrasound-imaging', 'ct-scan'],
  true,
  true,
  true,
  ARRAY['cash', 'credit-card', 'pet-insurance', 'care-credit'],
  true,
  true,
  'premium',
  'free-lot',
  true,
  'unverified'
),
(
  'Albany County Emergency Veterinary Clinic',
  'albany-county-emergency-vet',
  '1270 Central Ave',
  'Albany',
  'NY',
  '12205',
  '(518) 438-8888',
  NULL,
  false,
  'extended-hours',
  42.7060,
  -73.8340,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'ultrasound-imaging'],
  true,
  false,
  false,
  ARRAY['cash', 'credit-card', 'pet-insurance', 'care-credit'],
  true,
  true,
  'moderate',
  'free-lot',
  true,
  'unverified'
),
(
  'The Veterinary Emergency Group (VEG) Albany',
  'veg-albany',
  '5 Metro Park Rd',
  'Albany',
  'NY',
  '12205',
  '(518) 930-6063',
  'https://www.veg.com/locations/new-york/albany',
  true,
  'true-24-7',
  42.7160,
  -73.8420,
  ARRAY['dogs', 'cats', 'birds', 'reptiles', 'small-mammals', 'exotic-all'],
  true,
  ARRAY['emergency-surgery', 'icu-critical-care', 'overnight-monitoring', 'ultrasound-imaging', 'blood-transfusions', 'oxygen-therapy'],
  true,
  true,
  true,
  ARRAY['cash', 'credit-card', 'pet-insurance', 'care-credit', 'scratchpay'],
  true,
  true,
  'premium',
  'free-lot',
  true,
  'unverified'
)
ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------------------------
-- SYRACUSE (3 new clinics + 1 re-categorized = 4 total)
-- -----------------------------------------------------------------
INSERT INTO clinics (
  name, slug, address, city, state, zip_code, phone, website,
  is_24_7, availability_type, latitude, longitude,
  exotic_pets_accepted, has_exotic_specialist,
  services_offered, has_surgery_suite, has_icu, has_specialists,
  payment_methods, accepts_care_credit, accepts_pet_insurance,
  cost_tier, parking_type, wheelchair_accessible,
  verification_status
) VALUES
(
  'Syracuse Veterinary Specialists & Emergency',
  'syracuse-vet-specialists',
  '5100 W Taft Rd',
  'Syracuse',
  'NY',
  '13212',
  '(315) 449-0400',
  NULL,
  true,
  'true-24-7',
  43.0842,
  -76.1690,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'icu-critical-care', 'overnight-monitoring', 'ultrasound-imaging', 'cardiology'],
  true,
  true,
  true,
  ARRAY['cash', 'credit-card', 'pet-insurance', 'care-credit'],
  true,
  true,
  'premium',
  'free-lot',
  true,
  'unverified'
),
(
  'Central New York Veterinary Emergency',
  'cny-vet-emergency',
  '6867 E Genesee St',
  'Syracuse',
  'NY',
  '13066',
  '(315) 446-7933',
  NULL,
  false,
  'extended-hours',
  43.0480,
  -76.0520,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'ultrasound-imaging'],
  true,
  false,
  false,
  ARRAY['cash', 'credit-card', 'pet-insurance'],
  false,
  true,
  'moderate',
  'free-lot',
  true,
  'unverified'
),
(
  'Animal Emergency Service of Central NY',
  'animal-emergency-cny',
  '525 Vine St',
  'Syracuse',
  'NY',
  '13203',
  '(315) 471-0400',
  NULL,
  false,
  'extended-hours',
  43.0660,
  -76.1330,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['ultrasound-imaging', 'oxygen-therapy'],
  false,
  false,
  false,
  ARRAY['cash', 'credit-card', 'pet-insurance', 'care-credit'],
  true,
  true,
  'moderate',
  'free-lot',
  false,
  'unverified'
)
ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------------------------
-- LONG ISLAND (5 new clinics)
-- -----------------------------------------------------------------
INSERT INTO clinics (
  name, slug, address, city, state, zip_code, phone, website,
  is_24_7, availability_type, latitude, longitude,
  exotic_pets_accepted, has_exotic_specialist,
  services_offered, has_surgery_suite, has_icu, has_specialists,
  payment_methods, accepts_care_credit, accepts_pet_insurance,
  cost_tier, parking_type, wheelchair_accessible,
  verification_status
) VALUES
(
  'VEG Garden City',
  'veg-garden-city',
  '800 Old Country Rd',
  'Long Island',
  'NY',
  '11530',
  '(516) 750-0522',
  'https://www.veg.com/locations/new-york/garden-city',
  true,
  'true-24-7',
  40.7268,
  -73.6098,
  ARRAY['dogs', 'cats', 'birds', 'reptiles', 'small-mammals', 'exotic-all'],
  true,
  ARRAY['emergency-surgery', 'icu-critical-care', 'overnight-monitoring', 'ultrasound-imaging', 'blood-transfusions', 'oxygen-therapy'],
  true,
  true,
  true,
  ARRAY['cash', 'credit-card', 'pet-insurance', 'care-credit', 'scratchpay'],
  true,
  true,
  'premium',
  'free-lot',
  true,
  'verified'
),
(
  'Long Island Veterinary Specialists',
  'li-vet-specialists',
  '163 S Service Rd',
  'Long Island',
  'NY',
  '11803',
  '(516) 501-1700',
  NULL,
  true,
  'true-24-7',
  40.7760,
  -73.4680,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'icu-critical-care', 'overnight-monitoring', 'ultrasound-imaging', 'ct-scan', 'mri', 'cardiology', 'neurology', 'oncology'],
  true,
  true,
  true,
  ARRAY['cash', 'credit-card', 'pet-insurance', 'care-credit'],
  true,
  true,
  'premium',
  'free-lot',
  true,
  'unverified'
),
(
  'Veterinary Medical Center of Long Island',
  'vmc-long-island',
  '75 Sunrise Hwy',
  'Long Island',
  'NY',
  '11795',
  '(631) 587-0800',
  NULL,
  true,
  'true-24-7',
  40.7082,
  -73.2742,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'icu-critical-care', 'overnight-monitoring', 'ultrasound-imaging', 'cardiology', 'neurology'],
  true,
  true,
  true,
  ARRAY['cash', 'credit-card', 'pet-insurance', 'care-credit'],
  true,
  true,
  'premium',
  'free-lot',
  true,
  'unverified'
),
(
  'VEG Commack',
  'veg-commack',
  '5525 Sunrise Hwy',
  'Long Island',
  'NY',
  '11725',
  '(631) 738-4516',
  'https://www.veg.com/locations/new-york/commack',
  true,
  'true-24-7',
  40.7142,
  -73.2912,
  ARRAY['dogs', 'cats', 'birds', 'reptiles', 'small-mammals', 'exotic-all'],
  true,
  ARRAY['emergency-surgery', 'icu-critical-care', 'overnight-monitoring', 'ultrasound-imaging', 'blood-transfusions', 'oxygen-therapy'],
  true,
  true,
  true,
  ARRAY['cash', 'credit-card', 'pet-insurance', 'care-credit', 'scratchpay'],
  true,
  true,
  'premium',
  'free-lot',
  true,
  'verified'
),
(
  'Animal Emergency Service',
  'animal-emergency-service-li',
  '280-L Middle Country Rd',
  'Long Island',
  'NY',
  '11733',
  '(631) 473-0415',
  NULL,
  false,
  'extended-hours',
  40.8750,
  -73.0810,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'ultrasound-imaging', 'oxygen-therapy'],
  true,
  false,
  false,
  ARRAY['cash', 'credit-card', 'pet-insurance', 'care-credit'],
  true,
  true,
  'moderate',
  'free-lot',
  true,
  'unverified'
)
ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------------------------
-- NYC (5 new clinics + 1 re-categorized = 6 total)
-- -----------------------------------------------------------------
INSERT INTO clinics (
  name, slug, address, city, state, zip_code, phone, website,
  is_24_7, availability_type, latitude, longitude,
  exotic_pets_accepted, has_exotic_specialist,
  services_offered, has_surgery_suite, has_icu, has_specialists,
  payment_methods, accepts_care_credit, accepts_pet_insurance,
  cost_tier, parking_type, wheelchair_accessible,
  verification_status
) VALUES
(
  'VEG Upper West Side',
  'veg-upper-west-side',
  '2457 Broadway',
  'NYC',
  'NY',
  '10025',
  '(646) 850-5154',
  'https://www.veg.com/locations/new-york/upper-west-side',
  true,
  'true-24-7',
  40.7927,
  -73.9718,
  ARRAY['dogs', 'cats', 'birds', 'reptiles', 'small-mammals', 'exotic-all'],
  true,
  ARRAY['emergency-surgery', 'icu-critical-care', 'overnight-monitoring', 'ultrasound-imaging', 'blood-transfusions', 'oxygen-therapy'],
  true,
  true,
  true,
  ARRAY['cash', 'credit-card', 'pet-insurance', 'care-credit', 'scratchpay'],
  true,
  true,
  'premium',
  'street-only',
  true,
  'verified'
),
(
  'VEG Williamsburg',
  'veg-williamsburg',
  '196 N 4th St',
  'NYC',
  'NY',
  '11211',
  '(718) 810-7910',
  'https://www.veg.com/locations/new-york/williamsburg',
  true,
  'true-24-7',
  40.7167,
  -73.9601,
  ARRAY['dogs', 'cats', 'birds', 'reptiles', 'small-mammals', 'exotic-all'],
  true,
  ARRAY['emergency-surgery', 'icu-critical-care', 'overnight-monitoring', 'ultrasound-imaging', 'blood-transfusions', 'oxygen-therapy'],
  true,
  true,
  true,
  ARRAY['cash', 'credit-card', 'pet-insurance', 'care-credit', 'scratchpay'],
  true,
  true,
  'premium',
  'street-only',
  true,
  'verified'
),
(
  'VEG Cobble Hill',
  'veg-cobble-hill',
  '199 Court St',
  'NYC',
  'NY',
  '11201',
  '(718) 522-9400',
  'https://www.veg.com/locations/new-york/cobble-hill',
  true,
  'true-24-7',
  40.6861,
  -73.9937,
  ARRAY['dogs', 'cats', 'birds', 'reptiles', 'small-mammals', 'exotic-all'],
  true,
  ARRAY['emergency-surgery', 'icu-critical-care', 'overnight-monitoring', 'ultrasound-imaging', 'blood-transfusions', 'oxygen-therapy'],
  true,
  true,
  true,
  ARRAY['cash', 'credit-card', 'pet-insurance', 'care-credit', 'scratchpay'],
  true,
  true,
  'premium',
  'street-only',
  true,
  'verified'
),
(
  'BluePearl Pet Hospital Downtown Manhattan',
  'bluepearl-downtown-manhattan',
  '410 W 55th St',
  'NYC',
  'NY',
  '10019',
  '(212) 767-0099',
  'https://bluepearlvet.com/hospital/new-york-downtown',
  true,
  'true-24-7',
  40.7657,
  -73.9876,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'icu-critical-care', 'overnight-monitoring', 'ultrasound-imaging', 'ct-scan', 'cardiology', 'neurology', 'oncology'],
  true,
  true,
  true,
  ARRAY['cash', 'credit-card', 'pet-insurance', 'care-credit', 'scratchpay'],
  true,
  true,
  'premium',
  'street-only',
  true,
  'verified'
),
(
  'ASPCA Animal Hospital',
  'aspca-animal-hospital-nyc',
  '424 E 92nd St',
  'NYC',
  'NY',
  '10128',
  '(212) 876-7700',
  'https://www.aspca.org/nyc/aspca-animal-hospital',
  false,
  'extended-hours',
  40.7816,
  -73.9460,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'ultrasound-imaging', 'pain-management'],
  true,
  false,
  false,
  ARRAY['cash', 'credit-card', 'pet-insurance', 'care-credit'],
  true,
  true,
  'moderate',
  'street-only',
  true,
  'verified'
)
ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------------------------
-- ITHACA (2 new clinics + 1 re-categorized = 3 total)
-- -----------------------------------------------------------------
INSERT INTO clinics (
  name, slug, address, city, state, zip_code, phone, website,
  is_24_7, availability_type, latitude, longitude,
  exotic_pets_accepted, has_exotic_specialist,
  services_offered, has_surgery_suite, has_icu, has_specialists,
  payment_methods, accepts_care_credit, accepts_pet_insurance,
  cost_tier, parking_type, wheelchair_accessible,
  verification_status
) VALUES
(
  'Ithaca Veterinary Emergency Care',
  'ithaca-vet-emergency',
  '1780 Hanshaw Rd',
  'Ithaca',
  'NY',
  '14850',
  '(607) 257-0540',
  NULL,
  false,
  'extended-hours',
  42.4661,
  -76.4574,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'ultrasound-imaging', 'oxygen-therapy'],
  true,
  false,
  false,
  ARRAY['cash', 'credit-card', 'pet-insurance', 'care-credit'],
  true,
  true,
  'moderate',
  'free-lot',
  true,
  'unverified'
),
(
  'Finger Lakes Veterinary Emergency',
  'finger-lakes-vet-emergency',
  '730 Warren Rd',
  'Ithaca',
  'NY',
  '14850',
  '(607) 277-4411',
  NULL,
  false,
  'extended-hours',
  42.4320,
  -76.5107,
  ARRAY['dogs', 'cats', 'birds', 'small-mammals'],
  false,
  ARRAY['emergency-surgery', 'ultrasound-imaging'],
  true,
  false,
  false,
  ARRAY['cash', 'credit-card', 'pet-insurance'],
  false,
  true,
  'moderate',
  'free-lot',
  true,
  'unverified'
)
ON CONFLICT (slug) DO NOTHING;

-- =================================================================
-- STEP 4: UPDATE CITY CLINIC COUNTS
-- =================================================================

UPDATE cities
SET clinic_count = (
    SELECT COUNT(*)
    FROM clinics
    WHERE clinics.city = cities.name
      AND clinics.state = cities.state
      AND clinics.is_active = true
)
WHERE state = 'NY';

-- =================================================================
-- STEP 5: VERIFICATION
-- =================================================================

-- Check clinic counts per NY city
SELECT c.name AS city_name, c.slug, c.clinic_count
FROM cities c
WHERE c.state = 'NY'
ORDER BY c.clinic_count DESC;

-- Check total NY clinics
SELECT city, COUNT(*) as clinic_count
FROM clinics
WHERE state = 'NY'
GROUP BY city
ORDER BY clinic_count DESC;

-- Check overall total
SELECT COUNT(*) as total_clinics FROM clinics WHERE state = 'NY';

-- =================================================================
-- COMPLETE!
-- Expected results:
--   Westchester: ~10 clinics (some moved to other cities)
--   Rochester: ~7 clinics (some moved to other cities)
--   Buffalo: ~6 clinics (3 re-categorized + 3 new)
--   NYC: ~6 clinics (1 re-categorized + 5 new)
--   Long Island: 5 clinics (all new)
--   Albany: 4 clinics (all new)
--   Syracuse: ~4 clinics (1 re-categorized + 3 new)
--   Ithaca: ~3 clinics (1 re-categorized + 2 new)
-- =================================================================
