const stateAbbrByName = {
  Alabama: 'AL', Alaska: 'AK', Arizona: 'AZ', Arkansas: 'AR', California: 'CA', Colorado: 'CO',
  Connecticut: 'CT', Delaware: 'DE', Florida: 'FL', Georgia: 'GA', Hawaii: 'HI', Idaho: 'ID',
  Illinois: 'IL', Indiana: 'IN', Iowa: 'IA', Kansas: 'KS', Kentucky: 'KY', Louisiana: 'LA',
  Maine: 'ME', Maryland: 'MD', Massachusetts: 'MA', Michigan: 'MI', Minnesota: 'MN', Mississippi: 'MS',
  Missouri: 'MO', Montana: 'MT', Nebraska: 'NE', Nevada: 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
  'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', Ohio: 'OH',
  Oklahoma: 'OK', Oregon: 'OR', Pennsylvania: 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', Tennessee: 'TN', Texas: 'TX', Utah: 'UT', Vermont: 'VT', Virginia: 'VA',
  Washington: 'WA', 'West Virginia': 'WV', Wisconsin: 'WI', Wyoming: 'WY',
}

const stateAbbrs = Object.values(stateAbbrByName)
const stateNames = Object.keys(stateAbbrByName)

function extractLocation(keyword) {
  const normalized = keyword.replace(/\s+/g, ' ').trim()

  const abbrMatch = normalized.match(new RegExp(`([A-Za-z .'-]+?)[, ]+(${stateAbbrs.join('|')})$`, 'i'))
  if (abbrMatch) {
    const city = cleanCity(abbrMatch[1].trim())
    if (isGenericCity(city)) return null
    return { city, state: abbrMatch[2].toUpperCase() }
  }

  const inMatch = normalized.match(/(?:in|near|around)\s+([A-Za-z .'-]+?)[, ]+([A-Za-z]{2})\b/i)
  if (inMatch && stateAbbrs.includes(inMatch[2].toUpperCase())) {
    const city = cleanCity(inMatch[1].trim())
    if (isGenericCity(city)) return null
    return { city, state: inMatch[2].toUpperCase() }
  }

  for (const stateName of stateNames) {
    const regex = new RegExp(`([A-Za-z .'-]+)\\s+${stateName}$`, 'i')
    const match = normalized.match(regex)
    if (match) {
      const city = cleanCity(match[1].trim())
      if (isGenericCity(city)) return null
      return { city, state: stateAbbrByName[stateName] }
    }
  }

  return null
}

function cleanCity(raw) {
  let cleaned = raw
  let lower = cleaned.toLowerCase()
  const prefixes = [
    'emergency vet in ',
    'emergency vet ',
    'emergency veterinarian in ',
    'emergency veterinarian ',
    'emergency veterinary in ',
    'emergency veterinary ',
    'emergency animal hospital in ',
    'emergency animal hospital ',
    'emergency animal clinic in ',
    'emergency animal clinic ',
    'emergency vet clinic in ',
    'emergency vet clinic ',
    '24 hour emergency vet in ',
    '24 hour emergency vet ',
    '24 hour vet in ',
    '24 hour vet ',
    'urgent care vet in ',
    'urgent care vet ',
    'low cost emergency vet in ',
    'low cost emergency vet ',
    'best emergency vet in ',
    'best emergency vet ',
    'affordable emergency vet in ',
    'affordable emergency vet ',
    'hour emergency vet in ',
    'hour emergency vet ',
  ]

  for (const prefix of prefixes) {
    if (lower.startsWith(prefix)) {
      cleaned = cleaned.slice(prefix.length)
      break
    }
  }

  cleaned = cleaned.replace(/^(in|near|around)\s+/i, '')
  cleaned = cleaned.replace(/\s+/g, ' ').trim()
  return cleaned
}

function isGenericCity(value) {
  if (!value) return true
  const lower = value.toLowerCase()
  if (lower === 'emergency vet' || lower === 'emergency vets') return true
  if (lower.includes('near me')) return true
  if (lower.includes('vet ') || lower.includes('veterinary') || lower.includes('animal hospital') || lower.includes('animal clinic')) {
    return true
  }
  return false
}

module.exports = { extractLocation, stateAbbrByName }
