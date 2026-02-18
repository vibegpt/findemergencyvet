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

  // States with flat hub-and-spoke URLs
  const flatUrlStates = new Set(['NY'])

  return (
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

      <main className="max-w-3xl mx-auto px-5 pt-[60px] py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[13px] text-[#86868B] mb-6 pt-4">
          <Link href="/" className="hover:text-[#1D1D1F] transition-colors">Home</Link>
          <span>&rsaquo;</span>
          <span className="text-[#1D1D1F] font-medium">All Locations</span>
        </div>

        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-[32px] md:text-[40px] font-bold tracking-[-0.03em] text-[#1D1D1F] leading-tight mb-3">
            Emergency Vet Locations
          </h1>
          <p className="text-[#6E6E73] text-lg">
            {totalClinics} emergency veterinary clinics across {activeCities} cities
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-[#E8E8ED] rounded-2xl p-4 text-center" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div className="text-2xl font-bold text-[#1D1D1F]">{totalClinics}</div>
            <div className="text-xs text-[#6E6E73] font-medium">Total Clinics</div>
          </div>
          <div className="bg-white border border-[#E8E8ED] rounded-2xl p-4 text-center" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div className="text-2xl font-bold text-[#1D1D1F]">{activeCities}</div>
            <div className="text-xs text-[#6E6E73] font-medium">Active Cities</div>
          </div>
          <div className="bg-white border border-[#E8E8ED] rounded-2xl p-4 text-center" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div className="text-2xl font-bold text-[#1D1D1F]">{sortedStates.length}</div>
            <div className="text-xs text-[#6E6E73] font-medium">States</div>
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
                className="bg-white border border-[#E8E8ED] rounded-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 bg-[#F5F5F7] border-b border-[#E8E8ED]">
                  <div>
                    <h2 className="text-[#1D1D1F] font-bold text-lg">
                      {stateNames[state] || state}
                    </h2>
                    <span className="text-[#86868B] text-sm">
                      {stateCities.length} {stateCities.length === 1 ? 'city' : 'cities'} &bull; {totalInState} {totalInState === 1 ? 'clinic' : 'clinics'}
                    </span>
                  </div>
                  {hasActiveCities && (
                    <Link
                      href={flatUrlStates.has(state) ? `/${stateSlugs[state]}` : `/states/${stateSlugs[state] || state.toLowerCase()}`}
                      className="text-[#0071E3] text-sm font-semibold hover:underline"
                    >
                      View all
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5 p-0.5">
                  {stateCities.map(city => (
                    <Link
                      key={city.id}
                      href={flatUrlStates.has(state) ? `/new-york/${city.slug}` : `/states/${stateSlugs[state] || state.toLowerCase()}/${city.slug}`}
                      className={`flex items-center justify-between p-3 hover:bg-[#F5F5F7] transition-colors ${
                        city.clinic_count === 0 ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[#1D1D1F] font-medium text-sm">
                          {city.name}
                        </span>
                        {city.clinic_count === 0 && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#F5F5F7] text-[#86868B]">
                            SOON
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {city.clinic_count > 0 && (
                          <span className="text-[#1B7A1B] text-xs font-bold">
                            {city.clinic_count}
                          </span>
                        )}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="14" height="14" className="text-[#86868B]">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
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
          <div className="mt-8 bg-[#F5F5F7] border border-[#E8E8ED] rounded-2xl p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="40" height="40" className="text-[#86868B] mx-auto mb-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <h3 className="text-[#1D1D1F] font-bold text-lg mb-2">
              More Locations Coming Soon
            </h3>
            <p className="text-[#6E6E73] text-sm mb-4">
              We&apos;re actively adding emergency vet clinics in {totalCities - activeCities} new cities.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1D1D1F] text-white font-medium rounded-xl hover:opacity-90 transition-opacity text-sm"
            >
              List Your Clinic
            </Link>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-8 pt-8 border-t border-[#E8E8ED]">
          <Link
            href="/"
            className="text-[#0071E3] hover:underline"
          >
            &larr; Back to home
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-5 py-8 border-t border-[#E8E8ED] text-center">
        <p className="text-[#86868B] text-xs leading-relaxed max-w-lg mx-auto">
          FindEmergencyVet.com is an independent directory. Availability and hours may change without notice.
          Always call the clinic to confirm emergency services before traveling.
        </p>
        <div className="flex justify-center gap-4 mt-3 text-[#86868B] text-xs">
          <Link href="/about" className="hover:text-[#1D1D1F] transition-colors">About</Link>
          <Link href="/contact" className="hover:text-[#1D1D1F] transition-colors">Contact</Link>
          <Link href="/privacy" className="hover:text-[#1D1D1F] transition-colors">Privacy</Link>
        </div>
        <p className="text-[#86868B] text-xs mt-2">&copy; 2026 FindEmergencyVet.com</p>
      </footer>

      {/* Mobile Bottom Nav */}
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
          <Link href="/locations" className="flex flex-col items-center gap-0.5 text-[#0071E3] min-w-[48px] min-h-[48px] justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
            <span className="text-[10px] font-medium">Locations</span>
          </Link>
        </div>
      </nav>
      <div className="h-20 md:h-0" />
    </div>
  )
}
