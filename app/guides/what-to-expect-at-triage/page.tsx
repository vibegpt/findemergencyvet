import GuideLayout from '@/components/guides/GuideLayout'

export default function WhatToExpectGuidePage() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do emergency vets decide who is seen first?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Patients are prioritized by severity. Life-threatening cases are seen first, even if they arrive later.',
        },
      },
      {
        '@type': 'Question',
        name: 'Should I bring medical records?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Bring any recent records, medications, or lab results if possible.',
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <GuideLayout
        title="What to Expect During Emergency Vet Triage"
        subtitle="Knowing the triage process can reduce stress and help you advocate for your pet."
      >
        <section>
          <h2 className="text-xl font-bold text-[#0d141b] dark:text-white font-display">Triage happens immediately</h2>
          <p className="mt-3">
            A technician or veterinarian will assess breathing, circulation, and pain to determine urgency.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0d141b] dark:text-white font-display">Critical cases go first</h2>
          <p className="mt-3">
            Emergency hospitals see the most critical pets first, even if others arrived earlier.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0d141b] dark:text-white font-display">Be ready to share details</h2>
          <p className="mt-3">
            Share symptoms, time of onset, medications, and any possible toxins or trauma.
          </p>
        </section>
      </GuideLayout>
    </>
  )
}
