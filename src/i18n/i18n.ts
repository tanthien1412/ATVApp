import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLocales } from 'expo-localization'
import en from './locales/en.json'
import vi from './locales/vi.json'

const resources = {
  vi: { translation: vi },
  en: { translation: en },
}

export const i18nConfig = {
  locales: Object.keys(resources),
  defaultLocale: 'vi',
}

i18n.use(initReactI18next).init({
  resources,
  lng: getLocales()[0]?.languageCode ?? i18nConfig.defaultLocale,
  fallbackLng: i18nConfig.defaultLocale,
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
