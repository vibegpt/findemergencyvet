import { supabase } from '@/lib/supabase'
import { computeClinicStatus, HoursDetail } from '@/lib/clinic-status'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { stateNameBySlug, stateAbbrBySlug } from '@/lib/state-data'
import StateCityPage from './page-client'

// ISR: revalidate hourly for open/closed accuracy
export const revalidate = 3600

// Per-city metadata overrides for high-priority SEO targets.
// Key format: "{state-slug}/{city-slug}"
// Add new entries here as priority cities are identified — do not modify the
// fallback template in generateMetadata unless changing the site-wide default.
const cityMetaOverrides: Record<string, { title: string; description: string }> = {
  'georgia/gainesville': {
    title: 'Emergency Vet Gainesville GA | 24/7 Animal Hospital | FindEmergencyVet',
    description: 'Find emergency veterinary clinics in Gainesville, GA. Verified hours, open/closed status, and tap-to-call for 24/7 animal hospitals in Gainesville. Updated 2026.',
  },
  'virginia/richmond': {
    title: 'Emergency Vet Richmond VA | 24/7 Animal Hospital | FindEmergencyVet',
    description: 'Find emergency veterinary clinics in Richmond, VA. Verified hours, open/closed status, and tap-to-call for 24/7 animal hospitals in Richmond. Updated 2026.',
  },
  'missouri/springfield': {
    title: 'Emergency Vet Springfield MO | 24/7 Animal Hospital | FindEmergencyVet',
    description: 'Find emergency veterinary clinics in Springfield, MO. Verified hours, open/closed status, and tap-to-call for 24/7 emergency animal hospitals. Updated 2026.',
  },
  'florida/port-charlotte': {
    title: 'Emergency Vet Port Charlotte FL | 24/7 Animal Care | FindEmergencyVet',
    description: 'Find emergency veterinary clinics in Port Charlotte, FL. Verified hours, open/closed status, and tap-to-call for 24/7 emergency animal hospitals. Updated 2026.',
  },
}

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
    .select('name, state, clinic_count')
    .eq('slug', citySlug)
    .eq('state', stateAbbr)
    .single()

  if (!city) return { title: 'Emergency Vet Finder' }

  const stateName = stateNameBySlug[state] || city.state
  const override = cityMetaOverrides[`${state}/${citySlug}`]

  return {
    title: override?.title ?? `Emergency Vet in ${city.name}, ${stateName} — Open Now | FindEmergencyVet.com`,
    description: override?.description ?? `Find open 24/7 emergency vets and animal hospitals in ${city.name}, ${stateName}. Call now for immediate care, directions, and after-hours availability.`,
    alternates: {
      canonical: `https://findemergencyvet.com/${state}/${citySlug}`,
    },
    openGraph: {
      title: override?.title ?? `Emergency Vet in ${city.name}, ${stateName} — Open Now`,
      description: override?.description ?? `Find open emergency veterinary hospitals in ${city.name}, ${stateName}. Call directly, no delays.`,
      type: 'website',
    },
    // Noindex single-clinic pages — not enough content to merit indexing.
    // Paired with the sitemap filter (gte clinic_count 2) in app/sitemap.ts.
    ...(city.clinic_count === 1 && { robots: { index: false, follow: true } }),
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
  const { data: rawClinics } = await supabase
    .from('clinics')
    .select('id, slug, name, address, city, state, zip_code, phone, is_24_7, hours_detail, hours_description, availability_type, timezone, verification_status, has_exotic_specialist, google_rating, google_review_count, accepts_walk_ins, requires_call_ahead, exotic_pets_accepted, parking_type, wheelchair_accessible, has_separate_cat_entrance, has_isolation_rooms')
    .eq('city', city.name)
    .eq('state', stateAbbr)
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('is_24_7', { ascending: false })

  const clinics = (rawClinics || []).map(clinic => ({
    ...clinic,
    computedStatus: computeClinicStatus(
      clinic.is_24_7,
      clinic.hours_detail as HoursDetail | null,
      clinic.availability_type,
      clinic.hours_description,
      clinic.state,
      clinic.timezone,
    ),
    detailUrl: clinic.slug ? `/${state}/${citySlug}/${clinic.slug}` : null,
  }))

  // Guard: 0-clinic pages have no content — return 404 rather than render an empty page.
  // This is the runtime safety net if bad data bypasses the sitemap filter.
  if (clinics.length === 0) notFound()

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
        allClinics={clinics}
        nearbyCities={nearbyCities || []}
        stateSlug={state}
        stateName={stateName}
        stateAbbr={stateAbbr}
      />
    </>
  )
}
