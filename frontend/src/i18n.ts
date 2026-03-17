import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources, supportedLanguages } from "@/utils/translations";

const languageStorageKey = "normify-language";

const getInitialLanguage = () => {
  const savedLanguage = window.localStorage.getItem(languageStorageKey);

  if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
    return savedLanguage;
  }

  const browserLanguage = window.navigator.language.slice(0, 2);
  return supportedLanguages.includes(browserLanguage) ? browserLanguage : "pt";
};

void i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: "pt",
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (language) => {
  window.localStorage.setItem(languageStorageKey, language);
  document.documentElement.lang = language;
});

document.documentElement.lang = i18n.language;

export default i18n;
