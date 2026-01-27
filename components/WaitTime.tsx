'use client'

import { useState } from 'react'

type WaitTimeData = {
  minMinutes: number
  maxMinutes: number
  reportCount: number
  lastUpdated: string
}

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
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <span className="material-symbols-outlined text-lg" aria-hidden="true">schedule</span>
        <span>Wait time data not available</span>
        <button
          onClick={() => setShowReportForm(true)}
          className="text-[#137fec] hover:underline focus:outline-none focus:ring-2 focus:ring-[#137fec] rounded px-1"
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
        <span className="material-symbols-outlined text-[#137fec]" aria-hidden="true">schedule</span>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-[#0d141b] dark:text-white">
            Typical wait: {initialData.minMinutes}-{initialData.maxMinutes} minutes
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Based on {initialData.reportCount} recent reports
          </span>
        </div>
      </div>

      {/* Report Form */}
      {showReportForm && (
        <div className="mt-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700">
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
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1 mb-3">
            <span>0 min</span>
            <span className="font-bold text-[#137fec]">{waitTime} min</span>
            <span>3+ hours</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSubmitWaitTime}
              className="flex-1 px-4 py-2 bg-[#137fec] text-white text-sm font-semibold rounded-lg hover:bg-[#137fec]/90 focus:outline-none focus:ring-2 focus:ring-[#137fec]"
            >
              Submit
            </button>
            <button
              onClick={() => setShowReportForm(false)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
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
          className="text-xs text-[#137fec] hover:underline focus:outline-none focus:ring-2 focus:ring-[#137fec] rounded px-1"
        >
          Report your wait time
        </button>
      )}
    </div>
  )
}
