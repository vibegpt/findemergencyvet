'use client'

import Link from 'next/link'

type City = {
  id: string
  name: string
  state: string
  slug: string
  clinic_count: number
}

type Clinic = {
  id: string
  name: string
  phone: string
  address: string
  city: string
  state: string
  is_24_7: boolean
  has_exotic_specialist: boolean
  google_rating: number | null
  google_review_count: number | null
  availability_type: string | null
}

export default function HomePage({
  clinicCount,
  cities,
  cityClinics
}: {
  clinicCount: number
  cities: City[]
  cityClinics: Record<string, Clinic[]>
}) {
  // Group cities by state for the location section
  const citiesByState = cities.reduce((acc: Record<string, City[]>, city) => {
    if (!acc[city.state]) acc[city.state] = []
    acc[city.state].push(city)
    return acc
  }, {})

  const stateNames: Record<string, string> = {
    NY: 'New York', CA: 'California', TX: 'Texas', FL: 'Florida',
    GA: 'Georgia', VA: 'Virginia', SC: 'South Carolina', NC: 'North Carolina',
    MN: 'Minnesota', MO: 'Missouri', MS: 'Mississippi', MI: 'Michigan',
  }

  const stateSlugs: Record<string, string> = {
    NY: 'new-york', CA: 'california', TX: 'texas', FL: 'florida',
    GA: 'georgia', VA: 'virginia', SC: 'south-carolina', NC: 'north-carolina',
    MN: 'minnesota', MO: 'missouri', MS: 'mississippi', MI: 'michigan',
  }

  return (
    <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#101922]">
      {/* Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#137fec] focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Emergency Banner */}
      <div className="bg-red-600 text-white py-2 px-4 text-center text-sm font-bold">
        <span className="material-symbols-outlined text-sm align-middle mr-1" aria-hidden="true">emergency</span>
        CRITICAL EMERGENCY?
        <a href="#when-to-use" className="underline ml-2">Check if you need an emergency vet</a>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#f6f7f8]/80 dark:bg-[#101922]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center p-4 justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#137fec] text-3xl" aria-hidden="true">medical_services</span>
            <span className="text-[#0d141b] dark:text-white text-lg font-bold">Emergency Vet Finder</span>
          </div>
          <Link
            href="/locations"
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[#137fec]/10 text-[#137fec] text-sm font-bold hover:bg-[#137fec]/20"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">map</span>
            All Locations
          </Link>
        </div>
      </nav>

      <main id="main-content" className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <header className="bg-gradient-to-r from-[#137fec] to-[#0d5bbd] px-6 py-10 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            {/* H1 */}
            <h1 className="text-white text-3xl md:text-5xl font-black mb-4 leading-tight">
              Emergency Vet Finder — Fast Emergency Veterinary Care Near You
            </h1>

            {/* Intro Paragraph */}
            <p className="text-white/90 text-lg md:text-xl mb-6 leading-relaxed">
              When your pet needs urgent medical attention, time matters. Emergency Vet Finder connects you to open emergency veterinary hospitals. We help pet owners find emergency care for their pet.
            </p>

            {/* Live Stats */}
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-white font-bold">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              {clinicCount} Emergency Clinics • Live Directory
            </div>
          </div>
        </header>

        {/* H2: How Emergency Vet Finder Works */}
        <section className="px-6 py-10 md:py-12">
          <h2 className="text-[#0d141b] dark:text-white text-2xl md:text-3xl font-bold mb-6 text-center">
            How Emergency Vet Finder Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center border border-gray-100 dark:border-slate-700">
              <div className="w-12 h-12 bg-[#137fec]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-[#137fec] text-2xl">search</span>
              </div>
              <h3 className="font-bold text-[#0d141b] dark:text-white mb-2">Search by City or State</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Find emergency vets in your area instantly</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center border border-gray-100 dark:border-slate-700">
              <div className="w-12 h-12 bg-[#137fec]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-[#137fec] text-2xl">visibility</span>
              </div>
              <h3 className="font-bold text-[#0d141b] dark:text-white mb-2">See Open Emergency Vets</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Instantly see open emergency and referral vets</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center border border-gray-100 dark:border-slate-700">
              <div className="w-12 h-12 bg-[#137fec]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-[#137fec] text-2xl">call</span>
              </div>
              <h3 className="font-bold text-[#0d141b] dark:text-white mb-2">Call Directly</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">No signups, no delays — just call</p>
            </div>
          </div>
        </section>

        {/* H2: When to Use an Emergency Vet */}
        <section id="when-to-use" className="px-6 py-10 bg-white dark:bg-slate-800 border-y border-gray-100 dark:border-slate-700">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-[#0d141b] dark:text-white text-2xl md:text-3xl font-bold mb-6 text-center">
              When to Use an Emergency Vet
            </h2>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-100 dark:border-red-900/30">
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 mt-0.5">emergency</span>
                  <span>Difficulty breathing</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 mt-0.5">emergency</span>
                  <span>Severe bleeding or trauma</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 mt-0.5">emergency</span>
                  <span>Seizures or collapse</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 mt-0.5">emergency</span>
                  <span>Ingestion of toxins</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 mt-0.5">emergency</span>
                  <span>Sudden pain, paralysis, or distress</span>
                </li>
              </ul>
              <p className="mt-4 text-red-700 dark:text-red-300 font-semibold text-sm">
                If you're unsure, it's safer to call an emergency vet immediately.
              </p>
            </div>
          </div>
        </section>

        {/* H2: Find Emergency Veterinary Care by Location */}
        <section className="px-6 py-10 md:py-12">
          <h2 className="text-[#0d141b] dark:text-white text-2xl md:text-3xl font-bold mb-6 text-center">
            Find Emergency Veterinary Care by Location
          </h2>

          <div className="max-w-4xl mx-auto">
            {/* Featured States with Active Cities */}
            <div className="space-y-4">
              {Object.entries(citiesByState)
                .filter(([, stateCities]) => stateCities.some(c => c.clinic_count > 0))
                .map(([stateAbbr, stateCities]) => {
                  const stateName = stateNames[stateAbbr] || stateAbbr
                  const stateSlug = stateSlugs[stateAbbr] || stateAbbr.toLowerCase()
                  const activeCities = stateCities.filter(c => c.clinic_count > 0)
                  const totalClinics = activeCities.reduce((sum, c) => sum + c.clinic_count, 0)

                  // NY uses flat URLs (hub-and-spoke)
                  const isNY = stateAbbr === 'NY'
                  const stateHref = isNY ? '/new-york' : `/states/${stateSlug}`
                  const cityHref = (citySlug: string) =>
                    isNY ? `/new-york/${citySlug}` : `/states/${stateSlug}/${citySlug}`

                  return (
                    <div key={stateAbbr} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 border-b border-gray-100 dark:border-slate-700">
                        <div>
                          <h3 className="text-[#0d141b] dark:text-white font-bold text-lg">{stateName}</h3>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            {activeCities.length} {activeCities.length === 1 ? 'city' : 'cities'} • {totalClinics} clinics
                          </span>
                        </div>
                        <Link
                          href={stateHref}
                          className="text-[#137fec] text-sm font-bold hover:underline"
                        >
                          View all →
                        </Link>
                      </div>
                      <div className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {activeCities.map(city => (
                            <Link
                              key={city.id}
                              href={cityHref(city.slug)}
                              className="inline-flex items-center gap-1 px-3 py-2 bg-gray-50 dark:bg-slate-700 rounded-lg text-sm font-medium text-[#0d141b] dark:text-white hover:bg-[#137fec]/10 hover:text-[#137fec] transition-colors"
                            >
                              {city.name}
                              <span className="text-green-600 text-xs font-bold">({city.clinic_count})</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>

            {/* View All CTA */}
            <div className="mt-6 text-center">
              <Link
                href="/locations"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#137fec] text-white font-bold rounded-lg hover:bg-[#137fec]/90"
              >
                <span className="material-symbols-outlined text-[20px]">map</span>
                View All Locations
              </Link>
            </div>
          </div>
        </section>

        {/* H2: Why Pet Owners Trust Emergency Vet Finder */}
        <section className="px-6 py-10 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-700">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-[#0d141b] dark:text-white text-2xl md:text-3xl font-bold mb-6 text-center">
              Why Pet Owners Trust Emergency Vet Finder
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                <span className="material-symbols-outlined text-[#137fec] text-2xl shrink-0">check_circle</span>
                <div>
                  <h3 className="font-bold text-[#0d141b] dark:text-white mb-1">Emergency Focus Only</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">No general practice clutter — just emergency and referral care</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                <span className="material-symbols-outlined text-[#137fec] text-2xl shrink-0">smartphone</span>
                <div>
                  <h3 className="font-bold text-[#0d141b] dark:text-white mb-1">Built for Mobile</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Designed for high-stress situations on any device</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                <span className="material-symbols-outlined text-[#137fec] text-2xl shrink-0">update</span>
                <div>
                  <h3 className="font-bold text-[#0d141b] dark:text-white mb-1">Continuously Updated</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Live availability signals and verified information</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                <span className="material-symbols-outlined text-[#137fec] text-2xl shrink-0">thumb_up</span>
                <div>
                  <h3 className="font-bold text-[#0d141b] dark:text-white mb-1">No Paid Placements</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Results prioritize proximity and availability, not ads</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Register CTA */}
        <section className="px-6 py-10">
          <div className="max-w-3xl mx-auto bg-[#137fec] rounded-xl p-8 text-center text-white">
            <span className="material-symbols-outlined text-4xl mb-3" aria-hidden="true">add_business</span>
            <h3 className="text-xl font-bold mb-2">Are You an Emergency Veterinary Clinic?</h3>
            <p className="text-white/80 mb-4">List your clinic to help pet owners find you in emergencies.</p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#137fec] font-bold rounded-lg hover:bg-gray-100"
            >
              Register Your Clinic
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-8 text-center border-t border-gray-200 dark:border-slate-700">
          <p className="text-gray-500 dark:text-gray-400 text-xs">
            Emergency Vet Finder is an independent directory. Availability and hours may change.
            Always call the clinic to confirm emergency services.
          </p>
        </footer>
      </main>

      {/* Bottom Nav - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-gray-200 dark:border-slate-800 px-6 py-3 flex justify-around">
        <Link href="/" className="flex flex-col items-center gap-1 text-[#137fec]">
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>home</span>
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        <Link href="/locations" className="flex flex-col items-center gap-1 text-gray-400">
          <span className="material-symbols-outlined">map</span>
          <span className="text-[10px] font-bold">Locations</span>
        </Link>
      </nav>

      <div className="h-20 md:h-0"></div>
    </div>
  )
}
