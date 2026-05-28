/**
 * Promo codes (frontend-only MVP — replace with a backend
 * lookup once Sara finalises the business rules).
 *
 * Three sample codes:
 *   WELCOME10  → 10% off the subtotal
 *   WILD5      → $5 off the subtotal
 *   FREESHIP   → free shipping
 */
export const PROMO_CODES = {
  WELCOME10: { type: 'percent',  value: 0.10, label: '10% off your order' },
  WILD5:     { type: 'amount',   value: 5,    label: '$5 off' },
  FREESHIP:  { type: 'shipping',              label: 'Free shipping' },
}

export function lookupPromo(code) {
  if (!code) return null
  const normalized = code.trim().toUpperCase()
  const promo = PROMO_CODES[normalized]
  if (!promo) return null
  return { code: normalized, ...promo }
}
