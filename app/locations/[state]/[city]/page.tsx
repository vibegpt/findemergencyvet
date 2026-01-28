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
    title: `24 Hour Emergency Vet in ${city.name}, ${city.state} | Find Emergency Vet`,
    description: `Find open 24/7 emergency vets and animal hospitals in ${city.name}, ${city.state}. Call now for immediate care, directions, and after-hours availability.`,
    openGraph: {
      title: `24 Hour Emergency Vet in ${city.name}, ${city.state}`,
      description: `Find open 24/7 emergency vets and animal hospitals in ${city.name}, ${city.state}. Call now for immediate care.`,
      type: 'website',
    },
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

  // Fetch clinics with additional fields
  const { data: clinics } = await supabase
    .from('clinics')
    .select('id, name, address, city, state, zip_code, phone, latitude, longitude, is_24_7, current_status, has_surgery_suite, has_icu, has_exotic_specialist, accepts_care_credit, google_rating, google_review_count, exotic_pets_accepted, availability_type')
    .eq('city', city.name)
    .eq('state', city.state)
    .eq('is_active', true)
    .order('is_24_7', { ascending: false })
    .order('google_rating', { ascending: false, nullsFirst: false })

  // Fetch nearby cities (other cities in same state, excluding current)
  const { data: nearbyCities } = await supabase
    .from('cities')
    .select('id, name, state, slug, clinic_count')
    .eq('state', city.state)
    .neq('slug', citySlug)
    .order('clinic_count', { ascending: false })
    .limit(5)

  // Generate structured data for each clinic
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
      areaServed: `${city.name}, ${city.state}`,
      ...(clinic.google_rating && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: clinic.google_rating,
          reviewCount: clinic.google_review_count || 1,
        },
      }),
      ...(clinic.latitude && clinic.longitude && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: clinic.latitude,
          longitude: clinic.longitude,
        },
      }),
    })) || [],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CityPage
        city={city}
        allClinics={clinics || []}
        nearbyCities={nearbyCities || []}
      />
    </>
  )
}
