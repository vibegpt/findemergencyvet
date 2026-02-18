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
    <div className="min-h-screen bg-[#FAFAFA] text-[#1D1D1F]">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#1D1D1F] focus:text-white focus:rounded-lg">Skip to cost calculator</a>

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

      <main id="main-content" className="max-w-3xl mx-auto pb-32 pt-[60px]">
        <div className="px-5 pt-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[13px] text-[#86868B] mb-6">
            <Link href="/" className="hover:text-[#1D1D1F] transition-colors">Home</Link>
            <span>&rsaquo;</span>
            <span className="text-[#1D1D1F] font-medium">Cost Guide</span>
          </div>

          <h1 className="text-[32px] md:text-[40px] font-bold tracking-[-0.03em] text-[#1D1D1F] pb-3">How Much Does An Emergency Vet Cost?</h1>
          <p className="text-[#6E6E73] text-base font-normal leading-relaxed pb-3">Emergency care is unpredictable, but your bill shouldn&apos;t be. Use this guide to prepare for potential costs and find financial support.</p>
        </div>

        {/* Cost Estimator */}
        <div className="px-5 py-4 mt-2">
          <div className="bg-[#F5F5F7] border border-[#E8E8ED] rounded-2xl p-5">
            <h3 className="text-lg font-bold leading-tight tracking-tight text-[#1D1D1F] pb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#86868B" width="22" height="22" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" /></svg>
              Cost Estimator
            </h3>
            <div className="flex flex-col gap-4">
              <label htmlFor="scenario-select" className="flex flex-col">
                <span className="text-sm font-medium pb-2 text-[#6E6E73]">Select Emergency Scenario</span>
                <div className="relative">
                  <select id="scenario-select" value={selectedScenario.id} onChange={(e) => setSelectedScenario(scenarios.find(s => s.id === e.target.value) || scenarios[0])} className="w-full rounded-xl border border-[#E8E8ED] bg-white text-[#1D1D1F] h-14 px-4 pr-10 appearance-none focus:ring-2 focus:ring-[#1D1D1F] focus:border-[#1D1D1F] transition-all">
                    {scenarios.map(scenario => (<option key={scenario.id} value={scenario.id}>{scenario.name}</option>))}
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#86868B" width="18" height="18" className="absolute right-3 top-4 pointer-events-none" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" /></svg>
                </div>
              </label>
              <div className="flex items-center justify-between pt-2" aria-live="polite">
                <span className="text-sm text-[#6E6E73]">Estimated Range:</span>
                <span className="text-xl font-bold text-[#1D1D1F]">${selectedScenario.minCost.toLocaleString()} - ${selectedScenario.maxCost.toLocaleString()}</span>
              </div>
              <p className="text-xs text-[#6E6E73]">{selectedScenario.description}</p>
            </div>
          </div>
        </div>

        {/* Service Fees Table */}
        <div className="px-5 pt-6">
          <h3 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] pb-4">Common Service Fees</h3>
          <div className="overflow-hidden rounded-2xl border border-[#E8E8ED] bg-white">
            <table className="w-full text-left border-collapse">
              <caption className="sr-only">Common emergency vet service fees with price ranges</caption>
              <thead>
                <tr className="bg-[#F5F5F7]">
                  <th scope="col" className="p-4 text-xs font-bold uppercase tracking-wider text-[#86868B]">Service</th>
                  <th scope="col" className="p-4 text-xs font-bold uppercase tracking-wider text-[#86868B] text-right">Low</th>
                  <th scope="col" className="p-4 text-xs font-bold uppercase tracking-wider text-[#86868B] text-right">High</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8ED]">
                <tr><td className="p-4 text-sm font-medium text-[#1D1D1F]">Emergency Exam</td><td className="p-4 text-sm text-right text-[#6E6E73]">$96</td><td className="p-4 text-sm text-right text-[#6E6E73]">$236</td></tr>
                <tr><td className="p-4 text-sm font-medium text-[#1D1D1F]">Diagnostic X-Rays</td><td className="p-4 text-sm text-right text-[#6E6E73]">$150</td><td className="p-4 text-sm text-right text-[#6E6E73]">$250</td></tr>
                <tr><td className="p-4 text-sm font-medium text-[#1D1D1F]">Blood Work (STAT)</td><td className="p-4 text-sm text-right text-[#6E6E73]">$80</td><td className="p-4 text-sm text-right text-[#6E6E73]">$200</td></tr>
                <tr><td className="p-4 text-sm font-medium text-[#1D1D1F]">Ultrasound</td><td className="p-4 text-sm text-right text-[#6E6E73]">$300</td><td className="p-4 text-sm text-right text-[#6E6E73]">$600</td></tr>
                <tr><td className="p-4 text-sm font-medium text-[#1D1D1F]">IV Fluids &amp; Monitoring</td><td className="p-4 text-sm text-right text-[#6E6E73]">$200</td><td className="p-4 text-sm text-right text-[#6E6E73]">$500</td></tr>
                <tr><td className="p-4 text-sm font-medium text-[#1D1D1F]">Hospitalization (per night)</td><td className="p-4 text-sm text-right text-[#6E6E73]">$222</td><td className="p-4 text-sm text-right text-[#6E6E73]">$567</td></tr>
                <tr><td className="p-4 text-sm font-medium text-[#1D1D1F]">Emergency Surgery</td><td className="p-4 text-sm text-right font-semibold text-[#1D1D1F]">$2,000</td><td className="p-4 text-sm text-right font-semibold text-[#1D1D1F]">$5,000+</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#86868B] pt-3 italic">Prices based on 2024-2025 national averages (AVMA, CareCredit studies). Actual costs vary by location and clinic.</p>
        </div>

        {/* Real Cost Examples */}
        <div className="px-5 pt-6">
          <h3 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] pb-4">Real Cost Examples</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-4 border border-[#E8E8ED]"><div className="flex justify-between items-start mb-2"><h4 className="font-bold text-sm text-[#1D1D1F]">Broken Leg (Surgery)</h4><span className="text-[#1D1D1F] font-semibold">$2,371</span></div><p className="text-xs text-[#6E6E73]">X-rays, anesthesia, surgical repair, pain meds, follow-up</p></div>
            <div className="bg-white rounded-2xl p-4 border border-[#E8E8ED]"><div className="flex justify-between items-start mb-2"><h4 className="font-bold text-sm text-[#1D1D1F]">Foreign Body Removal</h4><span className="text-[#1D1D1F] font-semibold">$2,900 - $3,265</span></div><p className="text-xs text-[#6E6E73]">Diagnostics, endoscopy or surgery, overnight stay</p></div>
            <div className="bg-white rounded-2xl p-4 border border-[#E8E8ED]"><div className="flex justify-between items-start mb-2"><h4 className="font-bold text-sm text-[#1D1D1F]">Poisoning Treatment</h4><span className="text-[#1D1D1F] font-semibold">$500 - $2,500</span></div><p className="text-xs text-[#6E6E73]">Decontamination, IV fluids, monitoring (12-24 hours)</p></div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="px-5 pt-8">
          <h3 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] pb-4">Payment &amp; Assistance Options</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-[#E8E8ED]">
              <div className="flex-shrink-0 size-12 rounded-lg bg-[#F5F5F7] flex items-center justify-center" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#86868B" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-[#1D1D1F]">Pet Insurance</h4>
                <p className="text-xs text-[#6E6E73]">Most plans reimburse 70-90% of emergency costs</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-[#E8E8ED]">
              <div className="flex-shrink-0 size-12 rounded-lg bg-[#F5F5F7] flex items-center justify-center" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#86868B" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-[#1D1D1F]">CareCredit &amp; Scratchpay</h4>
                <p className="text-xs text-[#6E6E73]">0% interest financing for 6-24 months</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-[#E8E8ED]">
              <div className="flex-shrink-0 size-12 rounded-lg bg-[#F5F5F7] flex items-center justify-center" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#86868B" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-[#1D1D1F]">Emergency Assistance Programs</h4>
                <p className="text-xs text-[#6E6E73]">RedRover Relief, Paw Fund, Brown Dog Foundation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Money-Saving Tips */}
        <div className="mx-5 mt-8 p-4 rounded-xl bg-[#F5F5F7] border-l-4 border-[#1D1D1F]">
          <div className="flex gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#86868B" width="22" height="22" className="shrink-0 mt-0.5" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>
            <div>
              <h4 className="font-bold text-sm text-[#1D1D1F]">Money-Saving Tips</h4>
              <ul className="text-xs text-[#6E6E73] leading-normal mt-2 space-y-1">
                <li>- <strong>Always ask for a written estimate</strong> before treatment begins</li>
                <li>- <strong>Request itemized bills</strong> to understand each charge</li>
                <li>- <strong>Ask about payment plans</strong> if offered by the clinic</li>
                <li>- <strong>Consider pet insurance early</strong> - most don&apos;t cover pre-existing conditions</li>
                <li>- <strong>Call ahead</strong> to verify costs when possible</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div className="mx-5 mt-6 p-4 rounded-xl bg-[#FFF3E0] border border-[#FFE0B2]" role="note">
          <p className="text-xs text-[#1D1D1F] leading-relaxed"><strong>Important:</strong> Most emergency vets require payment in full at time of service. Credit cards, CareCredit, and pet insurance claims (reimbursement) are typically accepted. Some clinics offer payment plans - ask before treatment begins.</p>
        </div>
      </main>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#E8E8ED] pb-8 z-50">
        <div className="max-w-3xl mx-auto">
          <Link href="/locations/ny/westchester" className="w-full bg-[#1D1D1F] hover:bg-[#1D1D1F]/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#1D1D1F]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="20" height="20" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
            Find Nearest Emergency Vet
          </Link>
        </div>
      </div>

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
