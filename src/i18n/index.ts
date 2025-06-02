
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
    debug: true,
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i']
    }
  });

// Save language to localStorage when changed and force re-render
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lng);
    console.log('Language changed to:', lng);
    console.log('Available translations for', lng, ':', i18n.getResourceBundle(lng, 'translation'));
    
    // Force a page refresh to ensure all components re-render with new language
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }
});

export default i18n;
