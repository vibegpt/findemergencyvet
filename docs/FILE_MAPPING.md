# File Mapping Guide

## Quick Reference: Which File Goes Where

### Core App Files
```
app-page-v3.tsx                           → app/page.tsx
app-page-v3-client.tsx                    → app/page-client.tsx
app-layout.tsx                            → app/layout.tsx
app-globals.css                           → app/globals.css
```

### Triage Page
```
app-triage-page-v3.tsx                    → app/triage/page.tsx
```

### Cost Guide
```
app-costs-page-v3.tsx                     → app/costs/page.tsx
```

### City/Location Pages
```
app-locations-state-city-page-v3.tsx           → app/locations/[state]/[city]/page.tsx
app-locations-state-city-page-v3-client.tsx    → app/locations/[state]/[city]/page-client.tsx
```

### Components
```
components-SharedSections.tsx             → components/SharedSections.tsx
components-FloatingCallButton.tsx         → components/FloatingCallButton.tsx
components-WaitTime.tsx                   → components/WaitTime.tsx
```

### Database/Types
```
lib-supabase.ts                          → lib/supabase.ts
```

### Database SQL (Run in Supabase)
```
supabase-complete-schema.sql             → Run in Supabase SQL editor
insert-28-clinics.sql                    → Run after schema
```

---

## Copy Commands (Mac/Linux)

```bash
# Navigate to your project
cd ~/findemergencyvet

# Create directories
mkdir -p app/triage app/costs app/locations/\[state\]/\[city\] components lib

# Copy files (from wherever you downloaded them)
cp ~/Downloads/app-page-v3.tsx app/page.tsx
cp ~/Downloads/app-page-v3-client.tsx app/page-client.tsx
cp ~/Downloads/app-layout.tsx app/layout.tsx
cp ~/Downloads/app-globals.css app/globals.css

cp ~/Downloads/app-triage-page-v3.tsx app/triage/page.tsx
cp ~/Downloads/app-costs-page-v3.tsx app/costs/page.tsx

cp ~/Downloads/app-locations-state-city-page-v3.tsx app/locations/\[state\]/\[city\]/page.tsx
cp ~/Downloads/app-locations-state-city-page-v3-client.tsx app/locations/\[state\]/\[city\]/page-client.tsx

cp ~/Downloads/components-SharedSections.tsx components/SharedSections.tsx
cp ~/Downloads/components-FloatingCallButton.tsx components/FloatingCallButton.tsx
cp ~/Downloads/components-WaitTime.tsx components/WaitTime.tsx

cp ~/Downloads/lib-supabase.ts lib/supabase.ts
```

---

## Import Path Updates Needed

After copying, update these import paths in the files:

### In app/page-client.tsx:
```tsx
import { WhyUsSection, FAQSection } from '@/components/SharedSections'
```

### In app/locations/[state]/[city]/page-client.tsx:
```tsx
import { FAQSection } from '@/components/SharedSections'
import { FloatingCallButton } from '@/components/FloatingCallButton'
import { WaitTimeDisplay } from '@/components/WaitTime'
```

### In all server components:
```tsx
import { supabase } from '@/lib/supabase'
```

---

## next.config.js Configuration

Create `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
}

module.exports = nextConfig
```

---

## tailwind.config.js

Create `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

## tsconfig.json

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## Quick Start After Copying

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
EOF

# 3. Run dev server
npm run dev

# 4. Open browser
# http://localhost:3000
```

---

## Verification Checklist

After copying all files:

- [ ] All directories created correctly
- [ ] All files copied and renamed
- [ ] Import paths use @/ alias
- [ ] .env.local created with Supabase credentials
- [ ] next.config.js created
- [ ] tailwind.config.js created
- [ ] tsconfig.json created
- [ ] Database schema run in Supabase
- [ ] 28 clinics inserted in Supabase
- [ ] npm install completed
- [ ] npm run dev works
- [ ] Pages load without errors
- [ ] Filters work on city page
- [ ] Geolocation button works
- [ ] All links functional

---

## Common Issues

**"Module not found: Can't resolve '@/components/...'"**
- Check tsconfig.json has paths configured
- Verify file exists at correct location
- Restart dev server

**"Invalid environment variables"**
- Check .env.local exists
- Verify variable names exactly match
- Restart dev server after changes

**"Image optimization error"**
- Add 'images.unsplash.com' to next.config.js
- Restart dev server

**Database connection fails**
- Verify Supabase URL and key are correct
- Check RLS policies in Supabase
- Verify tables exist

---

**All files are ready in /mnt/user-data/outputs/**

Download them all and follow this mapping guide!
