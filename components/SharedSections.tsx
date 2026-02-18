import Link from 'next/link'

export function WhyUsSection() {
  return (
    <section className="px-5 py-8 bg-[#FAFAFA]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-6 text-center">
          Why FindEmergencyVet.com?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Real-Time Data */}
          <div className="flex flex-col items-center text-center gap-3 p-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-[#F5F5F7]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#86868B" width="28" height="28" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg text-[#1D1D1F]">
              Real-Time Status
            </h3>
            <p className="text-sm text-[#6E6E73] leading-relaxed">
              Live availability data so you know which emergency vets are open right now--not outdated information from months ago.
            </p>
          </div>

          {/* Exotic Pet Specialists */}
          <div className="flex flex-col items-center text-center gap-3 p-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-[#F5F5F7]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#86868B" width="28" height="28" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg text-[#1D1D1F]">
              Exotic Pet Filters
            </h3>
            <p className="text-sm text-[#6E6E73] leading-relaxed">
              Find emergency vets that specialize in birds, reptiles, rabbits, and other exotic pets--not just dogs and cats.
            </p>
          </div>

          {/* Cost Transparency */}
          <div className="flex flex-col items-center text-center gap-3 p-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-[#F5F5F7]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#86868B" width="28" height="28" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg text-[#1D1D1F]">
              Cost Transparency
            </h3>
            <p className="text-sm text-[#6E6E73] leading-relaxed">
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
      answer: "Most emergency vets accept credit cards, CareCredit, Scratchpay, and pet insurance (reimbursement). Some offer payment plans--ask before treatment begins."
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
    <section className="px-5 py-8 bg-[#F5F5F7]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-2 text-center">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-[#6E6E73] mb-6 text-center">
          Quick answers to common emergency vet questions
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group bg-white rounded-2xl border border-[#E8E8ED] overflow-hidden"
            >
              <summary className="flex items-center justify-between p-4 cursor-pointer list-none hover:bg-[#F5F5F7] transition-colors">
                <h3 className="font-semibold text-[#1D1D1F] pr-4">
                  {faq.question}
                </h3>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18" className="text-[#86868B] shrink-0 group-open:rotate-180 transition-transform" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </summary>
              <div className="px-4 pb-4 text-sm text-[#6E6E73] leading-relaxed border-t border-[#E8E8ED] pt-3">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-[#6E6E73] mb-3">
            Still have questions?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1D1D1F] text-white font-semibold rounded-xl hover:bg-[#1D1D1F]/90 focus:outline-none focus:ring-2 focus:ring-[#1D1D1F] transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}
