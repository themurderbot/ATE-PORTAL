'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Lang = 'ar' | 'en'

interface LangContextType {
  lang: Lang
  setLang: (l: Lang) => void
  t: (ar: string, en: string) => string
  dir: 'rtl' | 'ltr'
}

const LangContext = createContext<LangContextType>({
  lang: 'ar', setLang: () => {}, t: (ar) => ar, dir: 'rtl',
})

export function LangProvider({ children }: { children: ReactNode }) {
  // قراءة اللغة من localStorage عند البداية (إن وُجدت)
  const [lang, setLangState] = useState<Lang>('ar')

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('ate_lang') : null
    if (saved === 'ar' || saved === 'en') setLangState(saved as Lang)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    if (typeof window !== 'undefined') localStorage.setItem('ate_lang', l)
  }

  const t = (ar: string, en: string) => lang === 'ar' ? ar : en
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  return (
    <LangContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)