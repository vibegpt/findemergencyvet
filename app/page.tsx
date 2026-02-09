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

  const { data: allCities } = await supabase
    .from('cities')
    .select('id, name, state, slug, clinic_count')
    .order('state', { ascending: true })
    .order('name', { ascending: true })

  return (
    <HomePage
      clinicCount={count || 0}
      allCities={allCities || []}
    />
  )
}
