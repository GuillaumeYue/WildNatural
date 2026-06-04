import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Boxes,
  Warehouse,
  Users,
  Tag,
  FlaskConical,
  FileEdit,
  Languages,
  LogOut,
  ArrowLeft,
  Plus,
  Search,
  Edit3,
  Trash2,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import logoWild from '../assets/logo-wild.png'
import API from '../api/axiosInstance'

const SECTIONS = [
  { key: 'home', label: 'Dashboard', Icon: LayoutDashboard },
  { key: 'orders', label: 'Orders', Icon: Package },
  { key: 'products', label: 'Products', Icon: Boxes },
  { key: 'inventory', label: 'Inventory', Icon: Warehouse },
  { key: 'customers', label: 'Customers', Icon: Users },
  { key: 'promos', label: 'Promo Codes', Icon: Tag },
  { key: 'customize', label: 'Customize Requests', Icon: FlaskConical },
  { key: 'cms', label: 'Content', Icon: FileEdit },
  { key: 'lang', label: 'Translations', Icon: Languages },
]

const SECTION_TITLE = {
  home: 'Dashboard',
  orders: 'Orders',
  products: 'Products',
  inventory: 'Inventory',
  customers: 'Customers',
  promos: 'Promo Codes',
  customize: 'Customize Requests',
  cms: 'Site Content',
  lang: 'Translations',
}

const SECTION_SUB = {
  home: 'A quick read on today.',
  orders: 'Process, ship, refund.',
  products: 'Add or update SKUs.',
  inventory: 'Stock levels and low-stock alerts.',
  customers: 'See who is buying.',
  promos: 'Create and track discount codes.',
  customize: 'Bespoke skincare requests from the Customize page.',
  cms: 'Edit homepage copy, banners, and footer.',
  lang: 'English / French content for Bill 96 compliance.',
}

// ─────────────────────────────────────────────────────────────
//  Shared little widgets
// ─────────────────────────────────────────────────────────────
function Card({ children, className = '' }) {
  return (
    <div className={`bg-white border border-ink/10 rounded-lg ${className}`}>
      {children}
    </div>
  )
}

function Stat({ label, value, delta }) {
  return (
    <Card className="p-6">
      <p className="text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-3">
        {label}
      </p>
      <p className="font-display text-3xl font-semibold text-ink">{value}</p>
      {delta && (
        <p className="text-xs text-ink-muted mt-2">
          <span
            className={
              delta.startsWith('+')
                ? 'text-rose-500 font-medium'
                : 'text-ink-soft'
            }
          >
            {delta}
          </span>{' '}
          vs. previous period
        </p>
      )}
    </Card>
  )
}

function TableShell({ columns, rows, empty = 'No data yet.' }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink/10 text-[11px] tracking-[0.15em] uppercase text-ink-muted">
            {columns.map((c) => (
              <th key={c} className="text-left py-3 px-2 font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-12 text-ink-muted italic text-sm"
              >
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((cells, i) => (
              <tr
                key={i}
                className="border-b border-ink/5 hover:bg-blush-50/40 transition-colors"
              >
                {cells.map((cell, j) => (
                  <td key={j} className="py-4 px-2 text-ink">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

function ButtonPrimary({ children, icon: Icon, type = 'button', ...rest }) {
  return (
    <button
      type={type}
      className="bg-rose-500 hover:bg-rose-600 text-cream font-bold tracking-[0.2em] uppercase text-xs py-2.5 px-5 rounded-md transition-colors inline-flex items-center gap-2"
      {...rest}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  )
}

function ButtonGhost({ children, icon: Icon, ...rest }) {
  return (
    <button
      type="button"
      className="border border-ink/20 hover:border-rose-500 hover:text-rose-500 text-ink-soft font-medium text-sm py-2 px-4 rounded-md transition-colors inline-flex items-center gap-2"
      {...rest}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  )
}

function StatusPill({ kind, children }) {
  const styles = {
    paid: 'bg-rose-50 text-rose-500 border-rose-200',
    shipped: 'bg-blush-100 text-rose-600 border-rose-200',
    delivered: 'bg-ink/5 text-ink-soft border-ink/10',
    cancelled: 'bg-ink/5 text-ink-muted border-ink/10',
    active: 'bg-rose-50 text-rose-500 border-rose-200',
    paused: 'bg-ink/5 text-ink-muted border-ink/10',
    new: 'bg-rose-50 text-rose-500 border-rose-200',
    progress: 'bg-blush-100 text-rose-600 border-rose-200',
    done: 'bg-ink/5 text-ink-soft border-ink/10',
  }
  return (
    <span
      className={`inline-flex items-center text-[11px] tracking-wider uppercase font-medium px-2.5 py-1 rounded-full border ${styles[kind] || styles.done}`}
    >
      {children}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────
//  1 · Dashboard Home — top-of-shift overview
// ─────────────────────────────────────────────────────────────
function orderStatus(o) {
  if (o.isDelivered) return { kind: 'delivered', label: 'Delivered' }
  if (o.isPaid) return { kind: 'paid', label: 'Paid' }
  return { kind: 'new', label: 'New' }
}

function AdminHome() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    API.get('/admin/dashboard/stats')
      .then(({ data }) => alive && setStats(data))
      .catch(
        (err) =>
          alive &&
          setError(err.response?.data?.message || 'Failed to load dashboard.')
      )
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  if (loading) return <p className="text-ink-muted text-sm">Loading…</p>
  if (error) return <p className="text-rose-500 text-sm">{error}</p>

  const recentRows = (stats?.recentOrders || []).map((o) => {
    const s = orderStatus(o)
    return [
      <span key="o" className="font-mono text-xs">#{o._id.slice(-6)}</span>,
      o.user?.name || o.user?.email || '—',
      `$${(o.totalPrice ?? 0).toFixed(2)}`,
      <StatusPill key="s" kind={s.kind}>{s.label}</StatusPill>,
      new Date(o.createdAt).toLocaleDateString(),
    ]
  })

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Total Revenue" value={`$${(stats?.totalRevenue ?? 0).toFixed(2)}`} />
        <Stat label="Total Orders" value={stats?.totalOrders ?? 0} />
        <Stat label="Customers" value={stats?.totalUsers ?? 0} />
        <Stat label="Products" value={stats?.totalProducts ?? 0} />
      </div>

      <Card className="p-6">
        <h3 className="font-display text-xl font-semibold text-ink mb-4">
          Recent Orders
        </h3>
        <TableShell
          columns={['Order', 'Customer', 'Total', 'Status', 'Placed']}
          rows={recentRows}
          empty="No orders yet."
        />
      </Card>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  2 · Orders
// ─────────────────────────────────────────────────────────────
function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const fetchOrders = () => {
    setLoading(true)
    API.get('/orders/admin')
      .then(({ data }) => setOrders(data))
      .catch((err) =>
        setError(err.response?.data?.message || 'Failed to load orders.')
      )
      .finally(() => setLoading(false))
  }

  useEffect(fetchOrders, [])

  const act = async (id, fn) => {
    setBusyId(id)
    try {
      await fn()
      fetchOrders()
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed.')
    } finally {
      setBusyId(null)
    }
  }

  const markPaid = (id) => act(id, () => API.put(`/orders/admin/${id}/pay`))
  const markDelivered = (id) =>
    act(id, () => API.put(`/orders/admin/${id}/deliver`))
  const remove = (id) => {
    if (!window.confirm('Delete this order? This cannot be undone.')) return
    act(id, () => API.delete(`/orders/admin/${id}`))
  }

  if (loading) return <p className="text-ink-muted text-sm">Loading…</p>

  const rows = orders.map((o) => {
    const s = orderStatus(o)
    const isBusy = busyId === o._id
    return [
      <span key="o" className="font-mono text-xs">#{o._id.slice(-6)}</span>,
      o.user?.name || o.user?.email || '—',
      new Date(o.createdAt).toLocaleDateString(),
      `$${(o.totalPrice ?? 0).toFixed(2)}`,
      <StatusPill key="s" kind={s.kind}>{s.label}</StatusPill>,
      <div key="a" className="flex gap-2 flex-wrap">
        {!o.isPaid && (
          <ButtonGhost disabled={isBusy} onClick={() => markPaid(o._id)}>
            Mark Paid
          </ButtonGhost>
        )}
        {o.isPaid && !o.isDelivered && (
          <ButtonGhost disabled={isBusy} onClick={() => markDelivered(o._id)}>
            Mark Delivered
          </ButtonGhost>
        )}
        <button
          disabled={isBusy}
          onClick={() => remove(o._id)}
          className="text-ink-muted hover:text-rose-500 disabled:opacity-40"
          aria-label="Delete order"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>,
    ]
  })

  return (
    <div className="space-y-6">
      {error && <p className="text-rose-500 text-sm">{error}</p>}
      <Card className="p-6">
        <TableShell
          columns={['Order #', 'Customer', 'Date', 'Total', 'Status', 'Actions']}
          rows={rows}
          empty="No orders yet."
        />
      </Card>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  3 · Products
// ─────────────────────────────────────────────────────────────
function AdminProducts() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    brand: '',
    category: '',
    countInStock: '',
  })
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const emptyForm = {
    name: '',
    price: '',
    description: '',
    image: '',
    brand: '',
    category: '',
    countInStock: '',
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError('')

      const { data } = await API.get('/products')
      setProducts(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    try {
      const productData = {
        name: form.name,
        price: Number(form.price),
        description: form.description,
        image: form.image,
        brand: form.brand,
        category: form.category,
        countInStock: Number(form.countInStock),
      }

      if (editingId) {
        await API.put(`/products/${editingId}`, productData)
        setMessage('Product updated successfully')
      } else {
        await API.post('/products', productData)
        setMessage('Product added successfully')
      }

      setForm(emptyForm)
      setEditingId(null)
      fetchProducts()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product')
    }
  }

  const handleEdit = (product) => {
    setEditingId(product._id)
    setMessage('')
    setError('')

    setForm({
      name: product.name || '',
      price: product.price || '',
      description: product.description || '',
      image: product.image || '',
      brand: product.brand || '',
      category: product.category || '',
      countInStock: product.countInStock || '',
    })

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setForm(emptyForm)
    setMessage('')
    setError('')
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Delete this product?')

    if (!confirmDelete) return

    try {
      setMessage('')
      setError('')

      await API.delete(`/products/${id}`)
      setMessage('Product deleted successfully')
      fetchProducts()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product')
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-display text-xl font-semibold text-ink mb-4">
          {editingId ? 'Edit Product' : 'Add Product'}
        </h3>

        {message && (
          <p className="mb-4 text-sm text-green-600 font-medium">
            {message}
          </p>
        )}

        {error && (
          <p className="mb-4 text-sm text-rose-500 font-medium">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="border border-ink/15 p-2 rounded"
            required
          />

          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="border border-ink/15 p-2 rounded"
            required
          />

          <input
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            className="border border-ink/15 p-2 rounded"
            required
          />

          <input
            name="brand"
            placeholder="Brand"
            value={form.brand}
            onChange={handleChange}
            className="border border-ink/15 p-2 rounded"
            required
          />

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="border border-ink/15 p-2 rounded"
            required
          />

          <input
            name="countInStock"
            type="number"
            min="0"
            step="1"
            placeholder="Stock"
            value={form.countInStock}
            onChange={handleChange}
            className="border border-ink/15 p-2 rounded"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border border-ink/15 p-2 rounded md:col-span-2"
            required
          />

          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              className="bg-rose-500 hover:bg-rose-600 text-cream font-bold tracking-[0.2em] uppercase text-xs py-2.5 px-5 rounded-md transition-colors"
            >
              {editingId ? 'Update Product' : 'Add Product'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="border border-ink/20 hover:border-rose-500 hover:text-rose-500 text-ink-soft font-medium text-sm py-2 px-4 rounded-md transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </Card>

      <Card className="p-6">
        {loading ? (
          <p className="text-ink-muted text-sm">Loading products...</p>
        ) : (
          <TableShell
            columns={['Product', 'Price', 'Stock', 'Category', 'Actions']}
            rows={products.map((product) => [
              product.name,
              `$${product.price}`,
              product.countInStock,
              product.category,
              <div key={product._id} className="flex gap-2">
                <ButtonGhost onClick={() => handleEdit(product)}>
                  Edit
                </ButtonGhost>

                <button
                  type="button"
                  onClick={() => handleDelete(product._id)}
                  className="text-ink-muted hover:text-rose-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>,
            ])}
            empty="No products found."
          />
        )}
      </Card>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  4 · Inventory
// ─────────────────────────────────────────────────────────────
function AdminInventory() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <select className="border border-ink/15 rounded-md px-3 py-2 text-sm bg-white outline-none focus:border-rose-500">
            <option>All products</option>
            <option>Low stock only</option>
            <option>Out of stock</option>
          </select>
        </div>
        <div className="text-xs text-ink-muted flex items-center gap-2">
          Low-stock threshold:
          <input
            type="number"
            defaultValue={5}
            className="w-16 border border-ink/15 rounded px-2 py-1 text-ink"
          />
        </div>
      </div>

      <Card className="p-6">
        <TableShell
          columns={['Product', 'Stock', 'Reserved', 'Available', 'Adjust']}
          rows={[
            [
              'WILD Botanical Serum',
              '24',
              '2',
              '22',
              <div key="a" className="flex gap-1">
                <ButtonGhost>−</ButtonGhost>
                <ButtonGhost>+</ButtonGhost>
              </div>,
            ],
            [
              <span key="n" className="font-medium text-ink">WILD Hydrating Cleanser</span>,
              <span key="s" className="text-rose-500 font-medium">3</span>,
              '0',
              '3',
              <div key="a" className="flex gap-1">
                <ButtonGhost>−</ButtonGhost>
                <ButtonGhost>+</ButtonGhost>
              </div>,
            ],
          ]}
        />
      </Card>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  5 · Customers
// ─────────────────────────────────────────────────────────────
function AdminCustomers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [busyId, setBusyId] = useState(null)

  const fetchUsers = () => {
    setLoading(true)
    API.get('/users')
      .then(({ data }) => setUsers(data))
      .catch((err) =>
        setError(err.response?.data?.message || 'Failed to load customers.')
      )
      .finally(() => setLoading(false))
  }

  useEffect(fetchUsers, [])

  const remove = async (id) => {
    if (!window.confirm('Delete this customer? This cannot be undone.')) return
    setBusyId(id)
    try {
      await API.delete(`/users/${id}`)
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.')
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <p className="text-ink-muted text-sm">Loading…</p>

  const filtered = users.filter((u) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return (
      u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    )
  })

  const rows = filtered.map((u) => [
    u.name || '—',
    u.email,
    <StatusPill key="r" kind={u.role === 'admin' ? 'active' : 'done'}>
      {u.role}
    </StatusPill>,
    u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—',
    <button
      key="a"
      disabled={busyId === u._id}
      onClick={() => remove(u._id)}
      className="text-ink-muted hover:text-rose-500 disabled:opacity-40"
      aria-label="Delete customer"
    >
      <Trash2 className="w-4 h-4" />
    </button>,
  ])

  return (
    <div className="space-y-6">
      {error && <p className="text-rose-500 text-sm">{error}</p>}
      <div className="flex items-center gap-3">
        <Search className="w-4 h-4 text-ink-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email"
          className="border border-ink/15 rounded-md px-3 py-2 text-sm outline-none focus:border-rose-500 w-72"
        />
      </div>

      <Card className="p-6">
        <TableShell
          columns={['Name', 'Email', 'Role', 'Joined', 'Actions']}
          rows={rows}
          empty="No customers yet."
        />
      </Card>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  6 · Promo Codes
// ─────────────────────────────────────────────────────────────
function AdminPromos() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <ButtonPrimary icon={Plus}>Create code</ButtonPrimary>
      </div>

      <Card className="p-6">
        <TableShell
          columns={['Code', 'Type', 'Value', 'Used', 'Expires', 'Status', 'Actions']}
          rows={[
            [
              <span key="c" className="font-mono font-semibold text-ink">WELCOME10</span>,
              'Percent',
              '10%',
              '0',
              '—',
              <StatusPill key="s" kind="active">Active</StatusPill>,
              <ButtonGhost key="a" icon={Edit3}>Edit</ButtonGhost>,
            ],
            [
              <span key="c" className="font-mono font-semibold text-ink">WILD5</span>,
              'Amount',
              '$5.00',
              '0',
              '—',
              <StatusPill key="s" kind="active">Active</StatusPill>,
              <ButtonGhost key="a" icon={Edit3}>Edit</ButtonGhost>,
            ],
            [
              <span key="c" className="font-mono font-semibold text-ink">FREESHIP</span>,
              'Free shipping',
              '—',
              '0',
              '—',
              <StatusPill key="s" kind="active">Active</StatusPill>,
              <ButtonGhost key="a" icon={Edit3}>Edit</ButtonGhost>,
            ],
          ]}
        />
      </Card>

      <p className="text-xs text-ink-muted italic">
        Codes are read from <code className="bg-blush-50 px-1.5 py-0.5 rounded">frontend/src/lib/promo.js</code>{' '}
        until the backend exposes a <code className="bg-blush-50 px-1.5 py-0.5 rounded">PromoCode</code> model
        and <code className="bg-blush-50 px-1.5 py-0.5 rounded">POST /api/promo/validate</code>.
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  7 · Customize Requests
// ─────────────────────────────────────────────────────────────
function AdminCustomize() {
  const [tab, setTab] = useState('new')
  const tabs = [
    { key: 'new', label: 'New' },
    { key: 'progress', label: 'In Progress' },
    { key: 'done', label: 'Completed' },
  ]
  return (
    <div className="space-y-6">
      <div className="flex gap-1 border-b border-ink/10">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors -mb-px border-b-2 ${tab === t.key
              ? 'border-rose-500 text-rose-500'
              : 'border-transparent text-ink-muted hover:text-ink'
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card className="p-6">
        <TableShell
          columns={['Email', 'Ingredients', 'Service', 'Deposit', 'Status', 'Actions']}
          rows={[]}
          empty="Customize requests will appear here once the form submits to the backend."
        />
      </Card>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  8 · CMS — editable site content
// ─────────────────────────────────────────────────────────────
function AdminCMS() {
  const blocks = [
    { key: 'home-hero', label: 'Homepage hero', path: '/home', desc: 'Headline + subtitle + SHOP NOW button' },
    { key: 'home-whyus', label: 'Why Us features', path: '/home', desc: 'Three feature labels and icons' },
    { key: 'about-story', label: 'About — Heritage', path: '/about', desc: 'Founder story paragraphs' },
    { key: 'about-promise', label: 'About — Our Promise', path: '/about', desc: 'Three values copy' },
    { key: 'about-incl', label: 'About — Inclusion band', path: '/about', desc: 'Closing band tagline' },
    { key: 'products-line', label: 'Products — Tagline', path: '/products', desc: '"HANDCRAFTED WITH CARE" strip' },
    { key: 'banner', label: 'Site-wide banner', path: 'all', desc: 'Optional announcement strip across all pages' },
    { key: 'footer', label: 'Footer columns', path: 'all', desc: 'Column titles and links' },
  ]
  return (
    <div className="space-y-3">
      {blocks.map((b) => (
        <Card key={b.key} className="p-5 flex items-center justify-between">
          <div>
            <p className="font-medium text-ink">{b.label}</p>
            <p className="text-xs text-ink-muted mt-1">
              {b.desc} <span className="opacity-60">· {b.path}</span>
            </p>
          </div>
          <ButtonGhost icon={Edit3}>Edit</ButtonGhost>
        </Card>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  9 · Translations
// ─────────────────────────────────────────────────────────────
function AdminTranslations() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Search className="w-4 h-4 text-ink-muted" />
          <input
            placeholder="Search keys or text"
            className="border border-ink/15 rounded-md px-3 py-2 text-sm outline-none focus:border-rose-500 w-64"
          />
          <select className="border border-ink/15 rounded-md px-3 py-2 text-sm bg-white outline-none focus:border-rose-500">
            <option>All keys</option>
            <option>Missing French</option>
            <option>Recently changed</option>
          </select>
        </div>
        <ButtonGhost>Export translations</ButtonGhost>
      </div>

      <Card className="p-6">
        <TableShell
          columns={['Key', 'English', 'French', 'Status']}
          rows={[
            ['nav.home', 'Home', <span key="f" className="text-rose-500 italic">Missing</span>, <StatusPill key="s" kind="paused">Empty</StatusPill>],
            ['nav.about', 'About Us', <span key="f" className="text-rose-500 italic">Missing</span>, <StatusPill key="s" kind="paused">Empty</StatusPill>],
            ['nav.products', 'Products', <span key="f" className="text-rose-500 italic">Missing</span>, <StatusPill key="s" kind="paused">Empty</StatusPill>],
            ['welcome.headline', 'Step into something naturally yours.', <span key="f" className="text-rose-500 italic">Missing</span>, <StatusPill key="s" kind="paused">Empty</StatusPill>],
            ['button.signin', 'Sign In', <span key="f" className="text-rose-500 italic">Missing</span>, <StatusPill key="s" kind="paused">Empty</StatusPill>],
          ]}
        />
      </Card>

      <p className="text-xs text-ink-muted italic">
        Bill 96: French text must be at least as prominent as English on customer-facing pages.
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  Main page
// ─────────────────────────────────────────────────────────────
export default function Admin() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [section, setSection] = useState('home')

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/admin' }, replace: true })
    } else if (user.role !== 'admin') {
      // Backend User model now carries role: 'user' | 'admin'. Non-admins
      // are bounced back to the storefront. Make an account admin in Mongo
      // (or via a seed) to grant access.
      navigate('/home', { replace: true })
    }
  }, [user, navigate])

  if (!user || user.role !== 'admin') return null

  return (
    <div className="min-h-screen bg-blush-50/40 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-ink/10 flex flex-col fixed inset-y-0 left-0 z-10">
        <div className="px-6 py-5 border-b border-ink/10">
          <img src={logoWild} alt="WILD" className="h-10 w-auto" style={{ mixBlendMode: 'multiply' }} />
          <p className="mt-1 text-[10px] tracking-[0.3em] uppercase text-ink-muted">
            Admin
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {SECTIONS.map(({ key, label, Icon }) => {
            const active = section === key
            return (
              <button
                key={key}
                onClick={() => setSection(key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors mb-0.5 ${active
                  ? 'bg-blush-100 text-rose-500'
                  : 'text-ink-soft hover:bg-blush-50 hover:text-ink'
                  }`}
              >
                <Icon className="w-4 h-4" strokeWidth={1.8} />
                {label}
              </button>
            )
          })}
        </nav>

        <div className="border-t border-ink/10 p-3 space-y-0.5">
          <Link
            to="/home"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-ink-soft hover:bg-blush-50 hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.8} />
            Back to site
          </Link>
          <button
            onClick={() => {
              logout()
              navigate('/welcome')
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-ink-muted hover:text-rose-500 transition-colors"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.8} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 px-10 py-10">
        <header className="mb-10">
          <p className="text-[11px] tracking-[0.3em] uppercase text-rose-500 font-semibold mb-2">
            {SECTION_TITLE[section]}
          </p>
          <h1 className="font-display text-4xl font-semibold text-ink mb-2">
            {SECTION_TITLE[section]}
          </h1>
          <p className="text-ink-muted text-sm">{SECTION_SUB[section]}</p>
        </header>

        {section === 'home' && <AdminHome />}
        {section === 'orders' && <AdminOrders />}
        {section === 'products' && <AdminProducts />}
        {section === 'inventory' && <AdminInventory />}
        {section === 'customers' && <AdminCustomers />}
        {section === 'promos' && <AdminPromos />}
        {section === 'customize' && <AdminCustomize />}
        {section === 'cms' && <AdminCMS />}
        {section === 'lang' && <AdminTranslations />}
      </main>
    </div>
  )
}
