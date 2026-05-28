// Shared pricing logic so Cart and Checkout always agree.
// Quebec sales tax: GST 5% + QST 9.975% (applied separately on the
// retail base, equivalent to a flat 14.975% for non-compounding goods).

export const TAX_RATE = 0.14975
export const TAX_LABEL = 'Tax (GST 5% + QST 9.975%)'

export const FREE_SHIPPING_THRESHOLD = 100
export const SHIPPING_FLAT = 10

/**
 * Compute the price breakdown for a cart.
 * @param {number} itemsPrice - subtotal of the items
 * @param {{ type: 'percent'|'amount'|'shipping', value?: number, code?: string }|null} promo
 * @returns {{ itemsPrice, discount, shippingPrice, taxPrice, totalPrice }}
 */
export function calculatePricing(itemsPrice, promo = null) {
  let discount = 0
  let shippingPrice =
    itemsPrice > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT

  if (promo) {
    if (promo.type === 'percent') {
      discount = +(itemsPrice * promo.value).toFixed(2)
    } else if (promo.type === 'amount') {
      discount = Math.min(promo.value, itemsPrice)
    } else if (promo.type === 'shipping') {
      shippingPrice = 0
    }
  }

  const taxBase = Math.max(0, itemsPrice - discount)
  const taxPrice = +(taxBase * TAX_RATE).toFixed(2)
  const totalPrice = +(taxBase + shippingPrice + taxPrice).toFixed(2)

  return { itemsPrice, discount, shippingPrice, taxPrice, totalPrice }
}
