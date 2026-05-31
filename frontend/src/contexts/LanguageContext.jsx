import { createContext, useContext, useState } from 'react'

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

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within a LanguageProvider')
  return ctx
}
