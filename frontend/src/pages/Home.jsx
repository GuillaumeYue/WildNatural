import Nav from '../components/Nav'
import MaskedIcon from '../components/MaskedIcon'
import iconLeaves from '../assets/icon-leaves.png'
import iconRabbit from '../assets/icon-rabbit.png'
import iconBag from '../assets/icon-bag.png'
import heroBottles from '../assets/hero-bottles.png'

const FEATURES = [
  { icon: iconLeaves, label: 'Natural\nIngredients' },
  { icon: iconRabbit, label: 'Cruelty Free' },
  { icon: iconBag,    label: 'Eco-friendly\nPackaging' },
]

function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-white pt-28">
      <div className="absolute inset-y-0 right-0 w-[62%] overflow-hidden">
        <img
          src={heroBottles}
          alt="WILD skincare bottles"
          className="absolute right-0 top-0 h-full w-auto max-w-none"
          style={{ filter: 'hue-rotate(-105deg) saturate(1.6) brightness(0.88)' }}
        />
      </div>

      <div className="absolute bottom-0 left-0 h-[55%] w-full bg-gradient-to-tr from-blush-50 via-blush-50 to-transparent -z-0" />

      <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col px-10 pt-20 pb-32">
        <div className="max-w-[720px]">
          <h1 className="font-display font-bold text-ink text-[48px] leading-[1.05] tracking-[-0.02em] md:text-[60px] lg:text-[72px]">
            Nourish Your Skin,
            <br />
            Radiate Confidence
          </h1>

          <p className="mt-12 max-w-lg text-xl font-medium leading-relaxed text-ink-soft">
            Handcrafted with the freshest quality ingredients and care! :)
          </p>

          <button className="mt-14 rounded-md bg-rose-500 px-14 py-6 text-base font-bold tracking-[0.2em] text-cream transition-colors hover:bg-rose-600">
            SHOP NOW
          </button>
        </div>
      </div>
    </section>
  )
}

function WhyUs() {
  return (
    <section className="relative bg-blush-50 pb-24 pt-16">
      <div className="mx-auto max-w-[1400px] px-10">
        <h2 className="font-display text-2xl font-medium tracking-[0.15em] text-ink">
          WHY US?
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-16 md:grid-cols-3">
          {FEATURES.map(({ icon, label }) => (
            <div key={label} className="flex flex-col items-center text-center">
              <MaskedIcon
                src={icon}
                alt={label.replace('\n', ' ')}
                className="h-20 w-20 bg-rose-500"
              />
              <p className="mt-6 whitespace-pre-line text-base font-normal text-ink">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        <Hero />
        <WhyUs />
      </main>
    </div>
  )
}
