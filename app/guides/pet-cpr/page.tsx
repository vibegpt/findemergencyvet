import GuideLayout from '@/components/guides/GuideLayout'

export default function PetCprGuidePage() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'When should I perform pet CPR?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Only if your pet is unresponsive, not breathing, and has no heartbeat. Call an emergency vet immediately.',
        },
      },
      {
        '@type': 'Question',
        name: 'How fast should compressions be?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Aim for 100-120 compressions per minute, similar to human CPR.',
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <GuideLayout
        title="Pet CPR Essentials"
        subtitle="A fast, simple checklist to keep you focused during a critical emergency."
      >
        <section>
          <h2 className="text-xl font-bold text-[#0d141b] dark:text-white font-display">Check responsiveness</h2>
          <p className="mt-3">
            Tap, call their name, and check breathing. If no breathing or heartbeat, start CPR immediately.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0d141b] dark:text-white font-display">Chest compressions</h2>
          <ul className="list-disc pl-6 mt-3">
            <li>Place your hands over the widest part of the chest.</li>
            <li>Compress 1/3 to 1/2 chest depth.</li>
            <li>Perform 100-120 compressions per minute.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0d141b] dark:text-white font-display">Rescue breaths</h2>
          <p className="mt-3">
            Give 2 breaths after every 30 compressions. Seal the mouth and breathe into the nose.
          </p>
        </section>
      </GuideLayout>
    </>
  )
}
