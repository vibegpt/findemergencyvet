import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'

const stateNames: Record<string, string> = {
  ny: 'New York',
  ca: 'California',
  tx: 'Texas',
  fl: 'Florida',
  // Add more as needed
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>
}): Promise<Metadata> {
  const { state } = await params
  const stateName = stateNames[state.toLowerCase()] || state.toUpperCase()

  return {
    title: `Emergency Vets in ${stateName} | Find Emergency Vet`,
    description: `Find 24/7 emergency veterinary clinics in ${stateName}. Browse all locations with phone numbers, directions, and hours.`,
  }
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ state: string }>
}) {
  const { state } = await params
  const stateUpper = state.toUpperCase()
  const stateName = stateNames[state.toLowerCase()] || stateUpper

  // Fetch all cities in this state
  const { data: cities } = await supabase
    .from('cities')
    .select('*')
    .eq('state', stateUpper)
    .order('clinic_count', { ascending: false })

  if (!cities || cities.length === 0) {
    notFound()
  }

  const totalClinics = cities.reduce((sum, city) => sum + (city.clinic_count || 0), 0)

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
          <span className="text-[#1D1D1F] font-medium">{stateName}</span>
        </div>

        <h1 className="text-[32px] md:text-[40px] font-bold tracking-[-0.03em] text-[#1D1D1F] mb-2">
          Emergency Vets in {stateName}
        </h1>
        <p className="text-[#6E6E73] mb-8">
          {totalClinics} emergency veterinary clinics across {cities.length} locations
        </p>

        <div className="space-y-4">
          {cities.map(city => (
            <Link
              key={city.id}
              href={`/locations/${state.toLowerCase()}/${city.slug}`}
              className="block bg-white rounded-2xl border border-[#E8E8ED] p-4 hover:border-[#0071E3] transition-colors focus:ring-2 focus:ring-[#0071E3]"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-[#1D1D1F] text-lg font-bold">
                    {city.name}, {city.state}
                  </h2>
                  <p className="text-[#6E6E73] text-sm">
                    {city.clinic_count} emergency vet{city.clinic_count !== 1 ? 's' : ''}
                  </p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#0071E3" width="20" height="20" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-[#E8E8ED]">
          <Link
            href="/"
            className="text-[#0071E3] hover:underline focus:ring-2 focus:ring-[#0071E3] rounded"
          >
            &larr; Back to all locations
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
