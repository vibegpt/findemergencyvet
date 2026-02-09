-- =================================================================
-- INSERT 9 NEW CITIES + CLINICS
-- Springfield MO (3) + Richmond VA (5) + Lincoln NE (2) +
-- Huntsville AL (3) + Frederick MD (3) + Gainesville GA (2) +
-- Flowood MS (2) + Port Charlotte FL (2) + Jacksonville Beach FL (4)
-- Total: 26 new clinics
-- Data verified February 2026
-- =================================================================

-- =================================================================
-- CITIES
-- =================================================================

INSERT INTO cities (name, state, slug, clinic_count) VALUES
  ('Springfield', 'MO', 'springfield', 0),
  ('Richmond', 'VA', 'richmond', 0),
  ('Lincoln', 'NE', 'lincoln', 0),
  ('Huntsville', 'AL', 'huntsville', 0),
  ('Frederick', 'MD', 'frederick', 0),
  ('Flowood', 'MS', 'flowood', 0),
  ('Gainesville', 'GA', 'gainesville', 0),
  ('Port Charlotte', 'FL', 'port-charlotte', 0),
  ('Jacksonville Beach', 'FL', 'jacksonville-beach', 0)
ON CONFLICT (slug) DO NOTHING;

-- =================================================================
-- CLINICS
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

-- =================================================================
-- SPRINGFIELD, MISSOURI (3 clinics)
-- No true 24/7 facility. EVC is primary after-hours ER (since 1997).
-- =================================================================

-- 1. Emergency Veterinary Clinic of Southwest Missouri (After-Hours, Verified)
(
  'Emergency Veterinary Clinic of Southwest Missouri',
  'evc-springfield-mo',
  '400 S. Glenstone Ave',
  'Springfield',
  'MO',
  '65802',
  '(417) 890-1600',
  'https://evcspringfield.com',
  false,
  'emergency-only',
  NULL,
  NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'ultrasound-imaging', 'overnight-monitoring'],
  true,
  false,
  false,
  ARRAY['credit-card', 'care-credit'],
  true,
  false,
  'moderate',
  'free-lot',
  false,
  'verified'
),

-- 2. Spring Valley Veterinary Hospital - East (Daytime Urgent Care, Unverified)
(
  'Spring Valley Veterinary Hospital - East',
  'spring-valley-vet-springfield',
  '3825 S. National Ave',
  'Springfield',
  'MO',
  '65807',
  '(417) 887-7587',
  NULL,
  false,
  'urgent-care',
  NULL,
  NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['ultrasound-imaging'],
  false,
  false,
  false,
  ARRAY['cash', 'credit-card'],
  false,
  false,
  'unknown',
  'unknown',
  false,
  'unverified'
),

-- 3. Glenstone Veterinary Clinic (Daytime Emergency, Unverified)
(
  'Glenstone Veterinary Clinic',
  'glenstone-vet-springfield',
  '201 N. Glenstone Ave',
  'Springfield',
  'MO',
  '65802',
  '(417) 202-0279',
  NULL,
  false,
  'emergency-only',
  NULL,
  NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['ultrasound-imaging'],
  false,
  false,
  false,
  ARRAY['cash', 'credit-card'],
  false,
  false,
  'unknown',
  'unknown',
  false,
  'unverified'
),

-- =================================================================
-- RICHMOND, VIRGINIA (5 clinics)
-- Exceptionally well-served: FOUR true 24/7 emergency hospitals.
-- =================================================================

-- 4. BluePearl Pet Hospital - Richmond (24/7, Verified)
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
  NULL,
  NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'icu-critical-care', 'overnight-monitoring', 'ultrasound-imaging', 'ct-scan'],
  true,
  true,
  true,
  ARRAY['cash', 'credit-card', 'care-credit', 'scratchpay'],
  true,
  true,
  'premium',
  'free-lot',
  true,
  'verified'
),

-- 5. Virginia Veterinary Centers - Midlothian (24/7, Verified)
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
  'premium',
  'free-lot',
  true,
  'verified'
),

-- 6. Virginia Veterinary Centers - Short Pump (24/7, Verified)
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
  'premium',
  'free-lot',
  true,
  'verified'
),

-- 7. Partner Veterinary Emergency & Specialty Center (24/7, Verified)
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
  'premium',
  'free-lot',
  true,
  'verified'
),

-- 8. UrgentVet - Carytown (Urgent Care, Unverified)
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
  NULL,
  NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['ultrasound-imaging'],
  false,
  false,
  false,
  ARRAY['cash', 'credit-card'],
  false,
  false,
  'moderate',
  'unknown',
  false,
  'unverified'
),

-- =================================================================
-- LINCOLN, NEBRASKA (2 clinics)
-- No true 24/7 facility. VES Lincoln is primary after-hours ER.
-- =================================================================

-- 9. Veterinary Emergency Services of Lincoln (After-Hours, Verified)
(
  'Veterinary Emergency Services of Lincoln',
  'ves-lincoln-ne',
  '3700 S 9th St, Suite L',
  'Lincoln',
  'NE',
  '68502',
  '(402) 489-6800',
  NULL,
  false,
  'emergency-only',
  NULL,
  NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'ultrasound-imaging', 'overnight-monitoring'],
  true,
  false,
  false,
  ARRAY['credit-card', 'care-credit'],
  true,
  false,
  'moderate',
  'free-lot',
  false,
  'verified'
),

-- 10. Nebraska Animal Medical Center (Daytime Urgent Care, Unverified)
(
  'Nebraska Animal Medical Center',
  'nebraska-animal-medical-lincoln',
  '5720 Old Cheney Rd',
  'Lincoln',
  'NE',
  '68516',
  '(402) 423-9100',
  NULL,
  false,
  'urgent-care',
  NULL,
  NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['ultrasound-imaging'],
  false,
  false,
  false,
  ARRAY['cash', 'credit-card'],
  false,
  false,
  'unknown',
  'unknown',
  false,
  'unverified'
),

-- =================================================================
-- HUNTSVILLE, ALABAMA (3 clinics)
-- ONE true 24/7: HVSE. Two additional after-hours options.
-- =================================================================

-- 11. Huntsville Veterinary Specialists & Emergency (24/7, Verified)
(
  'Huntsville Veterinary Specialists & Emergency',
  'hvse-huntsville-al',
  '800 Dr. Joseph E. Lowery Blvd SW',
  'Huntsville',
  'AL',
  '35801',
  '(256) 715-8389',
  NULL,
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
  'premium',
  'free-lot',
  true,
  'verified'
),

-- 12. North Alabama Veterinary Emergency + Specialty (After-Hours, Unverified)
(
  'North Alabama Veterinary Emergency + Specialty',
  'north-alabama-vet-emergency',
  '164 John Thomas Dr',
  'Huntsville',
  'AL',
  '35757',
  '(256) 850-0077',
  NULL,
  false,
  'emergency-only',
  NULL,
  NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'ultrasound-imaging'],
  true,
  false,
  false,
  ARRAY['cash', 'credit-card'],
  false,
  false,
  'unknown',
  'unknown',
  false,
  'unverified'
),

-- 13. Madison Veterinary Emergency (After-Hours, Unverified)
(
  'Madison Veterinary Emergency',
  'madison-vet-emergency-athens',
  '27022 US-72',
  'Huntsville',
  'AL',
  '35613',
  '(256) 434-5290',
  NULL,
  false,
  'emergency-only',
  NULL,
  NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'ultrasound-imaging'],
  false,
  false,
  false,
  ARRAY['cash', 'credit-card'],
  false,
  false,
  'unknown',
  'unknown',
  false,
  'unverified'
),

-- =================================================================
-- FREDERICK, MARYLAND (3 clinics)
-- ONE true 24/7: Partner VESC. CARE provides after-hours coverage.
-- =================================================================

-- 14. Partner Veterinary Emergency & Specialty Center - Frederick (24/7, Verified)
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
  NULL,
  NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'icu-critical-care', 'overnight-monitoring', 'ultrasound-imaging'],
  true,
  true,
  true,
  ARRAY['cash', 'credit-card', 'care-credit', 'scratchpay'],
  true,
  true,
  'premium',
  'free-lot',
  true,
  'verified'
),

-- 15. CARE Veterinary Center (After-Hours, Verified)
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
  NULL,
  NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'ultrasound-imaging', 'overnight-monitoring'],
  true,
  false,
  false,
  ARRAY['credit-card', 'care-credit'],
  true,
  false,
  'moderate',
  'free-lot',
  false,
  'verified'
),

-- 16. VetUrgency (Urgent Care, Unverified)
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
  NULL,
  NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['ultrasound-imaging'],
  false,
  false,
  false,
  ARRAY['cash', 'credit-card'],
  false,
  false,
  'moderate',
  'unknown',
  false,
  'unverified'
),

-- =================================================================
-- GAINESVILLE, GEORGIA (2 clinics)
-- No true 24/7 facility. Animal Emergency of Gainesville is primary.
-- =================================================================

-- 17. Animal Emergency of Gainesville (After-Hours, Verified)
(
  'Animal Emergency of Gainesville',
  'animal-emergency-gainesville-ga',
  '275 Pearl Nix Pkwy #3',
  'Gainesville',
  'GA',
  '30501',
  '(770) 534-2911',
  NULL,
  false,
  'emergency-only',
  NULL,
  NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'ultrasound-imaging', 'overnight-monitoring'],
  true,
  false,
  false,
  ARRAY['cash', 'credit-card'],
  false,
  false,
  'moderate',
  'free-lot',
  false,
  'verified'
),

-- 18. North Georgia Veterinary Specialists (Emergency & Specialty, Unverified)
(
  'North Georgia Veterinary Specialists',
  'north-ga-vet-specialists-buford',
  '1328 Buford Hwy NE',
  'Gainesville',
  'GA',
  '30518',
  '(678) 835-3300',
  NULL,
  false,
  'emergency-only',
  NULL,
  NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'ultrasound-imaging'],
  true,
  false,
  true,
  ARRAY['cash', 'credit-card', 'care-credit'],
  true,
  false,
  'premium',
  'unknown',
  false,
  'unverified'
),

-- =================================================================
-- FLOWOOD, MISSISSIPPI (2 clinics)
-- ONE true 24/7: AERC (affiliated with MSU College of Vet Medicine).
-- =================================================================

-- 19. Animal Emergency & Referral Center (24/7, Verified)
(
  'Animal Emergency & Referral Center',
  'aerc-flowood-ms',
  '1009 Treetops Blvd',
  'Flowood',
  'MS',
  '39232',
  '(601) 939-8999',
  NULL,
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
  'verified'
),

-- 20. Flowood Pet Hospital and Resort (Daytime Urgent Care, Unverified)
(
  'Flowood Pet Hospital and Resort',
  'flowood-pet-hospital',
  '5316 Lakeland Dr',
  'Flowood',
  'MS',
  '39232',
  '(601) 919-9799',
  NULL,
  false,
  'urgent-care',
  NULL,
  NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['ultrasound-imaging'],
  false,
  false,
  false,
  ARRAY['cash', 'credit-card'],
  false,
  false,
  'unknown',
  'unknown',
  false,
  'unverified'
),

-- =================================================================
-- PORT CHARLOTTE, FLORIDA (2 clinics)
-- No true 24/7 facility. VEC has complex after-hours schedule.
-- AAHA Accredited, established 1992.
-- =================================================================

-- 21. Veterinary Emergency Clinic (After-Hours, Verified)
(
  'Veterinary Emergency Clinic',
  'vec-port-charlotte-fl',
  '17829 Murdock Circle, Suite 1',
  'Port Charlotte',
  'FL',
  '33948',
  '(941) 255-5222',
  NULL,
  false,
  'emergency-only',
  NULL,
  NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'ultrasound-imaging', 'overnight-monitoring', 'oxygen-therapy'],
  true,
  false,
  false,
  ARRAY['credit-card', 'care-credit'],
  true,
  false,
  'moderate',
  'free-lot',
  false,
  'verified'
),

-- 22. Charlotte Animal Hospital (Daytime Urgent Care, Unverified)
(
  'Charlotte Animal Hospital',
  'charlotte-animal-hospital-fl',
  '4200 Kings Hwy',
  'Port Charlotte',
  'FL',
  '33980',
  '(941) 629-2213',
  NULL,
  false,
  'urgent-care',
  NULL,
  NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['ultrasound-imaging'],
  false,
  false,
  false,
  ARRAY['cash', 'credit-card'],
  false,
  false,
  'unknown',
  'unknown',
  false,
  'unverified'
),

-- =================================================================
-- JACKSONVILLE BEACH, FLORIDA (4 clinics)
-- Exceptionally well-served: FOUR true 24/7 emergency facilities.
-- First Coast is only one physically in Jax Beach.
-- VEG treats exotic pets. BluePearl has CT/MRI.
-- =================================================================

-- 23. First Coast Veterinary Specialists & Emergency (24/7, Verified)
(
  'First Coast Veterinary Specialists & Emergency',
  'first-coast-vet-jax-beach',
  '301 Jacksonville Dr, Suite 2',
  'Jacksonville Beach',
  'FL',
  '32250',
  '(904) 853-6310',
  'https://fcvets.com',
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
  ARRAY['credit-card', 'care-credit'],
  true,
  false,
  'premium',
  'free-lot',
  true,
  'verified'
),

-- 24. VEG - Veterinary Emergency Group Jacksonville (24/7, Verified)
(
  'VEG - Veterinary Emergency Group Jacksonville',
  'veg-jacksonville-fl',
  '4507 Town Center Pkwy',
  'Jacksonville Beach',
  'FL',
  '32246',
  '(904) 638-7549',
  'https://veg.com/locations/florida/jacksonville',
  true,
  'true-24-7',
  NULL,
  NULL,
  ARRAY['dogs', 'cats', 'birds', 'reptiles', 'small-mammals'],
  true,
  ARRAY['emergency-surgery', 'icu-critical-care', 'overnight-monitoring', 'ultrasound-imaging', 'blood-transfusions', 'oxygen-therapy', 'pain-management'],
  true,
  true,
  true,
  ARRAY['cash', 'credit-card', 'care-credit'],
  true,
  true,
  'premium',
  'free-lot',
  true,
  'verified'
),

-- 25. BluePearl Pet Hospital - Jacksonville (24/7, Verified)
(
  'BluePearl Pet Hospital - Jacksonville',
  'bluepearl-jacksonville-fl',
  '3444 Southside Blvd, Suite 103',
  'Jacksonville Beach',
  'FL',
  '32216',
  '(904) 646-1287',
  'https://bluepearlvet.com/hospital/jacksonville-fl',
  true,
  'true-24-7',
  NULL,
  NULL,
  ARRAY['dogs', 'cats'],
  true,
  ARRAY['emergency-surgery', 'icu-critical-care', 'overnight-monitoring', 'ultrasound-imaging', 'ct-scan', 'mri', 'oncology', 'orthopedic'],
  true,
  true,
  true,
  ARRAY['cash', 'credit-card', 'care-credit', 'scratchpay'],
  true,
  true,
  'premium',
  'free-lot',
  true,
  'verified'
),

-- 26. Pet Urgent Response and Emergency (PURE) (24/7, Verified)
(
  'Pet Urgent Response and Emergency (PURE)',
  'pure-vet-jacksonville-fl',
  '8117 Point Meadows Dr, Unit 107',
  'Jacksonville Beach',
  'FL',
  '32256',
  '(904) 922-7873',
  'https://pureveter.com',
  true,
  'true-24-7',
  NULL,
  NULL,
  ARRAY['dogs', 'cats'],
  false,
  ARRAY['emergency-surgery', 'icu-critical-care', 'overnight-monitoring', 'ultrasound-imaging'],
  true,
  true,
  false,
  ARRAY['cash', 'credit-card', 'care-credit'],
  true,
  true,
  'moderate',
  'free-lot',
  true,
  'verified'
)

ON CONFLICT (slug) DO NOTHING;

-- =================================================================
-- UPDATE CITY CLINIC COUNTS
-- (The trigger handles this on insert, but run manually to be safe)
-- =================================================================

UPDATE cities
SET clinic_count = (
    SELECT COUNT(*)
    FROM clinics
    WHERE clinics.city = cities.name AND clinics.state = cities.state AND clinics.is_active = true
)
WHERE slug IN (
  'springfield', 'richmond', 'lincoln', 'huntsville',
  'frederick', 'flowood', 'gainesville', 'port-charlotte',
  'jacksonville-beach'
);

-- =================================================================
-- VERIFICATION
-- =================================================================

SELECT city, state, COUNT(*) as clinic_count,
       COUNT(*) FILTER (WHERE is_24_7 = true) as twenty_four_seven_count,
       COUNT(*) FILTER (WHERE verification_status = 'verified') as verified_count
FROM clinics
WHERE city IN ('Springfield', 'Richmond', 'Lincoln', 'Huntsville', 'Frederick', 'Flowood', 'Gainesville', 'Port Charlotte', 'Jacksonville Beach')
GROUP BY city, state
ORDER BY city;

SELECT COUNT(*) as total_new_clinics
FROM clinics
WHERE city IN ('Springfield', 'Richmond', 'Lincoln', 'Huntsville', 'Frederick', 'Flowood', 'Gainesville', 'Port Charlotte', 'Jacksonville Beach');

-- =================================================================
-- EXPECTED RESULTS:
-- Springfield, MO:        3 clinics (0 true 24/7, 1 verified)
-- Richmond, VA:           5 clinics (4 true 24/7, 4 verified)
-- Lincoln, NE:            2 clinics (0 true 24/7, 1 verified)
-- Huntsville, AL:         3 clinics (1 true 24/7, 1 verified)
-- Frederick, MD:          3 clinics (1 true 24/7, 2 verified)
-- Gainesville, GA:        2 clinics (0 true 24/7, 1 verified)
-- Flowood, MS:            2 clinics (1 true 24/7, 1 verified)
-- Port Charlotte, FL:     2 clinics (0 true 24/7, 1 verified)
-- Jacksonville Beach, FL: 4 clinics (4 true 24/7, 4 verified)
-- TOTAL:                 26 new clinics
-- =================================================================
