import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../api/authApi'

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register(formData)
      navigate('/login')
    } catch (err) {
      setError('We could not create your account. Please check your details and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = 'w-full bg-white border border-ink/15 rounded-md px-4 py-3 text-ink placeholder:text-ink-muted/50 outline-none transition-all focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15'
  const labelClass = 'block text-[11px] font-medium tracking-[0.15em] text-ink-soft uppercase mb-2'

  return (
    <div className="min-h-screen flex items-center justify-center bg-blush-50 px-6 py-12">
      <div className="w-full max-w-md bg-white border border-blush-200/70 px-10 py-12 sm:px-12 rounded-lg shadow-sm">
        <div className="text-center mb-10">
          <p className="text-[11px] font-semibold tracking-[0.3em] text-rose-500 mb-4">
            WILD NATURAL
          </p>
          <h1 className="font-display text-4xl font-semibold text-ink">
            Create your account
          </h1>
          <p className="mt-3 text-sm text-ink-muted">
            Start your skincare journey with us.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className={labelClass}>Full name</label>
            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Jane Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>Email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>Password</label>
            <input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={inputClass}
            />
          </div>

          {error && (
            <p className="text-sm text-rose-500" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-rose-500 hover:bg-rose-600 text-cream font-bold tracking-[0.2em] uppercase text-sm py-4 rounded-md transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-ink-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-rose-500 font-medium hover:text-rose-600 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
