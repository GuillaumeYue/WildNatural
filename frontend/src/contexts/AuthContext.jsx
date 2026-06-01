import { createContext, useContext, useState } from 'react'
import { updateProfile as updateProfileApi } from '../api/authApi'

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
   * Called after a successful /users/login or /users/register response.
   * Krunal's backend returns the full profile plus a token; we keep the
   * whole object under `wild.user` and mirror the token under `token`
   * so axiosInstance can attach it as a Bearer header.
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
   * Local-only merge of the stored user. Used for optimistic updates
   * where we don't need (or want to wait for) a server round-trip.
   */
  const updateUser = (updates) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  /**
   * Persist a profile change to the backend (PUT /api/users/profile) and
   * merge the returned user into state. The backend returns a fresh token,
   * so we refresh that too.
   *
   * @returns {Promise<{ ok: boolean, error?: string }>}
   */
  const updateProfile = async (updates) => {
    try {
      const { data } = await updateProfileApi(updates)
      setUser((prev) => {
        const next = { ...prev, ...data }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        if (data?.token) localStorage.setItem('token', data.token)
        return next
      })
      return { ok: true }
    } catch (err) {
      return {
        ok: false,
        error:
          err.response?.data?.message ||
          'Could not save your changes. Please try again.',
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateUser, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
