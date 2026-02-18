'use client'

import { useState } from 'react'

type WaitTimeData = {
  minMinutes: number
  maxMinutes: number
  reportCount: number
  lastUpdated: string
}

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

export function WaitTimeDisplay({ clinicId, initialData }: {
  clinicId: string
  initialData?: WaitTimeData
}) {
  const [showReportForm, setShowReportForm] = useState(false)
  const [waitTime, setWaitTime] = useState<number>(30)

  const handleSubmitWaitTime = async () => {
    // In production, this would POST to your API
    // For now, just show success message
    alert(`Thank you! Your wait time report helps other pet owners.`)
    setShowReportForm(false)
  }

  if (!initialData) {
    return (
      <div className="flex items-center gap-2 text-sm text-[#86868B]">
        <ClockIcon className="text-[#86868B]" />
        <span>Wait time data not available</span>
        <button
          onClick={() => setShowReportForm(true)}
          className="text-[#0071E3] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0071E3] rounded px-1"
        >
          Report wait time
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Display Current Wait Time */}
      <div className="flex items-center gap-2">
        <ClockIcon className="text-[#0071E3]" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-[#1D1D1F]">
            Typical wait: {initialData.minMinutes}-{initialData.maxMinutes} minutes
          </span>
          <span className="text-xs text-[#86868B]">
            Based on {initialData.reportCount} recent reports
          </span>
        </div>
      </div>

      {/* Report Form */}
      {showReportForm && (
        <div className="mt-3 p-3 bg-[#F5F5F7] rounded-lg border border-[#E8E8ED]">
          <label htmlFor={`wait-time-${clinicId}`} className="block text-sm font-medium mb-2">
            How long did you wait? (minutes)
          </label>
          <input
            id={`wait-time-${clinicId}`}
            type="range"
            min="0"
            max="180"
            step="15"
            value={waitTime}
            onChange={(e) => setWaitTime(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[#6E6E73] mt-1 mb-3">
            <span>0 min</span>
            <span className="font-bold text-[#0071E3]">{waitTime} min</span>
            <span>3+ hours</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSubmitWaitTime}
              className="flex-1 px-4 py-2 bg-[#0071E3] text-white text-sm font-semibold rounded-lg hover:bg-[#0071E3]/90 focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
            >
              Submit
            </button>
            <button
              onClick={() => setShowReportForm(false)}
              className="px-4 py-2 bg-[#E8E8ED] text-[#6E6E73] text-sm font-semibold rounded-lg hover:bg-[#D2D2D7] focus:outline-none focus:ring-2 focus:ring-[#86868B]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Report Button */}
      {!showReportForm && (
        <button
          onClick={() => setShowReportForm(true)}
          className="text-xs text-[#0071E3] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0071E3] rounded px-1"
        >
          Report your wait time
        </button>
      )}
    </div>
  )
}
