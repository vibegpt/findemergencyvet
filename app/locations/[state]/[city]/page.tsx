import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import CityPage from './page-client'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string }>
}): Promise<Metadata> {
  const { city: citySlug } = await params

  const { data: city } = await supabase
    .from('cities')
    .select('name, state')
    .eq('slug', citySlug)
    .single()

  if (!city) {
    return {
      title: '24/7 Emergency Vet — FindEmergencyVet.com',
    }
  }

  return {
    title: `24/7 Emergency Vet in ${city.name}, ${city.state} — Phone, Hours & Directions`,
    description: `Find open 24/7 emergency vets and animal hospitals in ${city.name}, ${city.state}. Call now or see directions to the nearest clinic — including live status and after-hours care info.`,
  }
}

export default async function CityPageWrapper({
  params,
}: {
  params: Promise<{ state: string; city: string }>
}) {
  const { city: citySlug } = await params

  const { data: city } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', citySlug)
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
