'use client'

import Link from 'next/link'
import { useState } from 'react'
import ClinicCard from '@/components/clinic/ClinicCard'

type Clinic = {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip_code: string | null
  phone: string
  latitude: number | null
  longitude: number | null
  is_24_7: boolean
  current_status: string
  has_exotic_specialist: boolean
  google_rating: number | null
  google_review_count: number | null
  exotic_pets_accepted: string[]
  availability_type: string | null
  accepts_walk_ins?: boolean | null
  requires_call_ahead?: boolean | null
  parking_type?: string | null
  wheelchair_accessible?: boolean | null
  has_separate_cat_entrance?: boolean | null
  has_isolation_rooms?: boolean | null
  slug?: string
}

type City = {
  id: string
  name: string
  state: string
  slug: string
  clinic_count: number
}

export default function CityPage({
  city,
  allClinics,
  nearbyCities = []
}: {
  city: City
  allClinics: Clinic[]
  nearbyCities?: City[]
}) {
  const [filter24_7, setFilter24_7] = useState(false)
  const [filterExotic, setFilterExotic] = useState(false)

  // Apply filters
  const filteredClinics = allClinics.filter(clinic => {
    if (filter24_7 && !clinic.is_24_7) return false
    if (filterExotic && !clinic.has_exotic_specialist) return false
    return true
  })

  const count24_7 = allClinics.filter(c => c.is_24_7).length

  return (
    <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#101922]">
      {/* Skip Link */}
      <a href="#clinics" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#137fec] focus:text-white focus:rounded-lg">
        Skip to clinic listings
      </a>

      {/* Emergency Banner */}
      <div className="bg-red-600 text-white py-2 px-4 text-center text-sm font-bold">
        <span className="material-symbols-outlined text-sm align-middle mr-1" aria-hidden="true">emergency</span>
        CRITICAL EMERGENCY?
        <a href="#emergency-signs" className="underline ml-2 focus:ring-2 focus:ring-white">
          Check symptoms below
        </a>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#f6f7f8]/80 dark:bg-[#101922]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center p-4 justify-between max-w-3xl mx-auto">
          <Link href="/" className="flex items-center gap-2 focus:ring-2 focus:ring-[#137fec] rounded">
            <span className="material-symbols-outlined text-[#137fec] text-2xl" aria-hidden="true">medical_services</span>
            <span className="text-[#0d141b] dark:text-white font-bold hidden sm:inline">FindEmergencyVet.com</span>
          </Link>
          <Link
            href="/triage"
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold hover:bg-red-200 dark:hover:bg-red-900/50 focus:ring-2 focus:ring-red-500"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">emergency</span>
            Triage
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto">
        {/* HERO - Above the Fold */}
        <header className="bg-gradient-to-r from-[#137fec] to-[#0d5bbd] px-6 py-8 md:py-12">
          <div className="flex flex-col gap-4">
          <h1 className="text-white text-2xl md:text-4xl font-black leading-tight font-display">
            24 Hour Emergency Vet in {city.name}, {city.state}
          </h1>
            <p className="text-white/90 text-base md:text-lg">
              If your pet needs urgent medical care in {city.name}, use the list below to find open emergency vets and animal hospitals right now.
            </p>
            <a
              href="#clinics"
              className="inline-flex items-center justify-center gap-2 w-fit px-6 py-3 bg-white text-[#137fec] font-bold rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-white shadow-lg"
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">search</span>
              Find Open Emergency Vets Now
            </a>
          </div>
        </header>

        {/* EMERGENCY DISCLAIMER */}
        <section className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 px-4 py-3 mx-4 mt-4 rounded-r-lg">
          <p className="text-red-800 dark:text-red-200 text-sm flex items-start gap-2">
            <span className="material-symbols-outlined text-red-500 text-[20px] shrink-0 mt-0.5" aria-hidden="true">warning</span>
            <span>
              <strong>Warning:</strong> If your pet is experiencing severe bleeding, difficulty breathing, seizures, or collapse, contact an emergency veterinarian immediately before traveling.
            </span>
          </p>
        </section>

        {/* FILTER CHIPS */}
        <div className="flex gap-2 px-4 py-4 overflow-x-auto" role="group" aria-label="Filter clinics">
          <button
            onClick={() => setFilter24_7(!filter24_7)}
            className={`flex h-10 shrink-0 items-center gap-2 rounded-full px-4 border-2 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#137fec] transition-colors ${
              filter24_7
                ? 'bg-[#137fec] text-white border-[#137fec]'
                : 'bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white border-gray-200 dark:border-slate-700 hover:border-[#137fec]'
            }`}
            aria-pressed={filter24_7}
          >
            24/7 Only ({count24_7})
            {filter24_7 && <span className="material-symbols-outlined text-[16px]" aria-hidden="true">check</span>}
          </button>
          <button
            onClick={() => setFilterExotic(!filterExotic)}
            className={`flex h-10 shrink-0 items-center gap-2 rounded-full px-4 border-2 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
              filterExotic
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white border-gray-200 dark:border-slate-700 hover:border-purple-500'
            }`}
            aria-pressed={filterExotic}
          >
            Exotic Pets
            {filterExotic && <span className="material-symbols-outlined text-[16px]" aria-hidden="true">check</span>}
          </button>
        </div>

        {/* CLINIC DIRECTORY */}
        <section id="clinics" className="px-4 pb-6">
          <h2 className="text-[#0d141b] dark:text-white text-xl font-bold mb-1">
            Emergency Veterinary Clinics Near {city.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            {filteredClinics.length} clinic{filteredClinics.length !== 1 ? 's' : ''} available
          </p>

          <div className="space-y-4">
            {filteredClinics.map(clinic => (
              <ClinicCard key={clinic.id} clinic={clinic} />
            ))}
          </div>

          {/* Coming Soon - No clinics in database yet */}
          {allClinics.length === 0 && (
            <div className="bg-[#137fec]/5 dark:bg-[#137fec]/10 border-2 border-dashed border-[#137fec]/30 rounded-xl p-8 text-center">
              <span className="material-symbols-outlined text-5xl text-[#137fec] mb-4" aria-hidden="true">add_location</span>
              <h3 className="text-xl font-bold text-[#0d141b] dark:text-white mb-2">Coming Soon</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 max-w-md mx-auto">
                We're actively adding emergency veterinary clinics in {city.name}, {city.state}.
                In the meantime, try searching Google Maps or call a nearby city's emergency vet.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`https://www.google.com/maps/search/emergency+vet+${encodeURIComponent(city.name + ' ' + city.state)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 text-[#0d141b] dark:text-white font-bold rounded-lg hover:border-[#137fec]"
                >
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">map</span>
                  Search Google Maps
                </a>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#137fec] text-white font-bold rounded-lg hover:bg-[#137fec]/90"
                >
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">add_business</span>
                  Register Your Clinic
                </Link>
              </div>
            </div>
          )}

          {/* Filtered results empty */}
          {allClinics.length > 0 && filteredClinics.length === 0 && (
            <div className="bg-gray-100 dark:bg-slate-800 rounded-xl p-8 text-center">
              <span className="material-symbols-outlined text-5xl text-gray-400 mb-4" aria-hidden="true">search_off</span>
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">No clinics match your filters</h3>
              <button
                onClick={() => { setFilter24_7(false); setFilterExotic(false); }}
                className="px-6 py-2 bg-[#137fec] text-white font-bold rounded-lg hover:bg-[#137fec]/90"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>

        {/* WHEN IS IT AN EMERGENCY? */}
        <section id="emergency-signs" className="px-4 py-6 bg-white dark:bg-slate-800 border-y border-gray-100 dark:border-slate-700">
          <h2 className="text-[#0d141b] dark:text-white text-xl font-bold mb-4">
            When to Visit an Emergency Vet
          </h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm mb-4">
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-red-500 text-[18px] mt-0.5" aria-hidden="true">emergency</span>
              Difficulty breathing or choking
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-red-500 text-[18px] mt-0.5" aria-hidden="true">emergency</span>
              Severe bleeding or trauma
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-red-500 text-[18px] mt-0.5" aria-hidden="true">emergency</span>
              Seizures or loss of consciousness
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-red-500 text-[18px] mt-0.5" aria-hidden="true">emergency</span>
              Sudden paralysis or collapse
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-red-500 text-[18px] mt-0.5" aria-hidden="true">emergency</span>
              Ingestion of toxic substances
            </li>
          </ul>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            If you are unsure, it is always safer to call an emergency veterinary clinic for guidance.
          </p>
          <Link
            href="/triage"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">medical_information</span>
            Use Quick Triage Tool
          </Link>
        </section>

        {/* CITY CONTEXT */}
        <section className="px-4 py-6">
          <h2 className="text-[#0d141b] dark:text-white text-xl font-bold mb-3">
            Emergency Vet Care in {city.name}, {city.state}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            Emergency veterinary services in {city.name} provide urgent care for pets outside of regular clinic hours.
            Availability may vary on holidays and overnight, so calling ahead is strongly recommended.
            Most clinics accept walk-ins for true emergencies, but wait times can be significant during peak hours.
          </p>
        </section>

        {/* INTERNAL LINKING */}
        <section className="px-4 py-6 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-700">
          <h3 className="text-[#0d141b] dark:text-white text-lg font-bold mb-3">
            Nearby Emergency Vet Locations
          </h3>
          {nearbyCities.length > 0 ? (
            <ul className="space-y-2 mb-4">
              {nearbyCities.map(nearbyCity => (
                <li key={nearbyCity.id}>
                  <Link
                    href={`/locations/${nearbyCity.state.toLowerCase()}/${nearbyCity.slug}`}
                    className="text-[#137fec] hover:underline focus:ring-2 focus:ring-[#137fec] rounded"
                  >
                    Emergency Vet in {nearbyCity.name}, {nearbyCity.state}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">More locations coming soon.</p>
          )}
          <div className="space-y-2">
            <Link
              href={`/locations/${city.state.toLowerCase()}`}
              className="block text-[#137fec] hover:underline focus:ring-2 focus:ring-[#137fec] rounded"
            >
              View all emergency vets in {city.state}
            </Link>
            <Link
              href="/triage"
              className="block text-[#137fec] hover:underline focus:ring-2 focus:ring-[#137fec] rounded"
            >
              What to Do in a Pet Emergency
            </Link>
          </div>
        </section>

        {/* FOOTER DISCLAIMER */}
        <footer className="px-4 py-6 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
            FindEmergencyVet.com is an independent directory. Availability and hours may change.
            Always call the clinic to confirm emergency services before traveling.
          </p>
        </footer>
      </main>

      {/* BOTTOM NAV - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-gray-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center" aria-label="Bottom navigation">
        <Link href="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#137fec] min-w-[48px] min-h-[48px] justify-center focus:ring-2 focus:ring-[#137fec] rounded">
          <span className="material-symbols-outlined" aria-hidden="true">home</span>
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        <Link href="/triage" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#137fec] min-w-[48px] min-h-[48px] justify-center focus:ring-2 focus:ring-[#137fec] rounded">
          <span className="material-symbols-outlined" aria-hidden="true">medical_information</span>
          <span className="text-[10px] font-bold">Triage</span>
        </Link>
        <Link href="/costs" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#137fec] min-w-[48px] min-h-[48px] justify-center focus:ring-2 focus:ring-[#137fec] rounded">
          <span className="material-symbols-outlined" aria-hidden="true">payments</span>
          <span className="text-[10px] font-bold">Costs</span>
        </Link>
        <Link href="/locations" className="flex flex-col items-center gap-1 text-[#137fec] min-w-[48px] min-h-[48px] justify-center focus:ring-2 focus:ring-[#137fec] rounded">
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}} aria-hidden="true">map</span>
          <span className="text-[10px] font-bold">Locations</span>
        </Link>
      </nav>

      <div className="h-20 md:h-0"></div>
    </div>
  )
}
