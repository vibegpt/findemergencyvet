import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { stateNameByAbbr, stateSlugByAbbr } from '@/lib/state-data'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ clinic: string }>
}): Promise<Metadata> {
  const { clinic: clinicSlug } = await params

  const { data: clinic } = await supabase
    .from('clinics')
    .select('name, city, state')
    .eq('slug', clinicSlug)
    .single()

  if (!clinic) {
    return { title: 'Emergency Vet Finder' }
  }

  const stateName = stateNameByAbbr[clinic.state] || clinic.state

  return {
    title: `${clinic.name} | Emergency Vet in ${clinic.city}, ${stateName}`,
    description: `Call ${clinic.name} for emergency veterinary care in ${clinic.city}, ${stateName}. See hours, walk-in policy, exotic pet support, and amenities.`,
  }
}

export default async function ClinicDetailPage({
  params,
}: {
  params: Promise<{ clinic: string }>
}) {
  const { clinic: clinicSlug } = await params

  const { data: clinic } = await supabase
    .from('clinics')
    .select(`
      id, slug, name, address, city, state, zip_code, phone, website,
      is_24_7, availability_type, current_status, hours_detail, after_hours_entrance,
      exotic_pets_accepted, has_exotic_specialist, exotic_pets_notes,
      services_offered, has_surgery_suite, has_icu, has_specialists, specialists_available,
      payment_methods, accepts_pet_insurance, accepts_care_credit, accepts_scratchpay, payment_plans_available,
      accepts_walk_ins, requires_call_ahead, special_notes,
      parking_type, parking_notes, wheelchair_accessible, has_separate_cat_entrance, has_isolation_rooms
    `)
    .eq('slug', clinicSlug)
    .single()

  if (!clinic) notFound()

  const stateName = stateNameByAbbr[clinic.state] || clinic.state

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'VeterinaryCare',
    name: clinic.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: clinic.address,
      addressLocality: clinic.city,
      addressRegion: clinic.state,
      postalCode: clinic.zip_code || undefined,
    },
    telephone: clinic.phone,
    openingHours: clinic.is_24_7 ? 'Mo-Su 00:00-23:59' : undefined,
    url: clinic.website || undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#101922]">
        <div className="bg-red-600 text-white py-2 px-4 text-center text-sm font-bold">
          <span className="material-symbols-outlined text-sm align-middle mr-1" aria-hidden="true">emergency</span>
          CRITICAL EMERGENCY?
          <Link href="/guides/triage" className="underline ml-2">See triage steps</Link>
        </div>

        <nav className="sticky top-0 z-50 bg-[#f6f7f8]/80 dark:bg-[#101922]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center p-4 justify-between max-w-4xl mx-auto">
            <Link href="/" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#137fec] text-2xl" aria-hidden="true">medical_services</span>
              <span className="text-[#0d141b] dark:text-white font-bold">FindEmergencyVet.com</span>
            </Link>
            <Link href={`/states/${stateSlugByAbbr[clinic.state] || clinic.state.toLowerCase()}`} className="text-[#137fec] text-sm font-bold hover:underline">
              {stateName} Directory
            </Link>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-[#0d141b] dark:text-white text-3xl md:text-4xl font-black mb-3 font-display">
            {clinic.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Emergency vet in {clinic.city}, {stateName}
          </p>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 mb-8">
            <div className="flex flex-wrap gap-3 items-center mb-3">
              {clinic.is_24_7 && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">On-site 24/7</span>}
              {clinic.availability_type === 'on-call-24-7' && <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full">On-call 24/7</span>}
              {clinic.accepts_walk_ins && <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">Walk-ins allowed</span>}
              {clinic.requires_call_ahead && <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">Call ahead required</span>}
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-1"><strong>Address:</strong> {clinic.address}, {clinic.city}, {clinic.state} {clinic.zip_code}</p>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-1"><strong>Phone:</strong> <a href={`tel:${clinic.phone}`} className="text-[#137fec] hover:underline">{clinic.phone}</a></p>
            {clinic.website && (
              <p className="text-gray-700 dark:text-gray-300 text-sm"><strong>Website:</strong> <a href={clinic.website} className="text-[#137fec] hover:underline">{clinic.website}</a></p>
            )}
            {clinic.special_notes && (
              <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-lg p-3 text-sm text-blue-800 dark:text-blue-200">
                {clinic.special_notes}
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-3">
              <a href={`tel:${clinic.phone}`} className="inline-flex items-center gap-2 px-4 py-2 bg-[#137fec] text-white font-bold rounded-lg">
                <span className="material-symbols-outlined text-[18px]">call</span>
                Call now
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${clinic.address}, ${clinic.city}, ${clinic.state}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-[#0d141b] font-bold rounded-lg"
              >
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">location_on</span>
                Directions
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
              <h2 className="text-lg font-bold text-[#0d141b] dark:text-white mb-3 font-display">Availability</h2>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>24/7: {clinic.is_24_7 ? 'Yes' : 'No'}</li>
                <li>Availability type: {clinic.availability_type || 'Call for details'}</li>
                <li>Call ahead: {clinic.requires_call_ahead ? 'Required' : 'Not required'}</li>
                <li>Walk-ins: {clinic.accepts_walk_ins ? 'Accepted' : 'Call to confirm'}</li>
                {clinic.after_hours_entrance && <li>After-hours entrance: {clinic.after_hours_entrance}</li>}
              </ul>
            </section>

            <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
              <h2 className="text-lg font-bold text-[#0d141b] dark:text-white mb-3 font-display">Pets Treated</h2>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>Exotic specialist: {clinic.has_exotic_specialist ? 'Yes' : 'No'}</li>
                {clinic.exotic_pets_accepted?.length ? (
                  <li>Exotic pets: {clinic.exotic_pets_accepted.join(', ')}</li>
                ) : (
                  <li>Exotic pets: Call to confirm</li>
                )}
                {clinic.exotic_pets_notes && <li>Notes: {clinic.exotic_pets_notes}</li>}
              </ul>
            </section>

            <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
              <h2 className="text-lg font-bold text-[#0d141b] dark:text-white mb-3 font-display">Services</h2>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>Surgery suite: {clinic.has_surgery_suite ? 'Yes' : 'No'}</li>
                <li>ICU: {clinic.has_icu ? 'Yes' : 'No'}</li>
                <li>Specialists: {clinic.has_specialists ? 'Yes' : 'No'}</li>
                {clinic.services_offered?.length ? <li>Services: {clinic.services_offered.join(', ')}</li> : null}
                {clinic.specialists_available?.length ? <li>Specialists: {clinic.specialists_available.join(', ')}</li> : null}
              </ul>
            </section>

            <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
              <h2 className="text-lg font-bold text-[#0d141b] dark:text-white mb-3 font-display">Amenities</h2>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>Parking: {clinic.parking_type || 'Call to confirm'}</li>
                {clinic.parking_notes && <li>Parking notes: {clinic.parking_notes}</li>}
                <li>Wheelchair access: {clinic.wheelchair_accessible ? 'Yes' : 'No'}</li>
                <li>Separate cat entrance: {clinic.has_separate_cat_entrance ? 'Yes' : 'No'}</li>
                <li>Isolation rooms: {clinic.has_isolation_rooms ? 'Yes' : 'No'}</li>
              </ul>
            </section>

            <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 md:col-span-2">
              <h2 className="text-lg font-bold text-[#0d141b] dark:text-white mb-3 font-display">Payment</h2>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                {clinic.payment_methods?.length ? <li>Methods: {clinic.payment_methods.join(', ')}</li> : <li>Methods: Call to confirm</li>}
                <li>Pet insurance: {clinic.accepts_pet_insurance ? 'Accepted' : 'Call to confirm'}</li>
                <li>CareCredit: {clinic.accepts_care_credit ? 'Accepted' : 'Call to confirm'}</li>
                <li>Scratchpay: {clinic.accepts_scratchpay ? 'Accepted' : 'Call to confirm'}</li>
                <li>Payment plans: {clinic.payment_plans_available ? 'Available' : 'Call to confirm'}</li>
              </ul>
            </section>
          </div>
        </main>
      </div>
    </>
  )
}
