import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import FadeIn from '../components/motion/FadeIn'
import { useLang } from '../contexts/LanguageContext'

export default function NotFound() {
  const { t } = useLang()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Nav />

      <main className="flex-1 flex items-center justify-center px-8 py-32">
        <FadeIn className="text-center max-w-md">
          <p className="font-display text-7xl md:text-8xl font-bold text-rose-500 mb-4">
            404
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink mb-4">
            {t('notFound.title')}
          </h1>
          <p className="text-ink-soft leading-relaxed mb-10">
            {t('notFound.message')}
          </p>
          <Link
            to="/home"
            className="inline-block bg-rose-500 hover:bg-rose-600 text-cream font-bold tracking-[0.2em] uppercase text-sm py-4 px-10 rounded-md transition-colors"
          >
            {t('notFound.cta')}
          </Link>
        </FadeIn>
      </main>

      <Footer />
    </div>
  )
}
