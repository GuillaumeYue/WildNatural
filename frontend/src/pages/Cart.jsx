import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
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
  return (
    <div
      className={`${GRID_COLS} pb-4 border-b border-ink/10 text-[11px] tracking-[0.2em] uppercase text-ink-muted`}
    >
      <div>Cart</div>
      <div>Price</div>
      <div>Quantity</div>
      <div className="text-right">Sub-total</div>
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
  return (
    <div className="text-center py-24">
      <p className="text-lg text-ink-muted mb-8">
        Your cart is empty.
      </p>
      <Link
        to="/products"
        className="inline-block bg-rose-500 hover:bg-rose-600 text-cream font-bold tracking-[0.2em] uppercase text-sm py-4 px-10 rounded-md transition-colors"
      >
        Browse Products
      </Link>
    </div>
  )
}

export default function Cart() {
  const [items, setItems] = useState(INITIAL_CART)
  const navigate = useNavigate()

  const handleQtyChange = (id, qty) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty } : item))
    )
  }

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const isEmpty = items.length === 0

  const handleCheckout = () => {
    if (isEmpty) return
    sessionStorage.setItem('wild.checkoutItems', JSON.stringify(items))
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
              Cart
            </h1>
            <p className="text-sm text-ink-soft leading-relaxed max-w-xl mx-auto">
              Purchase one more item of the sale products and receive free
              shipping! <span className="text-ink-muted">*Automatically applied on the next page.</span>
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
                  <div className="flex items-baseline justify-between mb-3">
                    <p className="text-xl text-ink">Total</p>
                    <p className="font-display text-4xl font-semibold text-ink">
                      ${total}
                    </p>
                  </div>
                  <p className="text-xs text-ink-muted mb-8">
                    Shipping Fee will be calculated at the time of purchase.
                  </p>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-rose-500 hover:bg-rose-600 text-cream font-bold tracking-[0.2em] uppercase text-sm py-5 rounded-md transition-colors"
                  >
                    Checkout
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
