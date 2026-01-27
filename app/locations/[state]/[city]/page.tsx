import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import CityPage from './page-client'

export default async function CityPageWrapper({
  params,
}: {
  params: { state: string; city: string }
}) {
  const { data: city } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', params.city)
    .single()

  if (!city) notFound()

  const { data: clinics } = await supabase
    .from('clinics')
    .select('*')
    .eq('city', city.name)
    .eq('state', city.state)
    .eq('is_active', true)
    .order('is_24_7', { ascending: false })

  return <CityPage city={city} allClinics={clinics || []} />
}
