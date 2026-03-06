/**
 * test-clinic-status.ts
 * 
 * Quick local test to verify computeClinicStatus logic
 * against your actual clinic hours data before deploying.
 * 
 * Run with: npx ts-node scripts/test-clinic-status.ts
 * Or:       npx tsx scripts/test-clinic-status.ts
 */

import { computeClinicStatus, HoursDetail } from '../lib/clinic-status'

const testClinics: Array<{
  name: string
  slug: string
  is_24_7: boolean
  hours_detail: HoursDetail | null
  availability_type: string | null
  hours_description: string | null
  state: string
}> = [
  {
    name: 'Urgent Pet Care Millard (Mon–Sat 8am–midnight, Sun 8am–10pm)',
    slug: 'urgent-pet-care-millard-omaha',
    is_24_7: false,
    hours_detail: {
      monday:    { open: '08:00', close: '00:00', overnight: true },
      tuesday:   { open: '08:00', close: '00:00', overnight: true },
      wednesday: { open: '08:00', close: '00:00', overnight: true },
      thursday:  { open: '08:00', close: '00:00', overnight: true },
      friday:    { open: '08:00', close: '00:00', overnight: true },
      saturday:  { open: '08:00', close: '00:00', overnight: true },
      sunday:    { open: '08:00', close: '22:00', overnight: false },
    },
    availability_type: 'urgent-care',
    hours_description: 'Mon–Sat 8am–12am · Sun 8am–10pm',
    state: 'NE',
  },
  {
    name: 'EVC Springfield (Mon–Fri 6pm–8am, Sat–Sun 24hr)',
    slug: 'evc-springfield-mo',
    is_24_7: false,
    hours_detail: {
      monday:    { open: '18:00', close: '08:00', overnight: true },
      tuesday:   { open: '18:00', close: '08:00', overnight: true },
      wednesday: { open: '18:00', close: '08:00', overnight: true },
      thursday:  { open: '18:00', close: '08:00', overnight: true },
      friday:    { open: '18:00', close: '08:00', overnight: true },
      saturday:  '24hr',
      sunday:    '24hr',
    },
    availability_type: 'emergency-only',
    hours_description: 'Mon–Fri 6pm–8am · Sat–Sun 24hrs',
    state: 'MO',
  },
  {
    name: 'UrgentVet Carytown (Mon–Fri 3pm–11pm, Sat–Sun 10am–8pm)',
    slug: 'urgentvet-carytown-va',
    is_24_7: false,
    hours_detail: {
      monday:    { open: '15:00', close: '23:00', overnight: false },
      tuesday:   { open: '15:00', close: '23:00', overnight: false },
      wednesday: { open: '15:00', close: '23:00', overnight: false },
      thursday:  { open: '15:00', close: '23:00', overnight: false },
      friday:    { open: '15:00', close: '23:00', overnight: false },
      saturday:  { open: '10:00', close: '20:00', overnight: false },
      sunday:    { open: '10:00', close: '20:00', overnight: false },
    },
    availability_type: 'urgent-care',
    hours_description: 'Mon–Fri 3pm–11pm · Sat–Sun 10am–8pm',
    state: 'VA',
  },
  {
    name: 'Glenstone Vet Springfield (Mon–Fri 8am–5pm only)',
    slug: 'glenstone-vet-springfield',
    is_24_7: false,
    hours_detail: {
      monday:    { open: '08:00', close: '17:00', overnight: false },
      tuesday:   { open: '08:00', close: '17:00', overnight: false },
      wednesday: { open: '08:00', close: '17:00', overnight: false },
      thursday:  { open: '08:00', close: '17:00', overnight: false },
      friday:    { open: '08:00', close: '17:00', overnight: false },
      saturday:  'closed',
      sunday:    'closed',
    },
    availability_type: 'emergency-only',
    hours_description: 'Mon–Fri 8am–5pm',
    state: 'MO',
  },
  {
    name: 'No hours data (call-for-hours fallback test)',
    slug: 'test-no-hours',
    is_24_7: false,
    hours_detail: null,
    availability_type: 'extended-hours',
    hours_description: 'Call to confirm hours',
    state: 'NY',
  },
]

console.log('='.repeat(70))
console.log('CLINIC STATUS TEST — Current time in each clinic timezone')
console.log('='.repeat(70))
console.log()

for (const clinic of testClinics) {
  const result = computeClinicStatus(
    clinic.is_24_7,
    clinic.hours_detail,
    clinic.availability_type,
    clinic.hours_description,
    clinic.state,
    null,
  )

  const statusIcon = {
    'open-24-7': '🟢',
    'open-now': '🟢',
    'closing-soon': '🟡',
    'closed': '🔴',
    'call-for-hours': '⚫',
  }[result.status] ?? '❓'

  console.log(`${statusIcon} ${clinic.name}`)
  console.log(`   Status: ${result.label} (${result.status})`)
  console.log(`   Hours:  ${result.hoursText}`)
  console.log(`   Color:  ${result.color}`)
  console.log()
}

console.log('='.repeat(70))
console.log('If statuses look wrong for the current time, check the overnight')
console.log('logic in lib/clinic-status.ts -> checkDayHours()')
console.log('='.repeat(70))
