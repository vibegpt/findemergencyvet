import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'

const stateData: Record<string, { name: string; abbr: string }> = {
  'new-york': { name: 'New York', abbr: 'NY' },
  california: { name: 'California', abbr: 'CA' },
  texas: { name: 'Texas', abbr: 'TX' },
  florida: { name: 'Florida', abbr: 'FL' },
  georgia: { name: 'Georgia', abbr: 'GA' },
  virginia: { name: 'Virginia', abbr: 'VA' },
  'south-carolina': { name: 'South Carolina', abbr: 'SC' },
  'north-carolina': { name: 'North Carolina', abbr: 'NC' },
  minnesota: { name: 'Minnesota', abbr: 'MN' },
  missouri: { name: 'Missouri', abbr: 'MO' },
  mississippi: { name: 'Mississippi', abbr: 'MS' },
  michigan: { name: 'Michigan', abbr: 'MI' },
  louisiana: { name: 'Louisiana', abbr: 'LA' },
  oregon: { name: 'Oregon', abbr: 'OR' },
  iowa: { name: 'Iowa', abbr: 'IA' },
  alabama: { name: 'Alabama', abbr: 'AL' },
  arkansas: { name: 'Arkansas', abbr: 'AR' },
  tennessee: { name: 'Tennessee', abbr: 'TN' },
  maryland: { name: 'Maryland', abbr: 'MD' },
  'west-virginia': { name: 'West Virginia', abbr: 'WV' },
  vermont: { name: 'Vermont', abbr: 'VT' },
  'new-hampshire': { name: 'New Hampshire', abbr: 'NH' },
  'new-jersey': { name: 'New Jersey', abbr: 'NJ' },
  connecticut: { name: 'Connecticut', abbr: 'CT' },
  pennsylvania: { name: 'Pennsylvania', abbr: 'PA' },
  maine: { name: 'Maine', abbr: 'ME' },
  wisconsin: { name: 'Wisconsin', abbr: 'WI' },
  nebraska: { name: 'Nebraska', abbr: 'NE' },
  oklahoma: { name: 'Oklahoma', abbr: 'OK' },
}

// Also map abbreviations to slugs
const abbrToSlug: Record<string, string> = {
  NY: 'new-york', CA: 'california', TX: 'texas', FL: 'florida',
  GA: 'georgia', VA: 'virginia', SC: 'south-carolina', NC: 'north-carolina',
  MN: 'minnesota', MO: 'missouri', MS: 'mississippi', MI: 'michigan',
  LA: 'louisiana', OR: 'oregon', IA: 'iowa', AL: 'alabama',
  AR: 'arkansas', TN: 'tennessee', MD: 'maryland', WV: 'west-virginia',
  VT: 'vermont', NH: 'new-hampshire', NJ: 'new-jersey', CT: 'connecticut',
  PA: 'pennsylvania', ME: 'maine', WI: 'wisconsin', NE: 'nebraska', OK: 'oklahoma',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>
}): Promise<Metadata> {
  const { state } = await params
  const stateInfo = stateData[state]

  if (!stateInfo) {
    return { title: 'Emergency Vet Finder' }
  }

  return {
    title: `Emergency Vets in ${stateInfo.name} State | Emergency Vet Finder`,
    description: `Looking for an emergency veterinarian in ${stateInfo.name}? Find open emergency veterinary hospitals and specialty referral centers across ${stateInfo.name} State.`,
    openGraph: {
      title: `Emergency Vets in ${stateInfo.name} State`,
      description: `Find open emergency veterinary hospitals across ${stateInfo.name} State.`,
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
  const stateInfo = stateData[state]

  if (!stateInfo) notFound()

  // Fetch all cities in this state
  const { data: cities } = await supabase
    .from('cities')
    .select('*')
    .eq('state', stateInfo.abbr)
    .order('clinic_count', { ascending: false })

  if (!cities || cities.length === 0) notFound()

  const totalClinics = cities.reduce((sum, c) => sum + (c.clinic_count || 0), 0)
  const activeCities = cities.filter(c => c.clinic_count > 0)

  return (
    <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#101922]">
      {/* Emergency Banner */}
      <div className="bg-red-600 text-white py-2 px-4 text-center text-sm font-bold">
        <span className="material-symbols-outlined text-sm align-middle mr-1" aria-hidden="true">emergency</span>
        CRITICAL EMERGENCY?
        <a href="#emergency-symptoms" className="underline ml-2">Check symptoms below</a>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#f6f7f8]/80 dark:bg-[#101922]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center p-4 justify-between max-w-4xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#137fec] text-2xl" aria-hidden="true">medical_services</span>
            <span className="text-[#0d141b] dark:text-white font-bold">Emergency Vet Finder</span>
          </Link>
          <Link href="/locations" className="text-[#137fec] text-sm font-bold hover:underline">
            All Locations
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* H1 */}
        <h1 className="text-[#0d141b] dark:text-white text-3xl md:text-4xl font-black mb-4">
          Emergency Vets in {stateInfo.name} State
        </h1>

        {/* Intro Paragraph */}
        <p className="text-gray-700 dark:text-gray-300 text-lg mb-8 leading-relaxed">
          Looking for an emergency veterinarian in {stateInfo.name}?
          This page is designed to help pet owners quickly find open emergency veterinary hospitals and specialty referral centers across {stateInfo.name} State.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center border border-gray-100 dark:border-slate-700">
            <div className="text-3xl font-black text-[#137fec]">{totalClinics}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Emergency Clinics</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center border border-gray-100 dark:border-slate-700">
            <div className="text-3xl font-black text-[#137fec]">{activeCities.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Cities Covered</div>
          </div>
        </div>

        {/* H2: Emergency Veterinary Care Across State */}
        <section className="mb-10">
          <h2 className="text-[#0d141b] dark:text-white text-2xl font-bold mb-4">
            Emergency Veterinary Care Across {stateInfo.name}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Emergency care availability varies by region. Some cities have 24/7 emergency hospitals, while others rely on referral centers or rotating emergency coverage.
          </p>
        </section>

        {/* H2: Major Emergency Vet Locations */}
        <section className="mb-10">
          <h2 className="text-[#0d141b] dark:text-white text-2xl font-bold mb-4">
            Major Emergency Vet Locations in {stateInfo.name}
          </h2>
          <div className="grid gap-3">
            {activeCities.map(city => (
              <Link
                key={city.id}
                href={`/states/${state}/${city.slug}`}
                className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700 hover:border-[#137fec] transition-colors"
              >
                <div>
                  <span className="text-[#0d141b] dark:text-white font-bold text-lg">
                    Emergency Vets in {city.name}
                  </span>
                  <span className="text-green-600 ml-2 text-sm font-semibold">
                    {city.clinic_count} clinic{city.clinic_count !== 1 ? 's' : ''}
                  </span>
                </div>
                <span className="material-symbols-outlined text-[#137fec]">chevron_right</span>
              </Link>
            ))}

            {/* Coming Soon Cities */}
            {cities.filter(c => c.clinic_count === 0).length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">Coming soon:</p>
                <div className="flex flex-wrap gap-2">
                  {cities.filter(c => c.clinic_count === 0).map(city => (
                    <Link
                      key={city.id}
                      href={`/states/${state}/${city.slug}`}
                      className="text-sm px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600"
                    >
                      {city.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* H2: What Counts as a Veterinary Emergency? */}
        <section id="emergency-symptoms" className="mb-10 bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-700">
          <h2 className="text-[#0d141b] dark:text-white text-2xl font-bold mb-4">
            What Counts as a Veterinary Emergency?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            The following symptoms require immediate emergency veterinary care:
          </p>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-red-500 mt-0.5">emergency</span>
              Difficulty breathing or choking
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-red-500 mt-0.5">emergency</span>
              Severe bleeding or open wounds
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-red-500 mt-0.5">emergency</span>
              Seizures or sudden collapse
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-red-500 mt-0.5">emergency</span>
              Suspected poisoning or toxin exposure
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-red-500 mt-0.5">emergency</span>
              Inability to urinate or defecate
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-red-500 mt-0.5">emergency</span>
              Sudden severe pain or distress
            </li>
          </ul>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-4 italic">
            If you're unsure, it's safer to call an emergency vet immediately.
          </p>
        </section>

        {/* H2: Can't Find an Open Emergency Vet? */}
        <section className="mb-10 bg-gray-50 dark:bg-slate-800/50 rounded-xl p-6">
          <h2 className="text-[#0d141b] dark:text-white text-2xl font-bold mb-4">
            Can't Find an Open Emergency Vet?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            If availability is limited in your area, expand your search to nearby cities or referral centers. Emergency Vet Finder prioritizes distance + open status, not paid placements.
          </p>
        </section>

        {/* Back to All */}
        <div className="pt-8 border-t border-gray-200 dark:border-slate-700">
          <Link href="/locations" className="text-[#137fec] hover:underline font-semibold">
            ← View all states and locations
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-gray-200 px-6 py-3 flex justify-around">
        <Link href="/" className="flex flex-col items-center gap-1 text-gray-400">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        <Link href="/locations" className="flex flex-col items-center gap-1 text-[#137fec]">
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>map</span>
          <span className="text-[10px] font-bold">Locations</span>
        </Link>
      </nav>

      <div className="h-20 md:h-0"></div>
    </div>
  )
}
