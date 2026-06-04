import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Home from './pages/Home'
import Welcome from './pages/Welcome'
import About from './pages/About'
import Products from './pages/Products'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Customize from './pages/Customize'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import Contact from './pages/Contact'

/**
 * Routes wrapped in a cross-fade. The wrapper animates opacity only
 * (never transform) so fixed/absolute children like the Nav and the
 * Admin sidebar keep positioning against the viewport.
 */
function AnimatedRoutes() {
  const location = useLocation()
  const reduce = useReducedMotion()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.25, ease: 'easeOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<Welcome />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/customize" element={<Customize />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  )
}

export default App