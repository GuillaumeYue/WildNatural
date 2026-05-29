import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import heroProductImg from '../assets/hero-product.png'
import productSerumImg from '../assets/product-serum.png'
import productCleanserImg from '../assets/product-cleanser.png'
import productCreamImg from '../assets/product-cream.png'

/**
 * Product line.
 *   - FEATURED_PRODUCT shows in the top hero showcase.
 *   - ALL_PRODUCTS feed the carousel below.
 * When Sara adds more SKUs, push to ALL_PRODUCTS and lower
 * COMING_SOON_PLACEHOLDERS to keep the carousel at 4 visible cards.
 */
const FEATURED_PRODUCT = {
  name: 'WILD Botanical Serum',
  tagline: 'Meet Our First Creation',
  description:
    'Handcrafted with the freshest natural ingredients, our debut serum is designed to nourish, hydrate, and bring out your natural glow.',
  price: 48,
  image: heroProductImg,
}

const ALL_PRODUCTS = [
  {
    name: 'WILD Botanical Serum',
    description: 'Nourish, Hydrate, Illuminate – 30ml.',
    price: 48,
    image: productSerumImg,
  },
  {
    name: 'WILD Hydrating Cleanser',
    description: 'Pure Bliss, Daily Cleanse – 50ml.',
    price: 34,
    image: productCleanserImg,
  },
  {
    name: 'WILD Renewal Cream',
    description: 'Brighten, Nourish, Transform – 15ml.',
    price: 52,
    image: productCreamImg,
  },
]

const COMING_SOON_PLACEHOLDERS = 1

function HeroShowcase({ product }) {

  const navigate = useNavigate()

  const handleShopNow = () => {
    const cartItem = {
      id: product.name,
      name: product.name,
      size: '30 ml',
      price: product.price,
      qty: 1,
      image: product.image,
    }

    sessionStorage.setItem('wild.checkoutItems', JSON.stringify([cartItem]))
    navigate('/cart')
  }
  return (
    <section className="bg-blush-50 pt-32 pb-20 px-10">
      <div className="mx-auto max-w-[1400px]">
        <p className="text-xs tracking-[0.3em] uppercase text-ink-muted mb-12">
          Home / Products
        </p>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: copy + buttons */}
          <div className="max-w-xl">
            <p className="text-xs tracking-[0.3em] uppercase text-rose-500 mb-6 font-semibold">
              {product.tagline}
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-ink mb-8 leading-[1.05]">
              {product.name}
            </h1>
            <p className="text-lg text-ink-soft leading-relaxed mb-10">
              {product.description}
            </p>
            <div className="flex items-center gap-4 flex-wrap mb-8">
              <button
                type="button"
                onClick={handleShopNow}
                className="rounded-md bg-rose-500 px-10 py-4 text-sm font-bold tracking-[0.2em] text-cream transition-colors hover:bg-rose-600"
              >
                SHOP NOW
              </button>
              <Link
                to="/about"
                className="rounded-md border-2 border-ink/20 px-10 py-4 text-sm font-bold tracking-[0.2em] text-ink transition-colors hover:border-rose-500 hover:text-rose-500"
              >
                LEARN MORE
              </Link>
            </div>
            <p className="font-display text-3xl font-semibold text-ink">
              ${product.price}.00
            </p>
          </div>

          {/* Right: product image on blush blob backdrop */}
          <div className="relative aspect-square max-w-[560px] w-full mx-auto">
            <div className="absolute inset-6 bg-blush-200 rounded-[42%]" />
            <img
              src={product.image}
              alt={product.name}
              className="relative w-full h-full object-contain drop-shadow-2xl p-6"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function TaglineStrip() {
  return (
    <section className="bg-blush-100 py-16 px-10">
      <div className="mx-auto max-w-[1400px] text-center">
        <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-ink tracking-tight">
          HANDCRAFTED WITH CARE
        </h2>
      </div>
    </section>
  )
}

function ProductCard({ product }) {
  return (
    <article className="flex-shrink-0 w-72 snap-start group cursor-pointer">
      <div className="aspect-[4/5] bg-blush-50 mb-5 overflow-hidden flex items-center justify-center">
        <img
          src={product.image}
          className="max-w-[85%] max-h-[85%] object-contain transition-transform duration-500 group-hover:scale-105"
          alt={product.name}
        />
      </div>
      <h3 className="font-display text-lg font-semibold text-rose-500 mb-2">
        {product.name}
      </h3>
      <p className="text-sm text-ink-soft mb-3 leading-relaxed">
        {product.description}
      </p>
      <p className="font-medium text-ink">${product.price.toFixed(2)}</p>
    </article>
  )
}

function ComingSoonCard() {
  return (
    <article
      className="flex-shrink-0 w-72 snap-start"
      aria-label="Future product placeholder"
    >
      <div className="aspect-[4/5] mb-5 flex items-center justify-center border border-dashed border-blush-200 bg-blush-50/30">
        <p className="text-ink-muted/60 italic text-sm">Coming Soon</p>
      </div>
      <h3 className="font-display text-lg font-semibold text-ink-muted mb-2">
        Future Product
      </h3>
      <p className="text-sm text-ink-muted/70 leading-relaxed">
        Watch this space.
      </p>
    </article>
  )
}

function ArrowButton({ direction, onClick }) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      onClick={onClick}
      className="shrink-0 w-12 h-12 rounded-full border border-ink/15 flex items-center justify-center text-ink transition-colors hover:border-rose-500 hover:text-rose-500 bg-white"
      aria-label={direction === 'left' ? 'Previous' : 'Next'}
    >
      <Icon className="w-5 h-5" strokeWidth={1.8} />
    </button>
  )
}

function CarouselSection({ products, placeholderCount }) {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (!scrollRef.current) return
    const cardWidth = 312 // w-72 (288) + gap-6 (24)
    scrollRef.current.scrollBy({
      left: direction * cardWidth,
      behavior: 'smooth',
    })
  }

  return (
    <section className="bg-white py-20 px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-rose-500 mb-2 font-semibold">
            Our Collection
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink">
            Browse our line
          </h2>
        </div>

        {/* Carousel: arrows flank the scrollable card row */}
        <div className="flex items-center gap-4">
          <ArrowButton direction="left" onClick={() => scroll(-1)} />

          <div
            ref={scrollRef}
            className="flex-1 flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 scrollbar-hide"
          >
            {products.map((p) => (
              <ProductCard key={p.name} product={p} />
            ))}
            {Array.from({ length: placeholderCount }).map((_, i) => (
              <ComingSoonCard key={`placeholder-${i}`} />
            ))}
          </div>

          <ArrowButton direction="right" onClick={() => scroll(1)} />
        </div>
      </div>
    </section>
  )
}

export default function Products() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        <HeroShowcase product={FEATURED_PRODUCT} />
        <TaglineStrip />
        <CarouselSection
          products={ALL_PRODUCTS}
          placeholderCount={COMING_SOON_PLACEHOLDERS}
        />
      </main>
      <Footer />
    </div>
  )
}
