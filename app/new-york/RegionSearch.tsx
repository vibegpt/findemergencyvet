'use client'

import { useState } from 'react'
import Link from 'next/link'

type Region = {
  name: string
  slug: string
  description: string
  facilities: string
}

export default function RegionSearch({ regions }: { regions: Region[] }) {
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? regions.filter(r =>
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.description.toLowerCase().includes(query.toLowerCase()) ||
        r.facilities.toLowerCase().includes(query.toLowerCase())
      )
    : null

  return (
    <div className="mb-10">
      <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868B]" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by city or region (e.g., Buffalo, Rochester, NYC)"
          className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-[#E8E8ED] bg-white text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:border-transparent text-sm"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#86868B] hover:text-[#1D1D1F] transition-colors"
            aria-label="Clear search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {filtered && (
        <div className="mt-3 space-y-2">
          {filtered.length > 0 ? (
            filtered.map(region => (
              <Link
                key={region.slug}
                href={`/new-york/${region.slug}`}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#E8E8ED] hover:border-[#0071E3] transition-colors"
              >
                <div>
                  <span className="text-[#1D1D1F] font-bold">{region.name}</span>
                  <p className="text-[#86868B] text-xs mt-0.5">{region.description}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#0071E3] shrink-0 ml-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            ))
          ) : (
            <p className="text-[#86868B] text-sm text-center py-4">
              No regions match &ldquo;{query}&rdquo;. Try a different city or browse the regions below.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
