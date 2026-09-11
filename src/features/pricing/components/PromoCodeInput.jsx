// src/features/pricing/components/PromoCodeInput.jsx
//
//  Self-contained promo code field for the checkout form.
//  Validates against the same fixed PROMO_CODE as pricingConfig.js so the
//  discounted price can preview instantly — the backend re-validates and
//  is the source of truth at charge time.
//
//  Collapsed by default behind a "Have a promo code?" link so it doesn't
//  create hesitation for the majority of users who don't have one — it
//  only expands into the full input on click.
//
//  Usage (inside PaymentForm):
//    <PromoCodeInput
//      appliedCode={promoCode}
//      onApply={(code) => setPromoCode(code)}
//      onRemove={() => setPromoCode(null)}
//    />
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { Tag, X, Check } from 'lucide-react'
import { validatePromoCode } from '../pricingConfig'

export default function PromoCodeInput({ appliedCode, onApply, onRemove }) {
  const [expanded, setExpanded] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState(null)

  const handleApply = () => {
    const code = input.trim()
    if (!code) return

    if (validatePromoCode(code)) {
      setError(null)
      setInput('')
      onApply(code)
    } else {
      setError('Invalid promo code')
    }
  }

  const handleCancel = () => {
    setExpanded(false)
    setInput('')
    setError(null)
  }

  // ── Applied state ───────────────────────────────────────────────────────
  if (appliedCode) {
    return (
      <div className="flex items-center justify-between bg-success/10 border border-success/30 rounded-xl px-4 py-2.5">
        <div className="flex items-center gap-2 text-sm font-semibold text-success">
          <Check className="h-4 w-4 shrink-0" />
          Promo code {appliedCode} applied
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove promo code"
          className="text-base-content/40 hover:text-base-content/70 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  // ── Collapsed state (default) ───────────────────────────────────────────
  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="text-xs font-semibold text-base-content/50 hover:text-primary transition-colors flex items-center gap-1.5"
      >
        <Tag className="h-3.5 w-3.5" />
        Have a promo code?
      </button>
    )
  }

  // ── Expanded input state ────────────────────────────────────────────────
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-base-content/50 uppercase tracking-wide">
          Promo Code
        </label>
        <button
          type="button"
          onClick={handleCancel}
          className="text-xs text-base-content/40 hover:text-base-content/70 transition-colors"
        >
          Cancel
        </button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="h-4 w-4 text-base-content/30 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            autoFocus
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              if (error) setError(null)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleApply()
              }
            }}
            placeholder="Enter code"
            className={`
              w-full pl-9 pr-3 py-2.5 rounded-xl border bg-base-100 text-sm
              focus:outline-none transition-colors
              ${error ? 'border-error' : 'border-base-300 focus:border-primary'}
            `}
          />
        </div>
        <button
          type="button"
          onClick={handleApply}
          disabled={!input.trim()}
          className="btn btn-outline btn-sm h-auto px-4 rounded-xl"
        >
          Apply
        </button>
      </div>

      {error && <p className="text-xs text-error mt-1.5">{error}</p>}
    </div>
  )
}
