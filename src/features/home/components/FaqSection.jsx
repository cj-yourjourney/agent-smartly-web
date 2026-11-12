// features/home/components/FaqSection.jsx
import { useState } from 'react'
import { faqs, PRICING_FAQ_PLACEHOLDER } from '../data/faqs'
import { buildPricingFaqAnswer } from '../utils'

export default function FaqSection() {
  const [openFaq, setOpenFaq] = useState(null)
  const pricingFaqAnswer = buildPricingFaqAnswer()

  return (
    <div className="py-24 px-4 bg-base-100 border-t border-base-300">
      <div className="max-w-3xl mx-auto">
        <p className="text-center text-primary font-bold tracking-widest text-xs uppercase mb-3">
          FAQ
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-center mb-4">
          Common Questions
        </h2>
        <p className="text-center text-base-content/60 text-lg mb-14 max-w-xl mx-auto">
          Answers based on real data from users who prepared with AgentSmartly.
        </p>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-base-300 rounded-xl overflow-hidden transition-all duration-200"
            >
              <button
                className="w-full flex justify-between items-center px-6 py-5 text-left gap-4 hover:bg-base-200 transition-colors duration-150 bg-base-100"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="font-semibold text-base">{faq.q}</span>
                <span
                  className={`text-primary text-xl flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`}
                >
                  +
                </span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-base-content/65 text-sm leading-relaxed border-t border-base-300 pt-4">
                  {faq.a === PRICING_FAQ_PLACEHOLDER ? pricingFaqAnswer : faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
