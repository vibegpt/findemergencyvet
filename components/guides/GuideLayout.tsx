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
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Standard Header */}
      <nav className="fixed top-0 left-0 right-0 h-[60px] z-50 border-b border-[#E8E8ED]" style={{ background: 'rgba(250,250,250,0.8)', backdropFilter: 'saturate(180%) blur(20px)', WebkitBackdropFilter: 'saturate(180%) blur(20px)' }}>
        <div className="max-w-3xl mx-auto h-full flex items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-8 h-8 bg-[#0071E3] rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            </span>
            <span className="text-base font-semibold tracking-tight text-[#1D1D1F]">FindEmergencyVet</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/guides" className="text-sm text-[#6E6E73] hover:text-[#1D1D1F] transition-colors hidden sm:block">Resources</Link>
            <Link href="/locations" className="text-sm text-[#6E6E73] hover:text-[#1D1D1F] transition-colors hidden sm:block">All Locations</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-5 pt-[84px] pb-10">
        <header className="mb-8">
          <div className="flex items-center gap-1.5 text-[13px] text-[#86868B] mb-6">
            <Link href="/" className="hover:text-[#1D1D1F] transition-colors">Home</Link>
            <span>&rsaquo;</span>
            <Link href="/guides" className="hover:text-[#1D1D1F] transition-colors">Guides</Link>
            <span>&rsaquo;</span>
            <span className="text-[#1D1D1F] font-medium">{title}</span>
          </div>
          <p className="text-[13px] text-[#86868B] uppercase tracking-widest mb-3">Emergency Guide</p>
          <h1 className="text-[32px] md:text-[40px] font-bold tracking-[-0.03em] text-[#1D1D1F]">{title}</h1>
          <p className="text-[#6E6E73] text-base mt-3">{subtitle}</p>
        </header>

        <div className="space-y-6 text-[#6E6E73] leading-relaxed">
          {children}
        </div>

        <section className="mt-10 bg-white rounded-2xl p-6 border border-[#E8E8ED]">
          <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-3">
            Need an emergency vet now?
          </h2>
          <p className="text-[#6E6E73] mb-4">
            Use our location search to find open clinics and call ahead for faster triage.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-[#1D1D1F] text-white font-bold rounded-xl hover:bg-[#1D1D1F]/90 transition-colors">
            Find emergency vets
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </section>
      </main>

      {/* Standard Footer */}
      <footer className="px-5 py-8 border-t border-[#E8E8ED] text-center">
        <p className="text-[#86868B] text-xs leading-relaxed max-w-lg mx-auto">
          FindEmergencyVet.com is an independent directory. Availability and hours may change without notice.
          Always call the clinic to confirm emergency services before traveling.
        </p>
        <p className="text-[#86868B] text-xs mt-2">&copy; 2026 FindEmergencyVet.com</p>
      </footer>
    </div>
  )
}
