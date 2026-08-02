import i18n from "i18next";
import {
  initReactI18next,
} from "react-i18next";

export const supportedLanguages = [
  "en",
  "uk",
  "cs",
] as const;

export type AppLanguage =
  (typeof supportedLanguages)[number];

type Translation = Record<string, unknown>;

interface LocaleModule {
  default: {
    translation: Translation;
  };
}

const LANGUAGE_STORAGE_KEY =
  "crm-remont-language";

const localeLoaders: Record<
  AppLanguage,
  () => Promise<LocaleModule>
> = {
  en: () => import("./locales/en"),
  uk: () => import("./locales/uk"),
  cs: () => import("./locales/cs"),
};

const isAppLanguage = (
  value: string | null
): value is AppLanguage =>
  supportedLanguages.includes(
    value as AppLanguage
  );

const getInitialLanguage = (): AppLanguage => {
  const storedLanguage =
    localStorage.getItem(
      LANGUAGE_STORAGE_KEY
    );

  return isAppLanguage(storedLanguage)
    ? storedLanguage
    : "en";
};

const loadTranslation = async (
  language: AppLanguage
): Promise<Translation> => {
  const locale =
    await localeLoaders[language]();

  return locale.default.translation;
};

const ensureLanguageLoaded = async (
  language: AppLanguage
): Promise<void> => {
  if (
    i18n.hasResourceBundle(
      language,
      "translation"
    )
  ) {
    return;
  }

  i18n.addResourceBundle(
    language,
    "translation",
    await loadTranslation(language),
    true,
    true
  );
};

let initializationPromise:
  Promise<void> | null = null;

export const initializeI18n =
  (): Promise<void> => {
    if (initializationPromise) {
      return initializationPromise;
    }

    initializationPromise =
      (async () => {
        const language =
          getInitialLanguage();

        const resources = {
          en: {
            translation:
              await loadTranslation("en"),
          },
        } as Record<
          string,
          {
            translation: Translation;
          }
        >;

        if (language !== "en") {
          resources[language] = {
            translation:
              await loadTranslation(language),
          };
        }

        await i18n
          .use(initReactI18next)
          .init({
            resources,
            lng: language,
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

        document.documentElement.lang =
          language;

        i18n.on(
          "languageChanged",
          (nextLanguage: string) => {
            if (
              !isAppLanguage(
                nextLanguage
              )
            ) {
              return;
            }

            localStorage.setItem(
              LANGUAGE_STORAGE_KEY,
              nextLanguage
            );

            document.documentElement.lang =
              nextLanguage;
          }
        );
      })().catch(
        (error: unknown) => {
          initializationPromise = null;
          throw error;
        }
      );

    return initializationPromise;
  };

export const changeAppLanguage = async (
  language: AppLanguage
): Promise<void> => {
  await initializeI18n();
  await ensureLanguageLoaded(language);
  await i18n.changeLanguage(language);
};

export default i18n;
