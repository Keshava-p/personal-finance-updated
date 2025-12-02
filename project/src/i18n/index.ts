import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';



function resolveInitialLanguage() {
  try {
    const stored = localStorage.getItem('pfm_profile');
    if (stored) {
      const profile = JSON.parse(stored);
      if (profile.languagePreference) {
        return profile.languagePreference;
      }
    }
  } catch (error) {
    console.error('Failed to resolve saved language', error);
  }
  return 'en';
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },

    },
    lng: resolveInitialLanguage(),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
