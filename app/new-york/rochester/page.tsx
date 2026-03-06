import { supabase } from '@/lib/supabase'
import { computeClinicStatus, HoursDetail } from '@/lib/clinic-status'
import { Metadata } from 'next'
import Link from 'next/link'
import ClinicCard from '@/components/clinic/ClinicCard'

// ISR: revalidate hourly for open/closed accuracy
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Emergency Vet Rochester NY | 24/7 Animal Hospital | FindEmergencyVet',
  description:
    "Find emergency veterinary clinics in Rochester, NY. 5 clinics with verified hours, open/closed status, and tap-to-call. Includes Rochester's only 24/7 emergency vet. Updated March 2026.",
  alternates: {
    canonical: 'https://findemergencyvet.com/new-york/rochester',
  },
  openGraph: {
    title: 'Emergency Vet Rochester NY | 24/7 Animal Hospital | FindEmergencyVet',
    description:
      "Emergency vets in Rochester, NY — verified hours, open/closed status, tap-to-call. Rochester's only 24/7 hospital listed.",
    type: 'website',
  },
}

// Clinic slugs in display order (coverage level: 24/7 first, then widest hours)
const CLINIC_SLUGS = [
  'rochester-emergency-veterinary-services',
  'ark-veterinary-hospital-henrietta',
  'animal-hospital-of-pittsford',
  'animal-intermediate-care-webster',
  'ridgemont-animal-hospital-rochester',
]

const FAQS = [
  {
    q: 'Is there a 24-hour emergency vet in Rochester, NY?',
    a: 'Yes. Rochester Emergency Veterinary Services (REVS) at 445 West Commercial St in East Rochester is open 24/7. It is the only true 24-hour emergency veterinary hospital in the Greater Rochester area. REVS is a nonprofit that opened in February 2024 and went to full around-the-clock coverage in May 2025. Call (585) 775-0020.',
  },
  {
    q: 'What are the closest 24/7 emergency vets near Rochester?',
    a: 'The only 24/7 emergency vet in the Rochester area is REVS in East Rochester at (585) 775-0020. If REVS is at capacity, the nearest alternatives are Orchard Park Veterinary Medical Center near Buffalo (79 miles, 716-662-6660), Veterinary Medical Center of Central New York in East Syracuse (92 miles, 315-446-7933), and Cornell University Hospital for Animals in Ithaca (97 miles, 607-253-3060).',
  },
  {
    q: 'How much does an emergency vet visit cost in Rochester?',
    a: 'Emergency exam fees in the Rochester area typically range from $145 to $500 for the initial assessment. Animal Intermediate Care charges a $145 exam fee. Total costs depend on the treatment required, including diagnostics, medications, surgery, and hospitalization. Most clinics accept major credit cards, and some offer CareCredit or Scratchpay financing.',
  },
  {
    q: 'Which emergency vets in Rochester accept walk-in patients?',
    a: "Animal Intermediate Care in Webster accepts walk-ins on a first-come, first-served basis (Sun–Thu, 11am–6:30pm). REVS accepts emergency walk-ins 24/7. ARK Veterinary Hospital asks that you call (585) 487-8700 first so they can triage your pet's situation. Pittsford Animal Hospital requires a triage form submitted the day before for weekend urgent care. Emergency clinics triage by severity, not arrival order — life-threatening cases are seen first.",
  },
  {
    q: 'Which emergency vets in Rochester treat exotic animals?',
    a: "ARK Veterinary Hospital & Urgent Care in Henrietta is one of the few emergency/urgent care options in the Rochester area that treats exotic pets, including birds, reptiles, ferrets, guinea pigs, hamsters, rats, and other pocket pets. Call (585) 487-8700 first to confirm the on-duty veterinarian has experience with your specific species — exotic vet availability varies by shift.",
  },
  {
    q: 'Why did Rochester lose its 24/7 emergency vet?',
    a: "Veterinary Specialists and Emergency Services (VSES) in Brighton, previously the area's only 24/7 facility, cut hours in August 2023 and eventually closed permanently. The parent company, Thrive Pet Healthcare, cited staff shortages and difficulty recruiting doctors and support staff — part of a national veterinary staffing crisis. REVS opened as a nonprofit in February 2024 to fill the gap and achieved full 24/7 coverage by May 2025.",
  },
]

export default async function RochesterPage() {
  const { data: rawClinics } = await supabase
    .from('clinics')
    .select(
      'id, slug, name, address, city, state, zip_code, phone, is_24_7, hours_detail, hours_description, availability_type, timezone, has_exotic_specialist, google_rating, google_review_count, accepts_walk_ins, requires_call_ahead, exotic_pets_accepted, parking_type, wheelchair_accessible, has_separate_cat_entrance, has_isolation_rooms, verification_status',
    )
    .in('slug', CLINIC_SLUGS)
    .eq('is_active', true)

  // Sort to match CLINIC_SLUGS display order
  const clinics = (rawClinics || [])
    .sort((a, b) => CLINIC_SLUGS.indexOf(a.slug) - CLINIC_SLUGS.indexOf(b.slug))
    .map(clinic => ({
      ...clinic,
      computedStatus: computeClinicStatus(
        clinic.is_24_7,
        clinic.hours_detail as HoursDetail | null,
        clinic.availability_type,
        clinic.hours_description,
        clinic.state,
        clinic.timezone,
      ),
    }))

  const { data: nearbyCities } = await supabase
    .from('cities')
    .select('id, name, state, slug, clinic_count')
    .eq('state', 'NY')
    .neq('slug', 'rochester')
    .gte('clinic_count', 1)
    .order('clinic_count', { ascending: false })
    .limit(6)

  // Schema: BreadcrumbList
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://findemergencyvet.com' },
      { '@type': 'ListItem', position: 2, name: 'New York', item: 'https://findemergencyvet.com/new-york' },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Rochester, NY',
        item: 'https://findemergencyvet.com/new-york/rochester',
      },
    ],
  }

  // Schema: CollectionPage + ItemList of VeterinaryCare
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Emergency Vets in Rochester, NY',
    url: 'https://findemergencyvet.com/new-york/rochester',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: clinics.map((clinic, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'VeterinaryCare',
          name: clinic.name,
          telephone: `+1${clinic.phone.replace(/\D/g, '')}`,
          address: {
            '@type': 'PostalAddress',
            streetAddress: clinic.address,
            addressLocality: clinic.city,
            addressRegion: 'NY',
            postalCode: clinic.zip_code || undefined,
          },
          areaServed: 'Rochester, New York',
          ...(clinic.google_rating && {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: clinic.google_rating,
              reviewCount: clinic.google_review_count || 1,
            },
          }),
          ...(clinic.is_24_7 && {
            openingHoursSpecification: [
              'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
            ].map(day => ({
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: `https://schema.org/${day}`,
              opens: '00:00',
              closes: '23:59',
            })),
          }),
        },
      })),
    },
  }

  // Schema: FAQPage
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="min-h-screen bg-[#FAFAFA]">
        {/* Navigation */}
        <nav
          className="fixed top-0 left-0 right-0 h-[60px] z-50 border-b border-[#E8E8ED]"
          style={{
            background: 'rgba(250,250,250,0.8)',
            backdropFilter: 'saturate(180%) blur(20px)',
            WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          }}
        >
          <div className="max-w-3xl mx-auto h-full flex items-center justify-between px-5">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="w-8 h-8 bg-[#0071E3] rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="white"
                  width="18"
                  height="18"
                >
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

        <main className="max-w-3xl mx-auto px-5 pt-[80px] pb-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[13px] text-[#86868B] mb-6">
            <Link href="/" className="hover:text-[#1D1D1F] transition-colors">
              Home
            </Link>
            <span>&rsaquo;</span>
            <Link href="/new-york" className="hover:text-[#1D1D1F] transition-colors">
              New York
            </Link>
            <span>&rsaquo;</span>
            <span className="text-[#1D1D1F] font-medium">Rochester</span>
          </div>

          {/* H1 */}
          <h1 className="text-[32px] md:text-[40px] font-bold tracking-[-0.03em] text-[#1D1D1F] mb-3">
            Emergency Vets in Rochester, NY
          </h1>

          {/* Hero subhead */}
          <p className="text-[#6E6E73] text-lg mb-3 leading-relaxed">
            {clinics.length} emergency veterinary clinics serving Rochester and surrounding areas. Hours confirmed March
            2026.
          </p>

          {/* 24/7 available badge */}
          <div className="mb-8">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: '#E8F5E8', color: '#1B7A1B' }}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: '#30D158' }}
                />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#30D158' }} />
              </span>
              24/7 Coverage Available
            </span>
          </div>

          {/* Clinic listings */}
          <section className="mb-10">
            <div className="space-y-4">
              {clinics.map(clinic => (
                <ClinicCard key={clinic.id} clinic={clinic} />
              ))}
            </div>
          </section>

          {/* SEO Paragraphs */}
          <section className="mb-10 space-y-4">
            <p className="text-[#6E6E73] leading-relaxed">
              Rochester and the surrounding Monroe County area are served by {clinics.length} emergency and urgent care
              veterinary clinics. Rochester Emergency Veterinary Services (REVS) in East Rochester is the only facility
              that maintains a veterinarian on-site around the clock, 24 hours a day, 7 days a week. If your pet is
              experiencing a medical emergency, calling ahead is always the first recommended step — it allows the clinic
              to prepare for your arrival and can reduce critical wait time.
            </p>
            <p className="text-[#6E6E73] leading-relaxed">
              The Rochester emergency vet landscape changed dramatically in 2023 when Veterinary Specialists and
              Emergency Services (VSES) in Brighton closed permanently, leaving the area without any 24/7 coverage. REVS
              opened in February 2024 as a nonprofit to fill that gap, and expanded to full 24/7 operations in May 2025
              from a new 12,000 sq ft facility in East Rochester. For daytime and evening urgent care, ARK Veterinary
              Hospital in Henrietta offers the widest hours at 7 days a week, and is one of the few local options for
              exotic pet emergencies.
            </p>
            <p className="text-[#6E6E73] leading-relaxed">
              If REVS is at capacity or your pet requires specialty care not available locally, the nearest 24/7
              emergency hospitals are{' '}
              <strong className="text-[#1D1D1F]">Orchard Park Veterinary Medical Center</strong> (716-662-6660)
              approximately 79 miles west near Buffalo, and{' '}
              <strong className="text-[#1D1D1F]">Veterinary Medical Center of Central New York</strong> (315-446-7933)
              approximately 92 miles east in East Syracuse. Cornell University Hospital for Animals in Ithaca
              (607-253-3060) is about 97 miles southeast. For suspected poisoning, contact{' '}
              <strong className="text-[#1D1D1F]">ASPCA Poison Control</strong> immediately at{' '}
              <a href="tel:+18884264435" className="text-[#0071E3] font-semibold hover:underline">
                (888) 426-4435
              </a>
              .
            </p>
          </section>

          {/* FAQ Section */}
          <section className="mb-10">
            <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-6">
              Rochester Emergency Vet — Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-[#E8E8ED]">
                  <h3 className="font-bold text-[#1D1D1F] mb-2 text-base">{faq.q}</h3>
                  <p className="text-[#6E6E73] text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Common Reasons */}
          <section id="emergency-reasons" className="mb-10 bg-white rounded-2xl p-6 border border-[#E8E8ED]">
            <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-4">
              Common Reasons to Visit an Emergency Vet in Rochester
            </h2>
            <ul className="space-y-3 text-[#6E6E73]">
              {[
                'Accidents, falls, or trauma (hit by car, attacked by another animal)',
                'Breathing difficulties or choking',
                'Sudden collapse, seizures, or loss of consciousness',
                'Poison or toxin ingestion (chocolate, xylitol, rat poison, plants)',
                'Severe pain, whimpering, or sudden behavioral change',
                'Bloated or distended abdomen (possible GDV/bloat)',
                'Inability to urinate, especially in male cats',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF453A] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* After-Hours & Urgent Care */}
          <section className="mb-10">
            <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-4">
              After-Hours &amp; Urgent Care in Rochester
            </h2>
            <p className="text-[#6E6E73] leading-relaxed mb-4">
              Not every situation requires a 24/7 emergency hospital. Some conditions — like minor limping, mild
              vomiting, or small wounds — may be handled by an urgent care clinic at lower cost. ARK Veterinary Hospital
              in Henrietta and Animal Intermediate Care in Webster both offer daytime and evening urgent care without a
              specialist referral.
            </p>
            <p className="text-[#6E6E73] leading-relaxed">
              If you&apos;re unsure whether your pet needs emergency or urgent care, call the nearest facility. Most will
              help you triage over the phone.
            </p>
          </section>

          {/* How to Get There */}
          <section className="mb-10 bg-white rounded-2xl p-6 border border-[#E8E8ED]">
            <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-4">
              How to Get to an Emergency Vet in Rochester
            </h2>
            <ul className="space-y-3 text-[#6E6E73]">
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-[#0071E3] mt-0.5 shrink-0"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                <span>
                  Use the <strong>Directions</strong> button on any listing above to open Google Maps navigation directly
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-[#0071E3] mt-0.5 shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
                <span>
                  <strong>Call ahead</strong> while en route — REVS at{' '}
                  <a href="tel:+15857750020" className="text-[#0071E3] font-semibold">
                    (585) 775-0020
                  </a>{' '}
                  is 24/7 and can prepare for your pet&apos;s arrival
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-[#0071E3] mt-0.5 shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                <span>Have someone else drive if possible so you can comfort and monitor your pet</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-[#0071E3] mt-0.5 shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                  />
                </svg>
                <span>
                  For suspected poisoning, call{' '}
                  <a href="tel:+18884264435" className="text-[#0071E3] font-semibold">
                    ASPCA Poison Control: (888) 426-4435
                  </a>{' '}
                  immediately
                </span>
              </li>
            </ul>
          </section>

          {/* What to Bring */}
          <section className="mb-10">
            <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-4">
              What to Bring to the Emergency Vet
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-[#E8E8ED]">
                <h3 className="font-bold text-[#1D1D1F] mb-2 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-[#0071E3]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                    />
                  </svg>
                  Medical Records
                </h3>
                <p className="text-[#6E6E73] text-sm">
                  Vaccination history, current medications, and your regular vet&apos;s contact info
                </p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-[#E8E8ED]">
                <h3 className="font-bold text-[#1D1D1F] mb-2 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-[#0071E3]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                    />
                  </svg>
                  Payment Method
                </h3>
                <p className="text-[#6E6E73] text-sm">
                  Credit card, CareCredit, or pet insurance info — most require payment at time of service
                </p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-[#E8E8ED]">
                <h3 className="font-bold text-[#1D1D1F] mb-2 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-[#0071E3]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                    />
                  </svg>
                  Toxin Sample
                </h3>
                <p className="text-[#6E6E73] text-sm">
                  If poisoning is suspected, bring the packaging, label, or a sample of what was ingested
                </p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-[#E8E8ED]">
                <h3 className="font-bold text-[#1D1D1F] mb-2 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-[#0071E3]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                    />
                  </svg>
                  Carrier or Leash
                </h3>
                <p className="text-[#6E6E73] text-sm">
                  Keep your pet safely contained — a carrier for cats and small animals, a leash for dogs
                </p>
              </div>
            </div>
          </section>

          {/* Nearby Cities */}
          <section className="mb-10">
            <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-4">
              Nearby Emergency Vet Options
            </h2>
            <p className="text-[#6E6E73] mb-4">Other New York cities with emergency veterinary clinics:</p>
            {nearbyCities && nearbyCities.length > 0 ? (
              <div className="space-y-2">
                {nearbyCities
                  .filter(c => c.clinic_count > 0)
                  .map(nearbyCity => (
                    <Link
                      key={nearbyCity.id}
                      href={`/new-york/${nearbyCity.slug}`}
                      className="flex items-center justify-between bg-white rounded-xl p-3 border border-[#E8E8ED] hover:border-[#0071E3] transition-colors"
                    >
                      <span className="text-[#0071E3] font-semibold">
                        Emergency Vets in {nearbyCity.name}, NY
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#1B7A1B] text-sm font-bold">{nearbyCity.clinic_count}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4 text-[#86868B]"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                <Link
                  href="/new-york"
                  className="flex items-center gap-2 mt-2 text-[#0071E3] font-bold hover:underline"
                >
                  View all emergency vets in New York
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            ) : (
              <Link href="/new-york" className="text-[#0071E3] hover:underline font-semibold">
                View all emergency vets in New York &rarr;
              </Link>
            )}
          </section>

          {/* When to Call */}
          <section className="mb-10 bg-[#F5F5F7] rounded-2xl p-6">
            <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-4">When to Call Before You Go</h2>
            <p className="text-[#6E6E73] leading-relaxed">
              Calling ahead helps confirm availability and allows staff to prepare for your pet&apos;s arrival. This is
              especially important during peak hours (evenings, weekends, holidays) or if your pet requires specialized
              care such as exotic animal treatment or advanced surgery. In true life-threatening emergencies, go directly
              to the nearest facility — they will triage upon arrival.
            </p>
          </section>

          {/* Back Links */}
          <div className="pt-8 border-t border-[#E8E8ED] flex justify-between items-center">
            <Link href="/new-york" className="text-[#0071E3] hover:underline font-semibold">
              &larr; All New York emergency vets
            </Link>
            <Link href="/locations" className="text-[#0071E3] hover:underline font-semibold">
              All locations &rarr;
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-5 py-8 border-t border-[#E8E8ED] text-center">
          <p className="text-[#86868B] text-xs leading-relaxed max-w-lg mx-auto">
            FindEmergencyVet.com is an independent directory. Availability and hours may change without notice. Always
            call the clinic to confirm emergency services before traveling. Last verified March 2026.
          </p>
          <div className="flex justify-center gap-4 mt-3 text-[#86868B] text-xs">
            <Link href="/about" className="hover:text-[#1D1D1F] transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-[#1D1D1F] transition-colors">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-[#1D1D1F] transition-colors">
              Privacy
            </Link>
          </div>
          <p className="text-[#86868B] text-xs mt-2">&copy; 2026 FindEmergencyVet.com</p>
        </footer>

        {/* Bottom Nav */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[#E8E8ED] px-5 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]"
          style={{
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
          aria-label="Bottom navigation"
        >
          <div className="flex justify-around items-center max-w-md mx-auto">
            <Link
              href="/"
              className="flex flex-col items-center gap-0.5 text-[#86868B] hover:text-[#1D1D1F] min-w-[48px] min-h-[48px] justify-center transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                width="24"
                height="24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              <span className="text-[10px] font-medium">Home</span>
            </Link>
            <Link
              href="/guides"
              className="flex flex-col items-center gap-0.5 text-[#86868B] hover:text-[#1D1D1F] min-w-[48px] min-h-[48px] justify-center transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                width="24"
                height="24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
              <span className="text-[10px] font-medium">Guides</span>
            </Link>
            <Link
              href="/locations"
              className="flex flex-col items-center gap-0.5 text-[#86868B] hover:text-[#1D1D1F] min-w-[48px] min-h-[48px] justify-center transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                width="24"
                height="24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              <span className="text-[10px] font-medium">Locations</span>
            </Link>
          </div>
        </nav>
        <div className="h-20 md:h-0" />
      </div>
    </>
  )
}
