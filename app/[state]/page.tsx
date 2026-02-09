import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { stateNameBySlug, stateAbbrBySlug } from '@/lib/state-data'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>
}): Promise<Metadata> {
  const { state } = await params
  const stateName = stateNameBySlug[state]

  if (!stateName) return { title: 'Emergency Vet Finder' }

  return {
    title: `Emergency Vets in ${stateName} — Open Now | FindEmergencyVet.com`,
    description: `Find open 24/7 emergency vets and animal hospitals across ${stateName}. Call now for immediate care, directions, and after-hours availability.`,
    alternates: {
      canonical: `https://findemergencyvet.com/${state}`,
    },
    openGraph: {
      title: `Emergency Vets in ${stateName} — Open Now`,
      description: `Find open emergency veterinary hospitals across ${stateName}. Call directly, no delays.`,
      type: 'website',
    },
  }
}

export default async function StateHubPage({
  params,
}: {
  params: Promise<{ state: string }>
}) {
  const { state } = await params
  const stateName = stateNameBySlug[state]
  const stateAbbr = stateAbbrBySlug[state]

  if (!stateName || !stateAbbr) notFound()

  const { data: cities } = await supabase
    .from('cities')
    .select('*')
    .eq('state', stateAbbr)
    .order('clinic_count', { ascending: false })

  if (!cities || cities.length === 0) notFound()

  const totalClinics = cities.reduce((sum, c) => sum + (c.clinic_count || 0), 0)
  const activeCities = cities.filter(c => c.clinic_count > 0)
  const comingSoonCities = cities.filter(c => c.clinic_count === 0)

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://findemergencyvet.com' },
      { '@type': 'ListItem', position: 2, name: stateName, item: `https://findemergencyvet.com/${state}` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      <div className="min-h-screen bg-white dark:bg-[#1d1d1f]">
        {/* ── Navigation ── */}
        <nav className="fixed top-0 left-0 right-0 h-[52px] bg-white/80 dark:bg-[#1d1d1f]/80 backdrop-blur-xl backdrop-saturate-[180%] z-50 border-b border-black/[0.08] dark:border-white/[0.08]">
          <div className="max-w-3xl mx-auto h-full flex items-center justify-between px-6">
            <Link href="/" className="text-lg font-semibold tracking-tight text-[#1d1d1f] dark:text-white">
              Find<span className="text-[#ff3b30]">Emergency</span>Vet
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/guides" className="text-sm text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white transition-colors hidden sm:block">
                Resources
              </Link>
              <Link href="/locations" className="text-sm text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white transition-colors hidden sm:block">
                All Locations
              </Link>
            </div>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto pt-[52px]">
          {/* ── Hero ── */}
          <header className="px-6 pt-12 pb-8">
            <div className="flex items-center gap-2 text-sm text-[#6e6e73] mb-6">
              <Link href="/" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[#1d1d1f] dark:text-white font-medium">{stateName}</span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-[#1d1d1f] dark:text-white leading-tight mb-4">
              Emergency Vets in {stateName}
            </h1>

            <p className="text-[#6e6e73] text-base md:text-lg leading-relaxed max-w-xl">
              {totalClinics} emergency veterinary {totalClinics === 1 ? 'clinic' : 'clinics'} across {activeCities.length} {activeCities.length === 1 ? 'city' : 'cities'} in {stateName}.
              Call ahead to confirm availability.
            </p>

            {/* Stats */}
            <div className="flex gap-4 mt-8">
              <div className="flex-1 bg-[#f5f5f7] dark:bg-[#2d2d2f] rounded-2xl p-5 text-center">
                <div className="text-3xl font-semibold text-[#1d1d1f] dark:text-white">{totalClinics}</div>
                <div className="text-sm text-[#86868b] mt-1">Emergency Clinics</div>
              </div>
              <div className="flex-1 bg-[#f5f5f7] dark:bg-[#2d2d2f] rounded-2xl p-5 text-center">
                <div className="text-3xl font-semibold text-[#1d1d1f] dark:text-white">{activeCities.length}</div>
                <div className="text-sm text-[#86868b] mt-1">Cities Covered</div>
              </div>
            </div>
          </header>

          {/* ── City Listings ── */}
          <section className="px-6 py-8">
            <h2 className="text-[#1d1d1f] dark:text-white text-xl font-semibold mb-6">
              Emergency Vet Locations in {stateName}
            </h2>
            <div className="space-y-3">
              {activeCities.map(city => (
                <Link
                  key={city.id}
                  href={`/${state}/${city.slug}`}
                  className="flex items-center justify-between bg-[#f5f5f7] dark:bg-[#2d2d2f] rounded-xl p-4 hover:bg-[#e8e8ed] dark:hover:bg-[#3d3d3f] transition-colors group"
                >
                  <div>
                    <span className="text-[#1d1d1f] dark:text-white font-semibold">
                      {city.name}, {stateAbbr}
                    </span>
                    <span className="text-[#1B7A1B] ml-2 text-sm font-semibold">
                      {city.clinic_count} {city.clinic_count === 1 ? 'clinic' : 'clinics'}
                    </span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18" className="text-[#86868b] group-hover:text-[#1d1d1f] dark:group-hover:text-white transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              ))}
            </div>

            {/* Coming Soon */}
            {comingSoonCities.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[#d2d2d7]/50 dark:border-[#2d2d2f]">
                <p className="text-[#86868b] text-sm mb-3">Coming soon</p>
                <div className="flex flex-wrap gap-2">
                  {comingSoonCities.map(city => (
                    <span
                      key={city.id}
                      className="text-sm px-3 py-1.5 bg-[#f5f5f7] dark:bg-[#2d2d2f] text-[#86868b] rounded-full"
                    >
                      {city.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* ── Emergency Signs ── */}
          <section className="px-6 py-8 border-t border-[#d2d2d7]/50 dark:border-[#2d2d2f]">
            <h2 className="text-[#1d1d1f] dark:text-white text-xl font-semibold mb-4">
              When to Visit an Emergency Vet
            </h2>
            <ul className="space-y-2.5 text-sm text-[#6e6e73] dark:text-[#86868b]">
              {[
                'Difficulty breathing or choking',
                'Severe bleeding or open wounds',
                'Seizures or loss of consciousness',
                'Sudden collapse or inability to stand',
                'Suspected poisoning or toxin ingestion',
                'Bloated, distended, or painful abdomen',
              ].map(item => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff3b30] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* ── ASPCA Poison Control Banner ── */}
          <section className="mx-6 mb-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="22" height="22" className="text-amber-600 shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <div>
                <p className="text-amber-900 dark:text-amber-200 text-sm font-semibold mb-1">
                  Think your pet was poisoned?
                </p>
                <p className="text-amber-800 dark:text-amber-300 text-sm">
                  Call the ASPCA Animal Poison Control Center:{' '}
                  <a href="tel:8884264435" className="font-bold underline whitespace-nowrap">(888) 426-4435</a>
                  <span className="text-amber-600 dark:text-amber-400 text-xs ml-1">(consultation fee may apply)</span>
                </p>
              </div>
            </div>
          </section>

          {/* ── Footer Disclaimer ── */}
          <footer className="px-6 py-8 border-t border-[#d2d2d7]/50 dark:border-[#2d2d2f] text-center">
            <p className="text-[#86868b] text-xs leading-relaxed max-w-lg mx-auto">
              FindEmergencyVet.com is an independent directory. Availability and hours may change without notice.
              Always call the clinic to confirm emergency services before traveling. Last verified February 2026.
            </p>
            <p className="text-[#86868b] text-xs mt-2">
              &copy; 2026 FindEmergencyVet.com
            </p>
          </footer>
        </main>

        {/* ── Mobile Bottom Nav ── */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#1d1d1f]/90 backdrop-blur-xl border-t border-black/[0.08] dark:border-white/[0.08] px-6 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]" aria-label="Bottom navigation">
          <div className="flex justify-around items-center max-w-md mx-auto">
            <Link href="/" className="flex flex-col items-center gap-0.5 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white min-w-[48px] min-h-[48px] justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span className="text-[10px] font-bold">Home</span>
            </Link>
            <Link href="/guides" className="flex flex-col items-center gap-0.5 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white min-w-[48px] min-h-[48px] justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              <span className="text-[10px] font-bold">Guides</span>
            </Link>
            <Link href="/locations" className="flex flex-col items-center gap-0.5 text-[#ff3b30] min-w-[48px] min-h-[48px] justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              <span className="text-[10px] font-bold">Locations</span>
            </Link>
          </div>
        </nav>

        {/* Bottom nav spacer */}
        <div className="h-20 md:h-0" />
      </div>
    </>
  )
}
