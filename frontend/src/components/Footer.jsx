import { Link } from 'react-router-dom'
import { Instagram, Twitter, Facebook } from 'lucide-react'

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products',         to: '/products' },
      { label: 'Botanical Serum',      to: '/products' },
      { label: 'Hydrating Cleanser',   to: '/products' },
      { label: 'Renewal Cream',        to: '/products' },
    ],
  },
  {
    title: 'Brand',
    links: [
      { label: 'About Us',         to: '/about' },
      { label: 'Our Story',        to: '/about' },
      { label: 'Sustainability',   to: '/about' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Customize',        to: '/customize' },
      { label: 'Shipping & Returns' },
      { label: 'FAQ' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { label: 'Contact Us' },
      { label: 'Newsletter' },
    ],
  },
]

const LEGAL_LINKS = [
  'Company Profile',
  'Privacy Policy',
  'Terms of Service',
  'Refund / Return Policy',
]

function FooterLink({ link }) {
  const className = 'text-sm text-cream/65 hover:text-cream transition-colors'
  if (link.to) {
    return <Link to={link.to} className={className}>{link.label}</Link>
  }
  return <a href="#" className={className}>{link.label}</a>
}

export default function Footer() {
  return (
    <footer className="bg-rose-500 text-cream px-10 pt-16 pb-8 mt-auto">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
          {/* Brand + social */}
          <div className="col-span-2 md:col-span-1">
            <p className="font-display text-3xl font-bold tracking-wide mb-8">
              WILD
            </p>
            <p className="text-[11px] tracking-[0.3em] uppercase text-cream/60 mb-4">
              Follow Us
            </p>
            <div className="flex gap-5">
              <a href="#" aria-label="Twitter" className="text-cream/80 hover:text-cream transition-colors">
                <Twitter className="w-5 h-5" strokeWidth={1.8} />
              </a>
              <a href="#" aria-label="Instagram" className="text-cream/80 hover:text-cream transition-colors">
                <Instagram className="w-5 h-5" strokeWidth={1.8} />
              </a>
              <a href="#" aria-label="Facebook" className="text-cream/80 hover:text-cream transition-colors">
                <Facebook className="w-5 h-5" strokeWidth={1.8} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-semibold text-cream mb-6 text-base">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-cream/10 flex flex-wrap items-center justify-between gap-4 text-xs text-cream/55">
          <p>WILD Natural. © 2026 All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            {LEGAL_LINKS.map((label) => (
              <a key={label} href="#" className="hover:text-cream transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
