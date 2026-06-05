import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, Plus, Trash2 } from 'lucide-react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import { useLang } from '../contexts/LanguageContext'
import FadeIn from '../components/motion/FadeIn'

const SECTIONS = [
  { key: 'account',  tKey: 'profile.section.account' },
  { key: 'shipping', tKey: 'profile.section.shipping' },
  { key: 'payment',  tKey: 'profile.section.payment' },
  { key: 'orders',   tKey: 'profile.section.orders' },
]

const CARDS_KEY = 'wild.cards'

const inputClass =
  'w-full bg-white border border-ink/15 rounded-md px-4 py-3 text-ink placeholder:text-ink-muted/50 outline-none transition-all focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15'
const labelClass =
  'block text-[11px] font-medium tracking-[0.15em] text-ink-soft uppercase mb-2'

function Field({ label, value, onChange, ...rest }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
        {...rest}
      />
    </div>
  )
}

function Card({ title, children }) {
  return (
    <section className="bg-white border border-blush-200/70 rounded-lg p-8">
      <h2 className="font-display text-2xl font-semibold text-ink mb-6">
        {title}
      </h2>
      {children}
    </section>
  )
}

function PrimaryButton({ children, ...rest }) {
  return (
    <button
      type="submit"
      className="bg-rose-500 hover:bg-rose-600 text-cream font-bold tracking-[0.2em] uppercase text-xs py-3 px-8 rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      {...rest}
    >
      {children}
    </button>
  )
}

function SavedFlash({ show }) {
  if (!show) return null
  return (
    <span className="inline-flex items-center gap-1 text-sm text-rose-500">
      <Check className="w-4 h-4" strokeWidth={2.5} />
      Saved
    </span>
  )
}

function ErrorText({ message }) {
  if (!message) return null
  return <span className="text-sm text-rose-500">{message}</span>
}

// ─────────────────────────────────────────────────────────────
//  Account section — name + password (PUT /api/users/profile),
//  email read-only
// ─────────────────────────────────────────────────────────────
function AccountSection() {
  const { user, updateProfile } = useAuth()

  const [name, setName] = useState(user.name || '')
  const [nameSaved, setNameSaved] = useState(false)
  const [nameErr, setNameErr] = useState('')
  const [nameBusy, setNameBusy] = useState(false)

  const [pw, setPw] = useState({ next: '', confirm: '' })
  const [pwSaved, setPwSaved] = useState(false)
  const [pwErr, setPwErr] = useState('')
  const [pwBusy, setPwBusy] = useState(false)

  const handleSaveName = async (e) => {
    e.preventDefault()
    setNameErr('')
    setNameBusy(true)
    const res = await updateProfile({ name })
    setNameBusy(false)
    if (res.ok) {
      setNameSaved(true)
      setTimeout(() => setNameSaved(false), 1800)
    } else {
      setNameErr(res.error)
    }
  }

  const handleSavePassword = async (e) => {
    e.preventDefault()
    setPwErr('')
    if (pw.next.length < 8) {
      setPwErr('Password must be at least 8 characters.')
      return
    }
    if (pw.next !== pw.confirm) {
      setPwErr('Passwords do not match.')
      return
    }
    setPwBusy(true)
    const res = await updateProfile({ password: pw.next })
    setPwBusy(false)
    if (res.ok) {
      setPw({ next: '', confirm: '' })
      setPwSaved(true)
      setTimeout(() => setPwSaved(false), 1800)
    } else {
      setPwErr(res.error)
    }
  }

  return (
    <div className="space-y-8">
      <Card title="Display Name">
        <form onSubmit={handleSaveName} className="space-y-5">
          <Field
            label="Name"
            value={name}
            onChange={setName}
            placeholder="Jane Doe"
            required
          />
          <div className="flex items-center gap-4">
            <PrimaryButton disabled={nameBusy}>
              {nameBusy ? 'Saving…' : 'Save'}
            </PrimaryButton>
            <SavedFlash show={nameSaved} />
            <ErrorText message={nameErr} />
          </div>
        </form>
      </Card>

      <Card title="Email">
        <p className="text-ink font-medium">{user.email}</p>
        <p className="text-xs text-ink-muted italic mt-3">
          Email cannot be changed from here yet. Reach out to support to update.
        </p>
      </Card>

      <Card title="Password">
        <form onSubmit={handleSavePassword} className="space-y-5">
          <Field
            label="New Password"
            type="password"
            value={pw.next}
            onChange={(v) => setPw({ ...pw, next: v })}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            required
          />
          <Field
            label="Confirm Password"
            type="password"
            value={pw.confirm}
            onChange={(v) => setPw({ ...pw, confirm: v })}
            placeholder="Re-enter new password"
            autoComplete="new-password"
            required
          />
          <div className="flex items-center gap-4">
            <PrimaryButton disabled={pwBusy}>
              {pwBusy ? 'Updating…' : 'Update Password'}
            </PrimaryButton>
            <SavedFlash show={pwSaved} />
            <ErrorText message={pwErr} />
          </div>
        </form>
      </Card>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  Shipping section — default address + phone
//  (PUT /api/users/profile). Country is QC-store fixed (the backend
//  User model has no country field).
// ─────────────────────────────────────────────────────────────
function ShippingSection() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({
    address: user.address || '',
    city: user.city || '',
    postalCode: user.postalCode || '',
    phone: user.phone || '',
  })
  const [saved, setSaved] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const setField = (key) => (v) => setForm({ ...form, [key]: v })

  const handleSave = async (e) => {
    e.preventDefault()
    setErr('')
    setBusy(true)
    const res = await updateProfile(form)
    setBusy(false)
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 1800)
    } else {
      setErr(res.error)
    }
  }

  return (
    <Card title="Default Shipping Address">
      <form onSubmit={handleSave} className="space-y-5">
        <Field
          label="Address"
          value={form.address}
          onChange={setField('address')}
          placeholder="123 Wild Lane"
          required
        />
        <div className="grid sm:grid-cols-2 gap-5">
          <Field
            label="City"
            value={form.city}
            onChange={setField('city')}
            placeholder="Montréal"
            required
          />
          <Field
            label="Postal Code"
            value={form.postalCode}
            onChange={setField('postalCode')}
            placeholder="H3A 0G4"
            required
          />
        </div>
        <Field
          label="Phone"
          type="tel"
          value={form.phone}
          onChange={setField('phone')}
          placeholder="(514) 555-0142"
          autoComplete="tel"
        />
        <div className="flex items-center gap-4 pt-2">
          <PrimaryButton disabled={busy}>
            {busy ? 'Saving…' : 'Save Address'}
          </PrimaryButton>
          <SavedFlash show={saved} />
          <ErrorText message={err} />
        </div>
      </form>
    </Card>
  )
}

// ─────────────────────────────────────────────────────────────
//  Payment section — saved cards list + add form
// ─────────────────────────────────────────────────────────────
function detectBrand(num) {
  const n = num.replace(/\s/g, '')
  if (n.startsWith('4')) return 'Visa'
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'Mastercard'
  if (/^3[47]/.test(n)) return 'Amex'
  if (/^6(?:011|5)/.test(n)) return 'Discover'
  return 'Card'
}

function PaymentSection() {
  const [cards, setCards] = useState(() => {
    try {
      const raw = localStorage.getItem(CARDS_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ number: '', name: '', expiry: '', cvv: '' })

  const persist = (next) => {
    setCards(next)
    localStorage.setItem(CARDS_KEY, JSON.stringify(next))
  }

  const handleAdd = (e) => {
    e.preventDefault()
    const last4 = form.number.replace(/\s/g, '').slice(-4)
    const brand = detectBrand(form.number)
    persist([
      ...cards,
      { id: Date.now(), brand, last4, expiry: form.expiry, name: form.name },
    ])
    setForm({ number: '', name: '', expiry: '', cvv: '' })
    setAdding(false)
  }

  const handleRemove = (id) => persist(cards.filter((c) => c.id !== id))

  return (
    <Card title="Saved Payment Methods">
      {cards.length === 0 ? (
        <p className="text-ink-soft text-sm mb-6">
          You haven't saved any cards yet.
        </p>
      ) : (
        <ul className="space-y-3 mb-6">
          {cards.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between p-4 bg-blush-50 rounded-md"
            >
              <div>
                <p className="font-medium text-ink">
                  {c.brand} ending in {c.last4}
                </p>
                <p className="text-xs text-ink-muted mt-1">
                  {c.name}
                  {c.expiry && <> · Expires {c.expiry}</>}
                </p>
              </div>
              <button
                onClick={() => handleRemove(c.id)}
                className="flex items-center gap-1 text-xs text-ink-muted hover:text-rose-500 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {adding ? (
        <form
          onSubmit={handleAdd}
          className="space-y-5 p-6 border border-ink/15 rounded-md bg-blush-50/40"
        >
          <Field
            label="Card Number"
            value={form.number}
            onChange={(v) => setForm({ ...form, number: v })}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            inputMode="numeric"
            autoComplete="cc-number"
            required
          />
          <Field
            label="Cardholder Name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
            placeholder="Jane Doe"
            autoComplete="cc-name"
            required
          />
          <div className="grid grid-cols-2 gap-5">
            <Field
              label="Expiry (MM/YY)"
              value={form.expiry}
              onChange={(v) => setForm({ ...form, expiry: v })}
              placeholder="MM / YY"
              maxLength={7}
              autoComplete="cc-exp"
              required
            />
            <Field
              label="CVV"
              value={form.cvv}
              onChange={(v) => setForm({ ...form, cvv: v })}
              placeholder="123"
              maxLength={4}
              inputMode="numeric"
              autoComplete="cc-csc"
              required
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <PrimaryButton>Save Card</PrimaryButton>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="text-sm text-ink-muted hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-2 text-sm text-rose-500 font-semibold tracking-wider uppercase hover:text-rose-600 transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Add new card
        </button>
      )}

      <p className="mt-8 text-xs text-ink-muted/70 italic">
        Demo only — only the last four digits and brand are stored locally.
        Full card numbers and CVV are never persisted.
      </p>
    </Card>
  )
}

// ─────────────────────────────────────────────────────────────
//  Orders section — empty state until backend exposes /api/orders/mine
// ─────────────────────────────────────────────────────────────
function OrdersSection() {
  return (
    <Card title="Order History">
      <div className="text-center py-12 bg-blush-50/60 rounded-md">
        <p className="text-ink-soft mb-5">
          You haven't placed any orders yet.
        </p>
        <Link
          to="/products"
          className="inline-block bg-rose-500 hover:bg-rose-600 text-cream font-bold tracking-[0.2em] uppercase text-xs py-3 px-8 rounded-md transition-colors"
        >
          Browse Products
        </Link>
      </div>
      <p className="mt-6 text-xs text-ink-muted/70 italic">
        Past orders will appear here once the backend exposes a
        <code className="mx-1 px-1.5 py-0.5 bg-blush-100 rounded text-ink">
          GET /api/orders/mine
        </code>
        endpoint.
      </p>
    </Card>
  )
}

// ─────────────────────────────────────────────────────────────
//  Main page
// ─────────────────────────────────────────────────────────────
export default function Profile() {
  const { user, logout } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()
  const [section, setSection] = useState('account')

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/profile' }, replace: true })
    }
  }, [user, navigate])

  if (!user) return null

  const firstName = user.name?.split(' ')[0] || 'friend'

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Nav />

      <main className="flex-1 pt-32 pb-24 px-10">
        <div className="mx-auto max-w-[1200px]">
          {/* Header */}
          <FadeIn>
            <p className="text-xs tracking-[0.3em] uppercase text-ink-muted mb-4">
              {t('profile.crumb')}
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink mb-2">
              {t('profile.title')}
            </h1>
            <p className="text-ink-soft mb-12">
              {t('profile.welcome')} {firstName}.
            </p>
          </FadeIn>

          <div className="grid lg:grid-cols-[240px_1fr] gap-10">
            {/* Sidebar nav */}
            <aside>
              <nav className="space-y-1 mb-8">
                {SECTIONS.map((s) => {
                  const active = section === s.key
                  return (
                    <button
                      key={s.key}
                      onClick={() => setSection(s.key)}
                      className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                        active
                          ? 'bg-blush-100 text-rose-500'
                          : 'text-ink-soft hover:bg-blush-50 hover:text-ink'
                      }`}
                    >
                      {t(s.tKey)}
                    </button>
                  )
                })}
              </nav>
              <div className="pt-4 border-t border-ink/10">
                <button
                  onClick={() => {
                    logout()
                    navigate('/welcome')
                  }}
                  className="w-full text-left px-4 py-3 rounded-md text-sm font-medium text-ink-muted hover:text-rose-500 transition-colors"
                >
                  {t('profile.signOut')}
                </button>
              </div>
            </aside>

            {/* Section content */}
            <section>
              <p className="text-xs tracking-[0.3em] uppercase text-rose-500 font-semibold mb-6">
                {t(SECTIONS.find((s) => s.key === section)?.tKey)}
              </p>
              {section === 'account' && <AccountSection />}
              {section === 'shipping' && <ShippingSection />}
              {section === 'payment' && <PaymentSection />}
              {section === 'orders' && <OrdersSection />}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
