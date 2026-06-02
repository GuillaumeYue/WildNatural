import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { calculatePricing } from '../lib/pricing'
import { lookupPromo } from '../lib/promo'
import { useLang } from '../contexts/LanguageContext'
import productSerumImg from '../assets/product-serum.png'
import productCreamImg from '../assets/product-cream.png'

/**
 * Mock cart contents — replace with a real cart store (Context / Zustand)
 * once Add-to-Cart is wired up on the Products page.
 */
const INITIAL_CART = [
  {
    id: '6657f1a2b8c4d5e6f7890001',
    name: 'WILD Botanical Serum',
    size: '30 ml',
    price: 48,
    qty: 1,
    image: productSerumImg,
  },
  {
    id: '6657f1a2b8c4d5e6f7890002',
    name: 'WILD Renewal Cream',
    size: '50 ml',
    price: 52,
    qty: 1,
    image: productCreamImg,
  },
]

const QTY_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const GRID_COLS =
  'grid grid-cols-[2.5fr_1fr_1fr_1fr] gap-6 items-center'

function CartHeader() {
  const { t } = useLang()
  return (
    <div
      className={`${GRID_COLS} pb-4 border-b border-ink/10 text-[11px] tracking-[0.2em] uppercase text-ink-muted`}
    >
      <div>{t('cart.col.cart')}</div>
      <div>{t('cart.col.price')}</div>
      <div>{t('cart.col.qty')}</div>
      <div className="text-right">{t('cart.col.subtotal')}</div>
    </div>
  )
}

function CartRow({ item, onQtyChange }) {
  return (
    <div className={`${GRID_COLS} py-8 border-b border-ink/10`}>
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 bg-blush-50 flex items-center justify-center shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="max-w-[80%] max-h-[80%] object-contain"
          />
        </div>
        <div>
          <h3 className="font-semibold text-ink leading-snug">{item.name}</h3>
          <p className="text-sm text-ink-muted mt-1">{item.size}</p>
        </div>
      </div>

      <div className="text-ink">${item.price}</div>

      <div>
        <div className="relative inline-block">
          <select
            value={item.qty}
            onChange={(e) => onQtyChange(item.id, Number(e.target.value))}
            className="appearance-none border border-ink/20 rounded-md pl-4 pr-10 py-2 bg-white text-ink cursor-pointer focus:border-rose-500 focus:outline-none"
          >
            {QTY_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted text-sm">
            ⌄
          </span>
        </div>
      </div>

      <div className="text-right text-ink font-medium">
        ${item.price * item.qty}
      </div>
    </div>
  )
}

function EmptyState() {
  const { t } = useLang()
  return (
    <div className="text-center py-24">
      <p className="text-lg text-ink-muted mb-8">
        {t('cart.empty')}
      </p>
      <Link
        to="/products"
        className="inline-block bg-rose-500 hover:bg-rose-600 text-cream font-bold tracking-[0.2em] uppercase text-sm py-4 px-10 rounded-md transition-colors"
      >
        {t('cart.browse')}
      </Link>
    </div>
  )
}

export default function Cart() {
  const { t } = useLang()
  const [items, setItems] = useState(INITIAL_CART)
  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [promoError, setPromoError] = useState('')
  const navigate = useNavigate()

  const handleQtyChange = (id, qty) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty } : item))
    )
  }

  const handleApplyPromo = (e) => {
    e.preventDefault()
    setPromoError('')
    const found = lookupPromo(promoInput)
    if (!found) {
      setPromoError(t('cart.invalidCode'))
      return
    }
    setAppliedPromo(found)
    setPromoInput('')
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
    setPromoError('')
  }

  const itemsPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const { discount, shippingPrice, taxPrice, totalPrice } = calculatePricing(
    itemsPrice,
    appliedPromo
  )
  const isEmpty = items.length === 0

  const handleCheckout = () => {
    if (isEmpty) return
    sessionStorage.setItem('wild.checkoutItems', JSON.stringify(items))
    sessionStorage.setItem('wild.checkoutPromo', JSON.stringify(appliedPromo))
    navigate('/checkout')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Nav />

      <main className="flex-1 pt-32 pb-24 px-10">
        <div className="mx-auto max-w-[1100px]">
          {/* Title + promo */}
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink mb-6">
              {t('cart.title')}
            </h1>
            <p className="text-sm text-ink-soft leading-relaxed max-w-xl mx-auto">
              {t('cart.promoMessage')}{' '}
              <span className="text-ink-muted">{t('cart.promoAuto')}</span>
            </p>
          </div>

          {isEmpty ? (
            <EmptyState />
          ) : (
            <>
              <CartHeader />
              {items.map((item) => (
                <CartRow key={item.id} item={item} onQtyChange={handleQtyChange} />
              ))}

              {/* Total + Checkout */}
              <div className="grid md:grid-cols-2 gap-12 mt-12">
                <div />
                <div>
                  {/* Promo code */}
                  <div className="pb-6 mb-6 border-b border-ink/10">
                    {appliedPromo ? (
                      <div className="flex justify-between items-center bg-blush-50 px-4 py-3 rounded-md">
                        <div>
                          <p className="text-xs font-semibold text-rose-500 tracking-[0.15em] uppercase">
                            {appliedPromo.code}
                          </p>
                          <p className="text-xs text-ink-soft mt-1">
                            {appliedPromo.label}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemovePromo}
                          className="text-xs text-ink-muted hover:text-rose-500 transition-colors"
                        >
                          {t('cart.remove')}
                        </button>
                      </div>
                    ) : (
                      <>
                        <form onSubmit={handleApplyPromo} className="flex gap-2">
                          <input
                            type="text"
                            value={promoInput}
                            onChange={(e) => setPromoInput(e.target.value)}
                            placeholder={t('cart.promoPlaceholder')}
                            className="flex-1 border border-ink/15 rounded-md px-4 py-2 text-sm uppercase tracking-wider outline-none focus:border-rose-500"
                          />
                          <button
                            type="submit"
                            className="px-5 py-2 border border-ink/20 rounded-md text-xs font-semibold tracking-[0.2em] uppercase text-ink hover:border-rose-500 hover:text-rose-500 transition-colors"
                          >
                            {t('cart.apply')}
                          </button>
                        </form>
                        {promoError && (
                          <p className="mt-2 text-xs text-rose-500">{promoError}</p>
                        )}
                      </>
                    )}
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-ink-muted">{t('cart.subtotal')}</span>
                      <span className="text-ink">${itemsPrice.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-rose-500 font-medium">
                          {t('cart.discount')}
                          {appliedPromo ? ` (${appliedPromo.code})` : ''}
                        </span>
                        <span className="text-rose-500">
                          −${discount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-ink-muted">
                        {shippingPrice === 0 ? t('cart.shippingFree') : t('cart.shipping')}
                      </span>
                      <span className="text-ink">${shippingPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-muted">{t('cart.tax')}</span>
                      <span className="text-ink">${taxPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between pt-4 border-t border-ink/10 mb-8">
                    <p className="text-xl text-ink">{t('cart.total')}</p>
                    <p className="font-display text-4xl font-semibold text-ink">
                      ${totalPrice.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-rose-500 hover:bg-rose-600 text-cream font-bold tracking-[0.2em] uppercase text-sm py-5 rounded-md transition-colors"
                  >
                    {t('cart.checkout')}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
