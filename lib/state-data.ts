export const stateNameByAbbr: Record<string, string> = {
  AL: 'Alabama',
  AR: 'Arkansas',
  CA: 'California',
  CT: 'Connecticut',
  FL: 'Florida',
  GA: 'Georgia',
  IA: 'Iowa',
  IL: 'Illinois',
  LA: 'Louisiana',
  MD: 'Maryland',
  ME: 'Maine',
  MI: 'Michigan',
  MN: 'Minnesota',
  MO: 'Missouri',
  MS: 'Mississippi',
  NC: 'North Carolina',
  NE: 'Nebraska',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NY: 'New York',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  SC: 'South Carolina',
  TN: 'Tennessee',
  TX: 'Texas',
  VA: 'Virginia',
  VT: 'Vermont',
  WI: 'Wisconsin',
  WV: 'West Virginia',
}

export const stateSlugByAbbr: Record<string, string> = {
  AL: 'alabama',
  AR: 'arkansas',
  CA: 'california',
  CT: 'connecticut',
  FL: 'florida',
  GA: 'georgia',
  IA: 'iowa',
  IL: 'illinois',
  LA: 'louisiana',
  MD: 'maryland',
  ME: 'maine',
  MI: 'michigan',
  MN: 'minnesota',
  MO: 'missouri',
  MS: 'mississippi',
  NC: 'north-carolina',
  NE: 'nebraska',
  NH: 'new-hampshire',
  NJ: 'new-jersey',
  NY: 'new-york',
  OK: 'oklahoma',
  OR: 'oregon',
  PA: 'pennsylvania',
  SC: 'south-carolina',
  TN: 'tennessee',
  TX: 'texas',
  VA: 'virginia',
  VT: 'vermont',
  WI: 'wisconsin',
  WV: 'west-virginia',
}

export const stateAbbrBySlug: Record<string, string> = Object.entries(stateSlugByAbbr)
  .reduce((acc, [abbr, slug]) => {
    acc[slug] = abbr
    return acc
  }, {} as Record<string, string>)

export const stateNameBySlug: Record<string, string> = Object.entries(stateSlugByAbbr)
  .reduce((acc, [abbr, slug]) => {
    acc[slug] = stateNameByAbbr[abbr] || slug
    return acc
  }, {} as Record<string, string>)
