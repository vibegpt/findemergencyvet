import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'

const stateNames: Record<string, string> = {
  'new-york': 'New York', ny: 'New York',
  california: 'California', ca: 'California',
  texas: 'Texas', tx: 'Texas',
  florida: 'Florida', fl: 'Florida',
  georgia: 'Georgia', ga: 'Georgia',
  virginia: 'Virginia', va: 'Virginia',
  'south-carolina': 'South Carolina', sc: 'South Carolina',
  'north-carolina': 'North Carolina', nc: 'North Carolina',
  minnesota: 'Minnesota', mn: 'Minnesota',
  missouri: 'Missouri', mo: 'Missouri',
  mississippi: 'Mississippi', ms: 'Mississippi',
  michigan: 'Michigan', mi: 'Michigan',
  louisiana: 'Louisiana', la: 'Louisiana',
  oregon: 'Oregon', or: 'Oregon',
  iowa: 'Iowa', ia: 'Iowa',
  alabama: 'Alabama', al: 'Alabama',
  arkansas: 'Arkansas', ar: 'Arkansas',
  tennessee: 'Tennessee', tn: 'Tennessee',
  maryland: 'Maryland', md: 'Maryland',
  'west-virginia': 'West Virginia', wv: 'West Virginia',
  vermont: 'Vermont', vt: 'Vermont',
  'new-hampshire': 'New Hampshire', nh: 'New Hampshire',
  'new-jersey': 'New Jersey', nj: 'New Jersey',
  connecticut: 'Connecticut', ct: 'Connecticut',
  pennsylvania: 'Pennsylvania', pa: 'Pennsylvania',
  maine: 'Maine', me: 'Maine',
  wisconsin: 'Wisconsin', wi: 'Wisconsin',
  nebraska: 'Nebraska', ne: 'Nebraska',
  oklahoma: 'Oklahoma', ok: 'Oklahoma',
}

const stateAbbreviations: Record<string, string> = {
  'new-york': 'NY', california: 'CA', texas: 'TX', florida: 'FL',
  georgia: 'GA', virginia: 'VA', 'south-carolina': 'SC', 'north-carolina': 'NC',
  minnesota: 'MN', missouri: 'MO', mississippi: 'MS', michigan: 'MI',
  louisiana: 'LA', oregon: 'OR', iowa: 'IA', alabama: 'AL',
  arkansas: 'AR', tennessee: 'TN', maryland: 'MD', 'west-virginia': 'WV',
  vermont: 'VT', 'new-hampshire': 'NH', 'new-jersey': 'NJ', connecticut: 'CT',
  pennsylvania: 'PA', maine: 'ME', wisconsin: 'WI', nebraska: 'NE', oklahoma: 'OK',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string }>
}): Promise<Metadata> {
  const { state, city: citySlug } = await params

  const { data: city } = await supabase
    .from('cities')
    .select('name, state')
    .eq('slug', citySlug)
    .single()

  if (!city) {
    return { title: 'Emergency Vet Finder' }
  }

  const stateName = stateNames[state] || city.state

  return {
    title: `Emergency Vet in ${city.name}, ${stateName} — Open Now | Emergency Vet Finder`,
    description: `Need an emergency veterinarian in ${city.name}, ${stateName}? Find open emergency and referral veterinary hospitals serving ${city.name} and surrounding areas—fast.`,
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

  const { data: city } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', citySlug)
    .single()

  if (!city) notFound()

  const stateName = stateNames[state] || city.state
  const stateAbbr = stateAbbreviations[state] || city.state

  // Fetch clinics
  const { data: clinics } = await supabase
    .from('clinics')
    .select('id, name, address, city, state, zip_code, phone, is_24_7, current_status, has_surgery_suite, has_icu, has_exotic_specialist, accepts_care_credit, google_rating, google_review_count, availability_type, special_notes, is_featured')
    .eq('city', city.name)
    .eq('state', city.state)
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('is_24_7', { ascending: false })
    .order('google_rating', { ascending: false, nullsFirst: false })

  // Fetch nearby cities
  const { data: nearbyCities } = await supabase
    .from('cities')
    .select('id, name, state, slug, clinic_count')
    .eq('state', city.state)
    .neq('slug', citySlug)
    .order('clinic_count', { ascending: false })
    .limit(5)

  // Structured data
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
    })) || [],
  }

  const hasClinics = clinics && clinics.length > 0

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
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
              <span className="text-[#0d141b] dark:text-white font-bold hidden sm:inline">Emergency Vet Finder</span>
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Link href={`/states/${state}`} className="hover:text-[#137fec]">{stateName}</Link>
              <span>/</span>
              <span className="font-semibold text-[#0d141b] dark:text-white">{city.name}</span>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* H1 */}
          <h1 className="text-[#0d141b] dark:text-white text-3xl md:text-4xl font-black mb-4">
            Emergency Vet in {city.name}, {stateName} — Open Now
          </h1>

          {/* Intro Paragraph */}
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-8 leading-relaxed">
            Need an emergency veterinarian in {city.name}, {stateName}?
            Emergency Vet Finder helps you locate open emergency and referral veterinary hospitals serving {city.name} and surrounding areas—fast.
          </p>

          {/* Clinic Listings */}
          {hasClinics ? (
            <section className="mb-10">
              <div className="space-y-4">
                {clinics.map(clinic => (
                  <article key={clinic.id} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-5 shadow-sm">
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <div>
                        <h3 className="text-[#0d141b] dark:text-white text-xl font-bold">{clinic.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {clinic.is_24_7 && (
                            <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
                              24/7
                            </span>
                          )}
                          {clinic.has_exotic_specialist && (
                            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold px-2 py-1 rounded-full">EXOTICS</span>
                          )}
                          {clinic.availability_type === 'on-call-24-7' && (
                            <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-bold px-2 py-1 rounded-full">CALL FIRST</span>
                          )}
                        </div>
                      </div>
                      {clinic.google_rating && (
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg font-bold ${
                          clinic.google_rating >= 4.5 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                          {clinic.google_rating}
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                      <strong>Address:</strong> {clinic.address}, {clinic.city}, {clinic.state} {clinic.zip_code}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                      <strong>Phone:</strong> <a href={`tel:${clinic.phone}`} className="text-[#137fec] hover:underline">{clinic.phone}</a>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      <strong>Hours:</strong> {clinic.is_24_7 ? '24/7 Emergency Care' : 'Call for hours'}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {clinic.has_surgery_suite && <span className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-semibold">SURGERY</span>}
                      {clinic.has_icu && <span className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-semibold">ICU</span>}
                      {clinic.accepts_care_credit && <span className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-semibold">CARECREDIT</span>}
                    </div>

                    {/* Special Notes */}
                    {clinic.special_notes && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-lg p-3 mb-4">
                        <div className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[18px] mt-0.5">info</span>
                          <p className="text-blue-800 dark:text-blue-200 text-sm">{clinic.special_notes}</p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href={`tel:${clinic.phone}`}
                        className="flex items-center justify-center gap-2 h-12 rounded-lg bg-[#137fec] text-white font-bold hover:bg-[#137fec]/90"
                      >
                        <span className="material-symbols-outlined text-[20px]">call</span>
                        Call Now
                      </a>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${clinic.address}, ${clinic.city}, ${clinic.state}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 h-12 rounded-lg border-2 border-red-500 text-red-500 font-bold hover:bg-red-50"
                      >
                        <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>location_on</span>
                        Directions
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : (
            /* Coming Soon */
            <section className="mb-10">
              <div className="bg-[#137fec]/5 border-2 border-dashed border-[#137fec]/30 rounded-xl p-8 text-center">
                <span className="material-symbols-outlined text-5xl text-[#137fec] mb-4">add_location</span>
                <h3 className="text-xl font-bold text-[#0d141b] dark:text-white mb-2">Coming Soon</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We're actively adding emergency veterinary clinics in {city.name}. In the meantime, try searching Google Maps.
                </p>
                <a
                  href={`https://www.google.com/maps/search/emergency+vet+${encodeURIComponent(city.name + ' ' + stateName)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#137fec] text-white font-bold rounded-lg"
                >
                  <span className="material-symbols-outlined text-[18px]">map</span>
                  Search Google Maps
                </a>
              </div>
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
                Accidents or trauma
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 mt-0.5">emergency</span>
                Breathing difficulties
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 mt-0.5">emergency</span>
                Sudden collapse or seizures
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 mt-0.5">emergency</span>
                Poison ingestion
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 mt-0.5">emergency</span>
                Severe pain or distress
              </li>
            </ul>
          </section>

          {/* H2: Availability */}
          <section className="mb-10">
            <h2 className="text-[#0d141b] dark:text-white text-2xl font-bold mb-4">
              Emergency Vet Availability in {city.name}, {stateName}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Emergency availability can change hour-to-hour. Some hospitals operate 24/7, while others offer limited emergency hours or referral-only care.
            </p>
          </section>

          {/* H2: Nearby Options */}
          <section className="mb-10">
            <h2 className="text-[#0d141b] dark:text-white text-2xl font-bold mb-4">
              Nearby Emergency Vet Options
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If no emergency clinic is immediately available in {city.name}, expanding your search to nearby areas may be necessary.
            </p>
            {nearbyCities && nearbyCities.length > 0 ? (
              <ul className="space-y-2">
                {nearbyCities.filter(c => c.clinic_count > 0).map(nearbyCity => (
                  <li key={nearbyCity.id}>
                    <Link
                      href={`/states/${state}/${nearbyCity.slug}`}
                      className="text-[#137fec] hover:underline"
                    >
                      Emergency Vets in {nearbyCity.name}, {stateAbbr}
                    </Link>
                    <span className="text-gray-500 ml-2">({nearbyCity.clinic_count} clinics)</span>
                  </li>
                ))}
                <li>
                  <Link href={`/states/${state}`} className="text-[#137fec] hover:underline font-semibold">
                    View all emergency vets in {stateName} →
                  </Link>
                </li>
              </ul>
            ) : (
              <Link href={`/states/${state}`} className="text-[#137fec] hover:underline">
                View all emergency vets in {stateName} →
              </Link>
            )}
          </section>

          {/* H2: When to Call Before You Go */}
          <section className="mb-10 bg-gray-50 dark:bg-slate-800/50 rounded-xl p-6">
            <h2 className="text-[#0d141b] dark:text-white text-2xl font-bold mb-4">
              When to Call Before You Go
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Calling ahead helps confirm availability and allows staff to prepare for your pet's arrival. This is especially important during peak hours or if your pet requires specialized care.
            </p>
          </section>

          {/* Footer */}
          <footer className="pt-8 border-t border-gray-200 dark:border-slate-700 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              Emergency Vet Finder is an independent directory. Availability may change. Always call to confirm.
            </p>
          </footer>
        </main>

        {/* Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-gray-200 px-6 py-3 flex justify-around">
          <Link href="/" className="flex flex-col items-center gap-1 text-gray-400">
            <span className="material-symbols-outlined">home</span>
            <span className="text-[10px] font-bold">Home</span>
          </Link>
          <Link href={`/states/${state}`} className="flex flex-col items-center gap-1 text-gray-400">
            <span className="material-symbols-outlined">map</span>
            <span className="text-[10px] font-bold">{stateAbbr}</span>
          </Link>
          <Link href="/locations" className="flex flex-col items-center gap-1 text-[#137fec]">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>location_on</span>
            <span className="text-[10px] font-bold">Locations</span>
          </Link>
        </nav>

        <div className="h-20 md:h-0"></div>
      </div>
    </>
  )
}
