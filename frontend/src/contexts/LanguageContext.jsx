import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { translations } from '../lib/translations'
import { useAuth } from './AuthContext'

const LanguageContext = createContext(null)

const STORAGE_KEY = 'wild.lang'
const SUPPORTED = ['en', 'fr']

function readStoredLang() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return SUPPORTED.includes(raw) ? raw : 'en'
  } catch {
    return 'en'
  }
}

export function LanguageProvider({ children }) {
  const { user, updateProfile } = useAuth()
  // Logged-in users start from their saved server preference; guests from
  // localStorage. (AuthProvider hydrates `user` synchronously from
  // localStorage, so it's already available on first render.)
  const [lang, setLangState] = useState(
    () => user?.languagePreference || readStoredLang()
  )

  // When a different user signs in, adopt their stored preference.
  const lastUserId = useRef(user?._id)
  useEffect(() => {
    if (user?._id && user._id !== lastUserId.current) {
      lastUserId.current = user._id
      if (user.languagePreference && SUPPORTED.includes(user.languagePreference)) {
        setLangState(user.languagePreference)
        localStorage.setItem(STORAGE_KEY, user.languagePreference)
      }
    }
  }, [user])

  const setLang = (next) => {
    if (!SUPPORTED.includes(next)) return
    localStorage.setItem(STORAGE_KEY, next)
    setLangState(next)
    // Persist to the account so the choice follows the user across devices.
    // Fire-and-forget — the UI has already updated optimistically.
    if (user) {
      updateProfile({ languagePreference: next })
    }
  }

  /**
   * Look up a key in the active language. Falls back to English if the
   * key has no translation in the current language, then to the key
   * itself so missing entries are obvious during development.
   */
  const t = (key) =>
    translations[lang]?.[key] ?? translations.en?.[key] ?? key

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within a LanguageProvider')
  return ctx
}
