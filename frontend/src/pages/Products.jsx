import Nav from '../components/Nav'
import heroBottles from '../assets/hero-bottles.png'

const CATEGORIES = [
  'Cleansers',
  'Serums',
  'Moisturisers',
  'Masks',
  'Eye Care',
  'Toners',
]

const PRODUCTS = [
  {
    name: 'Botanical Cleansing Gel',
    desc: 'Gentle foaming cleanser with French water lily.',
    price: 38,
  },
  {
    name: 'Restorative Night Serum',
    desc: 'Overnight serum that supports skin recovery.',
    price: 64,
  },
  {
    name: 'Hydrating Day Cream',
    desc: 'Featherlight cream with daily hydration.',
    price: 48,
  },
  {
    name: 'Renewing Eye Treatment',
    desc: 'Targeted care for the delicate eye area.',
    price: 56,
  },
  {
    name: 'Purifying Clay Mask',
    desc: 'A weekly deep-cleansing ritual, naturally drawn.',
    price: 34,
  },
  {
    name: 'Balancing Toning Mist',
    desc: 'A refreshing mist that calms and prepares skin.',
    price: 26,
  },
]

function FilterSidebar() {
  return (
    <aside className="hidden lg:block w-60 shrink-0">
      <h2 className="font-display text-xl font-semibold text-ink mb-2">
        Filter
      </h2>

      <div className="border-t border-blush-200 py-6 mt-4">
        <p className="font-semibold text-rose-500 text-xs tracking-[0.15em] uppercase mb-4">
          Category
        </p>
        <ul className="space-y-3">
          {CATEGORIES.map((cat) => (
            <li key={cat} className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-4 h-4 accent-rose-500 cursor-pointer"
                id={`cat-${cat}`}
              />
              <label
                htmlFor={`cat-${cat}`}
                className="text-sm text-ink-soft cursor-pointer hover:text-ink"
              >
                {cat}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <details className="border-t border-blush-200 py-6 group">
        <summary className="font-semibold text-ink text-xs tracking-[0.15em] uppercase cursor-pointer list-none flex items-center justify-between">
          Skin Condition
          <span className="text-ink-muted transition-transform group-open:rotate-180">⌄</span>
        </summary>
      </details>

      <details className="border-t border-blush-200 py-6 group">
        <summary className="font-semibold text-ink text-xs tracking-[0.15em] uppercase cursor-pointer list-none flex items-center justify-between">
          Price
          <span className="text-ink-muted transition-transform group-open:rotate-180">⌄</span>
        </summary>
      </details>
    </aside>
  )
}

function ProductCard({ name, desc, price }) {
  return (
    <article className="group cursor-pointer">
      <div className="aspect-[4/5] bg-blush-50 mb-5 overflow-hidden flex items-center justify-center">
        <img
          src={heroBottles}
          className="h-3/4 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
          style={{ filter: 'hue-rotate(-105deg) saturate(1.6) brightness(0.88)' }}
          alt={name}
        />
      </div>
      <h3 className="font-display text-lg font-semibold text-rose-500 mb-2">
        {name}
      </h3>
      <p className="text-sm text-ink-soft mb-3 leading-relaxed">{desc}</p>
      <p className="font-medium text-ink">${price.toFixed(2)}</p>
    </article>
  )
}

export default function Products() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main className="pt-32 pb-24 px-10">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-xs tracking-[0.3em] uppercase text-ink-muted mb-4">
            Home / Products
          </p>

          <div className="flex items-baseline justify-between flex-wrap gap-4 mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink">
              Skincare
              <span className="text-ink-muted text-xl ml-3 font-normal">
                ({PRODUCTS.length})
              </span>
            </h1>
            <label className="text-sm text-ink-soft flex items-center gap-2">
              Sort:
              <select className="bg-white border border-ink/15 rounded-md px-3 py-1.5 text-ink font-medium outline-none focus:border-rose-500 cursor-pointer">
                <option>Recommended</option>
                <option>Newest</option>
                <option>Price — Low to High</option>
                <option>Price — High to Low</option>
              </select>
            </label>
          </div>

          <div className="flex gap-12">
            <FilterSidebar />
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {PRODUCTS.map((product) => (
                <ProductCard key={product.name} {...product} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
