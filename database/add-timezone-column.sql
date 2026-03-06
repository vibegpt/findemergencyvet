-- Migration: Add timezone column to clinics table
-- Run this in Supabase SQL editor

ALTER TABLE clinics
ADD COLUMN IF NOT EXISTS timezone TEXT;

-- Back-fill from state using a lookup
-- This covers the most common case. Override per-clinic where a state
-- spans multiple timezones (IN, KY, TN, ND, SD, KS, NE, TX, FL, ID, OR, WA)

UPDATE clinics SET timezone = CASE state
  WHEN 'AL' THEN 'America/Chicago'
  WHEN 'AK' THEN 'America/Anchorage'
  WHEN 'AZ' THEN 'America/Phoenix'
  WHEN 'AR' THEN 'America/Chicago'
  WHEN 'CA' THEN 'America/Los_Angeles'
  WHEN 'CO' THEN 'America/Denver'
  WHEN 'CT' THEN 'America/New_York'
  WHEN 'DE' THEN 'America/New_York'
  WHEN 'FL' THEN 'America/New_York'
  WHEN 'GA' THEN 'America/New_York'
  WHEN 'HI' THEN 'Pacific/Honolulu'
  WHEN 'ID' THEN 'America/Denver'
  WHEN 'IL' THEN 'America/Chicago'
  WHEN 'IN' THEN 'America/Indiana/Indianapolis'
  WHEN 'IA' THEN 'America/Chicago'
  WHEN 'KS' THEN 'America/Chicago'
  WHEN 'KY' THEN 'America/New_York'
  WHEN 'LA' THEN 'America/Chicago'
  WHEN 'ME' THEN 'America/New_York'
  WHEN 'MD' THEN 'America/New_York'
  WHEN 'MA' THEN 'America/New_York'
  WHEN 'MI' THEN 'America/Detroit'
  WHEN 'MN' THEN 'America/Chicago'
  WHEN 'MS' THEN 'America/Chicago'
  WHEN 'MO' THEN 'America/Chicago'
  WHEN 'MT' THEN 'America/Denver'
  WHEN 'NE' THEN 'America/Chicago'
  WHEN 'NV' THEN 'America/Los_Angeles'
  WHEN 'NH' THEN 'America/New_York'
  WHEN 'NJ' THEN 'America/New_York'
  WHEN 'NM' THEN 'America/Denver'
  WHEN 'NY' THEN 'America/New_York'
  WHEN 'NC' THEN 'America/New_York'
  WHEN 'ND' THEN 'America/Chicago'
  WHEN 'OH' THEN 'America/New_York'
  WHEN 'OK' THEN 'America/Chicago'
  WHEN 'OR' THEN 'America/Los_Angeles'
  WHEN 'PA' THEN 'America/New_York'
  WHEN 'RI' THEN 'America/New_York'
  WHEN 'SC' THEN 'America/New_York'
  WHEN 'SD' THEN 'America/Chicago'
  WHEN 'TN' THEN 'America/Chicago'
  WHEN 'TX' THEN 'America/Chicago'
  WHEN 'UT' THEN 'America/Denver'
  WHEN 'VT' THEN 'America/New_York'
  WHEN 'VA' THEN 'America/New_York'
  WHEN 'WA' THEN 'America/Los_Angeles'
  WHEN 'WV' THEN 'America/New_York'
  WHEN 'WI' THEN 'America/Chicago'
  WHEN 'WY' THEN 'America/Denver'
  WHEN 'DC' THEN 'America/New_York'
  ELSE 'America/New_York'
END
WHERE timezone IS NULL;

-- Verify
SELECT state, timezone, COUNT(*) FROM clinics GROUP BY state, timezone ORDER BY state;
