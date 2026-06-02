// src/features/pricing/index.js
//
//  Barrel export — import anything pricing-related from one place:
//
//    import { PLANS, DEFAULT_PLAN, ACTIVE_SALE } from '@/features/pricing'
//    import { SaleBanner, PlanSelector, OneTimeChargeNotice } from '@/features/pricing'
// ─────────────────────────────────────────────────────────────────────────────

// Config & data
export { PLANS, DEFAULT_PLAN, ACTIVE_SALE } from './pricingConfig'

// UI components
export { default as SaleBanner } from './components/SaleBanner'
export { default as PlanSelector } from './components/PlanSelector'
export { default as OneTimeChargeNotice } from './components/OneTimeChargeNotice'
