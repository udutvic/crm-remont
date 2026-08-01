import i18n from "i18next";
import {
  initReactI18next,
} from "react-i18next";

import cs from "./locales/cs";
import en from "./locales/en";
import uk from "./locales/uk";

export const supportedLanguages = [
  "en",
  "uk",
  "cs",
] as const;

export type AppLanguage =
  (typeof supportedLanguages)[number];

const languageStorageKey =
  "crm-remont-language";

const isAppLanguage = (
  value: string | null
): value is AppLanguage => {
  return supportedLanguages.some(
    (language) =>
      language === value
  );
};

const getInitialLanguage =
  (): AppLanguage => {
    const storedLanguage =
      localStorage.getItem(
        languageStorageKey
      );

    if (
      isAppLanguage(
        storedLanguage
      )
    ) {
      return storedLanguage;
    }

    return "en";
  };

const initialLanguage =
  getInitialLanguage();

document.documentElement.lang =
  initialLanguage;

i18n.on(
  "languageChanged",
  (language: string) => {
    if (
      !isAppLanguage(language)
    ) {
      return;
    }

    localStorage.setItem(
      languageStorageKey,
      language
    );

    document.documentElement.lang =
      language;
  }
);

void i18n
  .use(initReactI18next)
  .init({
    resources: {
      en,
      uk,
      cs,
    },

    lng: initialLanguage,
    fallbackLng: "en",

    supportedLngs: [
      ...supportedLanguages,
    ],

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;