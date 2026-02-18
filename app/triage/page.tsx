'use client'
import { useState } from 'react'
import Link from 'next/link'

type Symptom = {
  id: string
  name: string
  description: string
  severity: 'critical' | 'urgent' | 'moderate'
}

const symptoms: Symptom[] = [
  { id: 'breathing', name: 'Breathing', description: 'Difficulty/Choking', severity: 'critical' },
  { id: 'toxins', name: 'Toxins', description: 'Ingested Poison', severity: 'critical' },
  { id: 'trauma', name: 'Trauma', description: 'Bleeding/Injury', severity: 'critical' },
  { id: 'seizures', name: 'Seizures', description: 'Collapse/Shaking', severity: 'critical' },
  { id: 'vomiting', name: 'Vomiting', description: 'Severe Diarrhea', severity: 'urgent' },
  { id: 'behavior', name: 'Behavior', description: 'Lethargy/Pain', severity: 'moderate' }
]

const criticalSymptoms = ['breathing', 'toxins', 'trauma', 'seizures']

const severityBg: Record<string, string> = {
  critical: 'bg-[#FDE8E8]',
  urgent: 'bg-[#FFF3E0]',
  moderate: 'bg-[#F5F5F7]',
}

export default function TriagePage() {
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)

  const handleSymptomSelect = (symptomId: string) => {
    setSelectedSymptom(symptomId)
    setShowResults(true)
  }

  const selectedSymptomData = symptoms.find(s => s.id === selectedSymptom)
  const isCritical = selectedSymptom ? criticalSymptoms.includes(selectedSymptom) : false

  return (
    <div className="bg-[#FAFAFA] min-h-screen flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#1D1D1F] focus:text-white focus:rounded-lg">
        Skip to triage form
      </a>

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

      <main id="main-content" className="flex-1 overflow-y-auto pb-32 pt-[60px]">
        <div className="max-w-3xl mx-auto px-5">
          {/* Page Title */}
          <h1 className="text-[32px] md:text-[40px] font-bold tracking-[-0.03em] text-[#1D1D1F] pt-8 pb-2">Emergency Triage</h1>

          {/* Progress */}
          <div className="flex flex-col gap-3 py-4">
            <div className="flex gap-6 justify-between">
              <p className="text-[#1D1D1F] text-base font-medium leading-normal">Triage Progress</p>
              <p className="text-[#6E6E73] text-sm font-normal leading-normal">{showResults ? 'Complete' : 'Step 1 of 1'}</p>
            </div>
            <div className="rounded-full bg-[#E8E8ED] overflow-hidden" role="progressbar" aria-valuenow={showResults ? 100 : 33} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-2 rounded-full bg-[#1D1D1F] transition-all duration-500" style={{ width: showResults ? '100%' : '33.3%' }}/>
            </div>
          </div>

          <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] pb-3 pt-5">What&apos;s happening with your pet?</h2>
          <p className="text-[#6E6E73] text-base font-normal leading-normal pb-3 pt-1">Select the primary concern to help us assess the urgency of the situation.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4" role="group" aria-label="Symptom selection">
            {symptoms.map((symptom) => (
              <button key={symptom.id} onClick={() => handleSymptomSelect(symptom.id)} className={`flex flex-1 gap-3 rounded-2xl border p-4 flex-col transition-all cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#1D1D1F] min-h-[48px] ${selectedSymptom === symptom.id ? 'border-[#1D1D1F] bg-[#F5F5F7]' : 'border-[#E8E8ED] bg-white hover:border-[#86868B]'}`} aria-pressed={selectedSymptom === symptom.id}>
                <div className={`w-10 h-10 rounded-full ${severityBg[symptom.severity]} flex items-center justify-center`} aria-hidden="true">
                  <span className="w-3 h-3 rounded-full bg-current" style={{ color: symptom.severity === 'critical' ? '#C41E1E' : symptom.severity === 'urgent' ? '#B8730E' : '#86868B' }} />
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <h3 className="text-[#1D1D1F] text-base font-bold leading-tight">{symptom.name}</h3>
                  <p className="text-[#6E6E73] text-sm font-normal leading-normal">{symptom.description}</p>
                </div>
              </button>
            ))}
          </div>

          {showResults && isCritical && (
            <div className="mt-6 p-4 bg-[#FDE8E8] border border-[#F5C6C6] rounded-2xl" role="alert" aria-live="assertive">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#C41E1E" width="24" height="24" className="shrink-0 mt-0.5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <div>
                  <h3 className="text-[#C41E1E] font-bold text-lg">Immediate Care Required</h3>
                  <p className="text-[#1D1D1F] text-sm mt-1 leading-relaxed"><strong>{selectedSymptomData?.name}</strong> symptoms require immediate veterinary attention. Every minute counts. Call the nearest emergency vet now or proceed directly to their facility.</p>
                  <div className="mt-3 p-3 bg-white/60 rounded-xl border border-[#F5C6C6]">
                    <p className="text-[#C41E1E] text-xs font-semibold mb-2">CRITICAL WARNING SIGNS:</p>
                    <ul className="text-[#1D1D1F] text-xs space-y-1">
                      {selectedSymptom === 'breathing' && (<><li>- Blue/gray gums or tongue</li><li>- Gasping for air or open-mouth breathing</li><li>- Unable to lie down comfortably</li></>)}
                      {selectedSymptom === 'toxins' && (<><li>- Known ingestion of chocolate, grapes, xylitol, antifreeze</li><li>- Ingestion within last 2 hours</li><li>- Symptoms: drooling, vomiting, tremors</li></>)}
                      {selectedSymptom === 'trauma' && (<><li>- Heavy bleeding that won&apos;t stop with pressure</li><li>- Hit by car or fell from height</li><li>- Broken bones visible or suspected</li></>)}
                      {selectedSymptom === 'seizures' && (<><li>- Seizure lasting more than 5 minutes</li><li>- Multiple seizures in short period</li><li>- Not responding after seizure ends</li></>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showResults && !isCritical && (
            <div className="mt-6 p-4 bg-[#FFF3E0] border border-[#FFE0B2] rounded-2xl" role="alert" aria-live="polite">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#B8730E" width="24" height="24" className="shrink-0 mt-0.5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <div>
                  <h3 className="text-[#B8730E] font-bold text-lg">Veterinary Care Recommended</h3>
                  <p className="text-[#1D1D1F] text-sm mt-1 leading-relaxed"><strong>{selectedSymptomData?.name}</strong> symptoms should be evaluated by a veterinarian within 12-24 hours. Monitor closely and seek immediate care if condition worsens.</p>
                  <div className="mt-3 p-3 bg-white/60 rounded-xl border border-[#FFE0B2]">
                    <p className="text-[#B8730E] text-xs font-semibold mb-2">MONITOR FOR THESE CHANGES:</p>
                    <ul className="text-[#1D1D1F] text-xs space-y-1">
                      {selectedSymptom === 'vomiting' && (<><li>- Vomiting more than 3 times in 24 hours</li><li>- Blood in vomit or diarrhea</li><li>- Unable to keep water down</li><li>- Lethargy or weakness developing</li></>)}
                      {selectedSymptom === 'behavior' && (<><li>- Refusing all food for 24+ hours</li><li>- Yelping or crying when touched</li><li>- Hiding or avoiding interaction</li><li>- Sudden aggression or personality change</li></>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showResults && (
            <>
              <div className="pt-8 pb-3">
                <h3 className="text-[#1D1D1F] text-xl font-bold">{isCritical ? 'Nearest Emergency Vets (24/7)' : 'Recommended Veterinary Clinics'}</h3>
                <p className="text-[#6E6E73] text-sm">{isCritical ? 'Open now - Call ahead if possible' : 'Sorted by distance'}</p>
              </div>
              <div className="flex flex-col gap-3 pb-8">
                <div className="flex items-center justify-between p-4 bg-white border border-[#E8E8ED] rounded-xl hover:border-[#86868B] transition-colors">
                  <div className="flex flex-col">
                    <span className="text-[#1D1D1F] font-bold">VEG White Plains</span>
                    <span className="text-[#6E6E73] text-sm">0.8 miles away - Open 24/7</span>
                  </div>
                  <a href="tel:914-949-8779" className="flex items-center justify-center px-4 py-2.5 bg-[#1B7A1B] rounded-xl text-white text-sm font-semibold active:scale-90 transition-transform focus:outline-none focus:ring-2 focus:ring-[#1B7A1B]" aria-label="Call VEG White Plains">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18" className="mr-1.5" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                    Call
                  </a>
                </div>
                <div className="flex items-center justify-between p-4 bg-white border border-[#E8E8ED] rounded-xl hover:border-[#86868B] transition-colors">
                  <div className="flex flex-col">
                    <span className="text-[#1D1D1F] font-bold">Katonah-Bedford Vet Center</span>
                    <span className="text-[#6E6E73] text-sm">2.4 miles away - Open 24/7</span>
                  </div>
                  <a href="tel:914-241-7700" className="flex items-center justify-center px-4 py-2.5 bg-[#1B7A1B] rounded-xl text-white text-sm font-semibold active:scale-90 transition-transform focus:outline-none focus:ring-2 focus:ring-[#1B7A1B]" aria-label="Call Katonah-Bedford Vet Center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18" className="mr-1.5" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                    Call
                  </a>
                </div>
                <div className="flex items-center justify-between p-4 bg-white border border-[#E8E8ED] rounded-xl hover:border-[#86868B] transition-colors">
                  <div className="flex flex-col">
                    <span className="text-[#1D1D1F] font-bold">Animal Specialty Center</span>
                    <span className="text-[#6E6E73] text-sm">5.1 miles away - Open 24/7</span>
                  </div>
                  <a href="tel:914-457-4000" className="flex items-center justify-center px-4 py-2.5 bg-[#1B7A1B] rounded-xl text-white text-sm font-semibold active:scale-90 transition-transform focus:outline-none focus:ring-2 focus:ring-[#1B7A1B]" aria-label="Call Animal Specialty Center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18" className="mr-1.5" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                    Call
                  </a>
                </div>
              </div>
            </>
          )}

          {showResults && isCritical && (
            <div className="mb-8 p-4 bg-white border border-[#E8E8ED] rounded-xl">
              <h4 className="text-[#1D1D1F] font-bold text-sm mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#0071E3" width="18" height="18" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                While Getting to the Vet:
              </h4>
              <ul className="text-[#6E6E73] text-xs space-y-2">
                <li>- Stay calm - your pet can sense your stress</li>
                <li>- Call ahead so the vet can prepare</li>
                <li>- Bring any packaging if toxin ingestion</li>
                <li>- Have someone else drive if possible</li>
                <li>- Keep pet warm with blanket</li>
              </ul>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#E8E8ED] pb-8 z-40">
        <div className="max-w-3xl mx-auto">
          {!showResults ? (
            <button disabled className="w-full bg-[#1D1D1F]/30 text-white/50 font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-lg cursor-not-allowed">
              Select a symptom above
            </button>
          ) : (
            <Link href="/locations/ny/westchester" className="w-full bg-[#1D1D1F] hover:bg-[#1D1D1F]/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-lg active:scale-[0.98] transition-transform focus:outline-none focus:ring-2 focus:ring-[#1D1D1F]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="20" height="20" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
              See All Nearby Vets
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
