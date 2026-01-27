-- =================================================================
-- COMPLETE SUPABASE DATABASE SCHEMA
-- Emergency Vet Directory with Full Differentiation Features
-- =================================================================

-- Drop existing tables if recreating from scratch
DROP TABLE IF EXISTS clinic_services CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS clinics CASCADE;
DROP TABLE IF EXISTS cities CASCADE;

-- =================================================================
-- CITIES TABLE
-- =================================================================

CREATE TABLE IF NOT EXISTS cities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  clinic_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =================================================================
-- CLINICS TABLE (Main table with all differentiation features)
-- =================================================================

CREATE TABLE IF NOT EXISTS clinics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic Info
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT,
  phone TEXT NOT NULL,
  website TEXT,
  
  -- Location Data
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- DIFFERENTIATION FEATURE #1: True 24/7 vs Extended Hours
  is_24_7 BOOLEAN DEFAULT false,
  availability_type TEXT CHECK (availability_type IN (
    'true-24-7',        -- Staff physically on-site 24/7
    'on-call-24-7',     -- Call first, vet comes in if needed
    'extended-hours',   -- Open late (until 10-11 PM)
    'emergency-only',   -- Regular hours + emergency appointments
    'urgent-care'       -- Urgent care hours only
  )),
  hours_detail JSONB, -- Detailed hours: {"monday": "24/7", "tuesday": "24/7", etc.}
  after_hours_entrance TEXT, -- Special entrance info for after-hours
  
  -- DIFFERENTIATION FEATURE #2: Exotic Pets
  exotic_pets_accepted TEXT[] DEFAULT '{}',
  -- Options: 'dogs', 'cats', 'birds', 'reptiles', 'rabbits', 'ferrets', 
  --          'guinea-pigs', 'hamsters', 'chinchillas', 'hedgehogs', 
  --          'sugar-gliders', 'small-mammals', 'pocket-pets', 'exotic-all'
  has_exotic_specialist BOOLEAN DEFAULT false,
  exotic_pets_notes TEXT, -- "Avian certified", "Reptile specialist on staff"
  
  -- DIFFERENTIATION FEATURE #3: Specialty Services
  services_offered TEXT[] DEFAULT '{}',
  -- Options: 'emergency-surgery', 'icu-critical-care', 'overnight-monitoring',
  --          'board-certified-specialists', 'ultrasound-imaging', 'ct-scan',
  --          'mri', 'blood-transfusions', 'oxygen-therapy', 'pain-management',
  --          'euthanasia', 'cardiology', 'neurology', 'oncology', 'orthopedic'
  has_surgery_suite BOOLEAN DEFAULT false,
  has_icu BOOLEAN DEFAULT false,
  has_specialists BOOLEAN DEFAULT false,
  specialists_available TEXT[], -- ['cardiology', 'neurology', 'oncology']
  
  -- DIFFERENTIATION FEATURE #4: Wait Time Estimates
  typical_wait_minutes_min INTEGER, -- Minimum typical wait
  typical_wait_minutes_max INTEGER, -- Maximum typical wait
  wait_time_category TEXT CHECK (wait_time_category IN (
    'short',      -- 0-30 minutes
    'moderate',   -- 30-90 minutes
    'long',       -- 90-180 minutes
    'very-long',  -- 180+ minutes
    'unknown'
  )),
  wait_time_last_updated TIMESTAMP WITH TIME ZONE,
  wait_time_reports_count INTEGER DEFAULT 0,
  wait_time_notes TEXT, -- "Longer on weekends", "Shortest wait Mon-Thu mornings"
  
  -- DIFFERENTIATION FEATURE #5: Cost Transparency
  emergency_exam_cost_min INTEGER, -- Minimum emergency exam fee
  emergency_exam_cost_max INTEGER, -- Maximum emergency exam fee
  typical_visit_cost_min INTEGER,  -- Typical total visit cost min
  typical_visit_cost_max INTEGER,  -- Typical total visit cost max
  cost_tier TEXT CHECK (cost_tier IN (
    'budget',    -- $
    'moderate',  -- $$
    'premium',   -- $$$
    'luxury',    -- $$$$
    'unknown'
  )),
  cost_notes TEXT, -- "Prices higher on weekends", "Free triage consultation"
  
  -- DIFFERENTIATION FEATURE #6: Payment Methods
  payment_methods TEXT[] DEFAULT '{}',
  -- Options: 'cash', 'credit-card', 'debit-card', 'pet-insurance',
  --          'care-credit', 'scratchpay', 'payment-plans', 'checks'
  accepts_pet_insurance BOOLEAN DEFAULT false,
  accepts_care_credit BOOLEAN DEFAULT false,
  accepts_scratchpay BOOLEAN DEFAULT false,
  payment_plans_available BOOLEAN DEFAULT false,
  payment_notes TEXT, -- "50% deposit required", "Payment in full required"
  
  -- DIFFERENTIATION FEATURE #7: Real-Time Status
  current_status TEXT CHECK (current_status IN (
    'confirmed-open',   -- Verified open in last 2 hours
    'likely-open',      -- Based on listed hours
    'call-to-confirm',  -- Haven't verified recently
    'closed',           -- Confirmed closed
    'at-capacity',      -- Open but not accepting new patients
    'unknown'
  )) DEFAULT 'unknown',
  status_last_verified TIMESTAMP WITH TIME ZONE,
  status_verified_by TEXT, -- 'staff', 'user-report', 'automated', 'clinic-api'
  is_accepting_patients BOOLEAN DEFAULT true,
  
  -- DIFFERENTIATION FEATURE #8: Facility Info
  parking_type TEXT CHECK (parking_type IN (
    'free-lot',
    'paid-lot',
    'street-only',
    'limited',
    'valet',
    'unknown'
  )),
  parking_notes TEXT, -- "Large lot", "Limited street parking"
  wheelchair_accessible BOOLEAN DEFAULT false,
  has_separate_cat_entrance BOOLEAN DEFAULT false,
  has_isolation_rooms BOOLEAN DEFAULT false,
  
  -- Reviews & Ratings
  google_rating DECIMAL(2, 1), -- 4.5, 3.8, etc.
  google_review_count INTEGER DEFAULT 0,
  yelp_rating DECIMAL(2, 1),
  yelp_review_count INTEGER DEFAULT 0,
  
  -- Verification & Quality
  verification_status TEXT CHECK (verification_status IN (
    'verified',      -- We've called and confirmed all info
    'unverified',    -- Listed but not verified
    'pending',       -- In process of verification
    'outdated'       -- Needs re-verification
  )) DEFAULT 'unverified',
  last_verified_date DATE,
  verified_by TEXT, -- Name of staff who verified
  
  -- Additional Info
  description TEXT,
  special_notes TEXT, -- "COVID protocols", "Call before arriving"
  languages_spoken TEXT[], -- ['english', 'spanish', 'mandarin']
  
  -- Metadata
  is_featured BOOLEAN DEFAULT false, -- For premium/promoted listings
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =================================================================
-- SERVICES TABLE (Optional - for more granular service tracking)
-- =================================================================

CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'emergency', 'specialty', 'diagnostic', 'treatment'
  description TEXT,
  icon TEXT, -- Emoji or icon identifier
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS clinic_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  available_24_7 BOOLEAN DEFAULT false,
  additional_cost INTEGER, -- If service has additional cost
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(clinic_id, service_id)
);

-- =================================================================
-- INDEXES FOR PERFORMANCE
-- =================================================================

-- Basic search indexes
CREATE INDEX IF NOT EXISTS idx_clinics_city_state ON clinics(city, state);
CREATE INDEX IF NOT EXISTS idx_clinics_state ON clinics(state);
CREATE INDEX IF NOT EXISTS idx_clinics_slug ON clinics(slug);
CREATE INDEX IF NOT EXISTS idx_clinics_is_active ON clinics(is_active);

-- Differentiation feature indexes
CREATE INDEX IF NOT EXISTS idx_clinics_is_24_7 ON clinics(is_24_7);
CREATE INDEX IF NOT EXISTS idx_clinics_availability_type ON clinics(availability_type);
CREATE INDEX IF NOT EXISTS idx_clinics_exotic_pets ON clinics USING GIN(exotic_pets_accepted);
CREATE INDEX IF NOT EXISTS idx_clinics_services ON clinics USING GIN(services_offered);
CREATE INDEX IF NOT EXISTS idx_clinics_payment_methods ON clinics USING GIN(payment_methods);
CREATE INDEX IF NOT EXISTS idx_clinics_current_status ON clinics(current_status);
CREATE INDEX IF NOT EXISTS idx_clinics_cost_tier ON clinics(cost_tier);

-- Location indexes
CREATE INDEX IF NOT EXISTS idx_clinics_lat_long ON clinics(latitude, longitude);

-- City indexes
CREATE INDEX IF NOT EXISTS idx_cities_slug ON cities(slug);
CREATE INDEX IF NOT EXISTS idx_cities_state ON cities(state);

-- =================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =================================================================

-- Enable RLS
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_services ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on clinics" 
  ON clinics FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Allow public read access on cities" 
  ON cities FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access on services" 
  ON services FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access on clinic_services" 
  ON clinic_services FOR SELECT 
  USING (true);

-- =================================================================
-- FUNCTIONS & TRIGGERS
-- =================================================================

-- Function to update clinic count in cities
CREATE OR REPLACE FUNCTION update_city_clinic_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE cities
  SET 
    clinic_count = (
      SELECT COUNT(*)
      FROM clinics
      WHERE clinics.city = cities.name 
        AND clinics.state = cities.state
        AND clinics.is_active = true
    ),
    updated_at = NOW()
  WHERE cities.name = COALESCE(NEW.city, OLD.city)
    AND cities.state = COALESCE(NEW.state, OLD.state);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update clinic counts
DROP TRIGGER IF EXISTS update_clinic_count_trigger ON clinics;
CREATE TRIGGER update_clinic_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON clinics
  FOR EACH ROW
  EXECUTE FUNCTION update_city_clinic_count();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for clinics updated_at
DROP TRIGGER IF EXISTS update_clinics_updated_at ON clinics;
CREATE TRIGGER update_clinics_updated_at
  BEFORE UPDATE ON clinics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for cities updated_at
DROP TRIGGER IF EXISTS update_cities_updated_at ON cities;
CREATE TRIGGER update_cities_updated_at
  BEFORE UPDATE ON cities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =================================================================
-- INITIAL DATA - CITIES
-- =================================================================

INSERT INTO cities (name, state, slug, clinic_count) VALUES 
  ('Westchester', 'NY', 'westchester', 0),
  ('Rochester', 'NY', 'rochester', 0)
ON CONFLICT (slug) DO NOTHING;

-- =================================================================
-- INITIAL DATA - COMMON SERVICES
-- =================================================================

INSERT INTO services (slug, name, category, description, icon) VALUES
  ('emergency-surgery', 'Emergency Surgery', 'emergency', 'On-site surgical capabilities for emergency procedures', '🔪'),
  ('icu-critical-care', 'ICU / Critical Care', 'emergency', '24/7 intensive care unit with monitoring', '🏥'),
  ('overnight-monitoring', 'Overnight Monitoring', 'emergency', 'Overnight patient monitoring and care', '🌙'),
  ('ultrasound-imaging', 'Ultrasound / Imaging', 'diagnostic', 'Ultrasound, X-ray, and diagnostic imaging', '📸'),
  ('blood-transfusions', 'Blood Transfusions', 'treatment', 'Emergency blood transfusion capabilities', '🩸'),
  ('oxygen-therapy', 'Oxygen Therapy', 'treatment', 'Oxygen supplementation for respiratory emergencies', '💨'),
  ('pain-management', 'Pain Management', 'treatment', 'Advanced pain management protocols', '💊'),
  ('euthanasia', 'Euthanasia Services', 'treatment', 'Compassionate end-of-life care', '🕊️'),
  ('cardiology', 'Cardiology', 'specialty', 'Board-certified cardiologist on staff', '❤️'),
  ('neurology', 'Neurology', 'specialty', 'Board-certified neurologist on staff', '🧠'),
  ('oncology', 'Oncology', 'specialty', 'Cancer treatment and oncology services', '🎗️'),
  ('orthopedic', 'Orthopedic Surgery', 'specialty', 'Bone and joint surgery specialists', '🦴')
ON CONFLICT (slug) DO NOTHING;

-- =================================================================
-- HELPFUL COMMENTS
-- =================================================================

COMMENT ON TABLE clinics IS 'Main table for emergency veterinary clinics with comprehensive differentiation features';
COMMENT ON COLUMN clinics.availability_type IS 'Distinguishes true 24/7 from on-call or extended hours';
COMMENT ON COLUMN clinics.exotic_pets_accepted IS 'Array of exotic pet types accepted (birds, reptiles, etc.)';
COMMENT ON COLUMN clinics.services_offered IS 'Array of specialty services available';
COMMENT ON COLUMN clinics.payment_methods IS 'Array of accepted payment methods';
COMMENT ON COLUMN clinics.current_status IS 'Real-time operational status';
COMMENT ON COLUMN clinics.cost_tier IS 'Relative cost level: budget ($) to luxury ($$$$)';
COMMENT ON COLUMN clinics.wait_time_category IS 'Typical wait time range';

-- =================================================================
-- COMPLETE!
-- =================================================================

-- To verify the schema was created correctly, run:
-- SELECT table_name, column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'clinics' 
-- ORDER BY ordinal_position;
