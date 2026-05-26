import { useState } from 'react'
import Nav from '../components/Nav'

const INGREDIENTS = [
  'Rosemary',
  'Lemon',
  'Orange',
  'Osmanthus Flowers',
  'Malva',
]

export default function Customize() {
  const [selectedIngredients, setSelectedIngredients] = useState([])

  const toggleIngredient = (ingredient) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(
        selectedIngredients.filter((item) => item !== ingredient)
      )
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient])
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Nav />

      <main className="pt-32 pb-24 px-10">
        <div className="mx-auto max-w-[1000px]">

          {/* HEADER */}

          <p className="text-xs tracking-[0.3em] uppercase text-ink-muted mb-4">
            Home / Customize
          </p>

          <h1 className="font-display text-5xl md:text-6xl font-semibold text-ink mb-8">
            Personalized Skincare
          </h1>

          <p className="max-w-3xl text-lg text-ink-soft leading-relaxed mb-16">
            Request a fully customized skincare experience tailored to your
            ingredients, preferences, and skin concerns.
          </p>

          {/* FORM */}

          <div className="bg-blush-50 p-10 rounded-lg">

            <form className="space-y-10">

              {/* EMAIL */}

              <div>
                <label className="block text-sm tracking-[0.15em] uppercase text-rose-500 font-semibold mb-4">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full border border-ink/10 bg-white px-5 py-4 outline-none focus:border-rose-500 rounded-md"
                />
              </div>

              {/* INGREDIENTS */}

              <div>
                <label className="block text-sm tracking-[0.15em] uppercase text-rose-500 font-semibold mb-5">
                  Ingredients That Interest You
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {INGREDIENTS.map((ingredient) => (
                    <button
                      type="button"
                      key={ingredient}
                      onClick={() => toggleIngredient(ingredient)}
                      className={`border rounded-md px-5 py-4 text-left transition-all
                      ${
                        selectedIngredients.includes(ingredient)
                          ? 'bg-rose-500 text-white border-rose-500'
                          : 'bg-white border-ink/10 text-ink hover:border-rose-500'
                      }`}
                    >
                      {ingredient}
                    </button>
                  ))}

                </div>
              </div>

              {/* SKIN NEEDS */}

              <div>
                <label className="block text-sm tracking-[0.15em] uppercase text-rose-500 font-semibold mb-4">
                  Skin Needs
                </label>

                <textarea
                  rows="5"
                  placeholder="Example: very dry skin, sensitivity, acne, irritation..."
                  className="w-full border border-ink/10 bg-white px-5 py-4 outline-none focus:border-rose-500 rounded-md resize-none"
                />
              </div>

              {/* SERVICE OPTION */}

              <div>
                <label className="block text-sm tracking-[0.15em] uppercase text-rose-500 font-semibold mb-4">
                  Consultation Option
                </label>

                <select className="w-full border border-ink/10 bg-white px-5 py-4 rounded-md outline-none focus:border-rose-500">
                  <option>PDF Recommendation</option>
                  <option>PDF + Online Meeting</option>
                </select>
              </div>

              {/* POLICY */}

              <div className="border border-rose-200 bg-white p-6 rounded-md">
                <h3 className="font-display text-2xl text-ink mb-4">
                  Appointment & Payment Policy
                </h3>

                <ul className="space-y-3 text-ink-soft leading-relaxed text-sm">
                  <li>
                    • A 50% non-refundable payment is required before work begins.
                  </li>

                  <li>
                    • During your appointment, we will discuss your skincare concerns and needs.
                  </li>

                  <li>
                    • Research and formulation may take up to one week.
                  </li>

                  <li>
                    • Recommendations will be provided through a PDF or PDF + online consultation.
                  </li>

                  <li>
                    • Remaining payment must be completed within 2 months once the product is ready.
                  </li>

                  <li>
                    • Unpaid orders will be cancelled, but client records remain stored securely.
                  </li>
                </ul>
              </div>

              {/* BUTTON */}

              <button
                type="submit"
                className="bg-rose-500 hover:bg-rose-600 transition-colors text-white px-14 py-5 rounded-md tracking-[0.2em] text-sm font-bold"
              >
                SUBMIT REQUEST
              </button>

            </form>
          </div>
        </div>
      </main>
    </div>
  )
}