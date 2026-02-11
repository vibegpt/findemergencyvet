'use client'

type Clinic = {
  id: string
  slug?: string
  name: string
  address: string
  city: string
  state: string
  zip_code: string | null
  phone: string
  is_24_7: boolean
  availability_type: string | null
  current_status: string | null
  verification_status?: string | null
  has_exotic_specialist: boolean
  exotic_pets_accepted?: string[] | null
  accepts_walk_ins?: boolean | null
  requires_call_ahead?: boolean | null
  google_rating?: number | null
  google_review_count?: number | null
}

const availabilityLabels: Record<string, string> = {
  'true-24-7': '24/7 Emergency',
  'on-call-24-7': 'On-call 24/7',
  'extended-hours': 'Extended Hours',
  'emergency-only': 'After-Hours Emergency',
  'urgent-care': 'Urgent Care',
}

/* ── Inline SVG icons (heroicons outline, 18×18) ── */

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  )
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ArrowTopRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  )
}

function CheckBadgeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
      <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
  )
}

/* ── Status badge logic ── */

function StatusBadge({ clinic }: { clinic: Clinic }) {
  if (clinic.is_24_7) {
    return (
      <span className="inline-flex items-center gap-1.5 bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
        </span>
        Open 24/7
      </span>
    )
  }

  if (clinic.current_status === 'closed') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
        Closed
      </span>
    )
  }

  if (clinic.current_status === 'confirmed-open') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
        </span>
        Open Now
      </span>
    )
  }

  // After-hours / urgent care / extended hours
  const label = clinic.availability_type ? availabilityLabels[clinic.availability_type] : 'Call for Hours'
  return (
    <span className="inline-flex items-center gap-1.5 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
      {label}
    </span>
  )
}

/* ── Main component ── */

export default function ClinicCard({ clinic }: { clinic: Clinic }) {
  const hoursText = clinic.is_24_7
    ? 'Open 24 hours, 7 days a week'
    : clinic.availability_type
      ? availabilityLabels[clinic.availability_type] || 'Call for hours'
      : 'Call for hours'

  const fullAddress = `${clinic.address}, ${clinic.city}, ${clinic.state}${clinic.zip_code ? ` ${clinic.zip_code}` : ''}`
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`

  return (
    <article className="bg-white border border-[#d2d2d7] rounded-2xl p-5 transition-shadow hover:shadow-lg">
      {/* Row 1: Name + Status Badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-[#1d1d1f] text-lg font-semibold leading-snug">
          {clinic.name}
        </h3>
        <StatusBadge clinic={clinic} />
      </div>

      {/* Row 2: Address */}
      <div className="flex items-start gap-2 mb-2">
        <MapPinIcon className="text-[#86868b] shrink-0 mt-0.5" />
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
        >
          {fullAddress}
        </a>
      </div>

      {/* Row 3: Hours */}
      <div className="flex items-start gap-2 mb-4">
        <ClockIcon className="text-[#86868b] shrink-0 mt-0.5" />
        <span className="text-sm text-[#6e6e73]">{hoursText}</span>
      </div>

      {/* Row 4: Feature Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {clinic.is_24_7 && (
          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            True 24/7
          </span>
        )}
        {clinic.verification_status === 'verified' && (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full">
            <CheckBadgeIcon />
            Verified
          </span>
        )}
        {clinic.accepts_walk_ins && (
          <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            Walk-ins Welcome
          </span>
        )}
        {clinic.has_exotic_specialist && (
          <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            Exotic Pets
          </span>
        )}
        {clinic.requires_call_ahead && (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            Call Ahead
          </span>
        )}
      </div>

      {/* Phone number (tappable text) */}
      <a
        href={`tel:${clinic.phone}`}
        className="inline-flex items-center gap-1.5 text-[#1B7A1B] font-semibold text-sm mb-4 hover:underline"
      >
        <PhoneIcon className="text-[#1B7A1B]" />
        {clinic.phone}
      </a>

      {/* Row 5: Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <a
          href={`tel:${clinic.phone}`}
          className="flex items-center justify-center gap-2 h-12 rounded-xl bg-[#1B7A1B] text-white text-sm font-bold shadow-sm hover:bg-[#156115] active:scale-[0.98] transition-all"
        >
          <PhoneIcon className="text-white" />
          Call Now
        </a>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 h-12 rounded-xl border border-[#d2d2d7] text-[#1d1d1f] text-sm font-bold hover:bg-[#f5f5f7] active:scale-[0.98] transition-all"
        >
          <ArrowTopRightIcon />
          Directions
        </a>
      </div>
    </article>
  )
}
