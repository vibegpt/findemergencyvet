'use client'
import { useState } from 'react'
import Link from 'next/link'

type Scenario = {
  id: string
  name: string
  minCost: number
  maxCost: number
  description: string
}

const scenarios: Scenario[] = [
  { id: 'foreign-object', name: 'Foreign Object Ingestion', minCost: 1500, maxCost: 3500, description: 'Surgery to remove swallowed items' },
  { id: 'toxin', name: 'Toxic Ingestion (Chocolate/Plants)', minCost: 500, maxCost: 2500, description: 'IV fluids, monitoring, decontamination' },
  { id: 'trauma', name: 'Physical Trauma / Fracture', minCost: 1500, maxCost: 5000, description: 'X-rays, surgery, hospitalization' },
  { id: 'breathing', name: 'Difficulty Breathing', minCost: 800, maxCost: 3000, description: 'Oxygen therapy, diagnostics, treatment' },
  { id: 'seizure', name: 'Seizures / Neurological', minCost: 1000, maxCost: 4000, description: 'Monitoring, diagnostics, medications' },
]

export default function CostGuidePage() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(scenarios[0])

  return (
    <div className="min-h-screen bg-[#f6f8f8] dark:bg-[#101f22] text-slate-900 dark:text-white">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#13c8ec] focus:text-white focus:rounded-lg">Skip to cost calculator</a>

      {/* Emergency Banner */}
      <div className="bg-red-600 text-white py-2 px-4 text-center text-sm font-bold">
        <span className="material-symbols-outlined text-sm align-middle mr-1" aria-hidden="true">emergency</span>
        CRITICAL EMERGENCY?
        <a href="/triage" className="underline ml-2 focus:outline-none focus:ring-2 focus:ring-white">
          Go to your nearest emergency vet immediately
        </a>
      </div>

      <div className="sticky top-0 z-50 bg-[#f6f8f8]/95 dark:bg-[#101f22]/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto">
          <Link href="/" className="flex size-12 shrink-0 items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#13c8ec] rounded" aria-label="Go back"><span className="material-symbols-outlined text-2xl" aria-hidden="true">arrow_back_ios</span></Link>
          <h1 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Cost Guide</h1>
          <Link href="/triage" className="flex items-center justify-center rounded-lg h-12 bg-transparent text-[#13c8ec] focus:outline-none focus:ring-2 focus:ring-[#13c8ec]" aria-label="Emergency triage"><span className="material-symbols-outlined text-2xl" aria-hidden="true">medical_information</span></Link>
        </div>
      </div>

      <main id="main-content" className="max-w-md mx-auto pb-32">
        <div className="px-4 pt-6">
          <h2 className="tracking-tight text-[28px] font-bold leading-tight pb-3">How Much Does An Emergency Vet Cost?</h2>
          <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-relaxed pb-3">Emergency care is unpredictable, but your bill shouldn't be. Use this guide to prepare for potential costs and find financial support.</p>
        </div>

        {/* Cost Estimator */}
        <div className="px-4 py-4 mt-2">
          <div className="bg-[#13c8ec]/10 border border-[#13c8ec]/20 rounded-xl p-5">
            <h3 className="text-lg font-bold leading-tight tracking-tight pb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[#13c8ec]" aria-hidden="true">calculate</span>Cost Estimator</h3>
            <div className="flex flex-col gap-4">
              <label htmlFor="scenario-select" className="flex flex-col">
                <span className="text-sm font-medium pb-2 text-slate-600 dark:text-slate-400">Select Emergency Scenario</span>
                <div className="relative">
                  <select id="scenario-select" value={selectedScenario.id} onChange={(e) => setSelectedScenario(scenarios.find(s => s.id === e.target.value) || scenarios[0])} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white h-14 px-4 pr-10 appearance-none focus:ring-2 focus:ring-[#13c8ec] focus:border-[#13c8ec] transition-all">
                    {scenarios.map(scenario => (<option key={scenario.id} value={scenario.id}>{scenario.name}</option>))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-4 pointer-events-none text-slate-400" aria-hidden="true">unfold_more</span>
                </div>
              </label>
              <div className="flex items-center justify-between pt-2" aria-live="polite">
                <span className="text-sm text-slate-600 dark:text-slate-400">Estimated Range:</span>
                <span className="text-xl font-bold text-[#13c8ec]">${selectedScenario.minCost.toLocaleString()} - ${selectedScenario.maxCost.toLocaleString()}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">{selectedScenario.description}</p>
            </div>
          </div>
        </div>

        {/* Service Fees Table */}
        <div className="px-4 pt-6">
          <h3 className="text-lg font-bold leading-tight tracking-tight pb-4">Common Service Fees</h3>
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="w-full text-left border-collapse">
              <caption className="sr-only">Common emergency vet service fees with price ranges</caption>
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/50">
                  <th scope="col" className="p-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Service</th>
                  <th scope="col" className="p-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 text-right">Low</th>
                  <th scope="col" className="p-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 text-right">High</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                <tr><td className="p-4 text-sm font-medium">Emergency Exam</td><td className="p-4 text-sm text-right">$96</td><td className="p-4 text-sm text-right">$236</td></tr>
                <tr className="bg-slate-50/50 dark:bg-slate-800/20"><td className="p-4 text-sm font-medium">Diagnostic X-Rays</td><td className="p-4 text-sm text-right">$150</td><td className="p-4 text-sm text-right">$250</td></tr>
                <tr><td className="p-4 text-sm font-medium">Blood Work (STAT)</td><td className="p-4 text-sm text-right">$80</td><td className="p-4 text-sm text-right">$200</td></tr>
                <tr className="bg-slate-50/50 dark:bg-slate-800/20"><td className="p-4 text-sm font-medium">Ultrasound</td><td className="p-4 text-sm text-right">$300</td><td className="p-4 text-sm text-right">$600</td></tr>
                <tr><td className="p-4 text-sm font-medium">IV Fluids & Monitoring</td><td className="p-4 text-sm text-right">$200</td><td className="p-4 text-sm text-right">$500</td></tr>
                <tr className="bg-slate-50/50 dark:bg-slate-800/20"><td className="p-4 text-sm font-medium">Hospitalization (per night)</td><td className="p-4 text-sm text-right">$222</td><td className="p-4 text-sm text-right">$567</td></tr>
                <tr><td className="p-4 text-sm font-medium">Emergency Surgery</td><td className="p-4 text-sm text-right font-semibold text-[#13c8ec]">$2,000</td><td className="p-4 text-sm text-right font-semibold text-[#13c8ec]">$5,000+</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 pt-3 flex items-center gap-1 italic"><span className="material-symbols-outlined text-[14px]" aria-hidden="true">info</span>Prices based on 2024-2025 national averages (AVMA, CareCredit studies). Actual costs vary by location and clinic.</p>
        </div>

        {/* Real Cost Examples */}
        <div className="px-4 pt-6">
          <h3 className="text-lg font-bold leading-tight tracking-tight pb-4">Real Cost Examples</h3>
          <div className="space-y-3">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800"><div className="flex justify-between items-start mb-2"><h4 className="font-bold text-sm">Broken Leg (Surgery)</h4><span className="text-[#13c8ec] font-bold">$2,371</span></div><p className="text-xs text-slate-600 dark:text-slate-400">X-rays, anesthesia, surgical repair, pain meds, follow-up</p></div>
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800"><div className="flex justify-between items-start mb-2"><h4 className="font-bold text-sm">Foreign Body Removal</h4><span className="text-[#13c8ec] font-bold">$2,900 - $3,265</span></div><p className="text-xs text-slate-600 dark:text-slate-400">Diagnostics, endoscopy or surgery, overnight stay</p></div>
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800"><div className="flex justify-between items-start mb-2"><h4 className="font-bold text-sm">Poisoning Treatment</h4><span className="text-[#13c8ec] font-bold">$500 - $2,500</span></div><p className="text-xs text-slate-600 dark:text-slate-400">Decontamination, IV fluids, monitoring (12-24 hours)</p></div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="px-4 pt-8"><h3 className="text-lg font-bold leading-tight tracking-tight pb-4">Payment & Assistance Options</h3><div className="space-y-4"><div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700"><div className="flex-shrink-0 size-12 rounded-lg bg-[#13c8ec]/20 flex items-center justify-center text-[#13c8ec]" aria-hidden="true"><span className="material-symbols-outlined">health_and_safety</span></div><div className="flex-1"><h4 className="font-bold text-sm">Pet Insurance</h4><p className="text-xs text-slate-600 dark:text-slate-400">Most plans reimburse 70-90% of emergency costs</p></div><span className="material-symbols-outlined text-slate-400" aria-hidden="true">chevron_right</span></div><div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700"><div className="flex-shrink-0 size-12 rounded-lg bg-green-500/20 flex items-center justify-center text-green-500" aria-hidden="true"><span className="material-symbols-outlined">payments</span></div><div className="flex-1"><h4 className="font-bold text-sm">CareCredit & Scratchpay</h4><p className="text-xs text-slate-600 dark:text-slate-400">0% interest financing for 6-24 months</p></div><span className="material-symbols-outlined text-slate-400" aria-hidden="true">chevron_right</span></div><div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700"><div className="flex-shrink-0 size-12 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-500" aria-hidden="true"><span className="material-symbols-outlined">volunteer_activism</span></div><div className="flex-1"><h4 className="font-bold text-sm">Emergency Assistance Programs</h4><p className="text-xs text-slate-600 dark:text-slate-400">RedRover Relief, Paw Fund, Brown Dog Foundation</p></div><span className="material-symbols-outlined text-slate-400" aria-hidden="true">chevron_right</span></div></div></div>

        {/* Money-Saving Tips */}
        <div className="mx-4 mt-8 p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-l-4 border-[#13c8ec]"><div className="flex gap-3"><span className="material-symbols-outlined text-[#13c8ec]" aria-hidden="true">lightbulb</span><div><h4 className="font-bold text-sm">Money-Saving Tips</h4><ul className="text-xs text-slate-700 dark:text-slate-300 leading-normal mt-2 space-y-1"><li>• <strong>Always ask for a written estimate</strong> before treatment begins</li><li>• <strong>Request itemized bills</strong> to understand each charge</li><li>• <strong>Ask about payment plans</strong> if offered by the clinic</li><li>• <strong>Consider pet insurance early</strong> - most don't cover pre-existing conditions</li><li>• <strong>Call ahead</strong> to verify costs when possible</li></ul></div></div></div>

        {/* Important Note */}
        <div className="mx-4 mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800" role="note"><p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed"><strong>⚠️ Important:</strong> Most emergency vets require payment in full at time of service. Credit cards, CareCredit, and pet insurance claims (reimbursement) are typically accepted. Some clinics offer payment plans - ask before treatment begins.</p></div>
      </main>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-[#101f22]/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-8 z-50"><div className="max-w-md mx-auto"><Link href="/locations/ny/westchester" className="w-full bg-[#13c8ec] hover:bg-[#13c8ec]/90 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#13c8ec]"><span className="material-symbols-outlined" aria-hidden="true">location_on</span>Find Nearest Emergency Vet</Link></div></div>
    </div>
  )
}
