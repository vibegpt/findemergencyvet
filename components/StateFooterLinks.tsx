import Link from 'next/link'
import { stateSlugByAbbr, stateNameByAbbr } from '@/lib/state-data'

const stateLinks = Object.entries(stateSlugByAbbr)
  .map(([abbr, slug]) => ({ slug, name: stateNameByAbbr[abbr] || abbr }))
  .sort((a, b) => a.name.localeCompare(b.name))

export default function StateFooterLinks() {
  return (
    <section className="px-5 py-8 border-t border-[#E8E8ED]">
      <h3 className="text-[#86868B] text-xs font-semibold uppercase tracking-wider mb-3">
        Emergency Vets by State
      </h3>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {stateLinks.map(s => (
          <Link
            key={s.slug}
            href={`/${s.slug}`}
            className="text-xs text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
          >
            {s.name}
          </Link>
        ))}
      </div>
    </section>
  )
}
