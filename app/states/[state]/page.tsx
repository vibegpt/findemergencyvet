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
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Standard Header */}
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

      <main className="max-w-3xl mx-auto px-5 py-8 pt-[84px]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[13px] text-[#86868B] mb-6">
          <Link href="/" className="hover:text-[#1D1D1F] transition-colors">Home</Link>
          <span>&rsaquo;</span>
          <Link href="/locations" className="hover:text-[#1D1D1F] transition-colors">Locations</Link>
          <span>&rsaquo;</span>
          <span className="text-[#1D1D1F] font-medium">{stateInfo.name}</span>
        </div>

        {/* H1 */}
        <h1 className="text-[32px] md:text-[40px] font-bold tracking-[-0.03em] text-[#1D1D1F] mb-4">
          Emergency Vets in {stateInfo.name} State
        </h1>

        {/* Intro Paragraph */}
        <p className="text-[#6E6E73] text-lg mb-8 leading-relaxed">
          Looking for an emergency veterinarian in {stateInfo.name}?
          This page is designed to help pet owners quickly find open emergency veterinary hospitals and specialty referral centers across {stateInfo.name} State.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-white rounded-2xl p-4 text-center border border-[#E8E8ED]">
            <div className="text-3xl font-bold text-[#1D1D1F]">{totalClinics}</div>
            <div className="text-sm text-[#6E6E73]">Emergency Clinics</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center border border-[#E8E8ED]">
            <div className="text-3xl font-bold text-[#1D1D1F]">{activeCities.length}</div>
            <div className="text-sm text-[#6E6E73]">Cities Covered</div>
          </div>
        </div>

        {/* H2: Emergency Veterinary Care Across State */}
        <section className="mb-10">
          <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-4">
            Emergency Veterinary Care Across {stateInfo.name}
          </h2>
          <p className="text-[#6E6E73] leading-relaxed">
            Emergency care availability varies by region. Some cities have 24/7 emergency hospitals, while others rely on referral centers or rotating emergency coverage.
          </p>
        </section>

        {/* H2: Major Emergency Vet Locations */}
        <section className="mb-10">
          <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-4">
            Major Emergency Vet Locations in {stateInfo.name}
          </h2>
          <div className="grid gap-3">
            {activeCities.map(city => (
              <Link
                key={city.id}
                href={`/states/${state}/${city.slug}`}
                className="flex items-center justify-between bg-white rounded-2xl p-4 border border-[#E8E8ED] hover:border-[#0071E3] transition-colors"
              >
                <div>
                  <span className="text-[#1D1D1F] font-bold text-lg">
                    Emergency Vets in {city.name}
                  </span>
                  <span className="text-[#1B7A1B] ml-2 text-sm font-semibold">
                    {city.clinic_count} clinic{city.clinic_count !== 1 ? 's' : ''}
                  </span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#0071E3" width="20" height="20" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ))}

            {/* Coming Soon Cities */}
            {cities.filter(c => c.clinic_count === 0).length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#E8E8ED]">
                <p className="text-[#86868B] text-sm mb-3">Coming soon:</p>
                <div className="flex flex-wrap gap-2">
                  {cities.filter(c => c.clinic_count === 0).map(city => (
                    <Link
                      key={city.id}
                      href={`/states/${state}/${city.slug}`}
                      className="text-sm px-3 py-1 bg-[#F5F5F7] text-[#6E6E73] rounded-full hover:bg-[#E8E8ED]"
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
        <section id="emergency-symptoms" className="mb-10 bg-white rounded-2xl p-6 border border-[#E8E8ED]">
          <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-4">
            What Counts as a Veterinary Emergency?
          </h2>
          <p className="text-[#6E6E73] mb-4">
            The following symptoms require immediate emergency veterinary care:
          </p>
          <ul className="space-y-3 text-[#6E6E73]">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C41E1E] shrink-0 mt-2" />
              Difficulty breathing or choking
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C41E1E] shrink-0 mt-2" />
              Severe bleeding or open wounds
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C41E1E] shrink-0 mt-2" />
              Seizures or sudden collapse
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C41E1E] shrink-0 mt-2" />
              Suspected poisoning or toxin exposure
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C41E1E] shrink-0 mt-2" />
              Inability to urinate or defecate
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C41E1E] shrink-0 mt-2" />
              Sudden severe pain or distress
            </li>
          </ul>
          <p className="text-[#86868B] text-sm mt-4 italic">
            If you&apos;re unsure, it&apos;s safer to call an emergency vet immediately.
          </p>
        </section>

        {/* H2: Can't Find an Open Emergency Vet? */}
        <section className="mb-10 bg-[#F5F5F7] rounded-2xl p-6">
          <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-4">
            Can&apos;t Find an Open Emergency Vet?
          </h2>
          <p className="text-[#6E6E73] leading-relaxed">
            If availability is limited in your area, expand your search to nearby cities or referral centers. Emergency Vet Finder prioritizes distance + open status, not paid placements.
          </p>
        </section>

        {/* Back to All */}
        <div className="pt-8 border-t border-[#E8E8ED]">
          <Link href="/locations" className="text-[#0071E3] hover:underline font-semibold">
            &larr; View all states and locations
          </Link>
        </div>
      </main>

      {/* Standard Footer */}
      <footer className="px-5 py-8 border-t border-[#E8E8ED] text-center">
        <p className="text-[#86868B] text-xs leading-relaxed max-w-lg mx-auto">
          FindEmergencyVet.com is an independent directory. Availability and hours may change without notice.
          Always call the clinic to confirm emergency services before traveling.
        </p>
        <p className="text-[#86868B] text-xs mt-2">&copy; 2026 FindEmergencyVet.com</p>
      </footer>
    </div>
  )
}
