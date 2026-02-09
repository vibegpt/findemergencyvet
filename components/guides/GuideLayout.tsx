import Link from 'next/link'

export default function GuideLayout({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#101922]">
      <div className="bg-red-600 text-white py-2 px-4 text-center text-sm font-bold">
        <span className="material-symbols-outlined text-sm align-middle mr-1" aria-hidden="true">emergency</span>
        CRITICAL EMERGENCY?
        <Link href="/triage" className="underline ml-2">Go to triage</Link>
      </div>

      <nav className="sticky top-0 z-50 bg-[#f6f7f8]/80 dark:bg-[#101922]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center p-4 justify-between max-w-4xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#137fec] text-2xl" aria-hidden="true">medical_services</span>
            <span className="text-[#0d141b] dark:text-white font-bold">FindEmergencyVet.com</span>
          </Link>
          <Link href="/locations" className="text-[#137fec] text-sm font-bold hover:underline">
            All Locations
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <header className="bg-[#0b1220] text-white rounded-3xl p-8 md:p-12 mb-8">
          <p className="uppercase tracking-[0.25em] text-xs text-white/60 mb-3">Emergency Guide</p>
          <h1 className="text-3xl md:text-4xl font-black font-display">{title}</h1>
          <p className="text-white/80 mt-3">{subtitle}</p>
        </header>

        <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
          {children}
        </div>

        <section className="mt-10 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-[#0d141b] dark:text-white mb-3 font-display">
            Need an emergency vet now?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Use our location search to find open clinics and call ahead for faster triage.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-[#137fec] text-white font-bold rounded-lg">
            Find emergency vets
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_forward</span>
          </Link>
        </section>
      </main>
    </div>
  )
}
