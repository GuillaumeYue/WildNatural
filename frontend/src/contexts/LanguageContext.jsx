import { createContext, useContext, useState } from 'react'
import { translations } from '../lib/translations'

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
  const [lang, setLangState] = useState(readStoredLang)

  const setLang = (next) => {
    if (!SUPPORTED.includes(next)) return
    localStorage.setItem(STORAGE_KEY, next)
    setLangState(next)
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
