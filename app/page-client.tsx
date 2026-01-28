'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { WhyUsSection, FAQSection } from '@/components/SharedSections'

export default function HomePage({ clinicCount, cities, cityClinics }: { clinicCount: number, cities: any[], cityClinics: Record<string, any[]> }) {
  const [detectedArea, setDetectedArea] = useState<string | null>(null)
  const [isLocating, setIsLocating] = useState(false)

  // Auto-detect location on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      setIsLocating(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          // Westchester area: roughly 40.85-41.35 lat, -73.4 to -74.0 lng
          // Rochester area: roughly 42.8-43.3 lat, -77.3 to -78.0 lng
          if (latitude >= 40.85 && latitude <= 41.4 && longitude >= -74.1 && longitude <= -73.3) {
            setDetectedArea('westchester')
          } else if (latitude >= 42.7 && latitude <= 43.4 && longitude >= -78.1 && longitude <= -76.9) {
            setDetectedArea('rochester')
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

  return (
    <div className="min-h-screen">
      {/* Skip to content link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#137fec] focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Emergency Hotline Banner */}
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
            <span className="material-symbols-outlined text-xl" aria-hidden="true">call</span>
          </Link>
          <button 
            className="flex items-center justify-center rounded-lg h-10 w-10 bg-transparent text-[#0d141b] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#137fec]"
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined text-2xl" aria-hidden="true">menu</span>
          </button>
        </div>
      </nav>

      <main id="main-content">
        {/* Compact Hero */}
        <div className="bg-gradient-to-b from-[#137fec] to-[#0d5bbd] px-4 py-8 text-center">
          <div className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white mb-4" role="status">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            {clinicCount} CLINICS • LIVE DATA
          </div>
          <h1 className="text-white text-2xl font-black leading-tight tracking-tight sm:text-4xl mb-2">
            24/7 Emergency Vets
          </h1>
          <p className="text-white/80 text-sm mb-4">
            Select your area to find open clinics now
          </p>
          {isLocating && (
            <p className="text-white/60 text-xs flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm animate-spin" aria-hidden="true">progress_activity</span>
              Detecting your location...
            </p>
          )}
          {detectedArea && (
            <p className="text-green-300 text-xs font-semibold">
              ✓ We detected you're near {detectedArea === 'westchester' ? 'Westchester' : 'Rochester'}
            </p>
          )}
        </div>

        {/* Service Area Selection - THE MAIN FOCUS */}
        <div className="px-4 py-4 -mt-4">
          <div className="grid grid-cols-2 gap-3">
            {cities?.map((city) => (
              <a
                key={city.id}
                href={`#${city.slug}`}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  detectedArea === city.slug
                    ? 'bg-[#137fec] border-[#137fec] text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-[#0d141b] dark:text-white hover:border-[#137fec]'
                }`}
              >
                <span className="material-symbols-outlined text-2xl mb-1" aria-hidden="true">location_on</span>
                <span className="font-bold text-sm">{city.name}</span>
                <span className={`text-xs ${detectedArea === city.slug ? 'text-white/80' : 'text-gray-500'}`}>
                  {city.state} • {city.clinic_count} vets
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Emergency Triage Banner */}
        <div className="p-4">
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

        {/* Section Header */}
        <div className="px-4 pt-4">
          <h2 className="text-[#0d141b] dark:text-white text-xl font-bold leading-tight tracking-tight">
            Emergency Vets Open Now
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Tap to call directly or view all clinics
          </p>
        </div>

        {/* Featured Locations with Top Clinics */}
        <div className="flex flex-col gap-4 p-4">
          {cities?.map((city) => {
            const topClinics = cityClinics[city.slug] || []
            return (
              <div
                key={city.id}
                id={city.slug}
                className="rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden scroll-mt-20"
              >
                {/* City Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-700">
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
                    View All
                    <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span>
                  </Link>
                </div>

                {/* Top Clinics */}
                <div className="divide-y divide-gray-100 dark:divide-slate-700">
                  {topClinics.map((clinic: any) => (
                    <div key={clinic.id} className="flex items-center justify-between px-4 py-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[#0d141b] dark:text-white font-semibold text-sm truncate">{clinic.name}</span>
                          {clinic.is_24_7 && (
                            <span className="inline-flex items-center gap-1 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0">24/7</span>
                          )}
                          {clinic.has_exotic_specialist && (
                            <span className="inline-flex items-center bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0">EXOTICS</span>
                          )}
                        </div>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">{clinic.phone}</span>
                      </div>
                      <a
                        href={`tel:${clinic.phone}`}
                        className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg bg-[#137fec] text-white text-sm font-bold hover:bg-[#137fec]/90 focus:outline-none focus:ring-2 focus:ring-[#137fec] shrink-0 ml-3"
                        aria-label={`Call ${clinic.name}`}
                      >
                        <span className="material-symbols-outlined text-[18px]" aria-hidden="true">call</span>
                        Call
                      </a>
                    </div>
                  ))}
                </div>

                {/* View All CTA */}
                <Link
                  href={`/locations/${city.state.toLowerCase()}/${city.slug}`}
                  className="flex items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-slate-700/50 text-[#137fec] text-sm font-bold hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#137fec]"
                >
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">map</span>
                  See all {city.clinic_count} clinics with map &amp; filters
                </Link>
              </div>
            )
          })}
        </div>

        {/* FAQ Section */}
        <FAQSection />

        {/* Help Banner */}
        <div className="p-4 mb-10">
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

      {/* Bottom Navigation - Consistent */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-gray-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center" aria-label="Bottom navigation">
        <Link href="/" className="flex flex-col items-center gap-1 text-[#137fec] min-w-[48px] min-h-[48px] justify-center focus:outline-none focus:ring-2 focus:ring-[#137fec] rounded">
          <span className="material-symbols-outlined" aria-hidden="true">search</span>
          <span className="text-[10px] font-bold">Search</span>
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

      <div className="h-20"></div>
    </div>
  )
}
