-- =================================================================
-- PHASE 1: ZERO-KD CITY EXPANSION
-- 51 keywords with 0 KD = 2,970 monthly searches @ $2.69 avg CPC
-- =================================================================

-- TOP 20 HIGHEST-VOLUME ZERO-KD CITIES
-- Target: Weeks 1-4

INSERT INTO cities (name, state, slug, clinic_count) VALUES
  -- Tier 1: 200+ monthly volume
  ('Eden Prairie', 'MN', 'eden-prairie', 0),

  -- Tier 2: 100-200 monthly volume
  ('Gainesville', 'GA', 'gainesville-ga', 0),
  ('Mechanicsville', 'VA', 'mechanicsville', 0),
  ('Flowood', 'MS', 'flowood', 0),
  ('Florence', 'SC', 'florence-sc', 0),
  ('Manassas', 'VA', 'manassas', 0),
  ('Vass', 'NC', 'vass', 0),
  ('Antioch', 'CA', 'antioch', 0),
  ('Denison', 'TX', 'denison', 0),

  -- Tier 3: 70-100 monthly volume
  ('Beaumont', 'TX', 'beaumont', 0),
  ('Hernando', 'FL', 'hernando', 0),
  ('Cape Girardeau', 'MO', 'cape-girardeau', 0),
  ('Fort Mill', 'SC', 'fort-mill', 0),
  ('Coos Bay', 'OR', 'coos-bay', 0),
  ('Jacksonville Beach', 'FL', 'jacksonville-beach', 0),
  ('Chesapeake', 'VA', 'chesapeake', 0),
  ('Myrtle Beach', 'SC', 'myrtle-beach', 0),
  ('Springfield', 'MO', 'springfield-mo', 0),
  ('Lake Charles', 'LA', 'lake-charles', 0),
  ('Port Charlotte', 'FL', 'port-charlotte', 0)
ON CONFLICT (slug) DO NOTHING;

-- =================================================================
-- PHASE 2: REMAINING ZERO-KD CITIES
-- Target: Weeks 5-8
-- =================================================================

INSERT INTO cities (name, state, slug, clinic_count) VALUES
  -- Additional cities from keyword research
  ('Bradenton', 'FL', 'bradenton', 0),
  ('Ames', 'IA', 'ames', 0),
  ('Ardmore', 'OK', 'ardmore', 0),
  ('Benson', 'NC', 'benson', 0),
  ('Bridgeton', 'MO', 'bridgeton', 0),
  ('Greenwich', 'CT', 'greenwich', 0),
  ('Lansing', 'MI', 'lansing', 0),
  ('Lincoln', 'NE', 'lincoln', 0),
  ('Longwood', 'FL', 'longwood', 0),
  ('Mebane', 'NC', 'mebane', 0),
  ('Sedalia', 'MO', 'sedalia', 0),
  ('Sikeston', 'MO', 'sikeston', 0),
  ('Temple', 'TX', 'temple', 0),
  ('Valdosta', 'GA', 'valdosta', 0),
  ('Spring Hill', 'FL', 'spring-hill', 0),
  ('Pensacola', 'FL', 'pensacola', 0),
  ('Riverside', 'CA', 'riverside', 0),
  ('Rock Hill', 'SC', 'rock-hill', 0),
  ('Allen', 'TX', 'allen', 0),
  ('Beckley', 'WV', 'beckley', 0),
  ('Fernandina Beach', 'FL', 'fernandina-beach', 0),
  ('Fort Dodge', 'IA', 'fort-dodge', 0),
  ('Fort Smith', 'AR', 'fort-smith', 0),
  ('Hermitage', 'TN', 'hermitage', 0),
  ('Huntingtown', 'MD', 'huntingtown', 0),
  ('Huntsville', 'AL', 'huntsville', 0),
  ('Fayetteville', 'NC', 'fayetteville', 0),
  ('Lafayette', 'LA', 'lafayette', 0),
  ('Lyndhurst', 'NJ', 'lyndhurst', 0),
  ('Madison Heights', 'MI', 'madison-heights', 0),
  ('Mt Vernon', 'NY', 'mt-vernon', 0),
  ('Murrells Inlet', 'SC', 'murrells-inlet', 0),
  ('Norristown', 'PA', 'norristown', 0),
  ('Ottumwa', 'IA', 'ottumwa', 0),
  ('Petoskey', 'MI', 'petoskey', 0),
  ('Prosper', 'TX', 'prosper', 0),
  ('Rutland', 'VT', 'rutland', 0),
  ('Troy', 'AL', 'troy', 0),
  ('Vallejo', 'CA', 'vallejo', 0),
  ('Keene', 'NH', 'keene', 0),
  ('Grand Blanc', 'MI', 'grand-blanc', 0),
  ('Mosinee', 'WI', 'mosinee', 0),
  ('Mt Pleasant', 'TX', 'mt-pleasant', 0),
  ('Plantation', 'FL', 'plantation', 0),
  ('Eatonton', 'GA', 'eatonton', 0),
  ('Scarborough', 'ME', 'scarborough', 0),
  ('St Augustine', 'FL', 'st-augustine', 0),
  ('Johns Island', 'SC', 'johns-island', 0)
ON CONFLICT (slug) DO NOTHING;

-- =================================================================
-- STATE GROUPINGS FOR INTERNAL LINKING
-- =================================================================

-- Florida (10 cities) - High priority cluster
-- Hernando, Jacksonville Beach, Port Charlotte, Bradenton,
-- Longwood, Spring Hill, Pensacola, Fernandina Beach,
-- Plantation, St Augustine

-- South Carolina (5 cities)
-- Florence, Fort Mill, Myrtle Beach, Rock Hill,
-- Murrells Inlet, Johns Island

-- Texas (6 cities)
-- Beaumont, Denison, Temple, Allen, Prosper, Mt Pleasant

-- Virginia (3 cities)
-- Mechanicsville, Manassas, Chesapeake

-- Missouri (4 cities)
-- Cape Girardeau, Springfield, Bridgeton, Sedalia, Sikeston

-- =================================================================
-- NOTES
-- =================================================================
-- 1. All cities start with clinic_count = 0
-- 2. clinic_count will auto-update when clinics are added (via trigger)
-- 3. Cities with 0 clinics will show "Coming soon" messaging
-- 4. Phase 1 cities should be prioritized for clinic data entry
