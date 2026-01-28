-- Update VEG White Plains with special notes
-- Run this in Supabase SQL Editor

UPDATE clinics
SET special_notes = 'Walk-ins accepted • Stay with your pet throughout treatment'
WHERE name ILIKE '%VEG%'
  AND (city = 'White Plains' OR city = 'Westchester')
  AND state = 'NY';

-- Verify the update
SELECT name, city, state, special_notes
FROM clinics
WHERE name ILIKE '%VEG%' AND state = 'NY';
