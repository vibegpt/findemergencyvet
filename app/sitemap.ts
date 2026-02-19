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

  // Fetch only cities that have clinics
  const { data: cities } = await supabase
    .from('cities')
    .select('slug, state, clinic_count')
    .gt('clinic_count', 0)
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

  const statePages: MetadataRoute.Sitemap = Array.from(statesWithCities).map(stateSlug => ({
    url: `${BASE_URL}/${stateSlug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const { data: clinics } = await supabase
    .from('clinics')
    .select('slug')
    .eq('is_active', true)

  const clinicPages: MetadataRoute.Sitemap = (clinics || []).map(clinic => ({
    url: `${BASE_URL}/clinics/${clinic.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...statePages, ...cityPages, ...clinicPages]
}
