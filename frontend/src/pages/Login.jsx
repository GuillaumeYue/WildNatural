import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/authApi'

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(formData)
      navigate('/')
    } catch (err) {
      setError('Email or password is incorrect. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blush-50 px-6 py-12">
      <div className="w-full max-w-md bg-white border border-blush-200/70 px-10 py-12 sm:px-12 rounded-lg shadow-sm">
        <div className="text-center mb-10">
          <p className="text-[11px] font-semibold tracking-[0.3em] text-rose-500 mb-4">
            WILD NATURAL
          </p>
          <h1 className="font-display text-4xl font-semibold text-ink">
            Welcome back
          </h1>
          <p className="mt-3 text-sm text-ink-muted">
            Sign in to continue to your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-[11px] font-medium tracking-[0.15em] text-ink-soft uppercase mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-white border border-ink/15 rounded-md px-4 py-3 text-ink placeholder:text-ink-muted/50 outline-none transition-all focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[11px] font-medium tracking-[0.15em] text-ink-soft uppercase mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-white border border-ink/15 rounded-md px-4 py-3 text-ink placeholder:text-ink-muted/50 outline-none transition-all focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
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
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-ink-muted">
          New to WILD Natural?{' '}
          <Link to="/signup" className="text-rose-500 font-medium hover:text-rose-600 transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
