'use client'

export function FloatingCallButton({ phone, clinicName }: { phone: string; clinicName: string }) {
  return (
    <a
      href={`tel:${phone}`}
      className="fixed bottom-24 right-4 z-40 flex items-center gap-2 px-6 py-4 bg-[#1B7A1B] text-white font-bold rounded-full hover:bg-[#1B7A1B]/90 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-[#1B7A1B]"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
      aria-label={`Call ${clinicName}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="20" height="20" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
      <span className="hidden sm:inline">Call Now</span>
    </a>
  )
}
