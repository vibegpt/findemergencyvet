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
  is_24_7: boolean
  current_status: string | null
  verification_status?: string | null
  has_exotic_specialist: boolean
  google_rating: number | null
  google_review_count: number | null
  exotic_pets_accepted?: string[] | null
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

type FilterKey = 'all' | '24_7' | 'walk_ins' | 'exotic'

const filters: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: '24_7', label: 'Open 24/7' },
  { key: 'walk_ins', label: 'Walk-ins OK' },
  { key: 'exotic', label: 'Exotic Pets' },
]

/* ── FAQ data ── */

function getFaqs(cityName: string, stateName: string, count24_7: number) {
  const has24_7 = count24_7 > 0
  return [
    {
      question: `Is there a 24-hour emergency vet in ${cityName}?`,
      answer: has24_7
        ? `Yes. ${cityName}, ${stateName} has ${count24_7} true 24/7 emergency veterinary ${count24_7 === 1 ? 'hospital' : 'hospitals'} with on-site staff around the clock. These facilities are listed first on this page with a green "Open 24/7" badge.`
        : `${cityName}, ${stateName} does not currently have a true 24/7 emergency vet. The area is served by after-hours emergency clinics with specific evening, overnight, and weekend schedules. Always call ahead to confirm availability.`,
    },
    {
      question: `How much does an emergency vet visit cost in ${cityName}?`,
      answer: `Emergency vet exam fees in ${cityName} typically range from $125–$500 for the initial consultation, depending on the facility and time of visit. Total costs including diagnostics and treatment can range from $200–$5,000+. Most clinics accept credit cards and CareCredit. Ask about payment options before treatment begins.`,
    },
    {
      question: 'How do I know if my pet needs emergency care?',
      answer: 'Seek immediate veterinary care if your pet shows: difficulty breathing, severe bleeding, collapse or inability to stand, seizures lasting more than 2 minutes, suspected poisoning, bloated or distended abdomen, inability to urinate, or trauma from a fall or vehicle accident.',
    },
    {
      question: 'Do emergency vets accept walk-ins?',
      answer: 'Most emergency veterinary clinics accept walk-ins for true emergencies, but calling ahead helps them prepare for your arrival and may reduce wait times. In life-threatening situations, go directly to the nearest facility.',
    },
    {
      question: `What should I bring to an emergency vet in ${cityName}?`,
      answer: "Bring your pet's medical records or medication list if available, a form of payment (credit card, CareCredit), any substance your pet may have ingested, and a carrier or leash. If your pet is injured, use a blanket or towel for safe transport.",
    },
  ]
}

export default function StateCityPage({
  city,
  allClinics,
  nearbyCities = [],
  stateSlug,
  stateName,
  stateAbbr,
}: {
  city: City
  allClinics: Clinic[]
  nearbyCities?: City[]
  stateSlug: string
  stateName: string
  stateAbbr: string
}) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')

  const filteredClinics = allClinics.filter(clinic => {
    if (activeFilter === '24_7') return clinic.is_24_7
    if (activeFilter === 'walk_ins') return clinic.accepts_walk_ins
    if (activeFilter === 'exotic') return clinic.has_exotic_specialist
    return true
  })

  const count24_7 = allClinics.filter(c => c.is_24_7).length
  const faqs = getFaqs(city.name, stateName, count24_7)

  // FAQPage JSON-LD
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#1d1d1f]">
      {/* FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Skip link */}
      <a href="#clinics" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#1d1d1f] focus:text-white focus:rounded-lg">
        Skip to clinic listings
      </a>

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
            <Link href={`/states/${stateSlug}`} className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">{stateName}</Link>
            <span>/</span>
            <span className="text-[#1d1d1f] dark:text-white font-medium">{city.name}, {stateAbbr}</span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-[#1d1d1f] dark:text-white leading-tight mb-4">
            Emergency Vets in {city.name}, {stateName}
          </h1>

          <p className="text-[#6e6e73] text-base md:text-lg leading-relaxed max-w-xl">
            {count24_7 > 0
              ? `${count24_7} true 24/7 ${count24_7 === 1 ? 'facility' : 'facilities'} with on-site staff. ${allClinics.length} total emergency options.`
              : `${allClinics.length} emergency veterinary ${allClinics.length === 1 ? 'clinic' : 'clinics'} serving ${city.name}. Call ahead to confirm availability.`
            }
          </p>

          {/* Trust indicators */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-sm text-[#86868b]">
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
              Verified hours
            </span>
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              True 24/7 vs after-hours
            </span>
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              Direct phone numbers
            </span>
          </div>
        </header>

        {/* ── Filter Chips ── */}
        <div className="sticky top-[52px] z-40 bg-white/80 dark:bg-[#1d1d1f]/80 backdrop-blur-xl backdrop-saturate-[180%] border-b border-black/[0.08] dark:border-white/[0.08]">
          <div className="flex gap-2 px-6 py-3 overflow-x-auto hide-scrollbar" role="group" aria-label="Filter clinics">
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === f.key
                    ? 'bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f]'
                    : 'bg-[#f5f5f7] dark:bg-[#2d2d2f] text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
                aria-pressed={activeFilter === f.key}
              >
                {f.label}
                {f.key === '24_7' && ` (${count24_7})`}
              </button>
            ))}
          </div>
        </div>

        {/* ── Clinic Listings ── */}
        <section id="clinics" className="px-6 py-8">
          <p className="text-sm text-[#86868b] mb-6">
            Showing {filteredClinics.length} of {allClinics.length} {allClinics.length === 1 ? 'clinic' : 'clinics'}
          </p>

          <div className="space-y-4">
            {filteredClinics.map(clinic => (
              <ClinicCard key={clinic.id} clinic={clinic} />
            ))}
          </div>

          {/* No clinics at all */}
          {allClinics.length === 0 && (
            <div className="border-2 border-dashed border-[#d2d2d7] dark:border-[#2d2d2f] rounded-2xl p-10 text-center">
              <h3 className="text-xl font-semibold text-[#1d1d1f] dark:text-white mb-2">Coming Soon</h3>
              <p className="text-[#6e6e73] text-sm mb-6 max-w-md mx-auto">
                We&apos;re adding emergency veterinary clinics in {city.name}, {stateName}.
                In the meantime, try searching Google Maps.
              </p>
              <a
                href={`https://www.google.com/maps/search/emergency+vet+${encodeURIComponent(city.name + ' ' + stateName)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f5f5f7] dark:bg-[#2d2d2f] text-[#1d1d1f] dark:text-white font-medium rounded-xl hover:bg-[#d2d2d7] dark:hover:bg-[#3d3d3f] transition-colors"
              >
                Search Google Maps
              </a>
            </div>
          )}

          {/* Filter empty state */}
          {allClinics.length > 0 && filteredClinics.length === 0 && (
            <div className="bg-[#f5f5f7] dark:bg-[#2d2d2f] rounded-2xl p-10 text-center">
              <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-white mb-2">No clinics match this filter</h3>
              <p className="text-[#6e6e73] text-sm mb-4">Try a different filter to see more results.</p>
              <button
                onClick={() => setActiveFilter('all')}
                className="px-5 py-2.5 bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] font-medium rounded-xl hover:opacity-90 transition-opacity"
              >
                Show All Clinics
              </button>
            </div>
          )}
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

        {/* ── FAQ Section (with schema) ── */}
        <section className="px-6 py-8 bg-[#f5f5f7] dark:bg-[#0d0d0d] border-t border-[#d2d2d7]/50 dark:border-[#2d2d2f]">
          <h2 className="text-[#1d1d1f] dark:text-white text-xl font-semibold mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3 max-w-2xl mx-auto">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-white dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#2d2d2f] rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between p-4 cursor-pointer list-none hover:bg-[#f5f5f7] dark:hover:bg-[#2d2d2f] transition-colors select-none">
                  <h3 className="font-medium text-[#1d1d1f] dark:text-white pr-4 text-sm">
                    {faq.question}
                  </h3>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18" className="text-[#86868b] shrink-0 group-open:rotate-180 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 text-sm text-[#6e6e73] dark:text-[#86868b] leading-relaxed border-t border-[#d2d2d7]/50 dark:border-[#2d2d2f] pt-3">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ── Nearby Cities ── */}
        <section className="px-6 py-8 border-t border-[#d2d2d7]/50 dark:border-[#2d2d2f]">
          <h3 className="text-[#1d1d1f] dark:text-white text-lg font-semibold mb-4">
            Nearby Emergency Vet Locations
          </h3>
          {nearbyCities.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {nearbyCities.filter(c => c.clinic_count > 0).map(nearbyCity => (
                <Link
                  key={nearbyCity.id}
                  href={`/states/${stateSlug}/${nearbyCity.slug}`}
                  className="px-4 py-2 bg-[#f5f5f7] dark:bg-[#2d2d2f] text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white text-sm rounded-full transition-colors"
                >
                  {nearbyCity.name}, {stateAbbr}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-[#86868b] text-sm mb-4">More locations coming soon.</p>
          )}
          <Link
            href={`/states/${stateSlug}`}
            className="text-sm text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white transition-colors underline"
          >
            View all emergency vets in {stateName} &rarr;
          </Link>
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
  )
}
