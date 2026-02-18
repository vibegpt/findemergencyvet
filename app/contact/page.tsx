import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact Us | FindEmergencyVet.com',
  description: 'Report incorrect clinic information, request listing updates, or get in touch with the FindEmergencyVet.com team.',
  alternates: {
    canonical: 'https://findemergencyvet.com/contact',
  },
}

export default function ContactPage() {
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

      <main className="max-w-3xl mx-auto pt-[60px]">
        <header className="px-5 pt-12 pb-8">
          <div className="flex items-center gap-1.5 text-[13px] text-[#86868B] mb-6">
            <Link href="/" className="hover:text-[#1D1D1F] transition-colors">Home</Link>
            <span>&rsaquo;</span>
            <span className="text-[#1D1D1F] font-medium">Contact</span>
          </div>

          <h1 className="text-[32px] md:text-[40px] font-bold tracking-[-0.03em] text-[#1D1D1F] leading-tight mb-4">
            Contact Us
          </h1>

          <p className="text-[#6E6E73] text-base md:text-lg leading-relaxed max-w-xl">
            Help us keep our directory accurate. We welcome corrections, listing requests, and feedback.
          </p>
        </header>

        <section className="px-5 pb-8">
          <div className="space-y-6">
            {/* Report Incorrect Data */}
            <div className="bg-white border border-[#E8E8ED] rounded-2xl p-6">
              <h2 className="text-[#1D1D1F] text-[24px] font-bold tracking-[-0.02em] mb-2">Report Incorrect Information</h2>
              <p className="text-[#6E6E73] text-sm mb-4">
                If you find a clinic with wrong hours, an outdated phone number, or incorrect address, let us know and we&apos;ll investigate within 24 hours.
              </p>
              <a
                href="mailto:corrections@findemergencyvet.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1D1D1F] text-white font-medium rounded-xl hover:opacity-90 transition-opacity text-sm"
              >
                corrections@findemergencyvet.com
              </a>
            </div>

            {/* List Your Clinic */}
            <div className="bg-white border border-[#E8E8ED] rounded-2xl p-6">
              <h2 className="text-[#1D1D1F] text-[24px] font-bold tracking-[-0.02em] mb-2">List Your Clinic</h2>
              <p className="text-[#6E6E73] text-sm mb-4">
                Are you a clinic owner or manager? If your emergency veterinary practice isn&apos;t listed, or if you need to update your existing listing, reach out and we&apos;ll get you added.
              </p>
              <a
                href="mailto:listings@findemergencyvet.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1D1D1F] text-white font-medium rounded-xl hover:opacity-90 transition-opacity text-sm"
              >
                listings@findemergencyvet.com
              </a>
            </div>

            {/* General Feedback */}
            <div className="bg-white border border-[#E8E8ED] rounded-2xl p-6">
              <h2 className="text-[#1D1D1F] text-[24px] font-bold tracking-[-0.02em] mb-2">General Feedback</h2>
              <p className="text-[#6E6E73] text-sm mb-4">
                Have suggestions for improving the site, want to request coverage in a new city, or just want to say hello? We&apos;d love to hear from you.
              </p>
              <a
                href="mailto:hello@findemergencyvet.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1D1D1F] text-white font-medium rounded-xl hover:opacity-90 transition-opacity text-sm"
              >
                hello@findemergencyvet.com
              </a>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="mx-5 mb-8 bg-[#FFF3E0] border border-[#FFE0B2] rounded-2xl p-5">
          <p className="text-[#B8730E] text-sm">
            <strong>Note:</strong> FindEmergencyVet.com is a directory service, not a veterinary practice. If your pet is experiencing a medical emergency, please call your nearest emergency vet directly or use our <Link href="/locations" className="font-bold underline">location finder</Link>.
          </p>
        </section>

        {/* Footer */}
        <footer className="px-5 py-8 border-t border-[#E8E8ED] text-center">
          <p className="text-[#86868B] text-xs leading-relaxed max-w-lg mx-auto">
            FindEmergencyVet.com is an independent directory. Availability and hours may change without notice.
            Always call the clinic to confirm emergency services before traveling.
          </p>
          <div className="flex justify-center gap-4 mt-3 text-[#86868B] text-xs">
            <Link href="/about" className="hover:text-[#1D1D1F] transition-colors">About</Link>
            <Link href="/contact" className="hover:text-[#1D1D1F] transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-[#1D1D1F] transition-colors">Privacy</Link>
          </div>
          <p className="text-[#86868B] text-xs mt-2">&copy; 2026 FindEmergencyVet.com</p>
        </footer>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[#E8E8ED] px-5 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }} aria-label="Bottom navigation">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center gap-0.5 text-[#86868B] hover:text-[#1D1D1F] min-w-[48px] min-h-[48px] justify-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link href="/guides" className="flex flex-col items-center gap-0.5 text-[#86868B] hover:text-[#1D1D1F] min-w-[48px] min-h-[48px] justify-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
            <span className="text-[10px] font-medium">Guides</span>
          </Link>
          <Link href="/locations" className="flex flex-col items-center gap-0.5 text-[#86868B] hover:text-[#1D1D1F] min-w-[48px] min-h-[48px] justify-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
            <span className="text-[10px] font-medium">Locations</span>
          </Link>
        </div>
      </nav>
      <div className="h-20 md:h-0" />
    </div>
  )
}
