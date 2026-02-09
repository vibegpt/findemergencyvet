import GuideLayout from '@/components/guides/GuideLayout'

export default function TransportGuidePage() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How should I move an injured pet?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use a blanket or rigid surface as a stretcher, keep the spine aligned, and avoid sudden movement.',
        },
      },
      {
        '@type': 'Question',
        name: 'Should I drive or call for help?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'If it is safe, drive immediately. Call the clinic while someone else drives if possible.',
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <GuideLayout
        title="Safe Transport to the Emergency Vet"
        subtitle="Reduce stress and prevent further injury with these transport tips."
      >
        <section>
          <h2 className="text-xl font-bold text-[#0d141b] dark:text-white font-display">Keep pets calm and secure</h2>
          <p className="mt-3">
            Speak calmly, minimize noise, and secure your pet in a carrier or with a seatbelt harness.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0d141b] dark:text-white font-display">Support injuries</h2>
          <ul className="list-disc pl-6 mt-3">
            <li>Use a blanket as a stretcher for large dogs.</li>
            <li>Keep the head and spine aligned if trauma is suspected.</li>
            <li>Avoid giving food or water unless instructed by a vet.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0d141b] dark:text-white font-display">Call ahead</h2>
          <p className="mt-3">
            Let the clinic know what is happening so they can prepare and advise you.
          </p>
        </section>
      </GuideLayout>
    </>
  )
}
