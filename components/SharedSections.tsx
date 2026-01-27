import Link from 'next/link'

export function WhyUsSection() {
  return (
    <section className="px-4 py-8 bg-white dark:bg-slate-900/50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-[#0d141b] dark:text-white mb-6 text-center">
          Why FindEmergencyVet.com?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Real-Time Data */}
          <div className="flex flex-col items-center text-center gap-3 p-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-[#137fec]/10">
              <span className="material-symbols-outlined text-[#137fec] text-3xl" aria-hidden="true">
                update
              </span>
            </div>
            <h3 className="font-bold text-lg text-[#0d141b] dark:text-white">
              Real-Time Status
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Live availability data so you know which emergency vets are open right now—not outdated information from months ago.
            </p>
          </div>

          {/* Exotic Pet Specialists */}
          <div className="flex flex-col items-center text-center gap-3 p-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-purple-500/10">
              <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-3xl" aria-hidden="true">
                pets
              </span>
            </div>
            <h3 className="font-bold text-lg text-[#0d141b] dark:text-white">
              Exotic Pet Filters
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Find emergency vets that specialize in birds, reptiles, rabbits, and other exotic pets—not just dogs and cats.
            </p>
          </div>

          {/* Cost Transparency */}
          <div className="flex flex-col items-center text-center gap-3 p-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-green-500/10">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-3xl" aria-hidden="true">
                payments
              </span>
            </div>
            <h3 className="font-bold text-lg text-[#0d141b] dark:text-white">
              Cost Transparency
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Upfront cost estimates and payment options so you can focus on your pet, not financial surprises.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function FAQSection() {
  const faqs = [
    {
      question: "How do I know if my pet needs emergency care?",
      answer: "Seek immediate care if your pet shows: difficulty breathing, severe bleeding, collapse, seizures, toxin ingestion, bloated abdomen, or inability to urinate. Use our triage tool for guidance."
    },
    {
      question: "Do emergency vets accept walk-ins?",
      answer: "Yes, most emergency vets accept walk-ins, but calling ahead helps them prepare. In life-threatening situations, go directly to the nearest facility."
    },
    {
      question: "How much does an emergency vet visit cost?",
      answer: "Emergency exams range from $96-$236, with total visit costs from $200-$5,000+ depending on treatment. Most clinics require payment at time of service. See our cost guide for detailed estimates."
    },
    {
      question: "What payment options are available?",
      answer: "Most emergency vets accept credit cards, CareCredit, Scratchpay, and pet insurance (reimbursement). Some offer payment plans—ask before treatment begins."
    },
    {
      question: "Are these clinics open 24/7?",
      answer: "We clearly mark which clinics are true 24/7 facilities vs. extended hours. Filter by 'Open Now' or '24/7' to see current availability."
    },
    {
      question: "Do you have vets for exotic pets?",
      answer: "Yes! Use our exotic pet filter to find emergency vets that treat birds, reptiles, rabbits, ferrets, and other non-traditional pets."
    }
  ]

  return (
    <section className="px-4 py-8 bg-gray-50 dark:bg-slate-900/30">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-[#0d141b] dark:text-white mb-2 text-center">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
          Quick answers to common emergency vet questions
        </p>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details 
              key={index}
              className="group bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <summary className="flex items-center justify-between p-4 cursor-pointer list-none hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                <h3 className="font-semibold text-[#0d141b] dark:text-white pr-4">
                  {faq.question}
                </h3>
                <span className="material-symbols-outlined text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" aria-hidden="true">
                  expand_more
                </span>
              </summary>
              <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-3">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Still have questions?
          </p>
          <Link 
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#137fec] text-white font-semibold rounded-lg hover:bg-[#137fec]/90 focus:outline-none focus:ring-2 focus:ring-[#137fec] focus:ring-offset-2 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}
