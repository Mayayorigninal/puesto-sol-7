import { createElement, Fragment, type ReactNode } from 'react'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import en from './EN/En.json'
import es from './ES/Es.json'

type Language = 'en' | 'es'
type LocaleState = { language: Language }
export type TranslationKey = keyof typeof en
export type Translate = (key: TranslationKey, values?: Record<string, string | number>) => string

const catalogs = { en, es } satisfies Record<Language, Record<TranslationKey, string>>
const defaultLanguage: Language = 'en'

const useLocale = create<LocaleState>()(
  persist<LocaleState>(() => ({ language: defaultLanguage }), {
    name: 'puesto-sol-7-language',
    storage: createJSONStorage(() => localStorage),
    merge: (saved, current) => {
      const language = (saved as Partial<typeof current> | undefined)?.language
      return language === 'en' || language === 'es' ? { language } : current
    },
  }),
)

function setLanguage(language: string) {
  if (language === 'en' || language === 'es') useLocale.setState({ language })
}

function createTranslation(language: Language) {
  const catalog = catalogs[language]
  const dateFormat = new Intl.DateTimeFormat(language, {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
  })
  const t: Translate = (key, values) =>
    catalog[key].replace(/\{\{(\w+)\}\}/g, (placeholder, name: string) =>
      values?.[name] === undefined ? placeholder : String(values[name]),
    )

  function rich(key: TranslationKey, values: Record<string, ReactNode>) {
    return catalog[key].split(/\{\{(\w+)\}\}/g).map((part, index) =>
      index % 2 === 0 ? part : createElement(Fragment, { key: index }, values[part]),
    )
  }

  const formatDate = (date: string) => dateFormat.format(new Date(date))
  return { t, rich, formatDate }
}

const translations = { en: createTranslation('en'), es: createTranslation('es') }

export function useTranslation() {
  const language = useLocale((state) => state.language)
  return { ...translations[language], language, setLanguage }
}
