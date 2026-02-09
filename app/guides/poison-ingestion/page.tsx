import GuideLayout from '@/components/guides/GuideLayout'

export default function PoisonGuidePage() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Should I make my pet vomit?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Do not induce vomiting unless a veterinarian or poison hotline instructs you to do so.',
        },
      },
      {
        '@type': 'Question',
        name: 'What information should I bring?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Bring packaging or a photo of the toxin, the time of ingestion, and your pet’s weight.',
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <GuideLayout
        title="Poison Ingestion: What to Do Right Away"
        subtitle="Fast action matters. Follow these steps and contact an emergency vet immediately."
      >
        <section>
          <h2 className="text-xl font-bold text-[#0d141b] dark:text-white font-display">Call an emergency vet immediately</h2>
          <p className="mt-3">
            Time matters with toxins. Call a nearby emergency clinic before you drive.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0d141b] dark:text-white font-display">Do not induce vomiting unless instructed</h2>
          <p className="mt-3">
            Some toxins cause more harm if vomited. Always follow a veterinarian’s directions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0d141b] dark:text-white font-display">Bring evidence of the toxin</h2>
          <p className="mt-3">
            Bring the packaging, plant sample, or label so the medical team can act quickly.
          </p>
        </section>
      </GuideLayout>
    </>
  )
}
