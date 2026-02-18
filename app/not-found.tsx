import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Navigation */}
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

      <main className="max-w-3xl mx-auto pt-[60px] px-5">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <p className="text-6xl font-semibold text-[#d2d2d7] mb-4">404</p>
          <h1 className="text-[32px] md:text-[40px] font-bold tracking-[-0.03em] text-[#1D1D1F] mb-3">
            Page Not Found
          </h1>
          <p className="text-[#6E6E73] text-base mb-8 max-w-md">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. Try one of the links below to find what you need.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1D1D1F] text-white font-medium rounded-xl hover:opacity-90 transition-opacity text-sm"
            >
              Find Emergency Vets
            </Link>
            <Link
              href="/locations"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#F5F5F7] text-[#1D1D1F] font-medium rounded-xl hover:bg-[#E8E8ED] transition-colors text-sm"
            >
              All Locations
            </Link>
            <Link
              href="/guides"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#F5F5F7] text-[#1D1D1F] font-medium rounded-xl hover:bg-[#E8E8ED] transition-colors text-sm"
            >
              Emergency Guides
            </Link>
          </div>
        </div>

        {/* Poison Control CTA */}
        <section className="mb-8 bg-[#FFF3E0] border border-[#FFE0B2] rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="22" height="22" className="text-[#B8730E] shrink-0 mt-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <p className="text-[#B8730E] text-sm font-semibold mb-1">
                In a pet emergency?
              </p>
              <p className="text-[#B8730E] text-sm">
                ASPCA Poison Control:{' '}
                <a href="tel:8884264435" className="font-bold underline whitespace-nowrap">(888) 426-4435</a>
                {' '}&bull;{' '}
                Pet Poison Helpline:{' '}
                <a href="tel:8557647661" className="font-bold underline whitespace-nowrap">(855) 764-7661</a>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
