import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import heroProductImg from '../assets/hero-product.png'
import productSerumImg from '../assets/product-serum.png'
import productCleanserImg from '../assets/product-cleanser.png'
import productCreamImg from '../assets/product-cream.png'
import { useLang } from '../contexts/LanguageContext'
import FadeIn from '../components/motion/FadeIn'

/**
 * Product line. Names are brand product names (kept identical across
 * languages); descriptions are translated via dictionary keys.
 *   - FEATURED_PRODUCT shows in the top hero showcase.
 *   - ALL_PRODUCTS feed the carousel below.
 * When Sara adds more SKUs, push to ALL_PRODUCTS and lower
 * COMING_SOON_PLACEHOLDERS to keep the carousel at 4 visible cards.
 */
const FEATURED_PRODUCT = {
  name: 'WILD Botanical Serum',
  descKey: 'products.featuredDesc',
  price: 48,
  image: heroProductImg,
}

const ALL_PRODUCTS = [
  { name: 'WILD Botanical Serum',   descKey: 'products.serumDesc',    price: 48, image: productSerumImg },
  { name: 'WILD Hydrating Cleanser', descKey: 'products.cleanserDesc', price: 34, image: productCleanserImg },
  { name: 'WILD Renewal Cream',     descKey: 'products.creamDesc',    price: 52, image: productCreamImg },
]

const COMING_SOON_PLACEHOLDERS = 1

function HeroShowcase({ product }) {
  const { t } = useLang()
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
            <p className="text-lg text-ink-soft leading-relaxed mb-10">
              {t(product.descKey)}
            </p>
            <div className="flex items-center gap-4 flex-wrap mb-8">
              <button
                type="button"
                onClick={handleShopNow}
                className="rounded-md bg-rose-500 px-10 py-4 text-sm font-bold tracking-[0.2em] text-cream transition-colors hover:bg-rose-600"
              >
                {t('products.shopNow')}
              </button>
              <Link
                to="/about"
                className="rounded-md border-2 border-ink/20 px-10 py-4 text-sm font-bold tracking-[0.2em] text-ink transition-colors hover:border-rose-500 hover:text-rose-500"
              >
                {t('products.learnMore')}
              </Link>
            </div>
            <p className="font-display text-3xl font-semibold text-ink">
              ${product.price}.00
            </p>
          </FadeIn>

          {/* Right: product image on blush blob backdrop */}
          <FadeIn delay={0.15} className="relative aspect-square max-w-[560px] w-full mx-auto">
            <div className="absolute inset-6 bg-blush-200 rounded-[42%]" />
            <img
              src={product.image}
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
        {t(product.descKey)}
      </p>
      <p className="font-medium text-ink">${product.price.toFixed(2)}</p>
    </article>
  )
}

function ComingSoonCard() {
  const { t } = useLang()
  return (
    <article
      className="flex-shrink-0 w-72 snap-start"
      aria-label="Future product placeholder"
    >
      <div className="aspect-[4/5] mb-5 flex items-center justify-center border border-dashed border-blush-200 bg-blush-50/30">
        <p className="text-ink-muted/60 italic text-sm">{t('products.comingSoon')}</p>
      </div>
      <h3 className="font-display text-lg font-semibold text-ink-muted mb-2">
        {t('products.future')}
      </h3>
      <p className="text-sm text-ink-muted/70 leading-relaxed">
        {t('products.watchSpace')}
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
  const { t } = useLang()
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
        <FadeIn className="mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-rose-500 mb-2 font-semibold">
            {t('products.collectionLabel')}
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink">
            {t('products.collectionTitle')}
          </h2>
        </FadeIn>

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
