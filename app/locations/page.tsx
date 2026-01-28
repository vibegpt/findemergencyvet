import { supabase } from '@/lib/supabase'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'All Emergency Vet Locations | Find Emergency Vet',
  description: 'Browse all 24/7 emergency veterinary clinic locations. Find emergency vets by state and city with phone numbers, directions, and hours.',
}

type City = {
  id: string
  name: string
  state: string
  slug: string
  clinic_count: number
}

export default async function LocationsPage() {
  // Fetch all cities
  const { data: cities } = await supabase
    .from('cities')
    .select('*')
    .order('state', { ascending: true })
    .order('name', { ascending: true })

  // Group cities by state
  const citiesByState = (cities || []).reduce((acc: Record<string, City[]>, city) => {
    if (!acc[city.state]) {
      acc[city.state] = []
    }
    acc[city.state].push(city)
    return acc
  }, {})

  // Sort states by number of clinics (most first)
  const sortedStates = Object.entries(citiesByState).sort((a, b) => {
    const totalA = a[1].reduce((sum, c) => sum + (c.clinic_count || 0), 0)
    const totalB = b[1].reduce((sum, c) => sum + (c.clinic_count || 0), 0)
    return totalB - totalA
  })

  const totalClinics = (cities || []).reduce((sum, c) => sum + (c.clinic_count || 0), 0)
  const totalCities = cities?.length || 0
  const activeCities = (cities || []).filter(c => c.clinic_count > 0).length

  const stateNames: Record<string, string> = {
    AL: 'Alabama', AR: 'Arkansas', CA: 'California', CT: 'Connecticut',
    FL: 'Florida', GA: 'Georgia', IA: 'Iowa', IL: 'Illinois',
    LA: 'Louisiana', MD: 'Maryland', ME: 'Maine', MI: 'Michigan',
    MN: 'Minnesota', MO: 'Missouri', MS: 'Mississippi', NC: 'North Carolina',
    NE: 'Nebraska', NH: 'New Hampshire', NJ: 'New Jersey', NY: 'New York',
    OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', SC: 'South Carolina',
    TN: 'Tennessee', TX: 'Texas', VA: 'Virginia', VT: 'Vermont',
    WI: 'Wisconsin', WV: 'West Virginia',
  }

  const stateSlugs: Record<string, string> = {
    AL: 'alabama', AR: 'arkansas', CA: 'california', CT: 'connecticut',
    FL: 'florida', GA: 'georgia', IA: 'iowa', IL: 'illinois',
    LA: 'louisiana', MD: 'maryland', ME: 'maine', MI: 'michigan',
    MN: 'minnesota', MO: 'missouri', MS: 'mississippi', NC: 'north-carolina',
    NE: 'nebraska', NH: 'new-hampshire', NJ: 'new-jersey', NY: 'new-york',
    OK: 'oklahoma', OR: 'oregon', PA: 'pennsylvania', SC: 'south-carolina',
    TN: 'tennessee', TX: 'texas', VA: 'virginia', VT: 'vermont',
    WI: 'wisconsin', WV: 'west-virginia',
  }

  return (
    <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#101922]">
      {/* Emergency Banner */}
      <div className="bg-red-600 text-white py-2 px-4 text-center text-sm font-bold">
        <span className="material-symbols-outlined text-sm align-middle mr-1" aria-hidden="true">emergency</span>
        CRITICAL EMERGENCY?
        <Link href="/triage" className="underline ml-2 focus:ring-2 focus:ring-white">
          Go to your nearest emergency vet immediately
        </Link>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#f6f7f8]/80 dark:bg-[#101922]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center p-4 justify-between max-w-5xl mx-auto">
          <Link href="/" className="flex items-center gap-2 focus:ring-2 focus:ring-[#137fec] rounded">
            <span className="material-symbols-outlined text-[#137fec] text-2xl" aria-hidden="true">medical_services</span>
            <span className="text-[#0d141b] dark:text-white font-bold">FindEmergencyVet.com</span>
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

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-[#0d141b] dark:text-white text-3xl md:text-4xl font-black mb-3">
            Emergency Vet Locations
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {totalClinics} emergency veterinary clinics across {activeCities} cities
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center border border-gray-100 dark:border-slate-700">
            <div className="text-2xl font-black text-[#137fec]">{totalClinics}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Total Clinics</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center border border-gray-100 dark:border-slate-700">
            <div className="text-2xl font-black text-[#137fec]">{activeCities}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Active Cities</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center border border-gray-100 dark:border-slate-700">
            <div className="text-2xl font-black text-[#137fec]">{sortedStates.length}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">States</div>
          </div>
        </div>

        {/* Cities by State */}
        <div className="space-y-6">
          {sortedStates.map(([state, stateCities]) => {
            const totalInState = stateCities.reduce((sum, c) => sum + (c.clinic_count || 0), 0)
            const hasActiveCities = totalInState > 0

            return (
              <div
                key={state}
                className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 border-b border-gray-100 dark:border-slate-700">
                  <div>
                    <h2 className="text-[#0d141b] dark:text-white font-bold text-lg">
                      {stateNames[state] || state}
                    </h2>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      {stateCities.length} {stateCities.length === 1 ? 'city' : 'cities'} • {totalInState} {totalInState === 1 ? 'clinic' : 'clinics'}
                    </span>
                  </div>
                  {hasActiveCities && (
                    <Link
                      href={`/states/${stateSlugs[state] || state.toLowerCase()}`}
                      className="text-[#137fec] text-sm font-bold hover:underline"
                    >
                      View all
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5 p-0.5">
                  {stateCities.map(city => (
                    <Link
                      key={city.id}
                      href={`/states/${stateSlugs[state] || state.toLowerCase()}/${city.slug}`}
                      className={`flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors ${
                        city.clinic_count === 0 ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[#0d141b] dark:text-white font-medium text-sm">
                          {city.name}
                        </span>
                        {city.clinic_count === 0 && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400">
                            SOON
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {city.clinic_count > 0 && (
                          <span className="text-green-600 dark:text-green-400 text-xs font-bold">
                            {city.clinic_count}
                          </span>
                        )}
                        <span className="material-symbols-outlined text-gray-400 text-[16px]" aria-hidden="true">
                          chevron_right
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Coming Soon CTA */}
        {totalCities > activeCities && (
          <div className="mt-8 bg-[#137fec]/10 dark:bg-[#137fec]/20 rounded-xl p-6 text-center">
            <span className="material-symbols-outlined text-[#137fec] text-4xl mb-2" aria-hidden="true">add_location</span>
            <h3 className="text-[#0d141b] dark:text-white font-bold text-lg mb-2">
              More Locations Coming Soon
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              We're actively adding emergency vet clinics in {totalCities - activeCities} new cities.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#137fec] text-white font-bold rounded-lg hover:bg-[#137fec]/90"
            >
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">add_business</span>
              Register Your Clinic
            </Link>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-700">
          <Link
            href="/"
            className="text-[#137fec] hover:underline focus:ring-2 focus:ring-[#137fec] rounded"
          >
            &larr; Back to home
          </Link>
        </div>
      </main>

      {/* Bottom Nav - Mobile */}
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
  )
}
