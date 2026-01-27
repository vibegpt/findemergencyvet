'use client'

export function FloatingCallButton({ phone, clinicName }: { phone: string; clinicName: string }) {
  return (
    <a
      href={`tel:${phone}`}
      className="fixed bottom-24 right-4 z-40 flex items-center gap-2 px-6 py-4 bg-[#137fec] text-white font-bold rounded-full shadow-2xl hover:bg-[#137fec]/90 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#137fec]"
      aria-label={`Call ${clinicName}`}
    >
      <span className="material-symbols-outlined text-xl" aria-hidden="true">
        call
      </span>
      <span className="hidden sm:inline">Call Now</span>
    </a>
  )
}
