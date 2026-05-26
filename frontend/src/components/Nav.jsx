import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, User } from 'lucide-react'
import logoWild from '../assets/logo-wild.png'

const NAV_ITEMS = [
  { label: 'Home',      to: '/' },
  { label: 'About Us',  to: '/about' },
  { label: 'Products',  to: '/products' },
 { label: 'Customize', to: '/customize' },
]

function Logo() {
  return (
    <Link to="/" aria-label="WILD Natural — Home" className="flex items-center">
      <img
        src={logoWild}
        alt="WILD Natural"
        className="h-14 w-auto"
      />
    </Link>
  )
}

export default function Nav() {
  const { pathname } = useLocation()

  return (
    <header className="absolute inset-x-0 top-0 z-20 bg-white">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-10 py-4">
        <Logo />

        <nav className="flex items-center gap-12">
          {NAV_ITEMS.map((item) => {
            const isActive = item.to !== null && item.to === pathname
            const baseClass = 'text-lg font-medium transition-colors hover:text-rose-500'
            const stateClass = isActive
              ? 'border-b-2 border-rose-500 pb-1 text-ink font-semibold'
              : 'text-ink-soft'

            if (item.to === null) {
              return (
                <a
                  key={item.label}
                  href="#"
                  className={`${baseClass} ${stateClass}`}
                  aria-disabled="true"
                  onClick={(e) => e.preventDefault()}
                >
                  {item.label}
                </a>
              )
            }
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`${baseClass} ${stateClass}`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-5 text-ink">
          <button aria-label="Cart" className="transition-opacity hover:opacity-70">
            <ShoppingCart className="h-6 w-6" strokeWidth={1.8} />
          </button>
          <Link
            to="/login"
            aria-label="Account"
            className="transition-opacity hover:opacity-70"
          >
            <User className="h-6 w-6" strokeWidth={1.8} />
          </Link>
        </div>
      </div>
    </header>
  )
}
