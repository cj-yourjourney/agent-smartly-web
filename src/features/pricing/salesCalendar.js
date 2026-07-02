// src/features/pricing/salesCalendar.js
//
// ─────────────────────────────────────────────────────────────────────────────
//  ROTATING SALES CALENDAR — single place to define every sale you run all year
//
//  To switch which sale is live:
//    → change ACTIVE_SALE_NAME below to match a key in SALES
//
//  To turn all sales off (back to full price, no banner):
//    → set ACTIVE_SALE_NAME = null
//
//  To add a new sale (e.g. Black Friday, New Year):
//    → add a new entry to SALES. Nothing else needs to change —
//      pricingConfig.js and SaleBanner.jsx pick it up automatically.
//
//  Field reference (same shape as before):
//    name        → machine-readable key, used for analytics / logging
//    label       → displayed in the UI sale badge  (e.g. "🎆 July 4th Sale")
//    tagline     → short promo copy shown under the badge
//    discountPct → integer 0-100.  50 = 50% off base prices.
//    endDate     → ISO string (UTC) shown in countdown timers.
//                  Set to null to hide the countdown.
//    badgeColor  → Tailwind background utility applied to the sale badge.
// ─────────────────────────────────────────────────────────────────────────────

export const SALES = {
  summer_kickoff: {
    name: 'summer_kickoff',
    label: '☀️ Summer Kickoff Sale',
    tagline: 'Limited-time offer — prices go back up soon.',
    discountPct: 50,
    endDate: '2026-07-02T03:00:00Z', // 7/1 8PM PDT
    badgeColor: 'bg-orange-500'
  },

  july_4th: {
    name: 'july_4th',
    label: '🎆 July 4th Sale',
    tagline: 'Celebrate with 50% off — sale ends soon.',
    discountPct: 50,
    endDate: '2026-07-21T07:00:00Z', // 7/5 11:59PM PDT
    badgeColor: 'bg-red-600'
  }

  // Add future sales here, e.g.:
  // labor_day: {
  //   name: 'labor_day',
  //   label: '🛠️ Labor Day Sale',
  //   tagline: 'End of summer savings — 40% off.',
  //   discountPct: 40,
  //   endDate: '2026-09-08T07:00:00Z',
  //   badgeColor: 'bg-blue-600'
  // }
}

// ── Which sale is currently live ───────────────────────────────────────────
//  Set to a key from SALES above, or null to run no sale at all.
export const ACTIVE_SALE_NAME = 'july_4th'
