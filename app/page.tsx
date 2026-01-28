import { supabase } from '@/lib/supabase'
import HomePage from './page-client'

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

  // Fetch top 3 clinics per city (24/7 first)
  const cityClinics: Record<string, any[]> = {}
  for (const city of cities || []) {
    const { data: clinics } = await supabase
      .from('clinics')
      .select('id, name, phone, is_24_7, current_status, has_exotic_specialist')
      .eq('city', city.name)
      .eq('state', city.state)
      .eq('is_active', true)
      .order('is_24_7', { ascending: false })
      .limit(3)
    cityClinics[city.slug] = clinics || []
  }

  return <HomePage clinicCount={count || 0} cities={cities || []} cityClinics={cityClinics} />
}
