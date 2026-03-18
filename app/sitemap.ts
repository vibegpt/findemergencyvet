import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'
import { stateSlugByAbbr } from '@/lib/state-data'

const BASE_URL = 'https://findemergencyvet.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/locations`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/triage`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/costs`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/guides`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/guides/triage`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/guides/pet-cpr`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/guides/transport-to-vet`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/guides/poison-ingestion`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/guides/what-to-expect-at-triage`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/privacy`, changeFrequency: 'monthly', priority: 0.3 },
  ]

  // SITEMAP FILTER: Only include city pages with 2+ clinics.
  // - 0-clinic pages: no content, pure crawl budget waste — return notFound() at the page level.
  // - 1-clinic pages: noindexed at the page level — no sitemap entry needed.
  // Do NOT lower this threshold without also updating the noindex guard in app/[state]/[city]/page.tsx.
  const { data: cities } = await supabase
    .from('cities')
    .select('slug, state, clinic_count')
    .gte('clinic_count', 2)
    .order('state')
    .order('slug')

  const statesWithCities = new Set<string>()
  const cityPages: MetadataRoute.Sitemap = []

  for (const city of cities || []) {
    const stateSlug = stateSlugByAbbr[city.state]
    if (!stateSlug) continue
    statesWithCities.add(stateSlug)
    cityPages.push({
      url: `${BASE_URL}/${stateSlug}/${city.slug}`,
      changeFrequency: 'hourly',
      priority: 0.9,
    })
  }

  // SITEMAP FILTER: Only include state pages that have at least one city with 2+ clinics.
  // State pages with no qualifying cities are noindexed at the page level.
  const statePages: MetadataRoute.Sitemap = Array.from(statesWithCities).map(stateSlug => ({
    url: `${BASE_URL}/${stateSlug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // SITEMAP FILTER: Only include clinic profiles with all four required fields populated.
  // Profiles missing name, phone, address, or hours provide no value to users and waste crawl budget.
  // Do not remove these filters — incomplete profiles must never appear in the sitemap.
  const { data: clinics } = await supabase
    .from('clinics')
    .select('slug, city, state')
    .eq('is_active', true)
    .not('name', 'is', null)
    .not('phone', 'is', null)
    .not('address', 'is', null)
    .not('hours_detail', 'is', null)

  // Fetch all cities to map city name → slug for building clinic profile URLs
  // (some clinic cities may not have 2+ clinics and aren't in the cities query above)
  const { data: allCities } = await supabase
    .from('cities')
    .select('name, state, slug')

  const cityNameMap = new Map<string, string>()
  for (const city of allCities || []) {
    cityNameMap.set(`${city.name}:${city.state}`, city.slug)
  }

  const clinicPages: MetadataRoute.Sitemap = (clinics || []).flatMap(clinic => {
    const stateSlug = stateSlugByAbbr[clinic.state]
    if (!stateSlug) return []
    const citySlug = cityNameMap.get(`${clinic.city}:${clinic.state}`)
      ?? clinic.city.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    return [{
      url: `${BASE_URL}/${stateSlug}/${citySlug}/${clinic.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }]
  })

  return [...staticPages, ...statePages, ...cityPages, ...clinicPages]
}
