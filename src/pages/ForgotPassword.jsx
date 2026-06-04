import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email.trim()) {
      setMessage('Please enter your email address.')
      return
    }

    setMessage(
      'If an account exists with this email, a password reset link will be sent.'
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blush-50 px-6 py-12">
      <div className="w-full max-w-md bg-white border border-blush-200/70 px-10 py-12 sm:px-12 rounded-lg shadow-sm">
        <div className="text-center mb-10">
          <p className="text-[11px] font-semibold tracking-[0.3em] text-rose-500 mb-4">
            WILD NATURAL
          </p>

          <h1 className="font-display text-4xl font-semibold text-ink">
            Forgot Password
          </h1>

          <p className="mt-3 text-sm text-ink-muted">
            Enter your email address and we'll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-[11px] font-medium tracking-[0.15em] text-ink-soft uppercase mb-2"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-ink/15 rounded-md px-4 py-3 text-ink placeholder:text-ink-muted/50 outline-none transition-all focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
            />
          </div>

          {message && (
            <p className="text-sm text-green-600">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-rose-500 hover:bg-rose-600 text-cream font-bold tracking-[0.2em] uppercase text-sm py-4 rounded-md transition-colors"
          >
            Send Reset Link
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-ink-muted">
          Remember your password?{' '}
          <Link
            to="/login"
            className="text-rose-500 font-medium hover:text-rose-600"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}