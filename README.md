# Wild Natural

**A bilingual (EN/FR) e-commerce platform for WILD Natural, a Montreal botanical skincare brand** (now Balade Bucolique). Customers browse the catalog, manage a cart, check out with promo codes and Quebec sales tax, and book product-customization appointments. Staff manage orders, products and promo codes from an admin dashboard.

Built by a 4-person team during a 2026 internship, replacing the brand's legacy PHP/HTML site with a MERN single-page app.

<!-- TODO: add 2-3 screenshots here: products page, checkout, admin dashboard. -->

## Features

**Storefront**
- Product showcase with a single-product hero and side carousel, plus product detail pages
- Cart and checkout with a shared pricing module, so both pages always agree: GST 5% + QST 9.975%, free shipping over $100, and percent, fixed-amount or free-shipping promo codes
- Order confirmation and a profile page
- Product-customization appointment requests
- English/French toggle across all customer-facing pages, driven by one translation dictionary and a `t()` helper
- Subtle motion (route cross-fades, scroll fade-ins) and a custom 404 page

**Accounts**
- Register and log in with JWT authentication and bcrypt-hashed passwords
- `user` and `admin` roles enforced by middleware

**Admin dashboard**
- Orders, products, promo codes and customization requests, wired to live data

**Payments**
- A Stripe Checkout session endpoint exists on the backend (`Controllers/stripeController.js`). In this snapshot it is not mounted and the checkout UI records the order without charging a card. Wiring the two together is the next step.

## Tech stack

**Frontend:** React 19, Vite, React Router 7, Tailwind CSS 3, Framer Motion, Axios
**Backend:** Node.js, Express 4, MongoDB with Mongoose 8, JSON Web Tokens, bcrypt, Stripe SDK

## Repository layout

```
frontend/
  src/pages/        Home, Products, ProductDetail, Cart, Checkout, OrderConfirmation,
                    Customize, Profile, Admin, Login, Signup, About, Contact, ...
  src/contexts/     AuthContext, LanguageContext
  src/lib/          pricing.js, promo.js, translations.js
  src/api/          Axios instance and API base config
backend/
  routes/           auth, users, products, cart, orders, promocodes, customizations, admin
  Controllers/      request handlers
  models/           User, Product, Cart, Order, PromoCode, Customization
  middleware/       auth and role checks
  seed/             product seeder
  server.js
```

## Running locally

Requirements: Node 20+, a MongoDB instance (local or Atlas).

**Backend**

```bash
cd backend
npm install
```

Create `backend/.env`:

```
PORT=5000
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<a long random string>
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=<optional, Stripe test key>
```

```bash
npm run seed    # load the product catalog
npm run dev     # API on http://localhost:5000
```

**Frontend**

```bash
cd frontend
npm install
npm run dev     # http://localhost:5173
```

The frontend calls `http://localhost:5000/api` by default. If port 5000 is taken (macOS AirPlay uses it), create `frontend/.env.local`:

```
VITE_API_BASE_URL=http://localhost:5001/api
```

## API overview

| Base path | Purpose |
|---|---|
| `/api/auth` | Register, login |
| `/api/users` | Profile |
| `/api/products` | Catalog |
| `/api/cart` | Cart |
| `/api/orders` | Orders |
| `/api/promocodes` | Promo code validation and management |
| `/api/customizations` | Customization appointment requests |
| `/api/admin/dashboard` | Admin data |

## Team

| Person | Area |
|---|---|
| Han (Alex) Yue | Frontend lead: storefront, cart and checkout, pricing and promo logic, EN/FR localization, admin dashboard UI, backend integration |
| Krunal Joshi | Backend: auth, users, cart, orders, products, admin APIs |
| Srushti | Customization, contact and about pages |

<!-- TODO: confirm teammates' names and roles, and add the fourth team member. -->

## Known gaps

- Stripe session endpoint is not yet connected to the checkout flow
- No automated tests yet
- No deployment config in this repository
