import { Link } from 'react-router-dom'
import { Instagram, Twitter, Facebook } from 'lucide-react'
import { useLang } from '../contexts/LanguageContext'

const COLUMNS = [
  {
    titleKey: 'footer.col.shop',
    links: [
      { tKey: 'footer.allProducts', to: '/products' },
      { tKey: 'footer.serum',       to: '/products' },
      { tKey: 'footer.cleanser',    to: '/products' },
      { tKey: 'footer.cream',       to: '/products' },
    ],
  },
  {
    titleKey: 'footer.col.brand',
    links: [
      { tKey: 'footer.about',   to: '/about' },
      { tKey: 'footer.story',   to: '/about' },
      { tKey: 'footer.sustain', to: '/about' },
    ],
  },
  {
    titleKey: 'footer.col.help',
    links: [
      { tKey: 'footer.customize', to: '/customize' },
      { tKey: 'footer.shipping' },
      { tKey: 'footer.faq' },
    ],
  },
  {
    titleKey: 'footer.col.contact',
    links: [
      { tKey: 'footer.contactUs', to: '/contact' },
      { tKey: 'footer.newsletter' },
    ],
  },
]

const LEGAL_KEYS = [
  'footer.legal.company',
  'footer.legal.privacy',
  'footer.legal.terms',
  'footer.legal.refund',
]

function FooterLink({ link, label }) {
  const className = 'text-sm text-cream/65 hover:text-cream transition-colors'
  if (link.to) {
    return <Link to={link.to} className={className}>{label}</Link>
  }
  return <a href="#" className={className}>{label}</a>
}

export default function Footer() {
  const { t } = useLang()
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
              {t('footer.followUs')}
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
            <div key={col.titleKey}>
              <h3 className="font-semibold text-cream mb-6 text-base">
                {t(col.titleKey)}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.tKey}>
                    <FooterLink link={link} label={t(link.tKey)} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-cream/10 flex flex-wrap items-center justify-between gap-4 text-xs text-cream/55">
          <p>{t('footer.copyright')}</p>
          <div className="flex flex-wrap gap-6">
            {LEGAL_KEYS.map((key) => (
              <a key={key} href="#" className="hover:text-cream transition-colors">
                {t(key)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
