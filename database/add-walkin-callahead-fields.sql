-- Add walk-in and call-ahead fields to clinics table
-- Run this in Supabase SQL Editor

-- Add new columns
ALTER TABLE clinics
ADD COLUMN IF NOT EXISTS accepts_walk_ins BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_call_ahead BOOLEAN DEFAULT false;

-- Add comments
COMMENT ON COLUMN clinics.accepts_walk_ins IS 'Clinic accepts walk-in patients without appointment';
COMMENT ON COLUMN clinics.requires_call_ahead IS 'Clinic requires calling before arrival';

-- Update VEG White Plains - accepts walk-ins
UPDATE clinics
SET
  accepts_walk_ins = true,
  special_notes = 'Stay with your pet throughout treatment',
  is_featured = true
WHERE name ILIKE '%VEG%'
  AND state = 'NY';

-- Verify
SELECT name, city, accepts_walk_ins, requires_call_ahead, special_notes
FROM clinics
WHERE state = 'NY'
ORDER BY is_featured DESC, is_24_7 DESC;
