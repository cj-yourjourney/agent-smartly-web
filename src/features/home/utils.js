// features/home/utils.js
import { PLANS, ACTIVE_SALE } from '@/features/pricing/pricingConfig'

// Build the FAQ pricing answer dynamically from pricingConfig
export function buildPricingFaqAnswer() {
  const planList = PLANS.map((p) => `${p.price} for ${p.label}`).join(', ')
  const saleNote = ACTIVE_SALE.enabled
    ? ` (${ACTIVE_SALE.discountPct}% off during the ${ACTIVE_SALE.label} — regular prices are ${PLANS.map((p) => `${p.originalPrice} for ${p.label}`).join(', ')})`
    : ''
  return `Plans start at ${planList}${saleNote} — no auto-renewal, no subscription. Every new account gets 60 free practice questions — no credit card required. When your free questions run out, you can purchase any plan anytime.`
}
