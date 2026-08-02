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

type TranslationTree =
  Record<string, unknown>;

interface LocaleModule {
  default: {
    translation:
      TranslationTree;
  };
}

type LocaleLoader =
  () => Promise<LocaleModule>;

const localeLoaders:
  Record<
    AppLanguage,
    LocaleLoader
  > = {
    en: () =>
      import(
        "./locales/en"
      ),

    uk: () =>
      import(
        "./locales/uk"
      ),

    cs: () =>
      import(
        "./locales/cs"
      ),
  };

const languageStorageKey =
  "crm-remont-language";

const defaultNamespace =
  "translation";

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

const loadTranslation =
  async (
    language: AppLanguage
  ): Promise<TranslationTree> => {
    const localeModule =
      await localeLoaders[
        language
      ]();

    return localeModule
      .default
      .translation;
  };

const addLanguageResources =
  async (
    language: AppLanguage
  ): Promise<void> => {
    if (
      i18n.hasResourceBundle(
        language,
        defaultNamespace
      )
    ) {
      return;
    }

    const translation =
      await loadTranslation(
        language
      );

    i18n.addResourceBundle(
      language,
      defaultNamespace,
      translation,
      true,
      true
    );
  };

const createInitialResources =
  async (
    language: AppLanguage
  ): Promise<
    Record<
      string,
      {
        translation:
          TranslationTree;
      }
    >
  > => {
    const resources:
      Record<
        string,
        {
          translation:
            TranslationTree;
        }
      > = {};

    resources.en = {
      translation:
        await loadTranslation(
          "en"
        ),
    };

    if (
      language !== "en"
    ) {
      resources[
        language
      ] = {
        translation:
          await loadTranslation(
            language
          ),
      };
    }

    return resources;
  };

let languageListenerRegistered =
  false;

const registerLanguageListener =
  (): void => {
    if (
      languageListenerRegistered
    ) {
      return;
    }

    languageListenerRegistered =
      true;

    i18n.on(
      "languageChanged",
      (language: string) => {
        if (
          !isAppLanguage(
            language
          )
        ) {
          return;
        }

        localStorage.setItem(
          languageStorageKey,
          language
        );

        document.documentElement
          .lang = language;
      }
    );
  };

let initializationPromise:
  Promise<void> | null = null;

const initialize =
  async (): Promise<void> => {
    const requestedLanguage =
      getInitialLanguage();

    let initialLanguage =
      requestedLanguage;

    let resources:
      Awaited<
        ReturnType<
          typeof createInitialResources
        >
      >;

    try {
      resources =
        await createInitialResources(
          requestedLanguage
        );
    } catch (
      error: unknown
    ) {
      if (
        requestedLanguage ===
        "en"
      ) {
        throw error;
      }

      console.error(
        "Failed to load the saved language. Falling back to English:",
        error
      );

      initialLanguage =
        "en";

      resources =
        await createInitialResources(
          "en"
        );
    }

    document.documentElement.lang =
      initialLanguage;

    registerLanguageListener();

    await i18n
      .use(initReactI18next)
      .init({
        resources,

        lng:
          initialLanguage,

        fallbackLng:
          "en",

        supportedLngs: [
          ...supportedLanguages,
        ],

        interpolation: {
          escapeValue:
            false,
        },

        react: {
          useSuspense:
            false,
        },
      });
  };

export const initializeI18n =
  (): Promise<void> => {
    if (
      initializationPromise
    ) {
      return initializationPromise;
    }

    initializationPromise =
      initialize().catch(
        (
          error: unknown
        ) => {
          initializationPromise =
            null;

          throw error;
        }
      );

    return initializationPromise;
  };

export const changeAppLanguage =
  async (
    language: AppLanguage
  ): Promise<void> => {
    await initializeI18n();

    await addLanguageResources(
      language
    );

    await i18n.changeLanguage(
      language
    );
  };

export default i18n;
