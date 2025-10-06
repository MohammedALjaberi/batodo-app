import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslations from "./src/i18n/en/common.json";
import arTranslations from "./src/i18n/ar/common.json";

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n to react-iz18next
  .init({
    resources: {
      en: {
        common: enTranslations,
      },
      ar: {
        common: arTranslations,
      },
    },
    fallbackLng: "en", // Use English if detection fails
    supportedLngs: ["en", "ar"], // English and Arabic

    ns: ["common"], // Namespaces
    defaultNS: "common",

    detection: {
      order: ["localStorage", "navigator"], // Check localStorage first
      caches: ["localStorage"], // Save preference to localStorage
    },

    interpolation: {
      escapeValue: false, // React already escapes
    },

    // RTL support for Arabic
    react: {
      useSuspense: false,
    },
  });

export default i18n;
