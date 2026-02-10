import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  // Test 1: Simple count
  const { data: count, error: countError } = await supabase
    .from('clinics')
    .select('id', { count: 'exact', head: true })
    .eq('city', 'Jacksonville Beach')
    .eq('state', 'FL')
    .eq('is_active', true)

  // Test 2: Full query (same as page.tsx)
  const { data: clinics, error: clinicsError } = await supabase
    .from('clinics')
    .select('id, slug, name, address, city, state, zip_code, phone, is_24_7, current_status, verification_status, has_exotic_specialist, google_rating, google_review_count, availability_type, accepts_walk_ins, requires_call_ahead, exotic_pets_accepted, parking_type, wheelchair_accessible, has_separate_cat_entrance, has_isolation_rooms')
    .eq('city', 'Jacksonville Beach')
    .eq('state', 'FL')
    .eq('is_active', true)

  // Test 3: Minimal query
  const { data: minimal, error: minimalError } = await supabase
    .from('clinics')
    .select('id, name, city, state')
    .eq('city', 'Jacksonville Beach')
    .eq('state', 'FL')
    .eq('is_active', true)

  return NextResponse.json({
    test1_count: { count, error: countError },
    test2_full: { count: clinics?.length, error: clinicsError, firstClinic: clinics?.[0]?.name },
    test3_minimal: { count: minimal?.length, error: minimalError, clinics: minimal?.map(c => c.name) },
  })
}
