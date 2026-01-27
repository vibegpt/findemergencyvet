'use client'
import { useState } from 'react'
import Link from 'next/link'

type Symptom = {
  id: string
  name: string
  description: string
  icon: string
  severity: 'critical' | 'urgent' | 'moderate'
}

const symptoms: Symptom[] = [
  { id: 'breathing', name: 'Breathing', description: 'Difficulty/Choking', icon: 'air', severity: 'critical' },
  { id: 'toxins', name: 'Toxins', description: 'Ingested Poison', icon: 'dangerous', severity: 'critical' },
  { id: 'trauma', name: 'Trauma', description: 'Bleeding/Injury', icon: 'medical_services', severity: 'critical' },
  { id: 'seizures', name: 'Seizures', description: 'Collapse/Shaking', icon: 'bolt', severity: 'critical' },
  { id: 'vomiting', name: 'Vomiting', description: 'Severe Diarrhea', icon: 'warning', severity: 'urgent' },
  { id: 'behavior', name: 'Behavior', description: 'Lethargy/Pain', icon: 'help', severity: 'moderate' }
]

const criticalSymptoms = ['breathing', 'toxins', 'trauma', 'seizures']

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
    <div className="bg-[#101c22] text-white min-h-screen flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#13a4ec] focus:text-white focus:rounded-lg">
        Skip to triage form
      </a>

      <header className="sticky top-0 z-50 flex items-center bg-[#101c22] p-4 pb-2 justify-between border-b border-[#325567]/30">
        <Link href="/" className="text-white flex size-12 shrink-0 items-center justify-start cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#13a4ec] rounded" aria-label="Close and return home">
          <span className="material-symbols-outlined" aria-hidden="true">close</span>
        </Link>
        <h1 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Emergency Triage</h1>
      </header>

      <main id="main-content" className="flex-1 overflow-y-auto pb-32">
        <div className="flex flex-col gap-3 p-4">
          <div className="flex gap-6 justify-between">
            <p className="text-white text-base font-medium leading-normal">Triage Progress</p>
            <p className="text-white text-sm font-normal leading-normal">{showResults ? 'Complete' : 'Step 1 of 1'}</p>
          </div>
          <div className="rounded-full bg-[#325567] overflow-hidden" role="progressbar" aria-valuenow={showResults ? 100 : 33} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-2 rounded-full bg-[#13a4ec] transition-all duration-500" style={{ width: showResults ? '100%' : '33.3%' }}/>
          </div>
        </div>

        <h2 className="text-white tracking-tight text-[28px] font-bold leading-tight px-4 text-left pb-3 pt-5">What's happening with your pet?</h2>
        <p className="text-[#92b7c9] text-base font-normal leading-normal pb-3 pt-1 px-4">Select the primary concern to help us assess the urgency of the situation.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4" role="group" aria-label="Symptom selection">
          {symptoms.map((symptom) => (
            <button key={symptom.id} onClick={() => handleSymptomSelect(symptom.id)} className={`flex flex-1 gap-3 rounded-xl border p-4 flex-col transition-all cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#13a4ec] min-h-[48px] ${selectedSymptom === symptom.id ? 'border-[#13a4ec] bg-[#13a4ec]/10' : 'border-[#325567] bg-[#192b33] hover:border-[#13a4ec]'}`} aria-pressed={selectedSymptom === symptom.id}>
              <div className="text-[#13a4ec]" aria-hidden="true"><span className="material-symbols-outlined text-3xl">{symptom.icon}</span></div>
              <div className="flex flex-col gap-1 text-left">
                <h3 className="text-white text-base font-bold leading-tight">{symptom.name}</h3>
                <p className="text-[#92b7c9] text-sm font-normal leading-normal">{symptom.description}</p>
              </div>
            </button>
          ))}
        </div>

        {showResults && isCritical && (
          <div className="mx-4 mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl animate-[fadeIn_0.3s_ease-in]" role="alert" aria-live="assertive">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-red-500 mt-1 text-2xl" aria-hidden="true">error</span>
              <div>
                <h3 className="text-red-500 font-bold text-lg">Immediate Care Required</h3>
                <p className="text-white text-sm mt-1 leading-relaxed"><strong>{selectedSymptomData?.name}</strong> symptoms require immediate veterinary attention. Every minute counts. Call the nearest emergency vet now or proceed directly to their facility.</p>
                <div className="mt-3 p-3 bg-red-900/20 rounded-lg">
                  <p className="text-red-300 text-xs font-semibold mb-2">⚠️ CRITICAL WARNING SIGNS:</p>
                  <ul className="text-white text-xs space-y-1">
                    {selectedSymptom === 'breathing' && (<><li>• Blue/gray gums or tongue</li><li>• Gasping for air or open-mouth breathing</li><li>• Unable to lie down comfortably</li></>)}
                    {selectedSymptom === 'toxins' && (<><li>• Known ingestion of chocolate, grapes, xylitol, antifreeze</li><li>• Ingestion within last 2 hours</li><li>• Symptoms: drooling, vomiting, tremors</li></>)}
                    {selectedSymptom === 'trauma' && (<><li>• Heavy bleeding that won't stop with pressure</li><li>• Hit by car or fell from height</li><li>• Broken bones visible or suspected</li></>)}
                    {selectedSymptom === 'seizures' && (<><li>• Seizure lasting more than 5 minutes</li><li>• Multiple seizures in short period</li><li>• Not responding after seizure ends</li></>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {showResults && !isCritical && (
          <div className="mx-4 mt-6 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-xl animate-[fadeIn_0.3s_ease-in]" role="alert" aria-live="polite">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-yellow-500 mt-1 text-2xl" aria-hidden="true">warning</span>
              <div>
                <h3 className="text-yellow-500 font-bold text-lg">Veterinary Care Recommended</h3>
                <p className="text-white text-sm mt-1 leading-relaxed"><strong>{selectedSymptomData?.name}</strong> symptoms should be evaluated by a veterinarian within 12-24 hours. Monitor closely and seek immediate care if condition worsens.</p>
                <div className="mt-3 p-3 bg-yellow-900/20 rounded-lg">
                  <p className="text-yellow-300 text-xs font-semibold mb-2">🔔 MONITOR FOR THESE CHANGES:</p>
                  <ul className="text-white text-xs space-y-1">
                    {selectedSymptom === 'vomiting' && (<><li>• Vomiting more than 3 times in 24 hours</li><li>• Blood in vomit or diarrhea</li><li>• Unable to keep water down</li><li>• Lethargy or weakness developing</li></>)}
                    {selectedSymptom === 'behavior' && (<><li>• Refusing all food for 24+ hours</li><li>• Yelping or crying when touched</li><li>• Hiding or avoiding interaction</li><li>• Sudden aggression or personality change</li></>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {showResults && (<><div className="px-4 pt-8 pb-3"><h3 className="text-white text-xl font-bold">{isCritical ? 'Nearest Emergency Vets (24/7)' : 'Recommended Veterinary Clinics'}</h3><p className="text-[#92b7c9] text-sm">{isCritical ? 'Open now • Call ahead if possible' : 'Sorted by distance'}</p></div><div className="flex flex-col gap-3 px-4 pb-8"><div className="flex items-center justify-between p-4 bg-[#192b33] border border-[#325567] rounded-xl hover:border-[#13a4ec] transition-colors"><div className="flex flex-col"><span className="text-white font-bold">VEG White Plains</span><span className="text-[#92b7c9] text-sm">0.8 miles away • Open 24/7</span></div><a href="tel:914-949-8779" className="flex items-center justify-center size-12 bg-[#13a4ec] rounded-full text-white active:scale-90 transition-transform focus:outline-none focus:ring-2 focus:ring-[#13a4ec]" aria-label="Call VEG White Plains"><span className="material-symbols-outlined" aria-hidden="true">call</span></a></div><div className="flex items-center justify-between p-4 bg-[#192b33] border border-[#325567] rounded-xl hover:border-[#13a4ec] transition-colors"><div className="flex flex-col"><span className="text-white font-bold">Katonah-Bedford Vet Center</span><span className="text-[#92b7c9] text-sm">2.4 miles away • Open 24/7</span></div><a href="tel:914-241-7700" className="flex items-center justify-center size-12 bg-[#13a4ec] rounded-full text-white active:scale-90 transition-transform focus:outline-none focus:ring-2 focus:ring-[#13a4ec]" aria-label="Call Katonah-Bedford Vet Center"><span className="material-symbols-outlined" aria-hidden="true">call</span></a></div><div className="flex items-center justify-between p-4 bg-[#192b33] border border-[#325567] rounded-xl hover:border-[#13a4ec] transition-colors"><div className="flex flex-col"><span className="text-white font-bold">Animal Specialty Center</span><span className="text-[#92b7c9] text-sm">5.1 miles away • Open 24/7</span></div><a href="tel:914-457-4000" className="flex items-center justify-center size-12 bg-[#13a4ec] rounded-full text-white active:scale-90 transition-transform focus:outline-none focus:ring-2 focus:ring-[#13a4ec]" aria-label="Call Animal Specialty Center"><span className="material-symbols-outlined" aria-hidden="true">call</span></a></div></div></>)}

        {showResults && isCritical && (<div className="mx-4 mb-8 p-4 bg-[#192b33] border border-[#325567] rounded-xl"><h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><span className="material-symbols-outlined text-[#13a4ec]" aria-hidden="true">info</span>While Getting to the Vet:</h4><ul className="text-[#92b7c9] text-xs space-y-2"><li>✓ Stay calm - your pet can sense your stress</li><li>✓ Call ahead so the vet can prepare</li><li>✓ Bring any packaging if toxin ingestion</li><li>✓ Have someone else drive if possible</li><li>✓ Keep pet warm with blanket</li></ul></div>)}
      </main>

      {/* Bottom Action Bar - NO BOTTOM NAV (focused crisis experience) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#101c22] border-t border-[#325567]/30 pb-8">
        {!showResults ? (
          <button disabled className="w-full bg-[#13a4ec]/30 text-white/50 font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-lg cursor-not-allowed">
            Select a symptom above
          </button>
        ) : (
          <Link href="/locations/ny/westchester" className="w-full bg-[#13a4ec] hover:bg-[#13a4ec]/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-lg active:scale-[0.98] transition-transform focus:outline-none focus:ring-2 focus:ring-white">
            <span className="material-symbols-outlined" aria-hidden="true">location_on</span>
            See All Nearby Vets
          </Link>
        )}
      </div>

      <style jsx>{`@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  )
}
