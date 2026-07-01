// src/features/pricing/pricingConfig.js
//
// ─────────────────────────────────────────────────────────────────────────────
//  SINGLE SOURCE OF TRUTH FOR ALL PRICING & SALES
//
//  To change prices:      edit BASE_PRICES
//  To run a sale:         set ACTIVE_SALE.enabled = true and fill its fields
//  To end a sale:         set ACTIVE_SALE.enabled = false  (prices revert automatically)
//  To swap a holiday sale: just change ACTIVE_SALE name/label/end date — everything
//                          else (discount math, UI banners) updates automatically.
// ─────────────────────────────────────────────────────────────────────────────

// ── 1. Base retail prices (what you'd charge with NO sale active) ─────────────
const BASE_PRICES = {
  week: {
    id: 'week',
    label: '1-Week Access',
    basePrice: 59.0
  },
  month: {
    id: 'month',
    label: '1-Month Access',
    basePrice: 79.0
  },
  three_months: {
    id: 'three_months',
    label: '3-Month Access',
    basePrice: 99.0
  }
}

// ── 2. Active sale — flip `enabled` to turn it on/off ─────────────────────────
//
//  name        → machine-readable key, used for analytics / logging
//  label       → displayed in the UI sale badge  (e.g. "🎆 July 4th Sale")
//  tagline     → short promo copy shown under the badge
//  discountPct → integer 0-100.  50 = 50 % off base prices.
//  endDate     → ISO string (midnight UTC) shown in countdown timers.
//                Set to null to hide the countdown.
//  badgeColor  → Tailwind background utility applied to the sale badge.
//
export const ACTIVE_SALE = {
  enabled: true,
  name: 'june_summer_kickoff',
  label: '☀️ Summer Kickoff Sale',
  tagline: 'Limited-time offer — prices go back up soon.',
  discountPct: 50,
  endDate: '2026-07-02T03:00:00Z', // 7/1 8PM PDT
  badgeColor: 'bg-orange-500'
}

// ── 3. Derived plan objects — consumed by every component ─────────────────────
//
//  Each plan exposes:
//    .price          → formatted string to render  ("$29.50"  or  "$39.50")
//    .originalPrice  → formatted original when a sale is active (null otherwise)
//    .saleSavings    → formatted savings string  ("Save $29.50")  (null if no sale)
//    .discountPct    → integer or 0
//
function formatPrice(cents) {
  // Accepts a dollar float, returns "$X.XX" or "$X" if no cents
  return `$${cents.toFixed(2).replace(/\.00$/, '')}`
}

function buildPlan(raw) {
  const { enabled, discountPct } = ACTIVE_SALE

  if (enabled && discountPct > 0) {
    const salePrice = raw.basePrice * (1 - discountPct / 100)
    return {
      ...raw,
      price: formatPrice(salePrice),
      priceValue: salePrice,
      originalPrice: formatPrice(raw.basePrice),
      saleSavings: `Save ${formatPrice(raw.basePrice - salePrice)}`,
      discountPct
    }
  }

  return {
    ...raw,
    price: formatPrice(raw.basePrice),
    priceValue: raw.basePrice,
    originalPrice: null,
    saleSavings: null,
    discountPct: 0
  }
}

export const PLANS = Object.values(BASE_PRICES).map(buildPlan)

export const DEFAULT_PLAN = PLANS.find((p) => p.id === 'month') ?? PLANS[0]

// ── Note ──────────────────────────────────────────────────────────────────────
//  getStripe lives in src/features/account/utils.js (unchanged).
//  It is NOT exported from here because @stripe/stripe-js is a browser-only
//  package and pricingConfig is imported at the page/SSR level — mixing them
//  causes a Next.js build error.  PaymentForm imports getStripe directly from
//  account/utils as before.
