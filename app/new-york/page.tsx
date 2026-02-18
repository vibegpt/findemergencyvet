import { supabase } from '@/lib/supabase'
import { Metadata } from 'next'
import Link from 'next/link'
import RegionSearch from './RegionSearch'

export const metadata: Metadata = {
  title: 'Emergency Vet New York | 24 Hour Animal Hospitals NY [2026]',
  description: 'Find 24 hour emergency vets across New York State. Locations in NYC, Westchester, Rochester, Buffalo, Albany, Syracuse & Long Island. Open now.',
  openGraph: {
    title: 'Emergency Vet New York | 24 Hour Animal Hospitals NY',
    description: 'Find 24 hour emergency vets across New York State. Locations in NYC, Westchester, Rochester, Buffalo, Albany, Syracuse & Long Island. Open now.',
    type: 'website',
  },
}

// Static region data matching the content document
const regions = [
  {
    name: 'New York City',
    slug: 'nyc',
    description: '24-hour emergency vets across all five boroughs including Manhattan, Brooklyn, Queens, and Staten Island.',
    facilities: 'Animal Medical Center, BluePearl (4 locations), VERG Brooklyn',
  },
  {
    name: 'Westchester County',
    slug: 'westchester',
    description: 'Emergency vet care in White Plains, Yonkers, Bedford Hills, and Brewster serving Westchester and Putnam counties.',
    facilities: 'VEG White Plains, Animal Specialty Center, VCA Katonah Bedford',
  },
  {
    name: 'Long Island',
    slug: 'long-island',
    description: '24-hour animal hospitals throughout Nassau and Suffolk counties from Westbury to the East End.',
    facilities: 'VMCLI, Atlantic Coast Vet Specialists, VEG Carle Place, VEG Commack',
  },
  {
    name: 'Rochester',
    slug: 'rochester',
    description: 'Emergency and urgent care vets serving Rochester, Monroe County, and the Finger Lakes region.',
    facilities: 'Rochester Emergency Veterinary Services (24/7), ARK Veterinary Hospital',
  },
  {
    name: 'Buffalo',
    slug: 'buffalo',
    description: '24-hour emergency vet hospitals in Buffalo, Cheektowaga, Orchard Park, and Tonawanda.',
    facilities: 'BluePearl Buffalo, Orchard Park VMC, Green Acres Veterinary Center',
  },
  {
    name: 'Albany / Capital Region',
    slug: 'albany',
    description: 'Emergency veterinary care in Latham, Albany, Saratoga Springs, and the Capital District.',
    facilities: 'Capital District Veterinary Referral Hospital, Upstate Veterinary Specialties',
  },
  {
    name: 'Syracuse / Central NY',
    slug: 'syracuse',
    description: 'Emergency vet services in Syracuse, East Syracuse, and Auburn serving Central New York.',
    facilities: 'Veterinary Medical Center of CNY',
  },
  {
    name: 'Ithaca / Southern Tier',
    slug: 'ithaca',
    description: 'Emergency veterinary care including the renowned Cornell University Hospital for Animals.',
    facilities: 'Cornell University Hospital for Animals (24/7), VCA Colonial Animal Hospital',
  },
]

const faqs = [
  {
    question: 'How much does an emergency vet visit cost in New York?',
    answer: 'Emergency vet visits in New York typically cost $150–$300 for the initial exam fee. Total costs vary widely based on treatment needed, ranging from $300–$500 for minor issues to $2,000–$5,000+ for surgery or overnight hospitalization. NYC and Westchester tend to be at the higher end of this range.',
  },
  {
    question: 'What should I do if my pet has an emergency at night in New York?',
    answer: 'Call the nearest 24-hour emergency vet immediately. New York has emergency animal hospitals in every major region that are open overnight. Keep the number saved in your phone. If possible, call ahead while driving so the vet team can prepare for your arrival.',
  },
  {
    question: 'Are there 24-hour emergency vets in upstate New York?',
    answer: 'Yes. Major upstate cities have 24/7 emergency vet coverage including Rochester (Rochester Emergency Veterinary Services), Buffalo (BluePearl, Orchard Park VMC, Green Acres), Albany (Capital District Veterinary Referral Hospital), Syracuse (Veterinary Medical Center of CNY), and Ithaca (Cornell University Hospital for Animals).',
  },
  {
    question: 'What symptoms require an emergency vet visit?',
    answer: 'Seek emergency care immediately for: difficulty breathing, collapse or inability to stand, seizures, bloated or distended abdomen, severe bleeding, suspected poisoning, inability to urinate (especially male cats), trauma from being hit by a car, or prolonged labor in pregnant pets.',
  },
  {
    question: 'Do emergency vets require appointments?',
    answer: 'Most emergency vets accept walk-ins 24/7 without appointments. However, calling ahead is recommended when possible so the team can prepare and provide guidance while you\'re en route.',
  },
]

export default async function NewYorkHubPage() {
  const { data: cities } = await supabase
    .from('cities')
    .select('*')
    .eq('state', 'NY')
    .order('clinic_count', { ascending: false })

  const totalClinics = (cities || []).reduce((sum, c) => sum + (c.clinic_count || 0), 0)
  const activeCities = (cities || []).filter(c => c.clinic_count > 0)

  // Schema: MedicalWebPage + ItemList
  const medicalWebPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: 'Emergency Veterinarians in New York State',
    description: 'Find 24 hour emergency vets across New York State including NYC, Westchester, Rochester, Buffalo, Albany, Syracuse and Long Island.',
    url: 'https://findemergencyvet.com/new-york',
    mainEntity: {
      '@type': 'ItemList',
      name: 'Emergency Vet Locations in New York',
      numberOfItems: 8,
      itemListElement: regions.map((region, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://findemergencyvet.com/new-york/${region.slug}`,
        name: `${region.name} Emergency Vets`,
      })),
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://findemergencyvet.com' },
      { '@type': 'ListItem', position: 2, name: 'New York', item: 'https://findemergencyvet.com/new-york' },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalWebPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="min-h-screen bg-[#FAFAFA]">
        {/* Navigation */}
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

        <main className="max-w-3xl mx-auto px-5 pt-[80px] pb-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[13px] text-[#86868B] mb-6">
            <Link href="/" className="hover:text-[#1D1D1F] transition-colors">Home</Link>
            <span>&rsaquo;</span>
            <span className="text-[#1D1D1F] font-medium">New York</span>
          </div>

          {/* H1 */}
          <h1 className="text-[32px] md:text-[40px] font-bold tracking-[-0.03em] text-[#1D1D1F] mb-6">
            Emergency Veterinary Care in New York
          </h1>

          {/* Intro Paragraphs */}
          <div className="space-y-4 mb-8 text-[#6E6E73] text-lg leading-relaxed">
            <p>
              When your pet faces a medical emergency in New York, every minute counts. Whether you&apos;re in Manhattan at 2 AM or in Buffalo on a holiday weekend, knowing where to find 24-hour emergency veterinary care can save your pet&apos;s life. New York State has dozens of emergency animal hospitals staffed with veterinarians trained in critical care, trauma, and emergency surgery.
            </p>
            <p>
              This guide covers emergency vet locations across all regions of New York, from the five boroughs and Long Island to Westchester, the Hudson Valley, Capital Region, Central New York, and Western New York. Many of these facilities offer 24/7 care year-round, while others provide extended evening and weekend hours. We&apos;ve compiled hours and contact information to help you find care quickly when your pet needs it most.
            </p>
          </div>

          {/* Emergency CTA Box */}
          <div className="mb-10 bg-[#FFF3E0] rounded-2xl p-6 border border-[#FFE0B2]">
            <p className="text-[#B8730E] text-lg">
              <strong>In a pet emergency right now?</strong> Select your region below to find the nearest 24-hour vet, or call the <strong>ASPCA Poison Control Center</strong> at{' '}
              <a href="tel:8884264435" className="text-[#B8730E] font-bold hover:underline">(888) 426-4435</a> if you suspect poisoning.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-white rounded-2xl p-4 text-center border border-[#E8E8ED]">
              <div className="text-3xl font-bold text-[#1D1D1F]">{totalClinics}</div>
              <div className="text-sm text-[#6E6E73]">Emergency Clinics</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center border border-[#E8E8ED]">
              <div className="text-3xl font-bold text-[#1D1D1F]">{activeCities.length}</div>
              <div className="text-sm text-[#6E6E73]">Regions Covered</div>
            </div>
          </div>

          {/* Search Bar */}
          <RegionSearch regions={regions} />

          {/* H2: 24/7 Emergency Vets by Region */}
          <section className="mb-10">
            <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-4">
              24/7 Emergency Vets by Region
            </h2>
            <p className="text-[#6E6E73] mb-6">
              Click your region to find emergency animal hospitals near you with addresses, phone numbers, and hours.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {regions.map(region => (
                <Link
                  key={region.slug}
                  href={`/new-york/${region.slug}`}
                  className="bg-white rounded-2xl p-5 border border-[#E8E8ED] hover:border-[#0071E3] transition-colors group block"
                >
                  <h3 className="text-[#1D1D1F] font-bold text-lg mb-2 group-hover:text-[#0071E3] transition-colors">
                    {region.name}
                  </h3>
                  <p className="text-[#6E6E73] text-sm mb-3">
                    {region.description}
                  </p>
                  <p className="text-[#86868B] text-xs mb-3">
                    <strong>Key Facilities:</strong> {region.facilities}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[#0071E3] font-bold text-sm group-hover:gap-2 transition-all">
                    Find {region.name.split(' /')[0]} Emergency Vets
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* H2: When to Seek Emergency Vet Care */}
          <section id="when-to-seek" className="mb-10 bg-white rounded-2xl p-6 border border-[#E8E8ED]">
            <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-4">
              When to Seek Emergency Vet Care
            </h2>
            <p className="text-[#6E6E73] mb-4">
              Not every health concern requires an emergency visit, but certain symptoms demand immediate veterinary attention. If your pet shows any of these signs, don&apos;t wait &mdash; head to the nearest emergency vet:
            </p>
            <ul className="space-y-3 text-[#6E6E73]">
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF453A] shrink-0" />
                <span><strong>Difficulty breathing</strong> &ndash; labored breathing, blue gums, or gasping</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF453A] shrink-0" />
                <span><strong>Collapse or inability to stand</strong> &ndash; sudden weakness or loss of consciousness</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF453A] shrink-0" />
                <span><strong>Seizures</strong> &ndash; especially if lasting more than 2-3 minutes or occurring in clusters</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF453A] shrink-0" />
                <span><strong>Bloated or distended abdomen</strong> &ndash; particularly in large breed dogs (potential GDV/bloat)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF453A] shrink-0" />
                <span><strong>Severe bleeding</strong> &ndash; that doesn&apos;t stop with direct pressure</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF453A] shrink-0" />
                <span><strong>Suspected poisoning</strong> &ndash; ingestion of chocolate, xylitol, antifreeze, medications, or toxic plants</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF453A] shrink-0" />
                <span><strong>Inability to urinate</strong> &ndash; especially in male cats (life-threatening urinary blockage)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF453A] shrink-0" />
                <span><strong>Trauma</strong> &ndash; hit by car, fall from height, or animal attack</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF453A] shrink-0" />
                <span><strong>Severe vomiting or diarrhea</strong> &ndash; with blood, or lasting more than 24 hours</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF453A] shrink-0" />
                <span><strong>Eye injuries</strong> &ndash; visible damage, sudden blindness, or severe swelling</span>
              </li>
            </ul>
            <p className="text-[#86868B] text-sm mt-4 italic">
              When in doubt, call an emergency vet. Most 24-hour facilities have staff who can help you assess whether your pet needs immediate care or can wait until your regular vet opens.
            </p>
          </section>

          {/* H2: What to Expect at an Emergency Vet */}
          <section className="mb-10">
            <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-4">
              What to Expect at an Emergency Vet
            </h2>
            <p className="text-[#6E6E73] mb-4">
              Emergency vet visits differ from regular vet appointments. Here&apos;s what to expect:
            </p>
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-[#E8E8ED]">
                <h3 className="text-[#1D1D1F] font-bold mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#0071E3]"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>
                  Triage
                </h3>
                <p className="text-[#6E6E73] text-sm">
                  When you arrive, a technician will quickly assess your pet&apos;s condition to determine urgency. Pets with life-threatening conditions are seen first, regardless of arrival time. This means you may wait if your pet&apos;s condition is stable.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-[#E8E8ED]">
                <h3 className="text-[#1D1D1F] font-bold mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#0071E3]"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>
                  Examination and Diagnostics
                </h3>
                <p className="text-[#6E6E73] text-sm">
                  The emergency veterinarian will examine your pet and may recommend diagnostic tests such as bloodwork, X-rays, ultrasound, or urinalysis to determine the problem.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-[#E8E8ED]">
                <h3 className="text-[#1D1D1F] font-bold mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#0071E3]"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                  Treatment Options
                </h3>
                <p className="text-[#6E6E73] text-sm">
                  The vet will explain findings and present treatment options with estimated costs. You&apos;ll be asked to approve a treatment plan before major procedures begin.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-[#E8E8ED]">
                <h3 className="text-[#1D1D1F] font-bold mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#0071E3]"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>
                  Communication
                </h3>
                <p className="text-[#6E6E73] text-sm">
                  Emergency staff will update you throughout your pet&apos;s treatment. If your pet needs to stay overnight, expect calls with progress reports.
                </p>
              </div>
            </div>
          </section>

          {/* H2: Emergency Vet Costs in New York */}
          <section className="mb-10 bg-white rounded-2xl p-6 border border-[#E8E8ED]">
            <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-4">
              Emergency Vet Costs in New York
            </h2>
            <p className="text-[#6E6E73] mb-4">
              Emergency veterinary care is more expensive than routine vet visits due to specialized staff, equipment, and around-the-clock availability. Here are typical cost ranges in New York:
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-[#E8E8ED]">
                <span className="text-[#6E6E73] font-medium">Emergency exam fee</span>
                <span className="text-[#1D1D1F] font-bold">$150 &ndash; $300</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#E8E8ED]">
                <span className="text-[#6E6E73] font-medium">Diagnostics (bloodwork, X-rays)</span>
                <span className="text-[#1D1D1F] font-bold">$200 &ndash; $600</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#E8E8ED]">
                <span className="text-[#6E6E73] font-medium">Minor treatment (wound care, medication)</span>
                <span className="text-[#1D1D1F] font-bold">$300 &ndash; $800</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#E8E8ED]">
                <span className="text-[#6E6E73] font-medium">Moderate treatment (IV fluids, observation)</span>
                <span className="text-[#1D1D1F] font-bold">$800 &ndash; $2,000</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-[#6E6E73] font-medium">Surgery or hospitalization</span>
                <span className="text-[#1D1D1F] font-bold">$2,000 &ndash; $5,000+</span>
              </div>
            </div>
            <p className="text-[#86868B] text-sm mt-4">
              NYC, Westchester, and Long Island facilities tend toward the higher end of these ranges. Upstate locations like Rochester, Buffalo, and Syracuse may be somewhat lower but still reflect the specialized nature of emergency care.
            </p>
            <p className="text-[#86868B] text-sm mt-2">
              <strong>Payment Options:</strong> Most emergency vets accept credit cards, CareCredit, and Scratchpay. Some offer payment plans. Pet insurance can significantly reduce out-of-pocket costs if you have a policy in place before the emergency occurs. <Link href="/costs" className="text-[#0071E3] hover:underline">See our full cost guide</Link>.
            </p>
          </section>

          {/* H2: Poison Control Resources */}
          <section className="mb-10 bg-[#FFF3E0] rounded-2xl p-6 border border-[#FFE0B2]">
            <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-4">
              Poison Control Resources
            </h2>
            <p className="text-[#B8730E] mb-4">
              If you suspect your pet has ingested something toxic, call a poison control hotline immediately while heading to the emergency vet:
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#B8730E] mt-0.5 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                <div>
                  <strong className="text-[#1D1D1F]">ASPCA Animal Poison Control Center:</strong>{' '}
                  <a href="tel:8884264435" className="text-[#B8730E] font-bold hover:underline">(888) 426-4435</a>
                  <span className="text-[#86868B] text-sm"> &ndash; Available 24/7. Consultation fee applies ($95).</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#B8730E] mt-0.5 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                <div>
                  <strong className="text-[#1D1D1F]">Pet Poison Helpline:</strong>{' '}
                  <a href="tel:8557647661" className="text-[#B8730E] font-bold hover:underline">(855) 764-7661</a>
                  <span className="text-[#86868B] text-sm"> &ndash; Available 24/7. Consultation fee applies ($85).</span>
                </div>
              </div>
            </div>
            <p className="text-[#86868B] text-sm mt-4">
              These services can provide immediate guidance on whether the substance is toxic, expected symptoms, and recommended treatment &mdash; information the emergency vet will need.
            </p>
          </section>

          {/* H2: Frequently Asked Questions */}
          <section className="mb-10">
            <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-white rounded-2xl border border-[#E8E8ED] overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-4 cursor-pointer list-none hover:bg-[#F5F5F7] transition-colors">
                    <h3 className="font-semibold text-[#1D1D1F] pr-4">
                      {faq.question}
                    </h3>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-[#86868B] group-open:rotate-180 transition-transform shrink-0" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </summary>
                  <div className="px-4 pb-4 text-sm text-[#6E6E73] leading-relaxed border-t border-[#E8E8ED] pt-3">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Closing CTA */}
          <section className="mb-10 bg-[#F5F5F7] rounded-2xl p-8 text-center">
            <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-3">
              Find an Emergency Vet Near You
            </h2>
            <p className="text-[#6E6E73] mb-6 max-w-2xl mx-auto">
              Select your region above to find 24-hour emergency veterinarians with addresses, phone numbers, and directions. Save this page and your nearest emergency vet&apos;s number in your phone &mdash; you&apos;ll be glad you did if an emergency ever happens.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {regions.slice(0, 4).map(region => (
                <Link
                  key={region.slug}
                  href={`/new-york/${region.slug}`}
                  className="px-4 py-2 bg-[#E8E8ED] hover:bg-[#D1D1D6] text-[#1D1D1F] rounded-lg font-bold text-sm transition-colors"
                >
                  {region.name.split(' /')[0]}
                </Link>
              ))}
            </div>
          </section>

          {/* Back Links */}
          <div className="pt-8 border-t border-[#E8E8ED] flex justify-between items-center">
            <Link href="/" className="text-[#0071E3] hover:underline font-semibold">
              &larr; Back to home
            </Link>
            <Link href="/locations" className="text-[#0071E3] hover:underline font-semibold">
              All locations &rarr;
            </Link>
          </div>
        </main>

        {/* Footer */}
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
          <p className="text-[#86868B] text-xs mt-2">&copy; 2026 FindEmergencyVet.com</p>
        </footer>

        {/* Bottom Nav */}
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
        <div className="h-20 md:h-0" />
      </div>
    </>
  )
}
