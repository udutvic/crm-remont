import {
  MouseEvent,
} from "react";
import {
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

import {
  AppLanguage,
  supportedLanguages,
} from "i18n";

const languageLabels: Record<
  AppLanguage,
  string
> = {
  en: "EN",
  uk: "UA",
  cs: "CZ",
};

const getCurrentLanguage = (
  language: string
): AppLanguage => {
  const languageCode =
    language
      .split("-")[0]
      .toLowerCase();

  const supportedLanguage =
    supportedLanguages.find(
      (item) =>
        item === languageCode
    );

  return supportedLanguage ?? "en";
};

const LanguageSwitcher = () => {
  const {
    t,
    i18n,
  } = useTranslation();

  const currentLanguage =
    getCurrentLanguage(
      i18n.resolvedLanguage ??
        i18n.language
    );

  const handleLanguageChange = (
    _event: MouseEvent<HTMLElement>,
    language: AppLanguage | null
  ): void => {
    if (
      !language ||
      language === currentLanguage
    ) {
      return;
    }

    void i18n.changeLanguage(
      language
    );
  };

  return (
    <Tooltip
      title={t("common.language")}
    >
      <ToggleButtonGroup
        exclusive
        size="small"
        value={currentLanguage}
        onChange={
          handleLanguageChange
        }
        aria-label={t(
          "common.language"
        )}
        sx={{
          backgroundColor:
            "rgba(255, 255, 255, 0.12)",

          "& .MuiToggleButton-root":
            {
              minWidth: {
                xs: 34,
                sm: 40,
              },
              px: {
                xs: 0.75,
                sm: 1.25,
              },
              py: 0.5,
              borderColor:
                "rgba(255, 255, 255, 0.35)",
              color:
                "rgba(255, 255, 255, 0.8)",
              fontSize: {
                xs: "0.68rem",
                sm: "0.75rem",
              },
              fontWeight: 700,

              "&:hover": {
                backgroundColor:
                  "rgba(255, 255, 255, 0.18)",
              },

              "&.Mui-selected": {
                backgroundColor:
                  "common.white",
                color: "primary.main",

                "&:hover": {
                  backgroundColor:
                    "common.white",
                },
              },
            },
        }}
      >
        {supportedLanguages.map(
          (language) => (
            <ToggleButton
              key={language}
              value={language}
              aria-label={language}
            >
              {
                languageLabels[
                  language
                ]
              }
            </ToggleButton>
          )
        )}
      </ToggleButtonGroup>
    </Tooltip>
  );
};

export default LanguageSwitcher;