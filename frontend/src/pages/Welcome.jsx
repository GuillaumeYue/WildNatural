import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logoWild from '../assets/logo-wild.png'
import { useAuth } from '../contexts/AuthContext'
import { useLang } from '../contexts/LanguageContext'

export default function Welcome() {
  const { user } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()

  // Logged-in users skip the entry page and go straight to the main site.
  useEffect(() => {
    if (user) navigate('/home', { replace: true })
  }, [user, navigate])

  return (
    <div className="min-h-screen bg-blush-50 relative overflow-hidden flex flex-col items-center justify-center px-8 py-20">
      {/* Main composition */}
      <div className="relative max-w-2xl text-center">
        {/* Brand logo — centerpiece. mix-blend-mode "multiply" makes
            the white PNG background fall away on top of the blush page,
            so the red blob reads as if it were on a transparent canvas. */}
        <img
          src={logoWild}
          alt="WILD Natural"
          className="mx-auto h-32 lg:h-44 w-auto mb-8"
          style={{ mixBlendMode: 'multiply' }}
        />

        <p className="text-xs tracking-[0.3em] uppercase text-rose-500 font-semibold mb-5">
          {t('welcome.label')}
        </p>

        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-ink leading-[1.05] mb-6">
          {t('welcome.headline1')}{' '}
          <span className="italic font-normal">{t('welcome.headline2')}</span>
        </h1>

        <p className="text-lg text-ink-soft italic leading-relaxed mb-10 max-w-md mx-auto">
          {t('welcome.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            to="/login"
            className="text-center bg-rose-500 hover:bg-rose-600 text-cream font-bold tracking-[0.2em] uppercase text-sm py-4 px-10 rounded-md transition-colors"
          >
            {t('welcome.signIn')}
          </Link>
          <Link
            to="/signup"
            className="text-center border-2 border-ink/20 hover:border-rose-500 hover:text-rose-500 text-ink font-bold tracking-[0.2em] uppercase text-sm py-4 px-10 rounded-md transition-colors"
          >
            {t('welcome.create')}
          </Link>
        </div>

        <Link
          to="/home"
          className="text-sm text-ink-muted hover:text-rose-500 transition-colors inline-flex items-center gap-1"
        >
          {t('welcome.guest')} <span aria-hidden>→</span>
        </Link>
      </div>

      {/* Bottom wave — takes up roughly the lower third */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[30vh] text-rose-500/20 pointer-events-none"
        viewBox="0 0 1440 100"
        fill="currentColor"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d="M0 60 Q 360 10, 720 60 T 1440 60 V 100 H 0 Z" />
      </svg>
    </div>
  )
}
