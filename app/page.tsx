import { supabase } from '@/lib/supabase'
import { Metadata } from 'next'
import HomePage from './page-client'

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://findemergencyvet.com',
  },
}

export default async function HomePageWrapper() {
  // Fetch total clinic count
  const { count } = await supabase
    .from('clinics')
    .select('*', { count: 'exact', head: true })

  // Fetch featured cities
  const { data: cities } = await supabase
    .from('cities')
    .select('*')
    .order('clinic_count', { ascending: false })
    .limit(2)

  // Fetch all clinics per city (24/7 first, then by rating)
  const cityClinics: Record<string, any[]> = {}
  for (const city of cities || []) {
    const { data: clinics } = await supabase
      .from('clinics')
      .select('id, name, phone, address, city, state, is_24_7, current_status, has_exotic_specialist, availability_type, google_rating, google_review_count, is_featured, accepts_walk_ins, requires_call_ahead')
      .eq('city', city.name)
      .eq('state', city.state)
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('is_24_7', { ascending: false })
      .order('google_rating', { ascending: false, nullsFirst: false })
    cityClinics[city.slug] = clinics || []
  }

  return <HomePage clinicCount={count || 0} cities={cities || []} cityClinics={cityClinics} />
}
