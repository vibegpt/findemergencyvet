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
        <div className="flex items-center p-4 justify-between max-w-3xl mx-auto">
          <Link href="/" className="flex items-center gap-2 focus:ring-2 focus:ring-[#137fec] rounded">
            <span className="material-symbols-outlined text-[#137fec] text-2xl" aria-hidden="true">medical_services</span>
            <span className="text-[#0d141b] dark:text-white font-bold">FindEmergencyVet.com</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-[#0d141b] dark:text-white text-3xl font-black mb-2">
          Emergency Vets in {stateName}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {totalClinics} emergency veterinary clinics across {cities.length} locations
        </p>

        <div className="space-y-4">
          {cities.map(city => (
            <Link
              key={city.id}
              href={`/locations/${state.toLowerCase()}/${city.slug}`}
              className="block bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4 hover:border-[#137fec] transition-colors focus:ring-2 focus:ring-[#137fec]"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-[#0d141b] dark:text-white text-lg font-bold">
                    {city.name}, {city.state}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {city.clinic_count} emergency vet{city.clinic_count !== 1 ? 's' : ''}
                  </p>
                </div>
                <span className="material-symbols-outlined text-[#137fec]" aria-hidden="true">chevron_right</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-700">
          <Link
            href="/"
            className="text-[#137fec] hover:underline focus:ring-2 focus:ring-[#137fec] rounded"
          >
            &larr; Back to all locations
          </Link>
        </div>
      </main>
    </div>
  )
}
