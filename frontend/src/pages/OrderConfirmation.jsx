import { Link, Navigate, useLocation } from 'react-router-dom'
import { Check } from 'lucide-react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useLang } from '../contexts/LanguageContext'

export default function OrderConfirmation() {
  const location = useLocation()
  const order = location.state?.order
  const { t } = useLang()

  // Hard refresh / direct visit → no order data, send back home.
  if (!order) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Nav />

      <main className="flex-1 pt-32 pb-24 px-10">
        <div className="mx-auto max-w-[760px] text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blush-100 text-rose-500 mb-8">
            <Check className="w-10 h-10" strokeWidth={2.5} />
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink mb-4">
            {t('orderConf.thanks')}
          </h1>
          <p className="text-lg text-ink-soft mb-12 leading-relaxed">
            {t('orderConf.subtitle')}
          </p>

          <section className="bg-blush-50 p-8 rounded-md text-left mb-12">
            <p className="text-[11px] tracking-[0.3em] uppercase text-rose-500 font-semibold mb-2">
              {t('orderConf.orderNumber')}
            </p>
            <p className="font-mono text-sm text-ink-soft mb-8 break-all">
              {order._id}
            </p>

            <h2 className="font-display text-xl font-semibold text-ink mb-4">
              {t('orderConf.items')}
            </h2>
            <ul className="space-y-3 mb-6">
              {order.orderItems?.map((item, i) => (
                <li
                  key={`${item.product}-${i}`}
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
              <Row label={t('cart.subtotal')} value={order.itemsPrice} />
              <Row label={t('checkout.shipping')} value={order.shippingPrice} />
              <Row label={t('cart.tax')} value={order.taxPrice} />
              <div className="flex justify-between pt-4 border-t border-ink/10 mt-3 font-semibold text-base">
                <span className="text-ink">{t('cart.total')}</span>
                <span className="text-ink">
                  ${order.totalPrice?.toFixed(2) ?? '—'}
                </span>
              </div>
            </div>

            {order.shippingAddress && (
              <div className="mt-8 pt-6 border-t border-ink/10">
                <p className="text-[11px] tracking-[0.3em] uppercase text-rose-500 font-semibold mb-3">
                  {t('orderConf.shippingTo')}
                </p>
                <p className="text-sm text-ink-soft leading-relaxed">
                  {order.shippingAddress.address}
                  <br />
                  {order.shippingAddress.city},{' '}
                  {order.shippingAddress.postalCode}
                  <br />
                  {order.shippingAddress.country}
                </p>
              </div>
            )}
          </section>

          <Link
            to="/products"
            className="inline-block bg-rose-500 hover:bg-rose-600 text-cream font-bold tracking-[0.2em] uppercase text-sm py-4 px-10 rounded-md transition-colors"
          >
            {t('orderConf.continue')}
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function Row({ label, value }) {
  if (value == null) return null
  return (
    <div className="flex justify-between">
      <span className="text-ink-muted">{label}</span>
      <span className="text-ink">${value.toFixed(2)}</span>
    </div>
  )
}
