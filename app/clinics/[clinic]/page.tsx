import { supabase } from '@/lib/supabase'
import { notFound, permanentRedirect } from 'next/navigation'
import { stateSlugByAbbr } from '@/lib/state-data'

// This route now permanently redirects to the canonical clinic profile URL:
// /clinics/{slug} → /{state}/{city-slug}/{slug}

export default async function ClinicRedirectPage({
  params,
}: {
  params: Promise<{ clinic: string }>
}) {
  const { clinic: clinicSlug } = await params

  const { data: clinic } = await supabase
    .from('clinics')
    .select('slug, city, state')
    .eq('slug', clinicSlug)
    .single()

  if (!clinic) notFound()

  const stateSlug = stateSlugByAbbr[clinic.state]
  if (!stateSlug) notFound()

  // Look up canonical city slug from cities table
  const { data: cityRecord } = await supabase
    .from('cities')
    .select('slug')
    .eq('name', clinic.city)
    .eq('state', clinic.state)
    .single()

  // Fall back to slugifying the city name if no DB record found
  const citySlug = cityRecord?.slug ?? clinic.city.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  permanentRedirect(`/${stateSlug}/${citySlug}/${clinicSlug}`)
}
