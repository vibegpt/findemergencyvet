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
          <h1 className="text-[32px] md:text-[40px] font-bold tracking-[-0.03em] text-[#1D1D1F] mb-3">
            {clinic.name}
          </h1>
          <p className="text-[#6E6E73] mb-6">
            Emergency vet in {clinic.city}, {stateName}
          </p>

          <div className="bg-white rounded-2xl p-6 border border-[#E8E8ED] mb-8" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div className="flex flex-wrap gap-3 items-center mb-3">
              {clinic.is_24_7 && <span className="bg-[#E8F5E8] text-[#1B7A1B] text-xs font-bold px-2 py-1 rounded-full">On-site 24/7</span>}
              {clinic.availability_type === 'on-call-24-7' && <span className="bg-[#FFF3E0] text-[#B8730E] text-xs font-bold px-2 py-1 rounded-full">On-call 24/7</span>}
              {clinic.accepts_walk_ins && <span className="bg-[#F5F5F7] text-[#1D1D1F] text-xs font-bold px-2 py-1 rounded-full">Walk-ins allowed</span>}
              {clinic.requires_call_ahead && <span className="bg-[#FFF3E0] text-[#B8730E] text-xs font-bold px-2 py-1 rounded-full">Call ahead required</span>}
            </div>
            <p className="text-[#6E6E73] text-sm mb-1"><strong className="text-[#1D1D1F]">Address:</strong> {clinic.address}, {clinic.city}, {clinic.state} {clinic.zip_code}</p>
            <p className="text-[#6E6E73] text-sm mb-1"><strong className="text-[#1D1D1F]">Phone:</strong> <a href={`tel:${clinic.phone}`} className="text-[#0071E3] hover:underline">{clinic.phone}</a></p>
            {clinic.website && (
              <p className="text-[#6E6E73] text-sm"><strong className="text-[#1D1D1F]">Website:</strong> <a href={clinic.website} className="text-[#0071E3] hover:underline">{clinic.website}</a></p>
            )}
            {clinic.special_notes && (
              <div className="mt-4 bg-[#FFF3E0] border border-[#FFE0B2] rounded-lg p-3 text-sm text-[#B8730E]">
                {clinic.special_notes}
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-3">
              <a href={`tel:${clinic.phone}`} className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B7A1B] text-white font-bold rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[18px] h-[18px]"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                Call now
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${clinic.address}, ${clinic.city}, ${clinic.state}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-[#E8E8ED] text-[#1D1D1F] font-bold rounded-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[18px] h-[18px]"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                Directions
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <section className="bg-white rounded-2xl p-6 border border-[#E8E8ED]">
              <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-3">Availability</h2>
              <ul className="text-sm text-[#6E6E73] space-y-2">
                <li>24/7: {clinic.is_24_7 ? 'Yes' : 'No'}</li>
                <li>Availability type: {clinic.availability_type || 'Call for details'}</li>
                <li>Call ahead: {clinic.requires_call_ahead ? 'Required' : 'Not required'}</li>
                <li>Walk-ins: {clinic.accepts_walk_ins ? 'Accepted' : 'Call to confirm'}</li>
                {clinic.after_hours_entrance && <li>After-hours entrance: {clinic.after_hours_entrance}</li>}
              </ul>
            </section>

            <section className="bg-white rounded-2xl p-6 border border-[#E8E8ED]">
              <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-3">Pets Treated</h2>
              <ul className="text-sm text-[#6E6E73] space-y-2">
                <li>Exotic specialist: {clinic.has_exotic_specialist ? 'Yes' : 'No'}</li>
                {clinic.exotic_pets_accepted?.length ? (
                  <li>Exotic pets: {clinic.exotic_pets_accepted.join(', ')}</li>
                ) : (
                  <li>Exotic pets: Call to confirm</li>
                )}
                {clinic.exotic_pets_notes && <li>Notes: {clinic.exotic_pets_notes}</li>}
              </ul>
            </section>

            <section className="bg-white rounded-2xl p-6 border border-[#E8E8ED]">
              <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-3">Services</h2>
              <ul className="text-sm text-[#6E6E73] space-y-2">
                <li>Surgery suite: {clinic.has_surgery_suite ? 'Yes' : 'No'}</li>
                <li>ICU: {clinic.has_icu ? 'Yes' : 'No'}</li>
                <li>Specialists: {clinic.has_specialists ? 'Yes' : 'No'}</li>
                {clinic.services_offered?.length ? <li>Services: {clinic.services_offered.join(', ')}</li> : null}
                {clinic.specialists_available?.length ? <li>Specialists: {clinic.specialists_available.join(', ')}</li> : null}
              </ul>
            </section>

            <section className="bg-white rounded-2xl p-6 border border-[#E8E8ED]">
              <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-3">Amenities</h2>
              <ul className="text-sm text-[#6E6E73] space-y-2">
                <li>Parking: {clinic.parking_type || 'Call to confirm'}</li>
                {clinic.parking_notes && <li>Parking notes: {clinic.parking_notes}</li>}
                <li>Wheelchair access: {clinic.wheelchair_accessible ? 'Yes' : 'No'}</li>
                <li>Separate cat entrance: {clinic.has_separate_cat_entrance ? 'Yes' : 'No'}</li>
                <li>Isolation rooms: {clinic.has_isolation_rooms ? 'Yes' : 'No'}</li>
              </ul>
            </section>

            <section className="bg-white rounded-2xl p-6 border border-[#E8E8ED] md:col-span-2">
              <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-3">Payment</h2>
              <ul className="text-sm text-[#6E6E73] space-y-2">
                {clinic.payment_methods?.length ? <li>Methods: {clinic.payment_methods.join(', ')}</li> : <li>Methods: Call to confirm</li>}
                <li>Pet insurance: {clinic.accepts_pet_insurance ? 'Accepted' : 'Call to confirm'}</li>
                <li>CareCredit: {clinic.accepts_care_credit ? 'Accepted' : 'Call to confirm'}</li>
                <li>Scratchpay: {clinic.accepts_scratchpay ? 'Accepted' : 'Call to confirm'}</li>
                <li>Payment plans: {clinic.payment_plans_available ? 'Available' : 'Call to confirm'}</li>
              </ul>
            </section>
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
