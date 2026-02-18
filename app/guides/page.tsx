import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Emergency Pet Care Guides | FindEmergencyVet.com',
  description: 'Free guides to help you handle pet emergencies — triage basics, pet CPR, poison ingestion, safe transport, and what to expect at the emergency vet.',
  alternates: {
    canonical: 'https://findemergencyvet.com/guides',
  },
}

const guides = [
  {
    slug: 'triage',
    title: 'Emergency Triage Basics for Pets',
    description: 'Use this quick triage checklist to decide how urgent the situation is and what to do next.',
  },
  {
    slug: 'pet-cpr',
    title: 'Pet CPR Guide',
    description: 'Step-by-step instructions for performing CPR on dogs and cats in a cardiac or respiratory emergency.',
  },
  {
    slug: 'poison-ingestion',
    title: 'Poison Ingestion Guide',
    description: 'What to do if your pet eats something toxic — which substances are dangerous and when to call poison control.',
  },
  {
    slug: 'transport-to-vet',
    title: 'How to Safely Transport Your Pet to the Vet',
    description: 'Tips for moving an injured or sick pet safely, including makeshift stretchers and calming techniques.',
  },
  {
    slug: 'what-to-expect-at-triage',
    title: 'What to Expect at Emergency Vet Triage',
    description: 'How triage works at an emergency vet, how they prioritize patients, and what to bring with you.',
  },
]

export default function GuidesPage() {
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
            <span className="text-[#1D1D1F] font-medium">Guides</span>
          </div>

          <h1 className="text-[32px] md:text-[40px] font-bold tracking-[-0.03em] text-[#1D1D1F] leading-tight mb-4">
            Emergency Pet Care Guides
          </h1>

          <p className="text-[#6E6E73] text-base md:text-lg leading-relaxed max-w-xl">
            Free resources to help you act quickly and make informed decisions during a pet emergency.
          </p>
        </header>

        <section className="px-5 pb-12">
          <div className="space-y-4">
            {guides.map(guide => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="flex items-start gap-4 bg-white border border-[#E8E8ED] rounded-2xl p-5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-shadow group"
              >
                <span className="w-8 h-8 rounded-full bg-[#FDE8E8] flex items-center justify-center shrink-0"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#C41E1E" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg></span>
                <div>
                  <h2 className="text-[#1D1D1F] font-semibold text-lg group-hover:text-[#1D1D1F] transition-colors">
                    {guide.title}
                  </h2>
                  <p className="text-[#6E6E73] text-sm mt-1">
                    {guide.description}
                  </p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18" className="text-[#86868B] group-hover:text-[#1D1D1F] transition-colors shrink-0 mt-1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ))}
          </div>
        </section>

        {/* Poison Control CTA */}
        <section className="mx-5 mb-8 bg-[#FFF3E0] border border-[#FFE0B2] rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="22" height="22" className="text-[#B8730E] shrink-0 mt-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <p className="text-[#B8730E] text-sm font-semibold mb-1">
                Think your pet was poisoned?
              </p>
              <p className="text-[#B8730E] text-sm">
                Call the ASPCA Animal Poison Control Center:{' '}
                <a href="tel:8884264435" className="font-bold underline whitespace-nowrap">(888) 426-4435</a>
                <span className="text-[#B8730E] text-xs ml-1">(consultation fee may apply)</span>
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-5 py-8 border-t border-[#E8E8ED] text-center">
          <p className="text-[#86868B] text-xs leading-relaxed max-w-lg mx-auto">
            FindEmergencyVet.com is an independent directory. These guides are for informational purposes only and are not a substitute for professional veterinary advice.
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
          <Link href="/guides" className="flex flex-col items-center gap-0.5 text-[#0071E3] min-w-[48px] min-h-[48px] justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
            </svg>
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
