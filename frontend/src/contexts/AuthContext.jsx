import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'wild.user'

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  /**
   * Called after a successful /auth/login or /auth/register response.
   * Krunal's backend returns { _id, name, email, token } — we store
   * the whole object plus the token under separate keys so
   * axiosInstance.js can read `localStorage.getItem('token')` directly.
   */
  const login = (userData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    if (userData?.token) localStorage.setItem('token', userData.token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem('token')
    setUser(null)
  }

  /**
   * Partial update of the stored user. Used by the profile page to
   * change the display name etc. While there's no backend endpoint
   * to persist this, the change survives a page refresh through
   * localStorage. Swap the body for an API call when /api/auth/me
   * lands.
   */
  const updateUser = (updates) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
