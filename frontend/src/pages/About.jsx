import Nav from '../components/Nav'
import Footer from '../components/Footer'
import MaskedIcon from '../components/MaskedIcon'
import iconLeaves from '../assets/icon-leaves.png'
import iconRabbit from '../assets/icon-rabbit.png'
import iconBag from '../assets/icon-bag.png'
import founderPortrait from '../assets/founder-portrait.jpg'
import { useLang } from '../contexts/LanguageContext'
import FadeIn from '../components/motion/FadeIn'

const VALUES = [
  { icon: iconLeaves, titleKey: 'about.value.natural', bodyKey: 'about.value.naturalBody' },
  { icon: iconRabbit, titleKey: 'about.value.cruelty', bodyKey: 'about.value.crueltyBody' },
  { icon: iconBag,    titleKey: 'about.value.eco',     bodyKey: 'about.value.ecoBody' },
]

function HeroBand() {
  const { t } = useLang()
  return (
    <section className="bg-rose-500 text-cream pt-40 pb-24 px-10">
      <div className="mx-auto max-w-[1400px]">
        <p className="text-[11px] tracking-[0.3em] uppercase opacity-70 mb-6 font-medium">
          {t('about.crumb')}
        </p>
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold mb-8">
          {t('about.heroTitle')}
        </h1>
        <p className="text-lg md:text-xl italic max-w-2xl opacity-90 leading-relaxed">
          {t('about.heroTagline')}
        </p>
      </div>
    </section>
  )
}

function Heritage() {
  const { t } = useLang()
  return (
    <section className="bg-white py-24 px-10">
      <FadeIn className="mx-auto max-w-[1200px] grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-rose-500 mb-4 font-semibold">
            {t('about.heritageLabel')}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-6 text-ink">
            {t('about.heritageTitle')}
          </h2>
          <div className="space-y-4 text-ink-soft leading-relaxed text-base">
            <p>{t('about.heritageBody1')}</p>
            <p>{t('about.heritageBody2')}</p>
            <p>{t('about.heritageBody3')}</p>
          </div>
        </div>
        <div className="aspect-[4/5] rounded-lg overflow-hidden bg-blush-100">
          <img
            src={founderPortrait}
            alt="WILD Natural founder portrait"
            className="w-full h-full object-cover"
          />
        </div>
      </FadeIn>
    </section>
  )
}

function OurPromise() {
  const { t } = useLang()
  return (
    <section className="bg-blush-50 py-24 px-10">
      <FadeIn className="mx-auto max-w-[1200px]">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-rose-500 mb-4 font-semibold">
            {t('about.promiseLabel')}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink">
            {t('about.promiseTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {VALUES.map(({ icon, titleKey, bodyKey }) => (
            <div key={titleKey} className="text-center md:text-left">
              <MaskedIcon
                src={icon}
                alt={t(titleKey)}
                className="h-14 w-14 bg-rose-500 mb-6 mx-auto md:mx-0"
              />
              <h3 className="font-display text-xl font-semibold mb-3 text-ink">
                {t(titleKey)}
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed">{t(bodyKey)}</p>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  )
}

function Closing() {
  const { t } = useLang()
  return (
    <section className="bg-rose-500 text-cream py-24 px-10">
      <FadeIn className="mx-auto max-w-[800px] text-center">
        <p className="text-[11px] tracking-[0.3em] uppercase opacity-70 mb-6 font-medium">
          {t('about.inclusionLabel')}
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-semibold mb-6">
          {t('about.inclusionTitle')}
        </h2>
        <p className="text-lg italic opacity-90 leading-relaxed">
          {t('about.inclusionBody')}
        </p>
      </FadeIn>
    </section>
  )
}

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        <HeroBand />
        <Heritage />
        <OurPromise />
        <Closing />
      </main>
      <Footer />
    </div>
  )
}
