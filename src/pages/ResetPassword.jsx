import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function ResetPassword() {
  const { token } = useParams()

  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: '',
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (passwords.password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    if (passwords.password !== passwords.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    console.log('Reset token:', token)
    setMessage('Your password has been reset successfully.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blush-50 px-6 py-12">
      <div className="w-full max-w-md bg-white border border-blush-200/70 px-10 py-12 sm:px-12 rounded-lg shadow-sm">
        <div className="text-center mb-10">
          <p className="text-[11px] font-semibold tracking-[0.3em] text-rose-500 mb-4">
            WILD NATURAL
          </p>

          <h1 className="font-display text-4xl font-semibold text-ink">
            Reset Password
          </h1>

          <p className="mt-3 text-sm text-ink-muted">
            Create a new password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="block text-[11px] font-medium tracking-[0.15em] text-ink-soft uppercase mb-2"
            >
              New Password
            </label>

            <input
              id="password"
              type="password"
              required
              placeholder="Enter new password"
              value={passwords.password}
              onChange={(e) =>
                setPasswords({ ...passwords, password: e.target.value })
              }
              className="w-full bg-white border border-ink/15 rounded-md px-4 py-3 text-ink placeholder:text-ink-muted/50 outline-none transition-all focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-[11px] font-medium tracking-[0.15em] text-ink-soft uppercase mb-2"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              required
              placeholder="Confirm new password"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full bg-white border border-ink/15 rounded-md px-4 py-3 text-ink placeholder:text-ink-muted/50 outline-none transition-all focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
            />
          </div>

          {error && (
            <p className="text-sm text-rose-500" role="alert">
              {error}
            </p>
          )}

          {message && (
            <p className="text-sm text-green-600">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-rose-500 hover:bg-rose-600 text-cream font-bold tracking-[0.2em] uppercase text-sm py-4 rounded-md transition-colors"
          >
            Reset Password
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-ink-muted">
          Back to{' '}
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