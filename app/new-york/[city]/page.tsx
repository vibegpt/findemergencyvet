import { supabase } from '@/lib/supabase'
import { computeClinicStatus, HoursDetail } from '@/lib/clinic-status'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import ClinicCard, { ClinicCardData } from '@/components/clinic/ClinicCard'

// ISR: revalidate hourly for open/closed accuracy
export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>
}): Promise<Metadata> {
  const { city: citySlug } = await params

  const { data: city } = await supabase
    .from('cities')
    .select('name, state, clinic_count')
    .eq('slug', citySlug)
    .eq('state', 'NY')
    .single()

  if (!city) return { title: 'Emergency Vet Finder' }

  return {
    title: `Emergency Vet in ${city.name}, New York — Open Now | Find Emergency Vet`,
    description: `Need an emergency vet in ${city.name}, New York? Find open 24/7 emergency veterinary hospitals with phone numbers, directions, hours, and walk-in policies.`,
    alternates: {
      canonical: `https://findemergencyvet.com/new-york/${citySlug}`,
    },
    openGraph: {
      title: `Emergency Vet in ${city.name}, New York — Open Now`,
      description: `Find open emergency veterinary hospitals in ${city.name}, New York. Call directly, get directions.`,
      type: 'website',
    },
    ...(city.clinic_count === 1 && { robots: { index: false, follow: true } }),
  }
}

export default async function NewYorkCityPage({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city: citySlug } = await params

  const { data: city } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', citySlug)
    .eq('state', 'NY')
    .single()

  if (!city) notFound()

  // Fetch clinics
  const { data: rawClinics } = await supabase
    .from('clinics')
    .select('id, slug, name, address, city, state, zip_code, phone, is_24_7, hours_detail, hours_description, availability_type, timezone, has_exotic_specialist, google_rating, google_review_count, accepts_walk_ins, requires_call_ahead, exotic_pets_accepted, parking_type, wheelchair_accessible, has_separate_cat_entrance, has_isolation_rooms, verification_status')
    .eq('city', city.name)
    .eq('state', 'NY')
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
  }))

  if (clinics.length === 0) notFound()

  // Fetch nearby cities for internal linking
  const { data: nearbyCities } = await supabase
    .from('cities')
    .select('id, name, state, slug, clinic_count')
    .eq('state', 'NY')
    .neq('slug', citySlug)
    .order('clinic_count', { ascending: false })
    .limit(6)

  const hasClinics = clinics && clinics.length > 0

  // Structured data: BreadcrumbList
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://findemergencyvet.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'New York',
        item: 'https://findemergencyvet.com/new-york',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${city.name}, NY`,
        item: `https://findemergencyvet.com/new-york/${citySlug}`,
      },
    ],
  }

  // Structured data: VeterinaryCare per clinic
  const clinicSchema = {
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
      areaServed: `${city.name}, New York`,
    })) || [],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicSchema) }}
      />

      <div className="min-h-screen bg-[#FAFAFA]">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 h-[60px] z-50 border-b border-[#E8E8ED]" style={{ background: 'rgba(250,250,250,0.8)', backdropFilter: 'saturate(180%) blur(20px)', WebkitBackdropFilter: 'saturate(180%) blur(20px)' }}>
          <div className="max-w-3xl mx-auto h-full flex items-center justify-between px-5">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="w-8 h-8 bg-[#0071E3] rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              </span>
              <span className="text-base font-semibold tracking-tight text-[#1D1D1F]">FindEmergencyVet</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/guides" className="text-sm text-[#6E6E73] hover:text-[#1D1D1F] transition-colors hidden sm:block">Resources</Link>
              <Link href="/locations" className="text-sm text-[#6E6E73] hover:text-[#1D1D1F] transition-colors hidden sm:block">All Locations</Link>
            </div>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-5 pt-[80px] pb-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[13px] text-[#86868B] mb-6">
            <Link href="/" className="hover:text-[#1D1D1F] transition-colors">Home</Link>
            <span>&rsaquo;</span>
            <Link href="/new-york" className="hover:text-[#1D1D1F] transition-colors">New York</Link>
            <span>&rsaquo;</span>
            <span className="text-[#1D1D1F] font-medium">{city.name}</span>
          </div>

          {/* H1 */}
          <h1 className="text-[32px] md:text-[40px] font-bold tracking-[-0.03em] text-[#1D1D1F] mb-4">
            Emergency Vet in {city.name}, New York — Open Now
          </h1>

          {/* Intro Paragraph */}
          <p className="text-[#6E6E73] text-lg mb-8 leading-relaxed">
            Need an emergency veterinarian in {city.name}, New York?
            Emergency Vet Finder helps you locate open emergency and referral veterinary hospitals serving {city.name} and surrounding areas — with phone numbers, directions, and hours.
          </p>

          {/* Clinic Listings */}
          {hasClinics ? (
            <section className="mb-10">
              <div className="space-y-4">
                {clinics.map(clinic => (
                  <ClinicCard key={clinic.id} clinic={clinic} />
                ))}
              </div>
            </section>
          ) : (
            <section className="mb-10 bg-[#FFF3E0] border border-[#FFE0B2] rounded-2xl p-6">
              <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-2">
                Emergency Vet Clinics Coming Soon
              </h2>
              <p className="text-[#6E6E73]">
                We're currently adding emergency veterinary clinics in {city.name}. In the meantime, check nearby cities below or call your regular vet for the closest emergency referral.
              </p>
            </section>
          )}

          {/* H2: Emergency Veterinary Services */}
          <section className="mb-10">
            <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-4">
              Emergency Veterinary Services in {city.name}
            </h2>
            <p className="text-[#6E6E73] leading-relaxed">
              Emergency vets in {city.name} treat urgent, life-threatening conditions that cannot wait for a regular appointment. These facilities are equipped for advanced diagnostics, surgery, and overnight care.
            </p>
          </section>

          {/* H2: Common Reasons */}
          <section id="emergency-reasons" className="mb-10 bg-white rounded-2xl p-6 border border-[#E8E8ED]">
            <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-4">
              Common Reasons to Visit an Emergency Vet in {city.name}
            </h2>
            <ul className="space-y-3 text-[#6E6E73]">
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF453A] shrink-0" />
                Accidents, falls, or trauma (hit by car, attacked by another animal)
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF453A] shrink-0" />
                Breathing difficulties or choking
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF453A] shrink-0" />
                Sudden collapse, seizures, or loss of consciousness
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF453A] shrink-0" />
                Poison or toxin ingestion (chocolate, xylitol, rat poison, plants)
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF453A] shrink-0" />
                Severe pain, whimpering, or sudden behavioral change
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF453A] shrink-0" />
                Bloated or distended abdomen (possible GDV/bloat)
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF453A] shrink-0" />
                Inability to urinate, especially in male cats
              </li>
            </ul>
          </section>

          {/* H2: After-Hours & Urgent Care */}
          <section className="mb-10">
            <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-4">
              After-Hours &amp; Urgent Care in {city.name}
            </h2>
            <p className="text-[#6E6E73] leading-relaxed mb-4">
              Not every situation requires a 24/7 emergency hospital. Some conditions — like minor limping, mild vomiting, or small wounds — may be handled by an urgent care or after-hours clinic at a lower cost. Look for clinics marked <span className="font-semibold text-[#6E6E73]">URGENT CARE</span> or <span className="font-semibold text-[#6E6E73]">EXTENDED HRS</span> in our listings above.
            </p>
            <p className="text-[#6E6E73] leading-relaxed">
              If you&apos;re unsure whether your pet needs emergency care or urgent care, call the nearest facility. Most will help you triage over the phone.
            </p>
          </section>

          {/* H2: How to Get There */}
          <section className="mb-10 bg-white rounded-2xl p-6 border border-[#E8E8ED]">
            <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-4">
              How to Get to an Emergency Vet in {city.name}
            </h2>
            <ul className="space-y-3 text-[#6E6E73]">
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#0071E3] mt-0.5 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                <span>Use the <strong>Directions</strong> button on any listing above to open Google Maps navigation directly</span>
              </li>
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#0071E3] mt-0.5 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                <span><strong>Call ahead</strong> while en route so the team can prepare for your pet&apos;s arrival</span>
              </li>
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#0071E3] mt-0.5 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                <span>Have someone else drive if possible so you can comfort and monitor your pet</span>
              </li>
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#0071E3] mt-0.5 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
                <span>Most {city.name} emergency vets offer free parking — check individual listings for details</span>
              </li>
            </ul>
          </section>

          {/* H2: What to Bring */}
          <section className="mb-10">
            <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-4">
              What to Bring to the Emergency Vet
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-[#E8E8ED]">
                <h3 className="font-bold text-[#1D1D1F] mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#0071E3]"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>
                  Medical Records
                </h3>
                <p className="text-[#6E6E73] text-sm">Vaccination history, current medications, and your regular vet&apos;s contact info</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-[#E8E8ED]">
                <h3 className="font-bold text-[#1D1D1F] mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#0071E3]"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>
                  Payment Method
                </h3>
                <p className="text-[#6E6E73] text-sm">Credit card, CareCredit, or pet insurance info — most require payment at time of service</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-[#E8E8ED]">
                <h3 className="font-bold text-[#1D1D1F] mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#0071E3]"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>
                  Toxin Sample
                </h3>
                <p className="text-[#6E6E73] text-sm">If poisoning is suspected, bring the packaging, label, or a sample of what was ingested</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-[#E8E8ED]">
                <h3 className="font-bold text-[#1D1D1F] mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#0071E3]"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
                  Carrier or Leash
                </h3>
                <p className="text-[#6E6E73] text-sm">Keep your pet safely contained — a carrier for cats and small animals, a leash for dogs</p>
              </div>
            </div>
          </section>

          {/* H2: Nearby Emergency Vet Options */}
          <section className="mb-10">
            <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-4">
              Nearby Emergency Vet Options
            </h2>
            <p className="text-[#6E6E73] mb-4">
              If no emergency clinic is immediately available in {city.name}, expanding your search to nearby areas may be necessary.
            </p>
            {nearbyCities && nearbyCities.length > 0 ? (
              <div className="space-y-2">
                {nearbyCities.filter(c => c.clinic_count > 0).map(nearbyCity => (
                  <Link
                    key={nearbyCity.id}
                    href={`/new-york/${nearbyCity.slug}`}
                    className="flex items-center justify-between bg-white rounded-xl p-3 border border-[#E8E8ED] hover:border-[#0071E3] transition-colors"
                  >
                    <span className="text-[#0071E3] font-semibold">
                      Emergency Vets in {nearbyCity.name}, NY
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#1B7A1B] text-sm font-bold">{nearbyCity.clinic_count}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-[#86868B]"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                    </div>
                  </Link>
                ))}
                <Link
                  href="/new-york"
                  className="flex items-center gap-2 mt-2 text-[#0071E3] font-bold hover:underline"
                >
                  View all emergency vets in New York
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </Link>
              </div>
            ) : (
              <Link href="/new-york" className="text-[#0071E3] hover:underline font-semibold">
                View all emergency vets in New York &rarr;
              </Link>
            )}
          </section>

          {/* H2: When to Call Before You Go */}
          <section className="mb-10 bg-[#F5F5F7] rounded-2xl p-6">
            <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-4">
              When to Call Before You Go
            </h2>
            <p className="text-[#6E6E73] leading-relaxed">
              Calling ahead helps confirm availability and allows staff to prepare for your pet&apos;s arrival. This is especially important during peak hours (evenings, weekends, holidays) or if your pet requires specialized care such as exotic animal treatment or advanced surgery. In true life-threatening emergencies, go directly to the nearest facility — they will triage upon arrival.
            </p>
          </section>

          {/* Back Links */}
          <div className="pt-8 border-t border-[#E8E8ED] flex justify-between items-center">
            <Link href="/new-york" className="text-[#0071E3] hover:underline font-semibold">
              &larr; All New York emergency vets
            </Link>
            <Link href="/locations" className="text-[#0071E3] hover:underline font-semibold">
              All locations &rarr;
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-5 py-8 border-t border-[#E8E8ED] text-center">
          <p className="text-[#86868B] text-xs leading-relaxed max-w-lg mx-auto">
            FindEmergencyVet.com is an independent directory. Availability and hours may change without notice.
            Always call the clinic to confirm emergency services before traveling. Last verified February 2026.
          </p>
          <div className="flex justify-center gap-4 mt-3 text-[#86868B] text-xs">
            <Link href="/about" className="hover:text-[#1D1D1F] transition-colors">About</Link>
            <Link href="/contact" className="hover:text-[#1D1D1F] transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-[#1D1D1F] transition-colors">Privacy</Link>
          </div>
          <p className="text-[#86868B] text-xs mt-2">&copy; 2026 FindEmergencyVet.com</p>
        </footer>

        {/* Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[#E8E8ED] px-5 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }} aria-label="Bottom navigation">
          <div className="flex justify-around items-center max-w-md mx-auto">
            <Link href="/" className="flex flex-col items-center gap-0.5 text-[#86868B] hover:text-[#1D1D1F] min-w-[48px] min-h-[48px] justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
              <span className="text-[10px] font-medium">Home</span>
            </Link>
            <Link href="/guides" className="flex flex-col items-center gap-0.5 text-[#86868B] hover:text-[#1D1D1F] min-w-[48px] min-h-[48px] justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
              <span className="text-[10px] font-medium">Guides</span>
            </Link>
            <Link href="/locations" className="flex flex-col items-center gap-0.5 text-[#86868B] hover:text-[#1D1D1F] min-w-[48px] min-h-[48px] justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
              <span className="text-[10px] font-medium">Locations</span>
            </Link>
          </div>
        </nav>
        <div className="h-20 md:h-0" />
      </div>
    </>
  )
}
