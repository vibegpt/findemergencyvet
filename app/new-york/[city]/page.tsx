import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import ClinicCard from '@/components/clinic/ClinicCard'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>
}): Promise<Metadata> {
  const { city: citySlug } = await params

  const { data: city } = await supabase
    .from('cities')
    .select('name, state')
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
  const { data: clinics } = await supabase
    .from('clinics')
    .select('id, slug, name, address, city, state, zip_code, phone, is_24_7, current_status, has_exotic_specialist, google_rating, google_review_count, availability_type, accepts_walk_ins, requires_call_ahead, exotic_pets_accepted, parking_type, wheelchair_accessible, has_separate_cat_entrance, has_isolation_rooms')
    .eq('city', city.name)
    .eq('state', 'NY')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('is_24_7', { ascending: false })
    .order('google_rating', { ascending: false, nullsFirst: false })

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

      <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#101922]">
        {/* Emergency Banner */}
        <div className="bg-red-600 text-white py-2 px-4 text-center text-sm font-bold">
          <span className="material-symbols-outlined text-sm align-middle mr-1" aria-hidden="true">emergency</span>
          CRITICAL EMERGENCY?
          <a href="#emergency-reasons" className="underline ml-2">Check symptoms below</a>
        </div>

        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-[#f6f7f8]/80 dark:bg-[#101922]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center p-4 justify-between max-w-4xl mx-auto">
            <Link href="/" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#137fec] text-2xl" aria-hidden="true">medical_services</span>
              <span className="text-[#0d141b] dark:text-white font-bold hidden sm:inline">FindEmergencyVet.com</span>
            </Link>
            <Link
              href="/triage"
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold"
            >
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">emergency</span>
              Triage
            </Link>
          </div>
        </nav>

        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto px-4 pt-4">
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500 dark:text-gray-400">
            <ol className="flex items-center gap-1">
              <li><Link href="/" className="hover:text-[#137fec]">Home</Link></li>
              <li><span className="mx-1">/</span></li>
              <li><Link href="/new-york" className="hover:text-[#137fec]">New York</Link></li>
              <li><span className="mx-1">/</span></li>
              <li className="font-semibold text-[#0d141b] dark:text-white">{city.name}</li>
            </ol>
          </nav>
        </div>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* H1 */}
          <h1 className="text-[#0d141b] dark:text-white text-3xl md:text-4xl font-black mb-4 font-display">
            Emergency Vet in {city.name}, New York — Open Now
          </h1>

          {/* Intro Paragraph */}
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-8 leading-relaxed">
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
            <section className="mb-10 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/30 rounded-xl p-6">
              <h2 className="text-[#0d141b] dark:text-white text-xl font-bold mb-2">
                Emergency Vet Clinics Coming Soon
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                We’re currently adding emergency veterinary clinics in {city.name}. In the meantime, check nearby cities below or call your regular vet for the closest emergency referral.
              </p>
            </section>
          )}

          {/* H2: Emergency Veterinary Services */}
          <section className="mb-10">
            <h2 className="text-[#0d141b] dark:text-white text-2xl font-bold mb-4">
              Emergency Veterinary Services in {city.name}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Emergency vets in {city.name} treat urgent, life-threatening conditions that cannot wait for a regular appointment. These facilities are equipped for advanced diagnostics, surgery, and overnight care.
            </p>
          </section>
          {/* H2: Common Reasons */}
          <section id="emergency-reasons" className="mb-10 bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-700">
            <h2 className="text-[#0d141b] dark:text-white text-2xl font-bold mb-4">
              Common Reasons to Visit an Emergency Vet in {city.name}
            </h2>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 mt-0.5">emergency</span>
                Accidents, falls, or trauma (hit by car, attacked by another animal)
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 mt-0.5">emergency</span>
                Breathing difficulties or choking
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 mt-0.5">emergency</span>
                Sudden collapse, seizures, or loss of consciousness
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 mt-0.5">emergency</span>
                Poison or toxin ingestion (chocolate, xylitol, rat poison, plants)
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 mt-0.5">emergency</span>
                Severe pain, whimpering, or sudden behavioral change
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 mt-0.5">emergency</span>
                Bloated or distended abdomen (possible GDV/bloat)
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 mt-0.5">emergency</span>
                Inability to urinate, especially in male cats
              </li>
            </ul>
          </section>

          {/* H2: After-Hours & Urgent Care */}
          <section className="mb-10">
            <h2 className="text-[#0d141b] dark:text-white text-2xl font-bold mb-4">
              After-Hours &amp; Urgent Care in {city.name}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Not every situation requires a 24/7 emergency hospital. Some conditions — like minor limping, mild vomiting, or small wounds — may be handled by an urgent care or after-hours clinic at a lower cost. Look for clinics marked <span className="font-semibold text-teal-700 dark:text-teal-300">URGENT CARE</span> or <span className="font-semibold text-amber-700 dark:text-amber-300">EXTENDED HRS</span> in our listings above.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If you&apos;re unsure whether your pet needs emergency care or urgent care, call the nearest facility. Most will help you triage over the phone.
            </p>
          </section>

          {/* H2: How to Get There */}
          <section className="mb-10 bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-700">
            <h2 className="text-[#0d141b] dark:text-white text-2xl font-bold mb-4">
              How to Get to an Emergency Vet in {city.name}
            </h2>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#137fec] mt-0.5">directions_car</span>
                <span>Use the <strong>Directions</strong> button on any listing above to open Google Maps navigation directly</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#137fec] mt-0.5">call</span>
                <span><strong>Call ahead</strong> while en route so the team can prepare for your pet&apos;s arrival</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#137fec] mt-0.5">person</span>
                <span>Have someone else drive if possible so you can comfort and monitor your pet</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#137fec] mt-0.5">local_parking</span>
                <span>Most {city.name} emergency vets offer free parking — check individual listings for details</span>
              </li>
            </ul>
          </section>

          {/* H2: What to Bring */}
          <section className="mb-10">
            <h2 className="text-[#0d141b] dark:text-white text-2xl font-bold mb-4">
              What to Bring to the Emergency Vet
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
                <h3 className="font-bold text-[#0d141b] dark:text-white mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#137fec] text-[20px]">folder_open</span>
                  Medical Records
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Vaccination history, current medications, and your regular vet&apos;s contact info</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
                <h3 className="font-bold text-[#0d141b] dark:text-white mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#137fec] text-[20px]">credit_card</span>
                  Payment Method
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Credit card, CareCredit, or pet insurance info — most require payment at time of service</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
                <h3 className="font-bold text-[#0d141b] dark:text-white mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#137fec] text-[20px]">science</span>
                  Toxin Sample
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">If poisoning is suspected, bring the packaging, label, or a sample of what was ingested</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
                <h3 className="font-bold text-[#0d141b] dark:text-white mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#137fec] text-[20px]">pets</span>
                  Carrier or Leash
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Keep your pet safely contained — a carrier for cats and small animals, a leash for dogs</p>
              </div>
            </div>
          </section>

          {/* H2: Nearby Emergency Vet Options */}
          <section className="mb-10">
            <h2 className="text-[#0d141b] dark:text-white text-2xl font-bold mb-4">
              Nearby Emergency Vet Options
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If no emergency clinic is immediately available in {city.name}, expanding your search to nearby areas may be necessary.
            </p>
            {nearbyCities && nearbyCities.length > 0 ? (
              <div className="space-y-2">
                {nearbyCities.filter(c => c.clinic_count > 0).map(nearbyCity => (
                  <Link
                    key={nearbyCity.id}
                    href={`/new-york/${nearbyCity.slug}`}
                    className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-100 dark:border-slate-700 hover:border-[#137fec] transition-colors"
                  >
                    <span className="text-[#137fec] font-semibold">
                      Emergency Vets in {nearbyCity.name}, NY
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 text-sm font-bold">{nearbyCity.clinic_count}</span>
                      <span className="material-symbols-outlined text-gray-400 text-[18px]">chevron_right</span>
                    </div>
                  </Link>
                ))}
                <Link
                  href="/new-york"
                  className="flex items-center gap-2 mt-2 text-[#137fec] font-bold hover:underline"
                >
                  View all emergency vets in New York
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            ) : (
              <Link href="/new-york" className="text-[#137fec] hover:underline font-semibold">
                View all emergency vets in New York &rarr;
              </Link>
            )}
          </section>

          {/* H2: When to Call Before You Go */}
          <section className="mb-10 bg-gray-50 dark:bg-slate-800/50 rounded-xl p-6">
            <h2 className="text-[#0d141b] dark:text-white text-2xl font-bold mb-4">
              When to Call Before You Go
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Calling ahead helps confirm availability and allows staff to prepare for your pet&apos;s arrival. This is especially important during peak hours (evenings, weekends, holidays) or if your pet requires specialized care such as exotic animal treatment or advanced surgery. In true life-threatening emergencies, go directly to the nearest facility — they will triage upon arrival.
            </p>
          </section>

          {/* Back Links */}
          <div className="pt-8 border-t border-gray-200 dark:border-slate-700 flex justify-between items-center">
            <Link href="/new-york" className="text-[#137fec] hover:underline font-semibold">
              &larr; All New York emergency vets
            </Link>
            <Link href="/locations" className="text-[#137fec] hover:underline font-semibold">
              All locations &rarr;
            </Link>
          </div>

          {/* Footer */}
          <footer className="mt-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              Emergency Vet Finder is an independent directory. Availability may change. Always call to confirm.
            </p>
          </footer>
        </main>

        {/* Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-gray-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center" aria-label="Bottom navigation">
          <Link href="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#137fec] min-w-[48px] min-h-[48px] justify-center">
            <span className="material-symbols-outlined" aria-hidden="true">home</span>
            <span className="text-[10px] font-bold">Home</span>
          </Link>
          <Link href="/triage" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#137fec] min-w-[48px] min-h-[48px] justify-center">
            <span className="material-symbols-outlined" aria-hidden="true">medical_information</span>
            <span className="text-[10px] font-bold">Triage</span>
          </Link>
          <Link href="/costs" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#137fec] min-w-[48px] min-h-[48px] justify-center">
            <span className="material-symbols-outlined" aria-hidden="true">payments</span>
            <span className="text-[10px] font-bold">Costs</span>
          </Link>
          <Link href="/locations" className="flex flex-col items-center gap-1 text-[#137fec] min-w-[48px] min-h-[48px] justify-center">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}} aria-hidden="true">map</span>
            <span className="text-[10px] font-bold">Locations</span>
          </Link>
        </nav>

        <div className="h-20 md:h-0"></div>
      </div>
    </>
  )
}
