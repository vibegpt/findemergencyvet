import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  // Check city records
  const { data: cities, error: citiesError } = await supabase
    .from('cities')
    .select('name, state, slug, clinic_count')
    .in('slug', ['richmond', 'frederick', 'jacksonville-beach'])

  // Check clinics for Richmond
  const { data: richmondClinics, error: richmondError } = await supabase
    .from('clinics')
    .select('id, name, city, state, is_active')
    .eq('city', 'Richmond')
    .eq('state', 'VA')

  // Check clinics for Frederick
  const { data: frederickClinics, error: frederickError } = await supabase
    .from('clinics')
    .select('id, name, city, state, is_active')
    .eq('city', 'Frederick')
    .eq('state', 'MD')

  // Also check if there are clinics with different state values for these cities
  const { data: allRichmond, error: allRichmondError } = await supabase
    .from('clinics')
    .select('id, name, city, state')
    .ilike('city', '%richmond%')

  const { data: allFrederick, error: allFrederickError } = await supabase
    .from('clinics')
    .select('id, name, city, state')
    .ilike('city', '%frederick%')

  return NextResponse.json({
    cities: { data: cities, error: citiesError },
    richmond_VA: { count: richmondClinics?.length, error: richmondError, clinics: richmondClinics },
    frederick_MD: { count: frederickClinics?.length, error: frederickError, clinics: frederickClinics },
    all_richmond_like: { data: allRichmond, error: allRichmondError },
    all_frederick_like: { data: allFrederick, error: allFrederickError },
  })
}
