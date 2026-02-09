import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { stateNameBySlug, stateAbbrBySlug } from '@/lib/state-data'
import StateCityPage from './page-client'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string }>
}): Promise<Metadata> {
  const { state, city: citySlug } = await params

  const stateAbbr = stateAbbrBySlug[state]
  if (!stateAbbr) return { title: 'Emergency Vet Finder' }

  const { data: city } = await supabase
    .from('cities')
    .select('name, state')
    .eq('slug', citySlug)
    .eq('state', stateAbbr)
    .single()

  if (!city) return { title: 'Emergency Vet Finder' }

  const stateName = stateNameBySlug[state] || city.state

  return {
    title: `Emergency Vet in ${city.name}, ${stateName} — Open Now | FindEmergencyVet.com`,
    description: `Find open 24/7 emergency vets and animal hospitals in ${city.name}, ${stateName}. Call now for immediate care, directions, and after-hours availability.`,
    alternates: {
      canonical: `https://findemergencyvet.com/${state}/${citySlug}`,
    },
    openGraph: {
      title: `Emergency Vet in ${city.name}, ${stateName} — Open Now`,
      description: `Find open emergency veterinary hospitals in ${city.name}, ${stateName}. Call directly, no delays.`,
      type: 'website',
    },
  }
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ state: string; city: string }>
}) {
  const { state, city: citySlug } = await params

  const stateAbbr = stateAbbrBySlug[state]
  if (!stateAbbr) notFound()

  const stateName = stateNameBySlug[state] || state

  const { data: city } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', citySlug)
    .eq('state', stateAbbr)
    .single()

  if (!city) notFound()

  // Fetch clinics with verification_status
  const { data: clinics } = await supabase
    .from('clinics')
    .select('id, slug, name, address, city, state, zip_code, phone, is_24_7, current_status, verification_status, has_exotic_specialist, google_rating, google_review_count, availability_type, accepts_walk_ins, requires_call_ahead, exotic_pets_accepted, parking_type, wheelchair_accessible, has_separate_cat_entrance, has_isolation_rooms')
    .eq('city', city.name)
    .eq('state', stateAbbr)
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('is_24_7', { ascending: false })
    .order('google_rating', { ascending: false, nullsFirst: false })

  // Fetch nearby cities (same state)
  const { data: nearbyCities } = await supabase
    .from('cities')
    .select('id, name, state, slug, clinic_count')
    .eq('state', stateAbbr)
    .neq('slug', citySlug)
    .order('clinic_count', { ascending: false })
    .limit(5)

  // VeterinaryCare structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': clinics?.map(clinic => ({
      '@type': 'VeterinaryCare',
      name: clinic.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: clinic.address,
        addressLocality: clinic.city,
        addressRegion: clinic.state,
        postalCode: clinic.zip_code || undefined,
      },
      telephone: clinic.phone,
      openingHours: clinic.is_24_7 ? 'Mo-Su 00:00-23:59' : undefined,
      areaServed: `${city.name}, ${stateName}`,
      ...(clinic.google_rating && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: clinic.google_rating,
          reviewCount: clinic.google_review_count || 1,
        },
      }),
    })) || [],
  }

  // BreadcrumbList structured data
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://findemergencyvet.com' },
      { '@type': 'ListItem', position: 2, name: stateName, item: `https://findemergencyvet.com/${state}` },
      { '@type': 'ListItem', position: 3, name: `${city.name}, ${stateAbbr}`, item: `https://findemergencyvet.com/${state}/${citySlug}` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <StateCityPage
        city={city}
        allClinics={clinics || []}
        nearbyCities={nearbyCities || []}
        stateSlug={state}
        stateName={stateName}
        stateAbbr={stateAbbr}
      />
    </>
  )
}
