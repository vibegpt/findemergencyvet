import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { stateNameBySlug, stateAbbrBySlug } from '@/lib/state-data'
import StateFooterLinks from '@/components/StateFooterLinks'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>
}): Promise<Metadata> {
  const { state } = await params
  const stateName = stateNameBySlug[state]

  if (!stateName) return { title: 'Emergency Vet Finder' }

  return {
    title: `Emergency Vets in ${stateName} — Open Now | FindEmergencyVet.com`,
    description: `Find open 24/7 emergency vets and animal hospitals across ${stateName}. Call now for immediate care, directions, and after-hours availability.`,
    alternates: {
      canonical: `https://findemergencyvet.com/${state}`,
    },
    openGraph: {
      title: `Emergency Vets in ${stateName} — Open Now`,
      description: `Find open emergency veterinary hospitals across ${stateName}. Call directly, no delays.`,
      type: 'website',
    },
  }
}

function getFaqs(stateName: string, totalClinics: number, cityCount: number) {
  return [
    {
      question: `Is there a 24-hour emergency vet in ${stateName}?`,
      answer: `Yes. ${stateName} has ${totalClinics} emergency veterinary ${totalClinics === 1 ? 'clinic' : 'clinics'} across ${cityCount} ${cityCount === 1 ? 'city' : 'cities'}. Many of these are true 24/7 facilities with on-site staff around the clock. Use the city listings above to find the nearest open emergency vet in ${stateName}.`,
    },
    {
      question: `How much does an emergency vet visit cost in ${stateName}?`,
      answer: `Emergency vet visits in ${stateName} typically cost $150–$300 for the initial exam fee. Total costs vary based on treatment: diagnostics (bloodwork, X-rays) run $200–$600, minor treatments $300–$800, and surgery or hospitalization can range from $2,000–$5,000+. Most clinics accept credit cards, CareCredit, and Scratchpay.`,
    },
    {
      question: `What should I do if my pet has an emergency at night in ${stateName}?`,
      answer: `Call the nearest 24-hour emergency vet in ${stateName} immediately. Keep the number saved in your phone. If possible, call ahead while driving so the vet team can prepare for your arrival. For suspected poisoning, also call the ASPCA Poison Control Center at (888) 426-4435.`,
    },
    {
      question: 'What symptoms require an emergency vet visit?',
      answer: 'Seek emergency care immediately for: difficulty breathing, collapse or inability to stand, seizures, bloated or distended abdomen, severe bleeding, suspected poisoning, inability to urinate (especially male cats), trauma from being hit by a car, or prolonged labor in pregnant pets.',
    },
    {
      question: 'Do emergency vets accept walk-ins?',
      answer: 'Most emergency vets accept walk-ins 24/7 without appointments. However, calling ahead is recommended when possible so the team can prepare and provide guidance while you\'re en route. Patients are seen based on triage priority, not arrival order.',
    },
  ]
}

export default async function StateHubPage({
  params,
}: {
  params: Promise<{ state: string }>
}) {
  const { state } = await params
  const stateName = stateNameBySlug[state]
  const stateAbbr = stateAbbrBySlug[state]

  if (!stateName || !stateAbbr) notFound()

  const { data: cities } = await supabase
    .from('cities')
    .select('*')
    .eq('state', stateAbbr)
    .order('clinic_count', { ascending: false })

  // Guard: state page requires at least one city with 2+ clinics to be worth indexing.
  // A state with only 0- or 1-clinic cities has no meaningful directory content.
  if (!cities || !cities.some(c => c.clinic_count >= 2)) notFound()

  // Fetch featured clinics for direct linking from state hub
  const { data: featuredClinics } = await supabase
    .from('clinics')
    .select('slug, name, city, is_24_7, phone')
    .eq('state', stateAbbr)
    .eq('is_active', true)
    .eq('is_24_7', true)
    .order('google_rating', { ascending: false, nullsFirst: false })
    .limit(5)

  const totalClinics = cities.reduce((sum, c) => sum + (c.clinic_count || 0), 0)
  const activeCities = cities.filter(c => c.clinic_count > 0)
  const comingSoonCities = cities.filter(c => c.clinic_count === 0)

  const faqs = getFaqs(stateName, totalClinics, activeCities.length)

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://findemergencyvet.com' },
      { '@type': 'ListItem', position: 2, name: stateName, item: `https://findemergencyvet.com/${state}` },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-[#FAFAFA]">
        {/* ── Navigation ── */}
        <nav className="fixed top-0 left-0 right-0 h-[60px] z-50 border-b border-[#E8E8ED]" style={{ background: 'rgba(250,250,250,0.8)', backdropFilter: 'saturate(180%) blur(20px)', WebkitBackdropFilter: 'saturate(180%) blur(20px)' }}>
          <div className="max-w-3xl mx-auto h-full flex items-center justify-between px-5">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="w-8 h-8 bg-[#0071E3] rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" width="18" height="18">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </span>
              <span className="text-base font-semibold tracking-tight text-[#1D1D1F]">FindEmergencyVet</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/guides" className="text-sm text-[#6E6E73] hover:text-[#1D1D1F] transition-colors hidden sm:block">
                Resources
              </Link>
              <Link href="/locations" className="text-sm text-[#6E6E73] hover:text-[#1D1D1F] transition-colors hidden sm:block">
                All Locations
              </Link>
            </div>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto pt-[60px]">
          {/* ── Hero ── */}
          <header className="px-5 pt-12 pb-8">
            <div className="flex items-center gap-1.5 text-[13px] text-[#86868B] mb-6">
              <Link href="/" className="hover:text-[#1D1D1F] transition-colors">Home</Link>
              <span>&rsaquo;</span>
              <span className="text-[#1D1D1F] font-medium">{stateName}</span>
            </div>

            <h1 className="text-[32px] md:text-[40px] font-bold tracking-[-0.03em] text-[#1D1D1F] leading-tight mb-4">
              Emergency Vets in {stateName}
            </h1>

            <p className="text-[#6E6E73] text-base md:text-lg leading-relaxed max-w-xl">
              {totalClinics} emergency veterinary {totalClinics === 1 ? 'clinic' : 'clinics'} across {activeCities.length} {activeCities.length === 1 ? 'city' : 'cities'} in {stateName}.
              Call ahead to confirm availability.
            </p>

            {/* Stats */}
            <div className="flex gap-4 mt-8">
              <div className="flex-1 bg-white border border-[#E8E8ED] rounded-2xl p-5 text-center">
                <div className="text-3xl font-semibold text-[#1D1D1F]">{totalClinics}</div>
                <div className="text-sm text-[#86868B] mt-1">Emergency Clinics</div>
              </div>
              <div className="flex-1 bg-white border border-[#E8E8ED] rounded-2xl p-5 text-center">
                <div className="text-3xl font-semibold text-[#1D1D1F]">{activeCities.length}</div>
                <div className="text-sm text-[#86868B] mt-1">Cities Covered</div>
              </div>
            </div>
          </header>

          {/* ── Intro Paragraph ── */}
          <section className="px-5 pb-8">
            <p className="text-[#6E6E73] leading-relaxed">
              When your pet faces a medical emergency in {stateName}, every minute counts. Whether it&apos;s the middle of the night, a weekend, or a holiday, knowing where to find 24-hour emergency veterinary care can save your pet&apos;s life. {stateName} has {totalClinics} emergency animal {totalClinics === 1 ? 'hospital' : 'hospitals'} across {activeCities.length} {activeCities.length === 1 ? 'city' : 'cities'}, many offering true 24/7 care with veterinarians on-site around the clock. Below you&apos;ll find every emergency vet location in {stateName} with direct phone numbers and directions.
            </p>
          </section>

          {/* ── City Listings ── */}
          <section className="px-5 py-8 border-t border-[#E8E8ED]">
            <h2 className="text-[#1D1D1F] text-[24px] font-bold tracking-[-0.02em] mb-6">
              Emergency Vet Locations in {stateName}
            </h2>
            <div className="space-y-3">
              {activeCities.map(city => (
                <Link
                  key={city.id}
                  href={`/${state}/${city.slug}`}
                  className="flex items-center justify-between bg-white border border-[#E8E8ED] rounded-xl p-4 hover:bg-[#F5F5F7] transition-colors group"
                >
                  <div>
                    <span className="text-[#1D1D1F] font-semibold">
                      {city.name}, {stateAbbr}
                    </span>
                    <span className="text-[#1B7A1B] ml-2 text-sm font-semibold">
                      {city.clinic_count} {city.clinic_count === 1 ? 'clinic' : 'clinics'}
                    </span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18" className="text-[#86868B] group-hover:text-[#1D1D1F] transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              ))}
            </div>

            {/* Coming Soon */}
            {comingSoonCities.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[#E8E8ED]">
                <p className="text-[#86868B] text-sm mb-3">Coming soon</p>
                <div className="flex flex-wrap gap-2">
                  {comingSoonCities.map(city => (
                    <span
                      key={city.id}
                      className="text-sm px-3 py-1.5 bg-white border border-[#E8E8ED] text-[#86868B] rounded-full"
                    >
                      {city.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* ── Featured 24/7 Clinics ── */}
          {featuredClinics && featuredClinics.length > 0 && (
            <section className="px-5 py-8 border-t border-[#E8E8ED]">
              <h2 className="text-[#1D1D1F] text-[24px] font-bold tracking-[-0.02em] mb-6">
                24/7 Emergency Vets in {stateName}
              </h2>
              <div className="space-y-3">
                {featuredClinics.map(fc => (
                  <Link
                    key={fc.slug}
                    href={`/clinics/${fc.slug}`}
                    className="flex items-center justify-between bg-white border border-[#E8E8ED] rounded-xl p-4 hover:bg-[#F5F5F7] transition-colors group"
                  >
                    <div>
                      <span className="text-[#1D1D1F] font-semibold text-sm">{fc.name}</span>
                      <span className="text-[#86868B] text-sm ml-2">{fc.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E8F5E8] text-[#1B7A1B]">24/7</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18" className="text-[#86868B] group-hover:text-[#1D1D1F] transition-colors">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── Emergency Vet Costs ── */}
          <section className="px-5 py-8 border-t border-[#E8E8ED]">
            <h2 className="text-[#1D1D1F] text-[24px] font-bold tracking-[-0.02em] mb-4">
              Emergency Vet Costs in {stateName}
            </h2>
            <p className="text-[#6E6E73] text-sm mb-4">
              Emergency veterinary care costs more than routine visits due to specialized staff, equipment, and around-the-clock availability. Here are typical cost ranges:
            </p>
            <div className="bg-white border border-[#E8E8ED] rounded-xl overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3 border-b border-[#E8E8ED]">
                <span className="text-[#6E6E73] text-sm">Emergency exam fee</span>
                <span className="text-[#1D1D1F] font-semibold text-sm">$150 &ndash; $300</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 border-b border-[#E8E8ED]">
                <span className="text-[#6E6E73] text-sm">Diagnostics (bloodwork, X-rays)</span>
                <span className="text-[#1D1D1F] font-semibold text-sm">$200 &ndash; $600</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 border-b border-[#E8E8ED]">
                <span className="text-[#6E6E73] text-sm">Minor treatment (wound care, meds)</span>
                <span className="text-[#1D1D1F] font-semibold text-sm">$300 &ndash; $800</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 border-b border-[#E8E8ED]">
                <span className="text-[#6E6E73] text-sm">Moderate treatment (IV fluids, observation)</span>
                <span className="text-[#1D1D1F] font-semibold text-sm">$800 &ndash; $2,000</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-[#6E6E73] text-sm">Surgery or hospitalization</span>
                <span className="text-[#1D1D1F] font-semibold text-sm">$2,000 &ndash; $5,000+</span>
              </div>
            </div>
            <p className="text-[#86868B] text-xs mt-3">
              Most emergency vets accept credit cards, CareCredit, and Scratchpay. Pet insurance can significantly reduce out-of-pocket costs.{' '}
              <Link href="/costs" className="text-[#0071E3] underline">See our full cost guide</Link>.
            </p>
          </section>

          {/* ── Emergency Signs ── */}
          <section className="px-5 py-8 border-t border-[#E8E8ED]">
            <h2 className="text-[#1D1D1F] text-[24px] font-bold tracking-[-0.02em] mb-4">
              When to Visit an Emergency Vet
            </h2>
            <ul className="space-y-2.5 text-sm text-[#6E6E73]">
              {[
                'Difficulty breathing or choking',
                'Severe bleeding or open wounds',
                'Seizures or loss of consciousness',
                'Sudden collapse or inability to stand',
                'Suspected poisoning or toxin ingestion',
                'Bloated, distended, or painful abdomen',
                'Inability to urinate, especially in male cats',
                'Trauma from a fall, car accident, or animal attack',
              ].map(item => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF453A] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* ── Poison Control Resources ── */}
          <section className="mx-5 mb-8 bg-[#FFF3E0] border border-[#FFE0B2] rounded-2xl p-5">
            <h2 className="text-[#B8730E] font-semibold mb-3">Poison Control Resources</h2>
            <p className="text-[#B8730E] text-sm mb-3">
              If you suspect your pet has ingested something toxic, call a poison control hotline immediately while heading to the emergency vet:
            </p>
            <div className="space-y-2">
              <p className="text-[#B8730E] text-sm">
                <strong>ASPCA Animal Poison Control:</strong>{' '}
                <a href="tel:8884264435" className="font-bold underline whitespace-nowrap">(888) 426-4435</a>
                <span className="text-[#B8730E] text-xs ml-1">(24/7, $95 fee)</span>
              </p>
              <p className="text-[#B8730E] text-sm">
                <strong>Pet Poison Helpline:</strong>{' '}
                <a href="tel:8557647661" className="font-bold underline whitespace-nowrap">(855) 764-7661</a>
                <span className="text-[#B8730E] text-xs ml-1">(24/7, $85 fee)</span>
              </p>
            </div>
          </section>

          {/* ── FAQ Section ── */}
          <section className="px-5 py-8 border-t border-[#E8E8ED]">
            <h2 className="text-[#1D1D1F] text-[24px] font-bold tracking-[-0.02em] mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-white border border-[#E8E8ED] rounded-2xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-4 cursor-pointer list-none hover:bg-[#F5F5F7] transition-colors select-none">
                    <h3 className="font-medium text-[#1D1D1F] pr-4 text-sm">
                      {faq.question}
                    </h3>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18" className="text-[#86868B] shrink-0 group-open:rotate-180 transition-transform">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </summary>
                  <div className="px-4 pb-4 text-sm text-[#6E6E73] leading-relaxed border-t border-[#E8E8ED] pt-3 faq-answer">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* ── Emergency Guides ── */}
          <section className="px-5 py-8 border-t border-[#E8E8ED]">
            <h2 className="text-[#1D1D1F] text-[24px] font-bold tracking-[-0.02em] mb-4">
              Emergency Pet Care Resources
            </h2>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/guides/triage"
                className="px-4 py-2 bg-white border border-[#E8E8ED] text-[#6E6E73] hover:text-[#1D1D1F] text-sm rounded-full transition-colors"
              >
                Emergency Triage Guide
              </Link>
              <Link
                href="/guides/pet-cpr"
                className="px-4 py-2 bg-white border border-[#E8E8ED] text-[#6E6E73] hover:text-[#1D1D1F] text-sm rounded-full transition-colors"
              >
                Pet CPR Guide
              </Link>
              <Link
                href="/guides/poison-ingestion"
                className="px-4 py-2 bg-white border border-[#E8E8ED] text-[#6E6E73] hover:text-[#1D1D1F] text-sm rounded-full transition-colors"
              >
                Poison Ingestion Guide
              </Link>
              <Link
                href="/guides"
                className="px-4 py-2 bg-white border border-[#E8E8ED] text-[#6E6E73] hover:text-[#1D1D1F] text-sm rounded-full transition-colors"
              >
                All Guides &rarr;
              </Link>
            </div>
          </section>

          {/* ── Browse by State ── */}
          <StateFooterLinks />

          {/* ── Footer Disclaimer ── */}
          <footer className="px-5 py-8 border-t border-[#E8E8ED] text-center">
            <p className="text-[#86868B] text-xs leading-relaxed max-w-lg mx-auto">
              FindEmergencyVet.com is an independent directory. Availability and hours may change without notice.
              Always call the clinic to confirm emergency services before traveling. Last verified February 2026.
            </p>
            <div className="flex justify-center gap-4 mt-3 text-[#86868B] text-xs">
              <Link href="/about" className="hover:text-[#1D1D1F] transition-colors">About</Link>
              <Link href="/contact" className="hover:text-[#1D1D1F] transition-colors">Contact</Link>
              <Link href="/privacy" className="hover:text-[#1D1D1F] transition-colors">Privacy</Link>
            </div>
            <p className="text-[#86868B] text-xs mt-2">
              &copy; 2026 FindEmergencyVet.com
            </p>
          </footer>
        </main>

        {/* ── Mobile Bottom Nav ── */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[#E8E8ED] px-5 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }} aria-label="Bottom navigation">
          <div className="flex justify-around items-center max-w-md mx-auto">
            <Link href="/" className="flex flex-col items-center gap-0.5 text-[#86868B] hover:text-[#1D1D1F] min-w-[48px] min-h-[48px] justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
              <span className="text-[10px] font-medium">Home</span>
            </Link>
            <Link href="/guides" className="flex flex-col items-center gap-0.5 text-[#86868B] hover:text-[#1D1D1F] min-w-[48px] min-h-[48px] justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
              <span className="text-[10px] font-medium">Guides</span>
            </Link>
            <Link href="/locations" className="flex flex-col items-center gap-0.5 text-[#86868B] hover:text-[#1D1D1F] min-w-[48px] min-h-[48px] justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
              <span className="text-[10px] font-medium">Locations</span>
            </Link>
          </div>
        </nav>

        {/* Bottom nav spacer */}
        <div className="h-20 md:h-0" />
      </div>
    </>
  )
}
