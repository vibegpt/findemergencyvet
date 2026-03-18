/**
 * clinic-status.ts
 *
 * Server-side utility to compute a clinic's open/closed status from
 * structured hours_detail JSON + timezone. Falls back gracefully when
 * structured hours are not yet populated.
 *
 * Called at ISR render time (city pages revalidate hourly).
 * Never runs client-side — no JavaScript required to show status.
 */

export type ClinicStatus =
  | 'open-24-7'        // is_24_7 = true
  | 'open-now'         // computed from hours_detail, currently open
  | 'closing-soon'     // open but closes within 60 minutes
  | 'closed'           // computed from hours_detail, currently closed
  | 'call-for-hours'   // no structured hours — honest fallback

export interface ComputedStatus {
  status: ClinicStatus
  label: string
  color: 'green' | 'amber' | 'red' | 'gray'
  hoursText: string   // human-readable hours for this clinic
}

// Structured hours shape stored in hours_detail JSONB column
// Each day is either "24hr", "closed", or { open: "18:00", close: "08:00", overnight: boolean }
export interface DayHours {
  open: string    // "HH:MM" 24-hour format
  close: string   // "HH:MM" 24-hour format — may be next day if overnight
  overnight: boolean
}

export type DayValue = DayHours | '24hr' | 'closed'

export interface HoursDetail {
  monday:    DayValue
  tuesday:   DayValue
  wednesday: DayValue
  thursday:  DayValue
  friday:    DayValue
  saturday:  DayValue
  sunday:    DayValue
  notes?: string
}

const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const

// US state → IANA timezone (covers all 50 states, uses primary timezone for split states)
export const STATE_TIMEZONES: Record<string, string> = {
  AL: 'America/Chicago',   AK: 'America/Anchorage', AZ: 'America/Phoenix',
  AR: 'America/Chicago',   CA: 'America/Los_Angeles', CO: 'America/Denver',
  CT: 'America/New_York',  DE: 'America/New_York',  FL: 'America/New_York',
  GA: 'America/New_York',  HI: 'Pacific/Honolulu',  ID: 'America/Denver',
  IL: 'America/Chicago',   IN: 'America/Indiana/Indianapolis', IA: 'America/Chicago',
  KS: 'America/Chicago',   KY: 'America/New_York',  LA: 'America/Chicago',
  ME: 'America/New_York',  MD: 'America/New_York',  MA: 'America/New_York',
  MI: 'America/Detroit',   MN: 'America/Chicago',   MS: 'America/Chicago',
  MO: 'America/Chicago',   MT: 'America/Denver',    NE: 'America/Chicago',
  NV: 'America/Los_Angeles', NH: 'America/New_York', NJ: 'America/New_York',
  NM: 'America/Denver',    NY: 'America/New_York',  NC: 'America/New_York',
  ND: 'America/Chicago',   OH: 'America/New_York',  OK: 'America/Chicago',
  OR: 'America/Los_Angeles', PA: 'America/New_York', RI: 'America/New_York',
  SC: 'America/New_York',  SD: 'America/Chicago',   TN: 'America/Chicago',
  TX: 'America/Chicago',   UT: 'America/Denver',    VT: 'America/New_York',
  VA: 'America/New_York',  WA: 'America/Los_Angeles', WV: 'America/New_York',
  WI: 'America/Chicago',   WY: 'America/Denver',    DC: 'America/New_York',
}

/**
 * Parse "HH:MM" string to total minutes since midnight
 */
function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

/**
 * Get current time in minutes since midnight for a given timezone
 */
function getCurrentMinutes(timezone: string): { minutes: number; dayIndex: number } {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    weekday: 'short',
  })
  const parts = formatter.formatToParts(now)
  const hour = parseInt(parts.find(p => p.type === 'hour')?.value ?? '0')
  const minute = parseInt(parts.find(p => p.type === 'minute')?.value ?? '0')
  const weekday = parts.find(p => p.type === 'weekday')?.value ?? 'Sun'

  const weekdayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6
  }

  return {
    minutes: hour * 60 + minute,
    dayIndex: weekdayMap[weekday] ?? 0,
  }
}

/**
 * Check if current time falls within open hours for a day
 * Returns: 'open' | 'closing-soon' | 'closed'
 */
function checkDayHours(
  dayHours: DayHours,
  currentMinutes: number
): 'open' | 'closing-soon' | 'closed' {
  const openMinutes = timeToMinutes(dayHours.open)
  let closeMinutes = timeToMinutes(dayHours.close)

  // Handle overnight: e.g. open 18:00, close 08:00 next day
  if (dayHours.overnight || closeMinutes <= openMinutes) {
    closeMinutes += 24 * 60 // add 24 hours
  }

  if (currentMinutes < openMinutes || currentMinutes >= closeMinutes) {
    // Check if we're in the overnight window from previous day
    // e.g. it's 02:00 and close is 08:00 (yesterday opened at 18:00)
    if (dayHours.overnight && currentMinutes + 24 * 60 < closeMinutes) {
      const minutesUntilClose = closeMinutes - (currentMinutes + 24 * 60)
      return minutesUntilClose <= 60 ? 'closing-soon' : 'open'
    }
    return 'closed'
  }

  const minutesUntilClose = closeMinutes - currentMinutes
  return minutesUntilClose <= 60 ? 'closing-soon' : 'open'
}

/**
 * Main export: compute clinic status from DB fields
 *
 * @param is_24_7 - from clinics.is_24_7
 * @param hours_detail - from clinics.hours_detail (JSONB), may be null
 * @param availability_type - from clinics.availability_type
 * @param hours_description - from clinics.hours_description (text fallback)
 * @param state - clinic state abbreviation (e.g. "NY") for timezone lookup
 * @param timezone - explicit IANA timezone override (optional)
 */
export function computeClinicStatus(
  is_24_7: boolean,
  hours_detail: HoursDetail | null,
  availability_type: string | null,
  hours_description: string | null,
  state: string,
  timezone?: string | null
): ComputedStatus {

  // Tier 1: True 24/7 — always open
  if (is_24_7) {
    return {
      status: 'open-24-7',
      label: 'Open 24/7',
      color: 'green',
      hoursText: 'Open 24 hours, 7 days a week',
    }
  }

  // Tier 2: Structured hours available — compute dynamically
  if (hours_detail) {
    const tz = timezone || STATE_TIMEZONES[state.toUpperCase()] || 'America/New_York'
    const { minutes, dayIndex } = getCurrentMinutes(tz)
    const dayKey = DAY_KEYS[dayIndex]
    const todayHours = hours_detail[dayKey]

    if (todayHours === '24hr') {
      return {
        status: 'open-now',
        label: 'Open Now',
        color: 'green',
        hoursText: 'Open 24 hours today',
      }
    }

    if (todayHours === 'closed') {
      // Check if yesterday was overnight and we're still in that window
      const yesterdayKey = DAY_KEYS[(dayIndex + 6) % 7]
      const yesterdayHours = hours_detail[yesterdayKey]
      if (yesterdayHours !== '24hr' && yesterdayHours !== 'closed' && yesterdayHours.overnight) {
        const result = checkDayHours(yesterdayHours, minutes)
        if (result !== 'closed') {
          return {
            status: result === 'closing-soon' ? 'closing-soon' : 'open-now',
            label: result === 'closing-soon' ? 'Closing Soon' : 'Open Now',
            color: result === 'closing-soon' ? 'amber' : 'green',
            hoursText: hours_description || 'After-hours emergency care',
          }
        }
      }
      return {
        status: 'closed',
        label: 'Closed Today',
        color: 'red',
        hoursText: hours_description || 'Closed today',
      }
    }

    // DayHours object
    const result = checkDayHours(todayHours, minutes)

    // Also check if yesterday was overnight and we're still in that window
    if (result === 'closed') {
      const yesterdayKey = DAY_KEYS[(dayIndex + 6) % 7]
      const yesterdayHours = hours_detail[yesterdayKey]
      if (yesterdayHours !== '24hr' && yesterdayHours !== 'closed' && yesterdayHours.overnight) {
        const overnightResult = checkDayHours(yesterdayHours, minutes)
        if (overnightResult !== 'closed') {
          return {
            status: overnightResult === 'closing-soon' ? 'closing-soon' : 'open-now',
            label: overnightResult === 'closing-soon' ? 'Closing Soon' : 'Open Now',
            color: overnightResult === 'closing-soon' ? 'amber' : 'green',
            hoursText: `${todayHours.open}–${todayHours.close}`,
          }
        }
      }
    }

    const openTime = todayHours.open
    const closeTime = todayHours.close
    const hoursText = `Today: ${formatTime(openTime)}–${formatTime(closeTime)}`

    return {
      status: result === 'closing-soon' ? 'closing-soon' : result === 'open' ? 'open-now' : 'closed',
      label: result === 'closing-soon' ? 'Closing Soon' : result === 'open' ? 'Open Now' : 'Closed',
      color: result === 'closing-soon' ? 'amber' : result === 'open' ? 'green' : 'red',
      hoursText,
    }
  }

  // Tier 3: No structured hours — honest fallback
  const availabilityLabel: Record<string, string> = {
    'on-call-24-7': 'On-call 24/7',
    'extended-hours': 'Extended Hours',
    'emergency-only': 'After-Hours Emergency',
    'urgent-care': 'Urgent Care',
  }

  return {
    status: 'call-for-hours',
    label: availabilityLabel[availability_type ?? ''] || 'Call for Hours',
    color: 'gray',
    hoursText: hours_description || 'Call to confirm availability',
  }
}

/**
 * Format "HH:MM" to "6:00 PM"
 */
function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return m === 0 ? `${hour} ${period}` : `${hour}:${m.toString().padStart(2, '0')} ${period}`
}
