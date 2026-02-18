import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About FindEmergencyVet.com | Our Mission & How We Verify Clinics',
  description: 'Learn how FindEmergencyVet.com verifies emergency vet clinics, our mission to help pet owners find 24/7 care, and the difference between true 24/7 and after-hours facilities.',
  alternates: {
    canonical: 'https://findemergencyvet.com/about',
  },
}

export default function AboutPage() {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FindEmergencyVet.com',
    url: 'https://findemergencyvet.com',
    description: 'Independent directory helping pet owners find verified 24/7 emergency veterinary clinics across the United States.',
    foundingDate: '2025',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: 'https://findemergencyvet.com/contact',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

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
              <span className="text-[#1D1D1F] font-medium">About</span>
            </div>

            <h1 className="text-[32px] md:text-[40px] font-bold tracking-[-0.03em] text-[#1D1D1F] leading-tight mb-4">
              About FindEmergencyVet.com
            </h1>

            <p className="text-[#6E6E73] text-base md:text-lg leading-relaxed max-w-xl">
              An independent directory helping pet owners find verified emergency veterinary care when every second counts.
            </p>
          </header>

          {/* Mission */}
          <section className="px-5 py-8">
            <h2 className="text-[#1D1D1F] text-[24px] font-bold tracking-[-0.02em] mb-4">Our Mission</h2>
            <p className="text-[#6E6E73] leading-relaxed mb-4">
              When your pet faces a medical emergency, searching through outdated listings and misleading hours wastes precious time. FindEmergencyVet.com exists to solve that problem.
            </p>
            <p className="text-[#6E6E73] leading-relaxed">
              We maintain a verified directory of emergency veterinary clinics across the United States, clearly distinguishing between true 24/7 facilities and after-hours or urgent care clinics. Our goal is simple: help you find open emergency vet care as fast as possible, with accurate phone numbers and directions.
            </p>
          </section>

          {/* How We Verify */}
          <section className="px-5 py-8 border-t border-[#E8E8ED]">
            <h2 className="text-[#1D1D1F] text-[24px] font-bold tracking-[-0.02em] mb-4">How We Verify Clinics</h2>
            <p className="text-[#6E6E73] leading-relaxed mb-4">
              Every clinic in our directory goes through a verification process before being listed:
            </p>
            <ul className="space-y-3 text-[#6E6E73]">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF453A] shrink-0 mt-2" />
                <span><strong className="text-[#1D1D1F]">Phone verification</strong> &mdash; We call clinics directly to confirm they offer emergency services and verify their hours of operation.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF453A] shrink-0 mt-2" />
                <span><strong className="text-[#1D1D1F]">Website and listing review</strong> &mdash; We cross-reference clinic websites, Google Business profiles, and state veterinary board registrations.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF453A] shrink-0 mt-2" />
                <span><strong className="text-[#1D1D1F]">Ongoing monitoring</strong> &mdash; We periodically re-verify listings and promptly investigate reports of inaccurate information from users and clinic staff.</span>
              </li>
            </ul>
            <p className="text-[#86868B] text-sm mt-4 italic">
              Despite our best efforts, hours and availability can change without notice. Always call the clinic before traveling to confirm they are open and accepting patients.
            </p>
          </section>

          {/* True 24/7 vs After-Hours */}
          <section className="px-5 py-8 border-t border-[#E8E8ED]">
            <h2 className="text-[#1D1D1F] text-[24px] font-bold tracking-[-0.02em] mb-4">True 24/7 vs. After-Hours Care</h2>
            <p className="text-[#6E6E73] leading-relaxed mb-4">
              Not all &ldquo;emergency vets&rdquo; operate the same way. We clearly label each facility so you know what to expect:
            </p>
            <div className="space-y-4">
              <div className="bg-white border border-[#E8E8ED] rounded-2xl p-5">
                <h3 className="font-semibold text-[#1D1D1F] mb-2">True 24/7 Emergency Hospitals</h3>
                <p className="text-[#6E6E73] text-sm">
                  These facilities have veterinary staff on-site around the clock, 365 days a year. A doctor is always physically present &mdash; not just on-call. Look for the green &ldquo;Open 24/7&rdquo; badge in our listings.
                </p>
              </div>
              <div className="bg-white border border-[#E8E8ED] rounded-2xl p-5">
                <h3 className="font-semibold text-[#1D1D1F] mb-2">After-Hours &amp; Urgent Care</h3>
                <p className="text-[#6E6E73] text-sm">
                  These clinics provide emergency care during specific evening, overnight, or weekend hours. They may close during daytime hours when regular vets are open. Always check their specific schedule.
                </p>
              </div>
            </div>
          </section>

          {/* Data Sources */}
          <section className="px-5 py-8 border-t border-[#E8E8ED]">
            <h2 className="text-[#1D1D1F] text-[24px] font-bold tracking-[-0.02em] mb-4">Data Sources</h2>
            <p className="text-[#6E6E73] leading-relaxed mb-4">
              Our directory is compiled from multiple sources to ensure accuracy:
            </p>
            <ul className="space-y-2 text-[#6E6E73] text-sm">
              <li className="flex items-start gap-2">
                <span className="text-[#86868B]">&bull;</span>
                Direct communication with clinic owners and staff
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#86868B]">&bull;</span>
                State veterinary licensing boards
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#86868B]">&bull;</span>
                Google Business Profile data (ratings, reviews, hours)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#86868B]">&bull;</span>
                Veterinary Emergency and Critical Care Society (VECCS) member directories
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#86868B]">&bull;</span>
                User-submitted reports and corrections
              </li>
            </ul>
          </section>

          {/* Contact CTA */}
          <section className="mx-5 mb-8 bg-white border border-[#E8E8ED] rounded-2xl p-6 text-center">
            <h2 className="text-[#1D1D1F] font-semibold mb-2">Found incorrect information?</h2>
            <p className="text-[#6E6E73] text-sm mb-4">
              Help us keep our directory accurate. Report errors or request updates.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1D1D1F] text-white font-medium rounded-xl hover:opacity-90 transition-opacity text-sm"
            >
              Contact Us
            </Link>
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
    </>
  )
}
