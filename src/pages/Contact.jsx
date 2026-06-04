import { useState } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function Contact() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-white">
      <Nav />

      <main className="pt-32 pb-24 px-10">
        <div className="mx-auto max-w-[900px]">
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-rose-500 mb-6">
            Contact Us
          </h1>

          <p className="text-lg text-ink-soft mb-12">
            Send us your inquiry.
          </p>

          <form onSubmit={handleSubmit} className="bg-blush-50 p-10 rounded-lg space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input required maxLength="60" placeholder="First Name" className="border border-ink/10 px-5 py-4 rounded-md" />
              <input required maxLength="60" placeholder="Last Name" className="border border-ink/10 px-5 py-4 rounded-md" />
              <input required maxLength="60" type="email" placeholder="Email" className="border border-ink/10 px-5 py-4 rounded-md" />
              <input required maxLength="30" type="tel" placeholder="Phone" className="border border-ink/10 px-5 py-4 rounded-md" />
              <input maxLength="60" placeholder="Company Name (Optional)" className="border border-ink/10 px-5 py-4 rounded-md md:col-span-2" />
              <input required maxLength="30" placeholder="Subject" className="border border-ink/10 px-5 py-4 rounded-md md:col-span-2" />
            </div>

            <textarea
              required
              maxLength="900"
              rows="7"
              placeholder="Message"
              className="w-full border border-ink/10 px-5 py-4 rounded-md resize-none"
            />

            <label className="flex items-start gap-3">
  <input
    type="checkbox"
    required
    className="mt-2 h-5 w-5 accent-rose-500"
  />

  <span className="text-lg leading-relaxed">
    I understand and consent to the collection, use, and storage of my personal information for the purpose of responding to my inquiry and complying with Québec and Canadian privacy laws.
  </span>
</label>

           <label className="flex items-start gap-3">
  <input
    type="checkbox"
    required
    className="mt-2 h-5 w-5 accent-rose-500"
  />

  <span className="text-lg leading-relaxed">
    I confirm that I am submitting this consultation request personally and that the information provided is accurate to the best of my knowledge.
  </span>
</label>

            <button
              type="submit"
              className="w-full bg-rose-500 hover:bg-rose-600 text-white py-5 rounded-md tracking-[0.2em] text-sm font-bold"
            >
              SEND MESSAGE
            </button>

            {sent && (
              <p className="text-rose-500 font-semibold">
                Message sent successfully.
              </p>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}