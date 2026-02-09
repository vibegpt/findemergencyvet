import Link from 'next/link'

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
  has_exotic_specialist: boolean
  exotic_pets_accepted?: string[] | null
  accepts_walk_ins?: boolean | null
  requires_call_ahead?: boolean | null
  parking_type?: string | null
  wheelchair_accessible?: boolean | null
  has_separate_cat_entrance?: boolean | null
  has_isolation_rooms?: boolean | null
  google_rating?: number | null
  google_review_count?: number | null
}

const statusLabels: Record<string, { label: string; tone: string }> = {
  'confirmed-open': { label: 'Open now', tone: 'bg-green-100 text-green-700' },
  'likely-open': { label: 'Likely open', tone: 'bg-emerald-100 text-emerald-700' },
  'call-to-confirm': { label: 'Call to confirm', tone: 'bg-yellow-100 text-yellow-700' },
  'closed': { label: 'Closed', tone: 'bg-gray-100 text-gray-600' },
  'at-capacity': { label: 'At capacity', tone: 'bg-red-100 text-red-700' },
  'unknown': { label: 'Status unknown', tone: 'bg-slate-100 text-slate-600' },
}

const availabilityLabels: Record<string, string> = {
  'true-24-7': 'On-site 24/7',
  'on-call-24-7': 'On-call 24/7 (call ahead)',
  'extended-hours': 'Extended hours',
  'emergency-only': 'Emergency appointments',
  'urgent-care': 'Urgent care hours',
}

const amenityLabels: Record<string, string> = {
  'free-lot': 'Free parking',
  'paid-lot': 'Paid parking',
  'street-only': 'Street parking',
  'limited': 'Limited parking',
  'valet': 'Valet parking',
}

const exoticLabels: Record<string, string> = {
  dogs: 'Dogs',
  cats: 'Cats',
  birds: 'Birds',
  reptiles: 'Reptiles',
  rabbits: 'Rabbits',
  ferrets: 'Ferrets',
  'guinea-pigs': 'Guinea pigs',
  hamsters: 'Hamsters',
  chinchillas: 'Chinchillas',
  hedgehogs: 'Hedgehogs',
  'sugar-gliders': 'Sugar gliders',
  'small-mammals': 'Small mammals',
  'pocket-pets': 'Pocket pets',
  'exotic-all': 'All exotics',
}

function formatExotics(exotics?: string[] | null) {
  if (!exotics || exotics.length === 0) return null
  const items = exotics.map(item => exoticLabels[item] || item.replace(/-/g, ' '))
  return items.join(', ')
}

export default function ClinicCard({
  clinic,
  showDetailsLink = true,
}: {
  clinic: Clinic
  showDetailsLink?: boolean
}) {
  const status = statusLabels[clinic.current_status || 'unknown'] || statusLabels.unknown
  const availability = clinic.availability_type ? availabilityLabels[clinic.availability_type] : null
  const exoticList = formatExotics(clinic.exotic_pets_accepted)
  const amenityTags = [
    clinic.parking_type ? amenityLabels[clinic.parking_type] : null,
    clinic.wheelchair_accessible ? 'Wheelchair access' : null,
    clinic.has_separate_cat_entrance ? 'Separate cat entrance' : null,
    clinic.has_isolation_rooms ? 'Isolation rooms' : null,
  ].filter(Boolean) as string[]

  return (
    <article className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-[#0d141b] dark:text-white text-xl font-bold">{clinic.name}</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {clinic.is_24_7 && (
              <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" aria-hidden="true"></span>
                24/7
              </span>
            )}
            {availability && (
              <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold px-2 py-1 rounded-full">
                {availability}
              </span>
            )}
            {clinic.has_exotic_specialist && (
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold px-2 py-1 rounded-full">
                Exotic specialist
              </span>
            )}
            {clinic.accepts_walk_ins && (
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-1 rounded-full">
                Walk-ins
              </span>
            )}
            {clinic.requires_call_ahead && (
              <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-bold px-2 py-1 rounded-full">
                Call ahead
              </span>
            )}
          </div>
        </div>
        {clinic.google_rating && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg font-bold text-sm bg-emerald-100 text-emerald-700">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">star</span>
            {clinic.google_rating}
            {clinic.google_review_count ? (
              <span className="text-xs font-normal opacity-70">({clinic.google_review_count})</span>
            ) : null}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${status.tone}`}>
          {status.label}
        </span>
        {clinic.is_24_7 && !clinic.requires_call_ahead && (
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
            On-site staff overnight
          </span>
        )}
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
        <strong>Address:</strong> {clinic.address}, {clinic.city}, {clinic.state} {clinic.zip_code || ''}
      </p>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
        <strong>Phone:</strong>{' '}
        <a href={`tel:${clinic.phone}`} className="text-[#137fec] hover:underline">
          {clinic.phone}
        </a>
      </p>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
        <strong>Hours:</strong>{' '}
        {clinic.is_24_7 ? '24/7 emergency care' : availability || 'Call for hours'}
      </p>

      {exoticList && (
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
          <strong>Exotic pets:</strong> {exoticList}
        </p>
      )}

      {amenityTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {amenityTags.map(tag => (
            <span key={tag} className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 px-2 py-1 rounded text-xs font-semibold">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <a
          href={`tel:${clinic.phone}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#137fec] text-white font-bold rounded-lg hover:bg-[#0d6ed0]"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">call</span>
          Call now
        </a>
        {showDetailsLink && clinic.slug && (
          <Link
            href={`/clinics/${clinic.slug}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-[#0d141b] font-bold rounded-lg hover:border-[#137fec] hover:text-[#137fec]"
          >
            View details
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">chevron_right</span>
          </Link>
        )}
      </div>
    </article>
  )
}
