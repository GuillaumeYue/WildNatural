import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Products from './pages/Products'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Customize from './pages/Customize'
import Cart from './pages/Cart'
import Contact from './pages/Contact'
import Footer from "./components/Footer";
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/customize" element={<Customize />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
      </Routes>
    </Router>
  )
}

export default App
