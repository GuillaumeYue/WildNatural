import Nav from '../components/Nav'
import MaskedIcon from '../components/MaskedIcon'
import iconLeaves from '../assets/icon-leaves.png'
import iconRabbit from '../assets/icon-rabbit.png'
import iconBag from '../assets/icon-bag.png'
import founderPortrait from '../assets/founder-portrait.jpg'

const VALUES = [
  {
    icon: iconLeaves,
    title: 'Naturally Sourced',
    body: 'Plant-led ingredients chosen for what they do, not how they sound.',
  },
  {
    icon: iconRabbit,
    title: 'Cruelty-Free',
    body: 'Never tested on animals — formulated, refined, and trusted by humans.',
  },
  {
    icon: iconBag,
    title: 'Eco-Conscious Packaging',
    body: 'Recycled and recyclable materials, designed for a smaller footprint.',
  },
]

function HeroBand() {
  return (
    <section className="bg-rose-500 text-cream pt-40 pb-24 px-10">
      <div className="mx-auto max-w-[1400px]">
        <p className="text-[11px] tracking-[0.3em] uppercase opacity-70 mb-6 font-medium">
          Home / Our Brand
        </p>
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold mb-8">
          Our Story
        </h1>
        <p className="text-lg md:text-xl italic max-w-2xl opacity-90 leading-relaxed">
          Clean skincare, crafted with intention. We make products that honor
          your skin and the world it lives in.
        </p>
      </div>
    </section>
  )
}

function Heritage() {
  return (
    <section className="bg-white py-24 px-10">
      <div className="mx-auto max-w-[1200px] grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-rose-500 mb-4 font-semibold">
            Heritage
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-6 text-ink">
            A quiet beginning.
          </h2>
          <div className="space-y-4 text-ink-soft leading-relaxed text-base">
            <p>
              WILD Natural began at a kitchen table — small batches, careful
              hands, and a refusal to compromise on what touches your skin.
            </p>
            <p>
              Today our team formulates every product with the same intention:
              ingredients you can pronounce, results you can see, and a story
              you can stand behind.
            </p>
          </div>
        </div>
        <div className="aspect-[4/5] rounded-lg overflow-hidden bg-blush-100">
          <img
            src={founderPortrait}
            alt="WILD Natural founder portrait"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}

function OurPromise() {
  return (
    <section className="bg-blush-50 py-24 px-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-rose-500 mb-4 font-semibold">
            Our Promise
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink">
            Beauty that respects.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {VALUES.map(({ icon, title, body }) => (
            <div key={title} className="text-center md:text-left">
              <MaskedIcon
                src={icon}
                alt={title}
                className="h-14 w-14 bg-rose-500 mb-6 mx-auto md:mx-0"
              />
              <h3 className="font-display text-xl font-semibold mb-3 text-ink">
                {title}
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Closing() {
  return (
    <section className="bg-rose-500 text-cream py-24 px-10">
      <div className="mx-auto max-w-[800px] text-center">
        <p className="text-[11px] tracking-[0.3em] uppercase opacity-70 mb-6 font-medium">
          Diversity &amp; Inclusion
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-semibold mb-6">
          Beauty for everyone.
        </h2>
        <p className="text-lg italic opacity-90 leading-relaxed">
          Beauty is a form of self-expression, and should be inclusive of every
          culture and tradition. Our products are made for every skin, every
          story, every ritual.
        </p>
      </div>
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
    </div>
  )
}
