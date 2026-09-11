// src/features/pricing/pricingConfig.js
//
// ─────────────────────────────────────────────────────────────────────────────
//  SINGLE SOURCE OF TRUTH FOR ALL PRICING & SALES
//
//  To change prices:      edit BASE_PRICES
//  To run/rotate a sale:  edit salesCalendar.js — set ACTIVE_SALE_NAME to the
//                          sale you want live. Nothing in this file changes.
//  To end all sales:      set ACTIVE_SALE_NAME = null in salesCalendar.js
//                          (prices revert automatically)
// ─────────────────────────────────────────────────────────────────────────────

import { SALES, ACTIVE_SALE_NAME } from './salesCalendar'

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

// ── 2. Active sale — resolved from salesCalendar.js ────────────────────────
//
//  ACTIVE_SALE.enabled is derived from whether ACTIVE_SALE_NAME points to a
//  real entry in SALES. Everything downstream (banner, discount math) reads
//  from this object exactly like before, so no other file needs to change.
//
export const ACTIVE_SALE =
  ACTIVE_SALE_NAME && SALES[ACTIVE_SALE_NAME]
    ? { enabled: true, ...SALES[ACTIVE_SALE_NAME] }
    : { enabled: false }

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

// ── 4. Promo code — single fixed code, 30% off whatever price is active ───────
//
//  Mirrors payments/pricing_config.py on the backend. This stacks on top of
//  the current price, so if a sale is live the promo takes 30% off the sale
//  price; otherwise it takes 30% off the base price. There's only one code
//  for now, so it's a constant here too — the backend is still the source of
//  truth and re-validates the code at checkout, this is just for instant
//  price preview without a network round trip.
//
export const PROMO_CODE = 'AGENT30'
export const PROMO_DISCOUNT_PCT = 30

export function validatePromoCode(code) {
  return (
    typeof code === 'string' &&
    code.trim().toUpperCase() === PROMO_CODE.toUpperCase()
  )
}

// Returns a copy of `plan` with the promo discount applied, if `code` is
// valid. Returns `plan` unchanged if the code doesn't match.
export function applyPromoCode(plan, code) {
  if (!validatePromoCode(code)) return plan

  const currentPrice = plan.priceValue
  const promoPrice = currentPrice * (1 - PROMO_DISCOUNT_PCT / 100)

  return {
    ...plan,
    price: formatPrice(promoPrice),
    priceValue: promoPrice,
    prePromoPrice: formatPrice(currentPrice),
    promoApplied: true,
    promoCode: PROMO_CODE,
    promoDiscountPct: PROMO_DISCOUNT_PCT
  }
}

// ── Note ──────────────────────────────────────────────────────────────────────
//  getStripe lives in src/features/account/utils.js (unchanged).
//  It is NOT exported from here because @stripe/stripe-js is a browser-only
//  package and pricingConfig is imported at the page/SSR level — mixing them
//  causes a Next.js build error.  PaymentForm imports getStripe directly from
//  account/utils as before.
