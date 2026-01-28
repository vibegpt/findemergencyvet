'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { WhyUsSection, FAQSection } from '@/components/SharedSections'

export default function HomePage({ clinicCount, cities, cityClinics }: { clinicCount: number, cities: any[], cityClinics: Record<string, any[]> }) {
  const [selectedArea, setSelectedArea] = useState<string>(cities?.[0]?.slug || 'westchester')
  const [isLocating, setIsLocating] = useState(false)

  // Auto-detect location on mount and set initial tab
  useEffect(() => {
    if ('geolocation' in navigator) {
      setIsLocating(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          // Westchester area: roughly 40.85-41.35 lat, -73.4 to -74.0 lng
          // Rochester area: roughly 42.8-43.3 lat, -77.3 to -78.0 lng
          if (latitude >= 40.85 && latitude <= 41.4 && longitude >= -74.1 && longitude <= -73.3) {
            setSelectedArea('westchester')
          } else if (latitude >= 42.7 && latitude <= 43.4 && longitude >= -78.1 && longitude <= -76.9) {
            setSelectedArea('rochester')
          }
          setIsLocating(false)
        },
        () => {
          setIsLocating(false)
        },
        { timeout: 5000 }
      )
    }
  }, [])

  // Helper to render clinic list
  const renderClinicList = (city: any, compact = false) => {
    const topClinics = cityClinics[city.slug] || []
    return (
      <div className={`bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden ${compact ? '' : 'shadow-sm'}`}>
        {/* City Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
          <div>
            <h3 className="text-[#0d141b] dark:text-white font-bold text-lg">
              {city.name}, {city.state}
            </h3>
            <span className="text-green-600 dark:text-green-400 text-xs font-bold flex items-center gap-1 mt-0.5">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              {city.clinic_count} Emergency Vets
            </span>
          </div>
          <Link
            href={`/locations/${city.state.toLowerCase()}/${city.slug}`}
            className="flex items-center gap-1 text-[#137fec] text-sm font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-[#137fec] rounded px-3 py-2"
          >
            All
            <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span>
          </Link>
        </div>

        {/* Clinics - Scrollable */}
        <div className="divide-y divide-gray-100 dark:divide-slate-700 max-h-[360px] overflow-y-auto">
          {topClinics.map((clinic: any) => (
            <div key={clinic.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[#0d141b] dark:text-white font-semibold text-sm">{clinic.name}</span>
                  {clinic.is_24_7 && (
                    <span className="inline-flex items-center gap-1 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0">24/7</span>
                  )}
                  {clinic.has_exotic_specialist && (
                    <span className="inline-flex items-center bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0">EXOTICS</span>
                  )}
                  {/* Availability Type Badge */}
                  {clinic.availability_type && clinic.availability_type !== 'true-24-7' && (
                    <span className={`inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                      clinic.availability_type === 'on-call-24-7'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                        : clinic.availability_type === 'extended-hours'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : clinic.availability_type === 'emergency-only'
                        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}>
                      {clinic.availability_type === 'on-call-24-7' && 'CALL FIRST'}
                      {clinic.availability_type === 'extended-hours' && 'EXTENDED HRS'}
                      {clinic.availability_type === 'emergency-only' && 'APPT ONLY'}
                      {clinic.availability_type === 'urgent-care' && 'URGENT CARE'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-gray-500 dark:text-gray-400 text-xs">{clinic.phone}</span>
                  {/* Google Rating */}
                  {clinic.google_rating && (
                    <span className={`inline-flex items-center gap-0.5 text-xs ${
                      clinic.google_rating >= 4.5 ? 'text-green-600 dark:text-green-400'
                      : clinic.google_rating >= 3.5 ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                    }`}>
                      <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: "'FILL' 1"}} aria-hidden="true">star</span>
                      {clinic.google_rating}
                      {clinic.google_review_count > 0 && (
                        <span className="text-gray-400 dark:text-gray-500">({clinic.google_review_count})</span>
                      )}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 shrink-0 ml-3">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${clinic.address}, ${clinic.city}, ${clinic.state}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-10 w-10 rounded-lg border-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label={`Get directions to ${clinic.name}`}
                >
                  <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 1"}} aria-hidden="true">location_on</span>
                </a>
                <a
                  href={`tel:${clinic.phone}`}
                  className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg bg-[#137fec] text-white text-sm font-bold hover:bg-[#137fec]/90 focus:outline-none focus:ring-2 focus:ring-[#137fec]"
                  aria-label={`Call ${clinic.name}`}
                >
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">call</span>
                  Call
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator if more than 3 clinics */}
        {topClinics.length > 3 && (
          <div className="flex items-center justify-center gap-1 py-2 bg-gray-50/50 dark:bg-slate-700/30 text-gray-400 dark:text-gray-500 text-xs border-t border-gray-100 dark:border-slate-700">
            <span className="material-symbols-outlined text-[14px]" aria-hidden="true">expand_more</span>
            Scroll for {topClinics.length - 3} more
          </div>
        )}

        {/* View on Map CTA */}
        <Link
          href={`/locations/${city.state.toLowerCase()}/${city.slug}`}
          className="flex items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-slate-700/50 text-[#137fec] text-sm font-bold hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#137fec] border-t border-gray-100 dark:border-slate-700"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">map</span>
          View on map
        </Link>
      </div>
    )
  }

  const selectedCity = cities?.find(c => c.slug === selectedArea)

  return (
    <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#101922]">
      {/* Skip to content link */}
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
        <a href="/triage" className="underline ml-2 focus:outline-none focus:ring-2 focus:ring-white">
          Go to your nearest emergency vet immediately
        </a>
      </div>

      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 flex items-center bg-[#f6f7f8]/80 dark:bg-[#101922]/80 backdrop-blur-md p-4 border-b border-gray-200 dark:border-gray-800 justify-between" aria-label="Main navigation">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#137fec] text-3xl" aria-hidden="true">medical_services</span>
          <h2 className="text-[#0d141b] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
            FindEmergencyVet.com
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/triage"
            className="flex items-center justify-center rounded-lg h-10 w-10 bg-[#137fec]/10 text-[#137fec] focus:outline-none focus:ring-2 focus:ring-[#137fec]"
            aria-label="Emergency triage checker"
          >
            <span className="material-symbols-outlined text-xl" aria-hidden="true">emergency</span>
          </Link>
        </div>
      </nav>

      <main id="main-content" className="max-w-6xl mx-auto">
        {/* Hero - Compact */}
        <div className="bg-gradient-to-r from-[#137fec] to-[#0d5bbd] px-4 py-6 md:py-8">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white" role="status">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              {clinicCount} CLINICS • LIVE
            </div>
            <h1 className="text-white text-2xl md:text-3xl font-black leading-tight tracking-tight">
              24/7 Emergency Vets
            </h1>
            <p className="text-white/80 text-sm">
              Westchester &amp; Rochester, NY
            </p>
            {isLocating && (
              <p className="text-white/60 text-xs flex items-center gap-2 mt-1">
                <span className="material-symbols-outlined text-sm animate-spin" aria-hidden="true">progress_activity</span>
                Detecting location...
              </p>
            )}
          </div>
        </div>

        {/* MOBILE: Tabs Interface */}
        <div className="md:hidden">
          {/* Tab Buttons */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 sticky top-[73px] z-40">
            {cities?.map((city) => (
              <button
                key={city.id}
                onClick={() => setSelectedArea(city.slug)}
                className={`flex-1 py-3 px-4 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#137fec] ${
                  selectedArea === city.slug
                    ? 'text-[#137fec] border-b-2 border-[#137fec] bg-white dark:bg-slate-800'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                {city.name}
                <span className="ml-1.5 text-xs font-normal">({city.clinic_count})</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {selectedCity && renderClinicList(selectedCity)}
          </div>
        </div>

        {/* DESKTOP: Side-by-Side */}
        <div className="hidden md:block p-6">
          <div className="grid grid-cols-2 gap-6">
            {cities?.map((city) => (
              <div key={city.id}>
                {renderClinicList(city)}
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Triage Banner */}
        <div className="p-4 md:px-6">
          <div className="flex flex-col items-start justify-between gap-4 rounded-xl border-2 border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 p-5 sm:flex-row sm:items-center">
            <div className="flex gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400" aria-hidden="true">
                <span className="material-symbols-outlined text-2xl font-bold">priority_high</span>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-red-800 dark:text-red-300 text-base font-bold leading-tight">Is This An Emergency?</p>
                <p className="text-red-700/80 dark:text-red-400/80 text-sm font-normal leading-tight">
                  Check for difficulty breathing, seizures, or toxin ingestion.
                </p>
              </div>
            </div>
            <Link
              href="/triage"
              className="flex w-full sm:w-auto min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-red-600 text-white text-sm font-bold shadow-md shadow-red-200 dark:shadow-none hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-800"
            >
              Quick Triage
            </Link>
          </div>
        </div>

        {/* Why Us Section */}
        <WhyUsSection />

        {/* FAQ Section */}
        <FAQSection />

        {/* Help Banner */}
        <div className="p-4 md:px-6 mb-10">
          <div className="bg-[#137fec] rounded-xl p-6 text-white flex flex-col items-center text-center gap-4">
            <span className="material-symbols-outlined text-4xl" aria-hidden="true">pets</span>
            <h3 className="text-xl font-bold">Every Second Counts</h3>
            <p className="text-white/80 text-sm">
              We maintain accurate emergency veterinary clinic information to help you and your pet when it matters most.
            </p>
            <Link
              href="/register"
              className="bg-white text-[#137fec] font-bold px-6 py-2 rounded-full text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
            >
              Register Your Clinic
            </Link>
          </div>
        </div>
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-gray-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-50" aria-label="Bottom navigation">
        <Link href="/" className="flex flex-col items-center gap-1 text-[#137fec] min-w-[48px] min-h-[48px] justify-center focus:outline-none focus:ring-2 focus:ring-[#137fec] rounded">
          <span className="material-symbols-outlined" aria-hidden="true">home</span>
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        <Link href="/triage" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#137fec] min-w-[48px] min-h-[48px] justify-center focus:outline-none focus:ring-2 focus:ring-[#137fec] rounded">
          <span className="material-symbols-outlined" aria-hidden="true">medical_information</span>
          <span className="text-[10px] font-bold">Triage</span>
        </Link>
        <Link href="/costs" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#137fec] min-w-[48px] min-h-[48px] justify-center focus:outline-none focus:ring-2 focus:ring-[#137fec] rounded">
          <span className="material-symbols-outlined" aria-hidden="true">payments</span>
          <span className="text-[10px] font-bold">Costs</span>
        </Link>
        <Link href="/locations" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#137fec] min-w-[48px] min-h-[48px] justify-center focus:outline-none focus:ring-2 focus:ring-[#137fec] rounded">
          <span className="material-symbols-outlined" aria-hidden="true">map</span>
          <span className="text-[10px] font-bold">Locations</span>
        </Link>
      </nav>

      <div className="h-20 md:h-0"></div>
    </div>
  )
}
