'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { WhyUsSection, FAQSection } from '@/components/SharedSections'

export default function HomePage({ clinicCount, cities }: { clinicCount: number, cities: any[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLocating, setIsLocating] = useState(false)

  const handleGeolocation = () => {
    setIsLocating(true)
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          // Redirect to search with coordinates
          window.location.href = `/search?lat=${latitude}&lng=${longitude}`
        },
        (error) => {
          alert('Unable to get your location. Please enter your city or zip code.')
          setIsLocating(false)
        }
      )
    } else {
      alert('Geolocation is not supported by your browser.')
      setIsLocating(false)
    }
  }

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
        <a href="tel:911" className="underline ml-2 focus:outline-none focus:ring-2 focus:ring-white">
          Call 911 or go to nearest vet immediately
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
        {/* Hero Section */}
        <div className="p-4">
          <div 
            className="flex min-h-[420px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-center justify-center p-6 shadow-sm relative overflow-hidden"
            role="banner"
          >
            <Image
              src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=1200&auto=format&fit=crop&q=80"
              alt="Veterinarian providing emergency care to a pet"
              fill
              priority
              className="object-cover -z-10"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#137fec]/70 to-[#101922]/85 -z-10" />
            
            <div className="flex flex-col gap-3 text-center z-10">
              {/* Live Data Badge */}
              <div className="inline-flex items-center justify-center gap-1.5 self-center rounded-full bg-green-500/20 px-3 py-1 text-xs font-bold text-green-400 border border-green-500/30" role="status">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                LIVE DATA ACTIVE
              </div>

              {/* Keyword-Optimized Headline */}
              <h1 className="text-white text-3xl font-black leading-tight tracking-tight sm:text-5xl">
                Find 24/7 Emergency Vets Near You
              </h1>

              <p className="text-white/90 text-sm font-medium sm:text-base max-w-md mx-auto">
                Open now, exotic pet specialists, real-time availability. Your pet's urgent care starts here.
              </p>
            </div>

            {/* Search Bar - Primary Action */}
            <div className="w-full max-w-[480px] space-y-3 z-10">
              <form action="/search" method="GET" role="search">
                <label htmlFor="location-search" className="sr-only">Enter your city or zip code</label>
                <div className="flex w-full flex-1 items-stretch rounded-lg h-16 shadow-lg overflow-hidden">
                  <div className="text-gray-400 flex bg-white dark:bg-slate-900 items-center justify-center pl-4 border-r-0" aria-hidden="true">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <input
                    id="location-search"
                    name="q"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex w-full min-w-0 flex-1 border-0 bg-white dark:bg-slate-900 text-[#0d141b] dark:text-white focus:ring-2 focus:ring-[#137fec] h-full placeholder:text-gray-400 px-3 text-base font-medium"
                    placeholder="Enter city or zip code..."
                    type="text"
                    autoComplete="off"
                    aria-label="Location search"
                  />
                  <div className="flex items-center justify-center bg-white dark:bg-slate-900 pr-2">
                    <button 
                      type="submit"
                      className="flex min-w-[80px] cursor-pointer items-center justify-center rounded-lg h-12 px-4 bg-[#137fec] text-white text-sm font-bold tracking-tight hover:bg-[#137fec]/90 focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      Find
                    </button>
                  </div>
                </div>
              </form>

              {/* Geolocation Button - Now Functional */}
              <button 
                type="button"
                onClick={handleGeolocation}
                disabled={isLocating}
                className="flex w-full items-center justify-center gap-2 text-white/80 text-xs font-semibold uppercase tracking-wider hover:text-white focus:outline-none focus:ring-2 focus:ring-white rounded py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Use my current location"
              >
                <span className="material-symbols-outlined text-sm" aria-hidden="true">
                  {isLocating ? 'progress_activity' : 'my_location'}
                </span>
                {isLocating ? 'Getting location...' : 'Use My Current Location'}
              </button>

              {/* Emergency Bypass Button */}
              <Link
                href="/locations/ny/westchester"
                className="flex w-full items-center justify-center gap-2 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              >
                <span className="material-symbols-outlined" aria-hidden="true">crisis_alert</span>
                Show All Emergency Vets Near Me
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap gap-4 px-4 py-2">
          <div className="flex flex-1 items-center gap-3 rounded-xl p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm min-w-[200px]">
            <div className="flex size-10 items-center justify-center rounded-full bg-[#137fec]/10 text-[#137fec]" aria-hidden="true">
              <span className="material-symbols-outlined">local_hospital</span>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Clinics Listed</p>
              <p className="text-[#0d141b] dark:text-white text-xl font-black">{clinicCount}</p>
            </div>
          </div>

          <div className="flex flex-1 items-center gap-3 rounded-xl p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm min-w-[200px]">
            <div className="flex size-10 items-center justify-center rounded-full bg-[#137fec]/10 text-[#137fec]" aria-hidden="true">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Data Quality</p>
              <p className="text-[#0d141b] dark:text-white text-xl font-black">Verified</p>
            </div>
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
        <div className="flex items-center justify-between px-4 pt-4">
          <h2 className="text-[#0d141b] dark:text-white text-xl font-bold leading-tight tracking-tight">
            Popular Service Areas
          </h2>
          <Link 
            href="/locations" 
            className="text-[#137fec] text-sm font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-[#137fec] rounded px-2 py-1"
          >
            See All
          </Link>
        </div>

        {/* Featured Locations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
          {cities?.map((city) => (
            <Link
              key={city.id}
              href={`/locations/${city.state.toLowerCase()}/${city.slug}`}
              className="group relative flex flex-col gap-2 rounded-xl bg-white dark:bg-slate-800 p-3 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-[#137fec]"
            >
              <div className="relative h-24 w-full rounded-lg mb-1 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&auto=format&fit=crop&q=60"
                  alt={`Emergency veterinary services in ${city.name}, ${city.state}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[#0d141b] dark:text-white font-bold text-sm">
                  {city.name}, {city.state}
                </span>
                <span className="text-green-600 dark:text-green-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" aria-hidden="true"></span>
                  {city.clinic_count} Vets Listed
                </span>
              </div>
            </Link>
          ))}
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
