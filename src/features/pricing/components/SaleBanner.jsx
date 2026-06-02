// src/features/pricing/components/SaleBanner.jsx
//
//  Full-width announcement bar — place directly below <Navbar /> on
//  unauthenticated marketing pages (index, about).
//
//  Renders nothing when ACTIVE_SALE.enabled is false, so it's zero-footprint
//  outside of active sale periods.
//
//  Usage:
//    import SaleBanner from '@/features/pricing/components/SaleBanner'
//    <SaleBanner />
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react'
import { ACTIVE_SALE } from '../pricingConfig'

function useCountdown(isoEndDate) {
  const [timeLeft, setTimeLeft] = useState(null)

  useEffect(() => {
    if (!isoEndDate) return

    function calc() {
      const diff = new Date(isoEndDate) - Date.now()
      if (diff <= 0) return setTimeLeft(null)

      setTimeLeft({
        d: Math.floor(diff / 86_400_000),
        h: Math.floor((diff % 86_400_000) / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1_000)
      })
    }

    calc()
    const id = setInterval(calc, 1_000)
    return () => clearInterval(id)
  }, [isoEndDate])

  return timeLeft
}

function Pad({ value, label }) {
  return (
    <div className="flex flex-col items-center min-w-[2ch]">
      <span className="text-sm font-black leading-none tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[8px] uppercase tracking-widest opacity-70 mt-0.5">
        {label}
      </span>
    </div>
  )
}

export default function SaleBanner() {
  const { enabled, label, tagline, endDate, badgeColor } = ACTIVE_SALE
  const timeLeft = useCountdown(enabled ? endDate : null)

  if (!enabled) return null

  return (
    <div className={`relative overflow-hidden w-full ${badgeColor} text-white`}>
      {/* Decorative diagonal stripe */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          background:
            'repeating-linear-gradient(135deg,#fff 0px,#fff 1px,transparent 1px,transparent 12px)'
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-4">
        {/* Left: label + tagline */}
        <p className="text-sm font-bold leading-snug text-center sm:text-left">
          {label}
          <span className="font-normal opacity-85 ml-2 hidden sm:inline">
            {tagline}
          </span>
        </p>

        {/* Right: countdown */}
        {timeLeft && (
          <div className="flex items-center justify-center gap-1.5 self-center">
            <Pad value={timeLeft.d} label="days" />
            <span className="font-black opacity-60 pb-3 text-sm">:</span>
            <Pad value={timeLeft.h} label="hrs" />
            <span className="font-black opacity-60 pb-3 text-sm">:</span>
            <Pad value={timeLeft.m} label="min" />
            <span className="font-black opacity-60 pb-3 text-sm">:</span>
            <Pad value={timeLeft.s} label="sec" />
          </div>
        )}
      </div>
    </div>
  )
}
