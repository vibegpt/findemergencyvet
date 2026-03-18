/**
 * export-missing-hours.ts
 *
 * Exports all clinics missing hours_detail as a CSV.
 * Use this to work through populating hours data systematically.
 *
 * Run with:
 *   NEXT_PUBLIC_SUPABASE_URL=<url> NEXT_PUBLIC_SUPABASE_ANON_KEY=<key> npx tsx scripts/export-missing-hours.ts
 *
 * Or pipe to a file:
 *   NEXT_PUBLIC_SUPABASE_URL=<url> NEXT_PUBLIC_SUPABASE_ANON_KEY=<key> npx tsx scripts/export-missing-hours.ts > missing-hours.csv
 *
 * Columns: name, city, state, phone, website, slug, verification_status
 */

import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.')
  console.error('Example:')
  console.error('  NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... npx tsx scripts/export-missing-hours.ts')
  process.exit(1)
}

const supabase = createClient(url, key)

async function main() {
  const { data: clinics, error } = await supabase
    .from('clinics')
    .select('name, city, state, phone, website, slug, verification_status, is_active')
    .is('hours_detail', null)
    .eq('is_active', true)
    .order('state')
    .order('city')
    .order('name')

  if (error) {
    console.error('Supabase error:', error.message)
    process.exit(1)
  }

  if (!clinics || clinics.length === 0) {
    console.error('No clinics missing hours_detail — nothing to export.')
    process.exit(0)
  }

  // CSV header
  const header = ['name', 'city', 'state', 'phone', 'website', 'slug', 'verification_status']
  console.log(header.join(','))

  // CSV rows — wrap fields in quotes to handle commas in names/addresses
  for (const c of clinics) {
    const row = [
      c.name,
      c.city,
      c.state,
      c.phone ?? '',
      c.website ?? '',
      c.slug,
      c.verification_status ?? '',
    ].map(field => `"${String(field).replace(/"/g, '""')}"`)
    console.log(row.join(','))
  }

  process.stderr.write(`\nExported ${clinics.length} clinics missing hours_detail.\n`)
}

main()
