import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Clinic = {
  id: string
  name: string
  slug: string
  address: string
  city: string
  state: string
  zip_code: string | null
  phone: string
  website: string | null
  latitude: number | null
  longitude: number | null
  is_24_7: boolean
  availability_type: 'true-24-7' | 'on-call-24-7' | 'extended-hours' | 'emergency-only' | 'urgent-care' | null
  exotic_pets_accepted: string[]
  has_exotic_specialist: boolean
  services_offered: string[]
  has_surgery_suite: boolean
  has_icu: boolean
  has_specialists: boolean
  payment_methods: string[]
  accepts_care_credit: boolean
  accepts_pet_insurance: boolean
  cost_tier: 'budget' | 'moderate' | 'premium' | 'luxury' | 'unknown' | null
  parking_type: 'free-lot' | 'paid-lot' | 'street-only' | 'limited' | 'valet' | 'unknown' | null
  wheelchair_accessible: boolean
  current_status: 'confirmed-open' | 'likely-open' | 'call-to-confirm' | 'closed' | 'at-capacity' | 'unknown'
  google_rating: number | null
  google_review_count: number
  verification_status: 'verified' | 'unverified' | 'pending' | 'outdated'
  created_at: string
  updated_at: string
}

export type City = {
  id: string
  name: string
  state: string
  slug: string
  clinic_count: number
  created_at: string
  updated_at: string
}
