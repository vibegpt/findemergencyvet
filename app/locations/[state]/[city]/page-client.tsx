'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { FAQSection } from '@/components/SharedSections'
import { FloatingCallButton } from '@/components/FloatingCallButton'
import { WaitTimeDisplay } from '@/components/WaitTime'

type Clinic = {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip_code: string | null
  phone: string
  is_24_7: boolean
  current_status: string
  has_surgery_suite: boolean
  has_icu: boolean
  has_exotic_specialist: boolean
  accepts_care_credit: boolean
  google_rating: number | null
  exotic_pets_accepted: string[]
}

export default function CityPage({ 
  city, 
  allClinics 
}: { 
  city: any
  allClinics: Clinic[]
}) {
  const [filterOpenNow, setFilterOpenNow] = useState(true)
  const [filter24_7, setFilter24_7] = useState(false)
  const [filterExotic, setFilterExotic] = useState<string | null>(null)
  const [selectedClinic, setSelectedClinic] = useState<string | null>(null)

  // Apply filters
  const filteredClinics = allClinics.filter(clinic => {
    if (filterOpenNow && !clinic.is_24_7 && clinic.current_status !== 'confirmed-open') return false
    if (filter24_7 && !clinic.is_24_7) return false
    if (filterExotic && !clinic.exotic_pets_accepted?.includes(filterExotic)) return false
    return true
  })

  const openNowCount = allClinics.filter(c => c.is_24_7 || c.current_status === 'confirmed-open').length

  const exoticPetTypes = ['birds', 'reptiles', 'rabbits', 'ferrets', 'small-mammals']

  return (
    <div className="min-h-screen bg-[#f6f8f8] dark:bg-[#101f22]">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#13c8ec] focus:text-white focus:rounded-lg">
        Skip to clinic listings
      </a>

      <div className="bg-red-600 text-white py-2 px-4 text-center text-sm font-bold">
        <span className="material-symbols-outlined text-sm align-middle mr-1" aria-hidden="true">emergency</span>
        CRITICAL EMERGENCY? <a href="tel:911" className="underline ml-2 focus:ring-2 focus:ring-white">Call 911</a>
      </div>

      <nav className="sticky top-0 z-50 bg-[#f6f8f8]/80 dark:bg-[#101f22]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center p-4 justify-between max-w-lg mx-auto">
          <Link href="/" className="material-symbols-outlined text-[#13c8ec] text-3xl focus:ring-2 focus:ring-[#13c8ec] rounded" aria-label="Homepage">emergency</Link>
          <h1 className="text-[#0d191b] dark:text-white text-lg font-bold">FindEmergencyVet.com</h1>
          <Link href="/" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-2 focus:ring-[#13c8ec]" aria-label="Search"><span className="material-symbols-outlined">search</span></Link>
        </div>
        <nav className="px-4 pb-2 max-w-lg mx-auto" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <li><Link href="/" className="hover:text-[#13c8ec] focus:ring-2 focus:ring-[#13c8ec] rounded px-1">Home</Link></li>
            <li>/</li>
            <li><Link href={`/locations/${city.state.toLowerCase()}`} className="hover:text-[#13c8ec] focus:ring-2 focus:ring-[#13c8ec] rounded px-1">{city.state}</Link></li>
            <li>/</li>
            <li aria-current="page" className="font-semibold text-[#0d191b] dark:text-white">{city.name}</li>
          </ol>
        </nav>
      </nav>

      <main id="main-content" className="max-w-lg mx-auto pb-24">
        <div className="p-0 sm:p-4">
          <div className="relative flex min-h-[280px] flex-col gap-6 sm:rounded-xl items-start justify-end px-5 pb-8 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&auto=format&fit=crop&q=60"
              alt={`Emergency veterinary hospitals in ${city.name}, ${city.state}`}
              fill
              priority
              className="object-cover -z-10"
              sizes="(max-width: 768px) 100vw, 800px"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70 -z-10" />
            
            <div className="flex flex-col gap-2 z-10">
              <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-green-500 text-white text-[10px] font-bold uppercase w-fit" role="status">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                {openNowCount} OPEN NOW
              </div>
              <h2 className="text-white text-3xl font-black leading-tight sm:text-4xl">Emergency Vets in {city.name}, {city.state}</h2>
              <p className="text-white/90 text-sm font-medium">24/7 urgent care • Exotic pet specialists available</p>
            </div>
          </div>
        </div>

        {/* Working Filter Chips */}
        <div className="sticky top-[137px] z-40 bg-[#f6f8f8] dark:bg-[#101f22] py-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex gap-2 px-4 overflow-x-auto hide-scrollbar" role="group" aria-label="Filter clinics">
            <button 
              onClick={() => setFilterOpenNow(!filterOpenNow)}
              className={`flex h-11 shrink-0 items-center justify-center gap-x-1.5 rounded-full px-4 border-2 min-w-[44px] focus:outline-none focus:ring-2 focus:ring-[#13c8ec] focus:ring-offset-2 transition-colors ${
                filterOpenNow 
                  ? 'bg-[#13c8ec] text-white border-[#13c8ec]' 
                  : 'bg-white dark:bg-gray-800 text-[#0d191b] dark:text-white border-gray-200 dark:border-gray-700 hover:border-[#13c8ec]'
              }`}
              aria-pressed={filterOpenNow}
            >
              <span className="text-sm font-bold">Open Now</span>
              {filterOpenNow && <span className="material-symbols-outlined text-[18px]" aria-hidden="true">check</span>}
            </button>

            <button 
              onClick={() => setFilter24_7(!filter24_7)}
              className={`flex h-11 shrink-0 items-center justify-center gap-x-1.5 rounded-full px-4 border-2 min-w-[44px] focus:outline-none focus:ring-2 focus:ring-[#13c8ec] focus:ring-offset-2 transition-colors ${
                filter24_7
                  ? 'bg-[#13c8ec] text-white border-[#13c8ec]' 
                  : 'bg-white dark:bg-gray-800 text-[#0d191b] dark:text-white border-gray-200 dark:border-gray-700 hover:border-[#13c8ec]'
              }`}
              aria-pressed={filter24_7}
            >
              <span className="text-sm font-medium">24/7 Only</span>
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">schedule</span>
            </button>

            <div className="relative">
              <button 
                onClick={() => setFilterExotic(filterExotic ? null : 'show-menu')}
                className={`flex h-11 shrink-0 items-center justify-center gap-x-1.5 rounded-full px-4 border-2 min-w-[44px] focus:outline-none focus:ring-2 focus:ring-[#13c8ec] focus:ring-offset-2 transition-colors ${
                  filterExotic && filterExotic !== 'show-menu'
                    ? 'bg-purple-500 text-white border-purple-500'
                    : 'bg-white dark:bg-gray-800 text-[#0d191b] dark:text-white border-gray-200 dark:border-gray-700 hover:border-[#13c8ec]'
                }`}
                aria-pressed={!!filterExotic}
                aria-label="Filter by exotic pets"
              >
                <span className="text-sm font-medium">Exotic Pets</span>
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">keyboard_arrow_down</span>
              </button>

              {filterExotic === 'show-menu' && (
                <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 min-w-[150px] z-50">
                  {exoticPetTypes.map(pet => (
                    <button
                      key={pet}
                      onClick={() => setFilterExotic(pet)}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded capitalize"
                    >
                      {pet.replace('-', ' ')}
                    </button>
                  ))}
                  <button
                    onClick={() => setFilterExotic(null)}
                    className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded border-t border-gray-200 dark:border-gray-700 mt-1 pt-2"
                  >
                    Clear filter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 pt-6">
          <h3 className="text-[#0d191b] dark:text-white text-xl font-extrabold">Emergency Clinics in {city.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Showing {filteredClinics.length} of {allClinics.length} veterinary emergency facilities
          </p>
        </div>

        {/* Clinic Listings - No Images */}
        <div className="px-4 mt-5 space-y-6">
          {filteredClinics.map(clinic => (
            <article 
              key={clinic.id} 
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 focus-within:ring-2 focus-within:ring-[#13c8ec]"
              onMouseEnter={() => setSelectedClinic(clinic.id)}
              onMouseLeave={() => setSelectedClinic(null)}
            >
              <div className="flex justify-between items-start gap-3 mb-3">
                <div className="flex-1">
                  <h4 className="text-[#0d191b] dark:text-white text-lg font-bold leading-tight">{clinic.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{clinic.address}, {clinic.city}, {clinic.state}</p>
                </div>
                <div className="flex flex-col gap-2">
                  {clinic.is_24_7 && <span className="inline-flex items-center gap-1 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap"><span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden="true"></span>24/7</span>}
                  {!clinic.is_24_7 && clinic.current_status === 'confirmed-open' && <span className="inline-flex items-center gap-1 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap"><span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden="true"></span>OPEN</span>}
                  {clinic.google_rating && <div className="flex items-center gap-1 bg-[#13c8ec]/10 text-[#13c8ec] px-2 py-1 rounded-md"><span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings:"'FILL' 1"}} aria-hidden="true">star</span><span className="text-xs font-bold">{clinic.google_rating}</span></div>}
                </div>
              </div>

              {/* Wait Time Display */}
              <div className="mb-3">
                <WaitTimeDisplay 
                  clinicId={clinic.id}
                  initialData={{
                    minMinutes: 20,
                    maxMinutes: 45,
                    reportCount: 8,
                    lastUpdated: new Date().toISOString()
                  }}
                />
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {clinic.has_surgery_suite && <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-[11px] font-semibold">SURGERY</span>}
                {clinic.has_icu && <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-[11px] font-semibold">ICU</span>}
                {clinic.has_exotic_specialist && <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded text-[11px] font-semibold">EXOTICS</span>}
                {clinic.accepts_care_credit && <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-[11px] font-semibold">CARECREDIT</span>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(clinic.address+' '+clinic.city+' '+clinic.state)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 h-12 rounded-lg border-2 border-[#13c8ec] text-[#13c8ec] text-sm font-bold hover:bg-[#13c8ec]/5 focus:ring-2 focus:ring-[#13c8ec]"><span className="material-symbols-outlined text-[20px]" aria-hidden="true">directions</span>Directions</a>
                <a href={`tel:${clinic.phone}`} className="flex items-center justify-center gap-2 h-12 rounded-lg bg-[#13c8ec] text-white text-sm font-bold shadow-md hover:bg-[#13c8ec]/90 focus:ring-2 focus:ring-white"><span className="material-symbols-outlined text-[20px]" aria-hidden="true">call</span>Call Now</a>
              </div>

              {/* Floating Call Button for Selected Clinic */}
              {selectedClinic === clinic.id && (
                <FloatingCallButton phone={clinic.phone} clinicName={clinic.name} />
              )}
            </article>
          ))}
        </div>

        {filteredClinics.length === 0 && (
          <div className="px-4 mt-8 text-center">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-8">
              <span className="material-symbols-outlined text-5xl text-gray-400 mb-4" aria-hidden="true">filter_alt_off</span>
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">No clinics match your filters</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Try adjusting your filters to see more results</p>
              <button
                onClick={() => {
                  setFilterOpenNow(true)
                  setFilter24_7(false)
                  setFilterExotic(null)
                }}
                className="px-6 py-2 bg-[#13c8ec] text-white font-semibold rounded-lg hover:bg-[#13c8ec]/90"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        <div className="px-4 mt-6 mb-8">
          <div className="bg-[#13c8ec]/5 dark:bg-[#13c8ec]/10 rounded-2xl p-6 border border-[#13c8ec]/20">
            <h3 className="text-[#13c8ec] font-bold text-lg mb-2">Not sure if it's an emergency?</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">Signs requiring immediate care: difficulty breathing, severe bleeding, collapse, seizures, toxin ingestion.</p>
            <Link href="/triage" className="w-full h-12 bg-white dark:bg-gray-800 border-2 border-[#13c8ec]/30 rounded-lg text-[#13c8ec] text-sm font-bold flex items-center justify-center hover:bg-[#13c8ec]/5 focus:ring-2 focus:ring-[#13c8ec]">Check Emergency Symptoms</Link>
          </div>
        </div>

        {/* FAQ Section */}
        <FAQSection />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-lg mx-auto flex justify-around p-3 pb-8">
          <Link href="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#13c8ec] min-w-[48px] min-h-[48px] justify-center focus:ring-2 focus:ring-[#13c8ec] rounded"><span className="material-symbols-outlined text-[28px]" aria-hidden="true">home</span><span className="text-[10px] font-bold">Home</span></Link>
          <Link href="/triage" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#13c8ec] min-w-[48px] min-h-[48px] justify-center focus:ring-2 focus:ring-[#13c8ec] rounded"><span className="material-symbols-outlined text-[28px]" aria-hidden="true">medical_information</span><span className="text-[10px] font-bold">Triage</span></Link>
          <Link href="/costs" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#13c8ec] min-w-[48px] min-h-[48px] justify-center focus:ring-2 focus:ring-[#13c8ec] rounded"><span className="material-symbols-outlined text-[28px]" aria-hidden="true">payments</span><span className="text-[10px] font-bold">Costs</span></Link>
          <Link href="/locations" className="flex flex-col items-center gap-1 text-[#13c8ec] min-w-[48px] min-h-[48px] justify-center focus:ring-2 focus:ring-[#13c8ec] rounded"><span className="material-symbols-outlined text-[28px]" style={{fontVariationSettings:"'FILL' 1"}} aria-hidden="true">map</span><span className="text-[10px] font-bold">Locations</span></Link>
        </div>
      </nav>
    </div>
  )
}
