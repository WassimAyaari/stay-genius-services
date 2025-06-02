
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import fr from './locales/fr.json';

const resources = {
  en: {
    translation: en
  },
  fr: {
    translation: fr
  }
};

// Get saved language from localStorage or default to 'en'
const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('language') || 'en' : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    debug: true, // Enable debug mode to see what's happening
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

// Save language to localStorage when changed
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lng);
    console.log('Language changed to:', lng);
  }
});

export default i18n;
