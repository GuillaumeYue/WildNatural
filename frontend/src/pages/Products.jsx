import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import API from '../api/axiosInstance'
import heroProductImg from '../assets/hero-product.png'
import { useLang } from '../contexts/LanguageContext'
import FadeIn from '../components/motion/FadeIn'

const FALLBACK_FEATURED_PRODUCT = {
  _id: 'featured-product',
  name: 'WILD Botanical Serum',
  descKey: 'products.featuredDesc',
  description:
    'Handcrafted with the freshest natural ingredients, our debut serum is designed to nourish, hydrate, and bring out your natural glow.',
  price: 48,
  image: heroProductImg,
  countInStock: 1,
}

function getProductDescription(product, t) {
  if (product.descKey) return t(product.descKey)
  return product.description || ''
}

function addToCart(product, navigate) {
  const existingItems =
    JSON.parse(sessionStorage.getItem('wild.checkoutItems')) || []

  const existingItem = existingItems.find((item) => item.id === product._id)

  if (product.countInStock === 0) {
    alert('This product is out of stock')
    return
  }

  if (existingItem && existingItem.qty >= product.countInStock) {
    alert(`Only ${product.countInStock} item(s) available in stock`)
    return
  }

  let updatedItems

  if (existingItem) {
    updatedItems = existingItems.map((item) =>
      item.id === product._id ? { ...item, qty: item.qty + 1 } : item
    )
  } else {
    updatedItems = [
      ...existingItems,
      {
        id: product._id,
        name: product.name,
        size: product.category || 'Product',
        price: Number(product.price),
        qty: 1,
        image: product.image,
      },
    ]
  }

  sessionStorage.setItem('wild.checkoutItems', JSON.stringify(updatedItems))
  navigate('/cart')
}

function HeroShowcase({ product }) {
  const { t } = useLang()
  const navigate = useNavigate()

  return (
    <section className="bg-blush-50 pt-32 pb-20 px-10">
      <div className="mx-auto max-w-[1400px]">
        <p className="text-xs tracking-[0.3em] uppercase text-ink-muted mb-12">
          {t('products.crumb')}
        </p>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: copy + buttons */}
          <FadeIn className="max-w-xl">
            <p className="text-xs tracking-[0.3em] uppercase text-rose-500 mb-6 font-semibold">
              {t('products.taglineLabel')}
            </p>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-ink mb-8 leading-[1.05]">
              {product.name}
            </h1>

            <p className="text-lg text-ink-soft leading-relaxed mb-6">
              {getProductDescription(product, t)}
            </p>

            {product.countInStock <= 5 && product.countInStock > 0 && (
              <p className="text-sm text-rose-500 font-medium mb-4">
                Only {product.countInStock} left in stock
              </p>
            )}

            {product.countInStock === 0 && (
              <p className="text-sm text-ink-muted font-medium mb-4">
                Out of stock
              </p>
            )}

            <div className="flex items-center gap-4 flex-wrap mb-8">
              <button
                type="button"
                disabled={product.countInStock === 0}
                onClick={() => addToCart(product, navigate)}
                className="rounded-md bg-rose-500 px-10 py-4 text-sm font-bold tracking-[0.2em] text-cream transition-colors hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.countInStock === 0
                  ? 'OUT OF STOCK'
                  : t('products.shopNow')}
              </button>

              <Link
                to="/about"
                className="rounded-md border-2 border-ink/20 px-10 py-4 text-sm font-bold tracking-[0.2em] text-ink transition-colors hover:border-rose-500 hover:text-rose-500"
              >
                {t('products.learnMore')}
              </Link>
            </div>

            <p className="font-display text-3xl font-semibold text-ink">
              ${Number(product.price).toFixed(2)}
            </p>
          </FadeIn>

          {/* Right: product image on blush blob backdrop */}
          <FadeIn delay={0.15} className="relative aspect-square max-w-[560px] w-full mx-auto">
            <div className="absolute inset-6 bg-blush-200 rounded-[42%]" />
            <img
              src={product.image || heroProductImg}
              alt={product.name}
              className="relative w-full h-full object-contain drop-shadow-2xl p-6"
            />
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

function TaglineStrip() {
  const { t } = useLang()

  return (
    <section className="bg-blush-100 py-16 px-10">
      <FadeIn className="mx-auto max-w-[1400px] text-center">
        <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-ink tracking-tight">
          {t('products.handcraftedStrip')}
        </h2>
      </FadeIn>
    </section>
  )
}

function ProductCard({ product }) {
  const { t } = useLang()
  const navigate = useNavigate()

  return (
    <article className="w-72 group">
      <div className="aspect-[4/5] bg-blush-50 mb-5 overflow-hidden flex items-center justify-center">
        <img
          src={product.image || heroProductImg}
          className="max-w-[85%] max-h-[85%] object-contain transition-transform duration-500 group-hover:scale-105"
          alt={product.name}
        />
      </div>

      <h3 className="font-display text-lg font-semibold text-rose-500 mb-2">
        {product.name}
      </h3>

      <p className="text-sm text-ink-soft mb-3 leading-relaxed">
        {getProductDescription(product, t)}
      </p>

      {product.countInStock <= 5 && product.countInStock > 0 && (
        <p className="text-xs text-rose-500 font-medium mb-3">
          Only {product.countInStock} left in stock
        </p>
      )}

      {product.countInStock === 0 && (
        <p className="text-xs text-ink-muted font-medium mb-3">
          Out of stock
        </p>
      )}

      <p className="font-medium text-ink mb-4">
        ${Number(product.price).toFixed(2)}
      </p>

      <button
        type="button"
        disabled={product.countInStock === 0}
        onClick={() => addToCart(product, navigate)}
        className="rounded-md bg-rose-500 px-5 py-3 text-xs font-bold tracking-[0.2em] text-cream transition-colors hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {product.countInStock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
      </button>
    </article>
  )
}

function ArrowButton({ direction, onClick }) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight

  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 w-12 h-12 rounded-full border border-ink/15 flex items-center justify-center text-ink transition-colors hover:border-rose-500 hover:text-rose-500 bg-white"
      aria-label={direction === 'left' ? 'Previous' : 'Next'}
    >
      <Icon className="w-5 h-5" strokeWidth={1.8} />
    </button>
  )
}

function ProductSection({ products }) {
  const { t } = useLang()
  const scrollRef = useRef(null)
  const shouldCarousel = products.length > 4

  const scroll = (direction) => {
    if (!scrollRef.current) return

    scrollRef.current.scrollBy({
      left: direction * 312,
      behavior: 'smooth',
    })
  }

  return (
    <section className="bg-white py-20 px-10">
      <div className="mx-auto max-w-[1400px]">
        <FadeIn className="mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-rose-500 mb-2 font-semibold">
            {t('products.collectionLabel')}
          </p>

          <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink">
            {t('products.collectionTitle')}
          </h2>
        </FadeIn>

        {products.length === 0 ? (
          <p className="text-center text-ink-muted py-16">
            No products available.
          </p>
        ) : shouldCarousel ? (
          <div className="flex items-center gap-4">
            <ArrowButton direction="left" onClick={() => scroll(-1)} />

            <div
              ref={scrollRef}
              className="flex-1 flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 scrollbar-hide"
            >
              {products.map((product) => (
                <div key={product._id} className="flex-shrink-0 snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <ArrowButton direction="right" onClick={() => scroll(1)} />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [featuredProduct, setFeaturedProduct] = useState(
    FALLBACK_FEATURED_PRODUCT
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError('')

        const { data } = await API.get('/products')

        setProducts(data)

        if (data.length > 0) {
          setFeaturedProduct({
            ...data[0],
            descKey: data[0].descKey,
          })
        }
      } catch (err) {
        setError('Unable to load products right now.')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Nav />

      <main>
        <HeroShowcase product={featuredProduct} />
        <TaglineStrip />

        {loading ? (
          <section className="py-20 text-center text-ink-muted">
            Loading products...
          </section>
        ) : error ? (
          <section className="py-20 text-center text-rose-500">
            {error}
          </section>
        ) : (
          <ProductSection products={products} />
        )}
      </main>

      <Footer />
    </div>
  )
}