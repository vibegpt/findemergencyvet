import GuideLayout from '@/components/guides/GuideLayout'

export default function TriageGuidePage() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What counts as a pet emergency?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Trouble breathing, uncontrolled bleeding, seizures, collapse, severe pain, or suspected poisoning are all emergencies that need immediate veterinary care.',
        },
      },
      {
        '@type': 'Question',
        name: 'Should I call the emergency vet before arriving?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Calling ahead helps the clinic prepare and confirm if they are accepting patients.',
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <GuideLayout
        title="Emergency Triage Basics for Pets"
        subtitle="Use this quick triage checklist to decide how urgent the situation is and what to do next."
      >
        <section>
          <h2 className="text-xl font-bold text-[#0d141b] dark:text-white font-display">Step 1: Look for critical signs</h2>
          <ul className="list-disc pl-6 mt-3">
            <li>Difficulty breathing or choking</li>
            <li>Severe bleeding or trauma</li>
            <li>Seizures or collapse</li>
            <li>Suspected toxin ingestion</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0d141b] dark:text-white font-display">Step 2: Call the nearest emergency vet</h2>
          <p className="mt-3">
            Even if you plan to drive immediately, a quick call can alert the team and reduce wait time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0d141b] dark:text-white font-display">Step 3: Transport safely</h2>
          <p className="mt-3">
            Keep your pet warm and calm, use a blanket as a stretcher for larger dogs, and avoid giving food or water unless advised.
          </p>
        </section>
      </GuideLayout>
    </>
  )
}
