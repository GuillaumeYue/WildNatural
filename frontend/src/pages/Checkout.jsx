import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import API from '../api/axiosInstance'
import { useAuth } from '../contexts/AuthContext'

const TAX_RATE = 0.13                  // 13% HST (Ontario default — adjust per province later)
const FREE_SHIPPING_THRESHOLD = 100    // free shipping over $100
const SHIPPING_FLAT = 10
const STORAGE_KEY = 'wild.checkoutItems'

const PAYMENT_METHODS = ['Credit Card', 'PayPal']

const inputClass =
  'w-full bg-white border border-ink/15 rounded-md px-4 py-3 text-ink placeholder:text-ink-muted/50 outline-none transition-all focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15'
const labelClass =
  'block text-[11px] font-medium tracking-[0.15em] text-ink-soft uppercase mb-2'

function Field({ label, value, onChange, ...rest }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
        {...rest}
      />
    </div>
  )
}

export default function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Items are stashed in sessionStorage by Cart so they survive an auth roundtrip.
  const items = useMemo(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }, [])

  // Auth gate + empty-cart gate
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' }, replace: true })
      return
    }
    if (items.length === 0) {
      navigate('/cart', { replace: true })
    }
  }, [user, items.length, navigate])

  const [shipping, setShipping] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: 'Canada',
  })
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const itemsPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const shippingPrice = itemsPrice > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT
  const taxPrice = +(itemsPrice * TAX_RATE).toFixed(2)
  const totalPrice = +(itemsPrice + shippingPrice + taxPrice).toFixed(2)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const orderItems = items.map((i) => ({
        product: i.id,
        name: i.name,
        image: i.image,
        price: i.price,
        qty: i.qty,
      }))

      const { data: order } = await API.post('/orders', {
        orderItems,
        shippingAddress: shipping,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      })

      sessionStorage.removeItem(STORAGE_KEY)
      navigate('/order-confirmation', { state: { order }, replace: true })
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Something went wrong placing your order. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  // Avoid rendering the form briefly while the auth/empty-cart effect redirects.
  if (!user || items.length === 0) return null

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Nav />

      <main className="flex-1 pt-32 pb-24 px-10">
        <div className="mx-auto max-w-[1200px]">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink text-center mb-16">
            Checkout
          </h1>

          <form
            onSubmit={handleSubmit}
            className="grid lg:grid-cols-[1.4fr_1fr] gap-12"
          >
            {/* Left column: shipping + payment */}
            <div className="space-y-12">
              <section>
                <h2 className="text-xs tracking-[0.3em] uppercase text-rose-500 font-semibold mb-6">
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <Field
                    label="Address"
                    value={shipping.address}
                    onChange={(v) => setShipping({ ...shipping, address: v })}
                    placeholder="123 Wild Lane"
                    required
                  />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field
                      label="City"
                      value={shipping.city}
                      onChange={(v) => setShipping({ ...shipping, city: v })}
                      placeholder="Toronto"
                      required
                    />
                    <Field
                      label="Postal Code"
                      value={shipping.postalCode}
                      onChange={(v) =>
                        setShipping({ ...shipping, postalCode: v })
                      }
                      placeholder="M5V 2T6"
                      required
                    />
                  </div>
                  <Field
                    label="Country"
                    value={shipping.country}
                    onChange={(v) => setShipping({ ...shipping, country: v })}
                    placeholder="Canada"
                    required
                  />
                </div>
              </section>

              <section>
                <h2 className="text-xs tracking-[0.3em] uppercase text-rose-500 font-semibold mb-6">
                  Payment Method
                </h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => {
                    const isActive = paymentMethod === method
                    return (
                      <label
                        key={method}
                        className={`flex items-center gap-3 p-4 border rounded-md cursor-pointer transition-colors ${
                          isActive
                            ? 'border-rose-500 bg-blush-50'
                            : 'border-ink/15 hover:border-rose-500'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={isActive}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="accent-rose-500"
                        />
                        <span className="text-ink">{method}</span>
                      </label>
                    )
                  })}
                </div>
                <p className="mt-4 text-xs text-ink-muted italic">
                  Payment integration is not yet live — orders are recorded as
                  unpaid until Stripe is wired up.
                </p>
              </section>
            </div>

            {/* Right column: order summary */}
            <aside className="bg-blush-50 p-8 rounded-md h-fit">
              <h2 className="font-display text-2xl font-semibold text-ink mb-6">
                Order Summary
              </h2>

              <ul className="space-y-3 mb-6">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between text-sm gap-4"
                  >
                    <span className="text-ink">
                      {item.name}
                      <span className="text-ink-muted"> × {item.qty}</span>
                    </span>
                    <span className="text-ink whitespace-nowrap">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-ink/10 pt-4 space-y-2 text-sm">
                <Row label="Subtotal" value={itemsPrice} />
                <Row
                  label={
                    shippingPrice === 0 ? 'Shipping (free)' : 'Shipping'
                  }
                  value={shippingPrice}
                />
                <Row label="Tax (HST 13%)" value={taxPrice} />
                <div className="flex justify-between pt-4 border-t border-ink/10 mt-3 font-semibold text-base">
                  <span className="text-ink">Total</span>
                  <span className="text-ink">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {error && (
                <p className="mt-4 text-sm text-rose-500" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-6 bg-rose-500 hover:bg-rose-600 text-cream font-bold tracking-[0.2em] uppercase text-sm py-4 rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Placing Order…' : 'Place Order'}
              </button>
            </aside>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-muted">{label}</span>
      <span className="text-ink">${value.toFixed(2)}</span>
    </div>
  )
}
