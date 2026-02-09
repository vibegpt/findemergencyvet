import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const DEFAULT_RADIUS_MILES = 50

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const latParam = searchParams.get('lat')
  const lngParam = searchParams.get('lng')
  const radiusParam = searchParams.get('radius')

  if (!latParam || !lngParam) {
    return NextResponse.json({ error: 'Missing lat/lng' }, { status: 400 })
  }

  const latitude = Number(latParam)
  const longitude = Number(lngParam)
  const radius = radiusParam ? Number(radiusParam) : DEFAULT_RADIUS_MILES

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return NextResponse.json({ error: 'Invalid lat/lng' }, { status: 400 })
  }

  const latDelta = radius / 69
  const lngDelta = radius / (Math.cos((Math.PI / 180) * latitude) * 69)

  const minLat = latitude - latDelta
  const maxLat = latitude + latDelta
  const minLng = longitude - lngDelta
  const maxLng = longitude + lngDelta

  const { data: clinics, error } = await supabase
    .from('clinics')
    .select('id, slug, name, phone, address, city, state, latitude, longitude, is_24_7, availability_type, current_status')
    .eq('is_active', true)
    .gte('latitude', minLat)
    .lte('latitude', maxLat)
    .gte('longitude', minLng)
    .lte('longitude', maxLng)
    .limit(40)

  if (error) {
    return NextResponse.json({ error: 'Query failed' }, { status: 500 })
  }

  return NextResponse.json(clinics || [])
}
