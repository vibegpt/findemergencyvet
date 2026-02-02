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
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" aria-hidden="true">
          search
        </span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by city or region (e.g., Buffalo, Rochester, NYC)"
          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#137fec] focus:border-transparent text-sm"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Clear search"
          >
            <span className="material-symbols-outlined text-xl">close</span>
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
                className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-[#137fec] transition-colors"
              >
                <div>
                  <span className="text-[#0d141b] dark:text-white font-bold">{region.name}</span>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{region.description}</p>
                </div>
                <span className="material-symbols-outlined text-[#137fec] text-xl shrink-0 ml-3">arrow_forward</span>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
              No regions match &ldquo;{query}&rdquo;. Try a different city or browse the regions below.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
