import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const BASE_URL = 'https://findemergencyvet.com'

const stateAbbrToSlug: Record<string, string> = {
  NY: 'new-york', CA: 'california', TX: 'texas', FL: 'florida',
  GA: 'georgia', VA: 'virginia', SC: 'south-carolina', NC: 'north-carolina',
  MN: 'minnesota', MO: 'missouri', MS: 'mississippi', MI: 'michigan',
  LA: 'louisiana', OR: 'oregon', IA: 'iowa', AL: 'alabama',
  AR: 'arkansas', TN: 'tennessee', MD: 'maryland', WV: 'west-virginia',
  VT: 'vermont', NH: 'new-hampshire', NJ: 'new-jersey', CT: 'connecticut',
  PA: 'pennsylvania', ME: 'maine', WI: 'wisconsin', NE: 'nebraska', OK: 'oklahoma',
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/locations`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/triage`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/costs`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/new-york`, changeFrequency: 'weekly', priority: 0.9 },
  ]

  // Fetch all cities
  const { data: cities } = await supabase
    .from('cities')
    .select('slug, state')
    .order('state')
    .order('slug')

  const cityPages: MetadataRoute.Sitemap = []
  const statesWithCities = new Set<string>()

  for (const city of cities || []) {
    const stateSlug = stateAbbrToSlug[city.state]
    if (!stateSlug) continue

    statesWithCities.add(city.state)

    if (city.state === 'NY') {
      // NY uses /new-york/{slug}
      cityPages.push({
        url: `${BASE_URL}/new-york/${city.slug}`,
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    } else {
      // Other states use /states/{state}/{slug}
      cityPages.push({
        url: `${BASE_URL}/states/${stateSlug}/${city.slug}`,
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  }

  // State hub pages (excluding NY which is handled above as /new-york)
  const statePages: MetadataRoute.Sitemap = []
  for (const stateAbbr of statesWithCities) {
    if (stateAbbr === 'NY') continue
    const stateSlug = stateAbbrToSlug[stateAbbr]
    if (!stateSlug) continue

    statePages.push({
      url: `${BASE_URL}/states/${stateSlug}`,
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  }

  return [...staticPages, ...statePages, ...cityPages]
}
