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

  return <HomePage clinicCount={count || 0} cities={cities || []} />
}
