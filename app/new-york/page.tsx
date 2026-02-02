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

      <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#101922]">
        {/* Emergency Banner */}
        <div className="bg-red-600 text-white py-2 px-4 text-center text-sm font-bold">
          <span className="material-symbols-outlined text-sm align-middle mr-1" aria-hidden="true">emergency</span>
          CRITICAL EMERGENCY?
          <a href="#when-to-seek" className="underline ml-2">Check symptoms below</a>
        </div>

        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-[#f6f7f8]/80 dark:bg-[#101922]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center p-4 justify-between max-w-4xl mx-auto">
            <Link href="/" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#137fec] text-2xl" aria-hidden="true">medical_services</span>
              <span className="text-[#0d141b] dark:text-white font-bold">findemergencyvet.com</span>
            </Link>
            <Link href="/triage" className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold">
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">emergency</span>
              Triage
            </Link>
          </div>
        </nav>

        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto px-4 pt-4">
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500 dark:text-gray-400">
            <ol className="flex items-center gap-1">
              <li><Link href="/" className="hover:text-[#137fec]">Home</Link></li>
              <li><span className="mx-1">&rsaquo;</span></li>
              <li className="font-semibold text-[#0d141b] dark:text-white">New York</li>
            </ol>
          </nav>
        </div>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* H1 */}
          <h1 className="text-[#0d141b] dark:text-white text-3xl md:text-4xl font-black mb-6">
            findemergencyvet.com &ndash; Fast Emergency Veterinary Care Near You
          </h1>

          {/* Intro Paragraphs */}
          <div className="space-y-4 mb-8 text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            <p>
              When your pet faces a medical emergency in New York, every minute counts. Whether you&apos;re in Manhattan at 2 AM or in Buffalo on a holiday weekend, knowing where to find 24-hour emergency veterinary care can save your pet&apos;s life. New York State has dozens of emergency animal hospitals staffed with veterinarians trained in critical care, trauma, and emergency surgery.
            </p>
            <p>
              This guide covers emergency vet locations across all regions of New York, from the five boroughs and Long Island to Westchester, the Hudson Valley, Capital Region, Central New York, and Western New York. Many of these facilities offer 24/7 care year-round, while others provide extended evening and weekend hours. We&apos;ve compiled hours and contact information to help you find care quickly when your pet needs it most.
            </p>
          </div>

          {/* Emergency CTA Box */}
          <div className="mb-10 bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-100 dark:border-red-900/30">
            <p className="text-gray-800 dark:text-gray-200 text-lg">
              <strong>In a pet emergency right now?</strong> Select your region below to find the nearest 24-hour vet, or call the <strong>ASPCA Poison Control Center</strong> at{' '}
              <a href="tel:8884264435" className="text-red-600 dark:text-red-400 font-bold hover:underline">(888) 426-4435</a> if you suspect poisoning.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center border border-gray-100 dark:border-slate-700">
              <div className="text-3xl font-black text-[#137fec]">{totalClinics}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Emergency Clinics</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center border border-gray-100 dark:border-slate-700">
              <div className="text-3xl font-black text-[#137fec]">{activeCities.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Regions Covered</div>
            </div>
          </div>

          {/* Search Bar */}
          <RegionSearch regions={regions} />

          {/* H2: 24/7 Emergency Vets by Region */}
          <section className="mb-10">
            <h2 className="text-[#0d141b] dark:text-white text-2xl font-bold mb-4">
              24/7 Emergency Vets by Region
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Click your region to find emergency animal hospitals near you with addresses, phone numbers, and hours.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {regions.map(region => (
                <Link
                  key={region.slug}
                  href={`/new-york/${region.slug}`}
                  className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-100 dark:border-slate-700 hover:border-[#137fec] transition-colors group block"
                >
                  <h3 className="text-[#0d141b] dark:text-white font-bold text-lg mb-2 group-hover:text-[#137fec] transition-colors">
                    {region.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {region.description}
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-xs mb-3">
                    <strong>Key Facilities:</strong> {region.facilities}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[#137fec] font-bold text-sm group-hover:gap-2 transition-all">
                    Find {region.name.split(' /')[0]} Emergency Vets
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* H2: When to Seek Emergency Vet Care */}
          <section id="when-to-seek" className="mb-10 bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-700">
            <h2 className="text-[#0d141b] dark:text-white text-2xl font-bold mb-4">
              When to Seek Emergency Vet Care
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Not every health concern requires an emergency visit, but certain symptoms demand immediate veterinary attention. If your pet shows any of these signs, don&apos;t wait &mdash; head to the nearest emergency vet:
            </p>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 mt-0.5 shrink-0">emergency</span>
                <span><strong>Difficulty breathing</strong> &ndash; labored breathing, blue gums, or gasping</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 mt-0.5 shrink-0">emergency</span>
                <span><strong>Collapse or inability to stand</strong> &ndash; sudden weakness or loss of consciousness</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 mt-0.5 shrink-0">emergency</span>
                <span><strong>Seizures</strong> &ndash; especially if lasting more than 2-3 minutes or occurring in clusters</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 mt-0.5 shrink-0">emergency</span>
                <span><strong>Bloated or distended abdomen</strong> &ndash; particularly in large breed dogs (potential GDV/bloat)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 mt-0.5 shrink-0">emergency</span>
                <span><strong>Severe bleeding</strong> &ndash; that doesn&apos;t stop with direct pressure</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 mt-0.5 shrink-0">emergency</span>
                <span><strong>Suspected poisoning</strong> &ndash; ingestion of chocolate, xylitol, antifreeze, medications, or toxic plants</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 mt-0.5 shrink-0">emergency</span>
                <span><strong>Inability to urinate</strong> &ndash; especially in male cats (life-threatening urinary blockage)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 mt-0.5 shrink-0">emergency</span>
                <span><strong>Trauma</strong> &ndash; hit by car, fall from height, or animal attack</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 mt-0.5 shrink-0">emergency</span>
                <span><strong>Severe vomiting or diarrhea</strong> &ndash; with blood, or lasting more than 24 hours</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 mt-0.5 shrink-0">emergency</span>
                <span><strong>Eye injuries</strong> &ndash; visible damage, sudden blindness, or severe swelling</span>
              </li>
            </ul>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-4 italic">
              When in doubt, call an emergency vet. Most 24-hour facilities have staff who can help you assess whether your pet needs immediate care or can wait until your regular vet opens.
            </p>
          </section>

          {/* H2: What to Expect at an Emergency Vet */}
          <section className="mb-10">
            <h2 className="text-[#0d141b] dark:text-white text-2xl font-bold mb-4">
              What to Expect at an Emergency Vet
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Emergency vet visits differ from regular vet appointments. Here&apos;s what to expect:
            </p>
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-100 dark:border-slate-700">
                <h3 className="text-[#0d141b] dark:text-white font-bold mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#137fec]">assignment_ind</span>
                  Triage
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  When you arrive, a technician will quickly assess your pet&apos;s condition to determine urgency. Pets with life-threatening conditions are seen first, regardless of arrival time. This means you may wait if your pet&apos;s condition is stable.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-100 dark:border-slate-700">
                <h3 className="text-[#0d141b] dark:text-white font-bold mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#137fec]">biotech</span>
                  Examination and Diagnostics
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  The emergency veterinarian will examine your pet and may recommend diagnostic tests such as bloodwork, X-rays, ultrasound, or urinalysis to determine the problem.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-100 dark:border-slate-700">
                <h3 className="text-[#0d141b] dark:text-white font-bold mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#137fec]">medical_services</span>
                  Treatment Options
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  The vet will explain findings and present treatment options with estimated costs. You&apos;ll be asked to approve a treatment plan before major procedures begin.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-100 dark:border-slate-700">
                <h3 className="text-[#0d141b] dark:text-white font-bold mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#137fec]">forum</span>
                  Communication
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Emergency staff will update you throughout your pet&apos;s treatment. If your pet needs to stay overnight, expect calls with progress reports.
                </p>
              </div>
            </div>
          </section>

          {/* H2: Emergency Vet Costs in New York */}
          <section className="mb-10 bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-700">
            <h2 className="text-[#0d141b] dark:text-white text-2xl font-bold mb-4">
              Emergency Vet Costs in New York
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Emergency veterinary care is more expensive than routine vet visits due to specialized staff, equipment, and around-the-clock availability. Here are typical cost ranges in New York:
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-700">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Emergency exam fee</span>
                <span className="text-[#0d141b] dark:text-white font-bold">$150 &ndash; $300</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-700">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Diagnostics (bloodwork, X-rays)</span>
                <span className="text-[#0d141b] dark:text-white font-bold">$200 &ndash; $600</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-700">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Minor treatment (wound care, medication)</span>
                <span className="text-[#0d141b] dark:text-white font-bold">$300 &ndash; $800</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-700">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Moderate treatment (IV fluids, observation)</span>
                <span className="text-[#0d141b] dark:text-white font-bold">$800 &ndash; $2,000</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Surgery or hospitalization</span>
                <span className="text-[#0d141b] dark:text-white font-bold">$2,000 &ndash; $5,000+</span>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-4">
              NYC, Westchester, and Long Island facilities tend toward the higher end of these ranges. Upstate locations like Rochester, Buffalo, and Syracuse may be somewhat lower but still reflect the specialized nature of emergency care.
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              <strong>Payment Options:</strong> Most emergency vets accept credit cards, CareCredit, and Scratchpay. Some offer payment plans. Pet insurance can significantly reduce out-of-pocket costs if you have a policy in place before the emergency occurs. <Link href="/costs" className="text-[#137fec] hover:underline">See our full cost guide</Link>.
            </p>
          </section>

          {/* H2: Poison Control Resources */}
          <section className="mb-10 bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-100 dark:border-red-900/30">
            <h2 className="text-[#0d141b] dark:text-white text-2xl font-bold mb-4">
              Poison Control Resources
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you suspect your pet has ingested something toxic, call a poison control hotline immediately while heading to the emergency vet:
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 mt-0.5 shrink-0">call</span>
                <div>
                  <strong className="text-[#0d141b] dark:text-white">ASPCA Animal Poison Control Center:</strong>{' '}
                  <a href="tel:8884264435" className="text-red-600 dark:text-red-400 font-bold hover:underline">(888) 426-4435</a>
                  <span className="text-gray-500 dark:text-gray-400 text-sm"> &ndash; Available 24/7. Consultation fee applies ($95).</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 mt-0.5 shrink-0">call</span>
                <div>
                  <strong className="text-[#0d141b] dark:text-white">Pet Poison Helpline:</strong>{' '}
                  <a href="tel:8557647661" className="text-red-600 dark:text-red-400 font-bold hover:underline">(855) 764-7661</a>
                  <span className="text-gray-500 dark:text-gray-400 text-sm"> &ndash; Available 24/7. Consultation fee applies ($85).</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-4">
              These services can provide immediate guidance on whether the substance is toxic, expected symptoms, and recommended treatment &mdash; information the emergency vet will need.
            </p>
          </section>

          {/* H2: Frequently Asked Questions */}
          <section className="mb-10">
            <h2 className="text-[#0d141b] dark:text-white text-2xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-4 cursor-pointer list-none hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <h3 className="font-semibold text-[#0d141b] dark:text-white pr-4">
                      {faq.question}
                    </h3>
                    <span className="material-symbols-outlined text-gray-400 group-open:rotate-180 transition-transform shrink-0" aria-hidden="true">
                      expand_more
                    </span>
                  </summary>
                  <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-slate-700 pt-3">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Closing CTA */}
          <section className="mb-10 bg-[#137fec] rounded-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">
              Find an Emergency Vet Near You
            </h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Select your region above to find 24-hour emergency veterinarians with addresses, phone numbers, and directions. Save this page and your nearest emergency vet&apos;s number in your phone &mdash; you&apos;ll be glad you did if an emergency ever happens.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {regions.slice(0, 4).map(region => (
                <Link
                  key={region.slug}
                  href={`/new-york/${region.slug}`}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-bold text-sm transition-colors"
                >
                  {region.name.split(' /')[0]}
                </Link>
              ))}
            </div>
          </section>

          {/* Back Links */}
          <div className="pt-8 border-t border-gray-200 dark:border-slate-700 flex justify-between items-center">
            <Link href="/" className="text-[#137fec] hover:underline font-semibold">
              &larr; Back to home
            </Link>
            <Link href="/locations" className="text-[#137fec] hover:underline font-semibold">
              All locations &rarr;
            </Link>
          </div>

          {/* Footer */}
          <footer className="mt-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              Emergency Vet Finder is an independent directory. Availability may change. Always call to confirm.
            </p>
          </footer>
        </main>

        {/* Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-gray-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center" aria-label="Bottom navigation">
          <Link href="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#137fec] min-w-[48px] min-h-[48px] justify-center">
            <span className="material-symbols-outlined" aria-hidden="true">home</span>
            <span className="text-[10px] font-bold">Home</span>
          </Link>
          <Link href="/triage" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#137fec] min-w-[48px] min-h-[48px] justify-center">
            <span className="material-symbols-outlined" aria-hidden="true">medical_information</span>
            <span className="text-[10px] font-bold">Triage</span>
          </Link>
          <Link href="/costs" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#137fec] min-w-[48px] min-h-[48px] justify-center">
            <span className="material-symbols-outlined" aria-hidden="true">payments</span>
            <span className="text-[10px] font-bold">Costs</span>
          </Link>
          <Link href="/locations" className="flex flex-col items-center gap-1 text-[#137fec] min-w-[48px] min-h-[48px] justify-center">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}} aria-hidden="true">map</span>
            <span className="text-[10px] font-bold">Locations</span>
          </Link>
        </nav>

        <div className="h-20 md:h-0"></div>
      </div>
    </>
  )
}
