'use client'

import './homepage.css'
import Link from 'next/link'
import { useMemo, useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { stateNameByAbbr, stateSlugByAbbr } from '@/lib/state-data'

type City = {
  id: string
  name: string
  state: string
  slug: string
  clinic_count: number
}

export default function HomePage({
  clinicCount,
  allCities,
}: {
  clinicCount: number
  allCities: City[]
}) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Compute state stats from city data
  const stateStats = useMemo(() => {
    const stats: Record<string, { abbr: string; name: string; slug: string; cityCount: number }> = {}
    for (const city of allCities) {
      if (city.clinic_count === 0) continue
      if (!stats[city.state]) {
        stats[city.state] = {
          abbr: city.state,
          name: stateNameByAbbr[city.state] || city.state,
          slug: stateSlugByAbbr[city.state] || city.state.toLowerCase(),
          cityCount: 0,
        }
      }
      stats[city.state].cityCount++
    }
    return Object.values(stats).sort((a, b) => b.cityCount - a.cityCount)
  }, [allCities])

  // Popular cities by clinic count
  const popularCities = useMemo(() => {
    return [...allCities]
      .filter(c => c.clinic_count > 0)
      .sort((a, b) => b.clinic_count - a.clinic_count)
      .slice(0, 6)
  }, [allCities])

  const quickLinkCities = popularCities.slice(0, 4)

  // Search autocomplete
  const stateMatches = useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) return []
    return Object.entries(stateNameByAbbr)
      .filter(([, name]) => name.toLowerCase().includes(trimmed))
      .slice(0, 4)
  }, [query])

  const cityMatches = useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) return []
    return allCities
      .filter(city => {
        const stateName = stateNameByAbbr[city.state] || city.state
        return (
          city.name.toLowerCase().includes(trimmed) ||
          `${city.name.toLowerCase()}, ${stateName.toLowerCase()}`.includes(trimmed) ||
          `${city.name.toLowerCase()}, ${city.state.toLowerCase()}`.includes(trimmed)
        )
      })
      .slice(0, 6)
  }, [allCities, query])

  const hasSuggestions = cityMatches.length > 0 || stateMatches.length > 0

  // Close suggestions on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const findCityMatch = (input: string): City | null => {
    const trimmed = input.trim()
    if (!trimmed) return null
    const lower = trimmed.toLowerCase()

    const commaParts = trimmed.split(',').map(part => part.trim())
    if (commaParts.length >= 2) {
      const cityName = commaParts[0].toLowerCase()
      const statePart = commaParts[1].toUpperCase()
      const exact = allCities.find(city => city.name.toLowerCase() === cityName && city.state === statePart)
      if (exact) return exact
    }

    const byExactCity = allCities.find(city => city.name.toLowerCase() === lower)
    if (byExactCity) return byExactCity

    return cityMatches[0] || null
  }

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    setErrorMessage(null)
    setShowSuggestions(false)
    const trimmed = query.trim()
    if (!trimmed) return

    const cityMatch = findCityMatch(trimmed)
    if (cityMatch) {
      const slug = stateSlugByAbbr[cityMatch.state]
      if (slug) {
        router.push(`/${slug}/${cityMatch.slug}`)
        return
      }
    }

    const stateMatch = Object.entries(stateNameByAbbr).find(([, name]) =>
      name.toLowerCase() === trimmed.toLowerCase()
    )
    if (stateMatch) {
      const slug = stateSlugByAbbr[stateMatch[0]]
      router.push(`/${slug}`)
      return
    }

    setErrorMessage('Try a city like "Eden Prairie, MN" or a state like "Florida".')
  }

  const navigateToCity = (city: City) => {
    const slug = stateSlugByAbbr[city.state]
    if (slug) router.push(`/${slug}/${city.slug}`)
  }

  const navigateToState = (abbr: string) => {
    const slug = stateSlugByAbbr[abbr]
    if (slug) router.push(`/${slug}`)
  }

  return (
    <div className="homepage">
      {/* Navigation */}
      <nav>
        <div className="nav-inner">
          <Link href="/" className="logo">Find<span>Emergency</span>Vet</Link>
          <ul className="nav-links">
            <li><Link href="/guides">Resources</Link></li>
            <li><Link href="/locations">All Locations</Link></li>
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <span className="hero-eyebrow">
          <span className="status-dot" />
          Verified listings updated daily
        </span>

        <h1>Find emergency vet care.<br />Right now.</h1>

        <p className="hero-subtitle">
          Instantly locate 24-hour animal hospitals and after-hours clinics near you. Verified hours. Real availability.
        </p>

        {/* Search */}
        <div className="search-container" ref={searchRef}>
          <div className="search-box-wrapper">
            <form className="search-box" onSubmit={handleSearch}>
              <span className="search-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </span>
              <input
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setShowSuggestions(true); setErrorMessage(null) }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Enter your city or zip code"
                autoComplete="off"
              />
              <button type="submit" className="search-btn">Search</button>
            </form>

            {showSuggestions && hasSuggestions && (
              <div className="suggestions-dropdown">
                {cityMatches.map(city => (
                  <button
                    key={city.id}
                    className="suggestion-item"
                    onClick={() => { setShowSuggestions(false); navigateToCity(city) }}
                  >
                    <span className="suggestion-name">{city.name}, {stateNameByAbbr[city.state] || city.state}</span>
                    <span className="suggestion-count">{city.clinic_count} clinics</span>
                  </button>
                ))}
                {stateMatches.map(([abbr, name]) => (
                  <button
                    key={abbr}
                    className="suggestion-item"
                    onClick={() => { setShowSuggestions(false); navigateToState(abbr) }}
                  >
                    <span className="suggestion-name">{name}</span>
                    <span className="suggestion-count">View state</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {errorMessage ? (
            <p className="search-error">{errorMessage}</p>
          ) : (
            <p className="search-hint">Try: &ldquo;Austin, TX&rdquo; or &ldquo;Eden Prairie, MN&rdquo;</p>
          )}

          <div className="quick-links">
            {quickLinkCities.map(city => (
              <Link
                key={city.id}
                href={`/${stateSlugByAbbr[city.state]}/${city.slug}`}
                className="quick-link"
              >
                {city.name}, {city.state}
              </Link>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="trust-bar">
          <div className="trust-item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Verified 24/7 clinics
          </div>
          <div className="trust-item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Real-time hours
          </div>
          <div className="trust-item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Direct phone numbers
          </div>
        </div>
      </section>

      {/* Browse by State */}
      <section className="states-section">
        <div className="section-header">
          <h2>Browse by state</h2>
          <p>Find emergency veterinary care anywhere in the United States</p>
        </div>

        <div className="states-grid">
          {stateStats.map((state, i) => (
            <Link
              key={state.abbr}
              href={`/${state.slug}`}
              className={`state-card${i < 2 ? ' featured' : ''}`}
            >
              <div className="state-name">{state.name}</div>
              <div className="state-count">
                {state.cityCount} {state.cityCount === 1 ? 'city' : 'cities'}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Cities */}
      <section className="cities-section">
        <div className="section-header">
          <h2>Popular cities</h2>
          <p>Frequently searched emergency vet locations</p>
        </div>

        <div className="cities-grid">
          {popularCities.map(city => (
            <Link
              key={city.id}
              href={`/${stateSlugByAbbr[city.state]}/${city.slug}`}
              className="city-card"
            >
              <div className="city-header">
                <div>
                  <div className="city-name">{city.name}</div>
                  <div className="city-state">{stateNameByAbbr[city.state] || city.state}</div>
                </div>
                <span className="city-badge emergency">24/7</span>
              </div>
              <div className="city-stats">
                <div className="city-stat">
                  <span className="city-stat-value">{city.clinic_count}</span>
                  <span className="city-stat-label">Clinics</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Value Props */}
      <section className="value-section">
        <div className="section-header">
          <h2>Why pet owners trust us</h2>
          <p>When every minute matters, we help you find care faster</p>
        </div>

        <div className="value-grid">
          <div className="value-item">
            <div className="value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <h3 className="value-title">Verified information</h3>
            <p className="value-desc">We call clinics directly to verify hours, services, and walk-in policies. No guessing.</p>
          </div>

          <div className="value-item">
            <div className="value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="value-title">True 24-hour vs after-hours</h3>
            <p className="value-desc">We clearly distinguish between always-open ERs and clinics with limited emergency hours.</p>
          </div>

          <div className="value-item">
            <div className="value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <h3 className="value-title">Genuinely local</h3>
            <p className="value-desc">Find the closest option fast with accurate addresses and distance information.</p>
          </div>
        </div>
      </section>

      {/* Emergency CTA */}
      <section className="emergency-cta">
        <h2>Is your pet having an emergency?</h2>
        <p>Don&apos;t wait. Find 24-hour care near you now.</p>
        <button
          className="emergency-btn"
          onClick={() => {
            const input = document.querySelector('.homepage .search-box input') as HTMLInputElement
            if (input) {
              input.focus()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          Search now
        </button>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-inner">
          <div className="footer-brand">
            <Link href="/" className="logo">Find<span>Emergency</span>Vet</Link>
            <p>Helping pet owners find emergency veterinary care when every minute counts. Verified clinic information across the United States.</p>
          </div>

          <div className="footer-col">
            <h4>Popular States</h4>
            <ul>
              {stateStats.slice(0, 4).map(state => (
                <li key={state.abbr}>
                  <Link href={`/${state.slug}`}>{state.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Resources</h4>
            <ul>
              <li><Link href="/guides">Emergency Guides</Link></li>
              <li><Link href="/locations">All Locations</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/privacy">Privacy</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; 2026 FindEmergencyVet.com</span>
          <span>Not a substitute for professional veterinary advice</span>
        </div>
      </footer>
    </div>
  )
}
