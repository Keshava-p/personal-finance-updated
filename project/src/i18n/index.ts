import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import hi from './locales/hi.json';
import kn from './locales/kn.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import ml from './locales/ml.json';
import mr from './locales/mr.json';
import bn from './locales/bn.json';
import gu from './locales/gu.json';

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
      hi: { translation: hi },
      kn: { translation: kn },
      ta: { translation: ta },
      te: { translation: te },
      ml: { translation: ml },
      mr: { translation: mr },
      bn: { translation: bn },
      gu: { translation: gu },
    },
    lng: resolveInitialLanguage(),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
