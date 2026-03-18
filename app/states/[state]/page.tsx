import { permanentRedirect } from 'next/navigation'

// Legacy route — permanently redirected to canonical /{state}
// The [state] param here was already in slug format (e.g. "new-york"),
// so a direct pass-through is safe.
export default async function LegacyStateRedirect({
  params,
}: {
  params: Promise<{ state: string }>
}) {
  const { state } = await params
  permanentRedirect(`/${state}`)
}
