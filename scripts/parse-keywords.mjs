import fs from 'fs'
import path from 'path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { extractLocation, stateAbbrByName } = require('./parse-keywords.utils.cjs')

const inputPath = process.argv[2]
if (!inputPath) {
  console.error('Usage: node scripts/parse-keywords.mjs <path-to-csv>')
  process.exit(1)
}

const outputDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

const csvContent = fs.readFileSync(inputPath, 'utf8')
const records = parseCsv(csvContent)


const grouped = {}
const cityRows = []

for (const row of records) {
  const keyword = row.keyword || row.Keyword || row.KEYWORD
  if (!keyword) continue
  const location = extractLocation(keyword)
  if (!location) continue

  const state = location.state
  if (!grouped[state]) grouped[state] = {}
  if (!grouped[state][location.city]) grouped[state][location.city] = []

  grouped[state][location.city].push({
    keyword,
    volume: row.volume || row.Volume || row['Monthly Volume'] || null,
    kd: row.kd || row.KD || row['Keyword Difficulty'] || null,
    intent: row.intent || row.Intent || null,
    cpc: row.cpc || row.CPC || null,
  })

  cityRows.push({ city: location.city, state })
}

fs.writeFileSync(
  path.join(outputDir, 'keywords-by-state.json'),
  JSON.stringify(grouped, null, 2)
)

const uniqueCities = Array.from(new Set(cityRows.map(item => `${item.city}::${item.state}`)))
const citySql = uniqueCities
  .map(item => {
    const [city, state] = item.split('::')
    const slug = city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    return `('${city.replace(/'/g, "''")}', '${state}', '${slug}', 0)`
  })
  .join(',\n')

fs.writeFileSync(
  path.join(outputDir, 'keyword-cities.sql'),
  `INSERT INTO cities (name, state, slug, clinic_count) VALUES\n${citySql}\nON CONFLICT (slug) DO NOTHING;`
)

const reportLines = ['# Keyword Grouping Report', '']
for (const state of Object.keys(grouped).sort()) {
  reportLines.push(`## ${state}`)
  const cities = Object.keys(grouped[state]).sort()
  for (const city of cities) {
    reportLines.push(`- ${city} (${grouped[state][city].length} keywords)`)
  }
  reportLines.push('')
}

fs.writeFileSync(path.join(outputDir, 'keyword-report.md'), reportLines.join('\n'))

console.log('Wrote data/keywords-by-state.json, data/keyword-cities.sql, data/keyword-report.md')

function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    const next = text[i + 1]

    if (char === '"' && inQuotes && next === '"') {
      field += '"'
      i += 1
      continue
    }

    if (char === '"') {
      inQuotes = !inQuotes
      continue
    }

    if (char === ',' && !inQuotes) {
      row.push(field)
      field = ''
      continue
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (field.length > 0 || row.length > 0) {
        row.push(field)
        rows.push(row)
        row = []
        field = ''
      }
      continue
    }

    field += char
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  if (rows.length === 0) return []
  const headers = rows[0].map(h => h.trim())
  return rows.slice(1).map(values => {
    const record = {}
    headers.forEach((header, index) => {
      record[header] = values[index] ?? ''
    })
    return record
  })
}
