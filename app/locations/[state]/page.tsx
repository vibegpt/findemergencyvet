import { permanentRedirect, notFound } from 'next/navigation'
import { stateSlugByAbbr } from '@/lib/state-data'

// Legacy route — permanently redirected to canonical /{state-slug}
// The [state] param here was a lowercase abbreviation (e.g. "ny"),
// so we map it to the full slug before redirecting.
export default async function LegacyLocationsStateRedirect({
  params,
}: {
  params: Promise<{ state: string }>
}) {
  const { state } = await params
  const stateSlug = stateSlugByAbbr[state.toUpperCase()]
  if (!stateSlug) notFound()
  permanentRedirect(`/${stateSlug}`)
}
