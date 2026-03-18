import { permanentRedirect } from 'next/navigation'

// Legacy route — permanently redirected to canonical /{state}/{city}
// The [state] param here was already in slug format (e.g. "new-york"),
// so a direct pass-through is safe.
export default async function LegacyStateCityRedirect({
  params,
}: {
  params: Promise<{ state: string; city: string }>
}) {
  const { state, city } = await params
  permanentRedirect(`/${state}/${city}`)
}
