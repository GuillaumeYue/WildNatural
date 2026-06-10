import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Minus, Plus } from 'lucide-react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import API from '../api/axiosInstance'
import heroProductImg from '../assets/hero-product.png'
import { useLang } from '../contexts/LanguageContext'

function getProductDescription(product, t) {
  if (product?.descKey) return t(product.descKey)
  return product?.description || ''
}

/**
 * Adds `qty` units of a product to the session cart, respecting stock,
 * then sends the shopper to the cart. Mirrors the shape written by the
 * product grid so the two entry points stay compatible.
 */
function addToCart(product, qty, navigate) {
  const stock = Number(product.countInStock)
  if (stock === 0) {
    alert('This product is out of stock')
    return
  }

  const existingItems =
    JSON.parse(sessionStorage.getItem('wild.checkoutItems')) || []
  const existingItem = existingItems.find((item) => item.id === product._id)
  const currentQty = existingItem ? existingItem.qty : 0

  if (currentQty + qty > stock) {
    alert(`Only ${stock} item(s) available in stock`)
    return
  }

  let updatedItems
  if (existingItem) {
    updatedItems = existingItems.map((item) =>
      item.id === product._id ? { ...item, qty: item.qty + qty } : item
    )
  } else {
    updatedItems = [
      ...existingItems,
      {
        id: product._id,
        name: product.name,
        size: product.category || 'Product',
        price: Number(product.price),
        qty,
        image: product.image,
      },
    ]
  }

  sessionStorage.setItem('wild.checkoutItems', JSON.stringify(updatedItems))
  navigate('/cart')
}

function QuantityStepper({ qty, setQty, max }) {
  const dec = () => setQty((q) => Math.max(1, q - 1))
  const inc = () => setQty((q) => Math.min(max, q + 1))

  return (
    <div className="inline-flex items-center rounded-md border border-ink/15">
      <button
        type="button"
        onClick={dec}
        disabled={qty <= 1}
        aria-label="Decrease quantity"
        className="flex h-11 w-11 items-center justify-center text-ink transition-colors hover:text-rose-500 disabled:opacity-30 disabled:hover:text-ink"
      >
        <Minus className="h-4 w-4" strokeWidth={1.8} />
      </button>
      <span className="w-12 text-center text-sm font-semibold text-ink" aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        onClick={inc}
        disabled={qty >= max}
        aria-label="Increase quantity"
        className="flex h-11 w-11 items-center justify-center text-ink transition-colors hover:text-rose-500 disabled:opacity-30 disabled:hover:text-ink"
      >
        <Plus className="h-4 w-4" strokeWidth={1.8} />
      </button>
    </div>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLang()

  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError('')
        const { data } = await API.get(`/products/${id}`)
        if (active) setProduct(data)
      } catch (err) {
        if (active)
          setError(
            err.response?.status === 404
              ? 'This product could not be found.'
              : 'Unable to load this product right now.'
          )
      } finally {
        if (active) setLoading(false)
      }
    }
    fetchProduct()
    return () => {
      active = false
    }
  }, [id])

  const stock = Number(product?.countInStock ?? 0)
  const outOfStock = stock === 0

  return (
    <div className="min-h-screen bg-white">
      <Nav />

      <main className="pt-28 pb-24 px-10">
        <div className="mx-auto max-w-[1200px]">
          <Link
            to="/products"
            className="mb-10 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted transition-colors hover:text-rose-500"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.8} />
            {t('nav.products')}
          </Link>

          {loading ? (
            <p className="py-24 text-center text-ink-muted">Loading…</p>
          ) : error ? (
            <div className="py-24 text-center">
              <p className="mb-6 text-rose-500">{error}</p>
              <Link
                to="/products"
                className="text-sm font-semibold uppercase tracking-[0.2em] text-ink hover:text-rose-500"
              >
                Back to products
              </Link>
            </div>
          ) : (
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Image */}
              <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-blush-50">
                <div className="absolute inset-8 rounded-[42%] bg-blush-200" />
                <img
                  src={product.image || heroProductImg}
                  alt={product.name}
                  className="relative max-h-[80%] max-w-[80%] object-contain drop-shadow-2xl"
                />
              </div>

              {/* Details */}
              <div className="flex flex-col justify-center">
                {product.category && (
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
                    {product.category}
                  </p>
                )}

                <h1 className="mb-4 font-display text-3xl font-semibold text-ink md:text-4xl">
                  {product.name}
                </h1>

                <p className="mb-6 text-2xl font-medium text-ink">
                  ${Number(product.price).toFixed(2)}
                </p>

                <p className="mb-8 max-w-xl leading-relaxed text-ink-soft">
                  {getProductDescription(product, t)}
                </p>

                {/* Stock signal */}
                {outOfStock ? (
                  <p className="mb-8 text-sm font-medium text-ink-muted">
                    Out of stock
                  </p>
                ) : stock <= 5 ? (
                  <p className="mb-8 text-sm font-medium text-rose-500">
                    Only {stock} left in stock
                  </p>
                ) : (
                  <p className="mb-8 text-sm font-medium text-ink-muted">
                    In stock
                  </p>
                )}

                {!outOfStock && (
                  <div className="mb-8">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
                      Quantity
                    </p>
                    <QuantityStepper qty={qty} setQty={setQty} max={stock} />
                  </div>
                )}

                <button
                  type="button"
                  disabled={outOfStock}
                  onClick={() => addToCart(product, qty, navigate)}
                  className="w-full max-w-xs rounded-md bg-rose-500 px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-cream transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {outOfStock ? 'Out of stock' : 'Add to cart'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
