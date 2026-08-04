import {
  useState,
} from "react";
import type {
  MouseEvent,
} from "react";
import {
  Check as CheckIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

import {
  changeAppLanguage,
  supportedLanguages,
} from "i18n";
import type {
  AppLanguage,
} from "i18n";

interface LanguageOption {
  code: string;
  flag: string;
  label: string;
}

const languageOptions: Record<
  AppLanguage,
  LanguageOption
> = {
  cs: {
    code: "CZ",
    flag: "🇨🇿",
    label: "Čeština",
  },
  uk: {
    code: "UA",
    flag: "🇺🇦",
    label: "Українська",
  },
  en: {
    code: "EN",
    flag: "🇬🇧",
    label: "English",
  },
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

  const [
    anchorElement,
    setAnchorElement,
  ] = useState<HTMLElement | null>(
    null
  );

  const [
    changingLanguage,
    setChangingLanguage,
  ] = useState(false);

  const currentLanguage =
    getCurrentLanguage(
      i18n.resolvedLanguage ??
        i18n.language
    );

  const currentOption =
    languageOptions[currentLanguage];

  const menuOpen =
    Boolean(anchorElement);

  const handleOpen = (
    event: MouseEvent<HTMLElement>
  ) => {
    setAnchorElement(
      event.currentTarget
    );
  };

  const handleClose = () => {
    if (!changingLanguage) {
      setAnchorElement(null);
    }
  };

  const handleLanguageChange = (
    language: AppLanguage
  ): void => {
    if (
      language === currentLanguage ||
      changingLanguage
    ) {
      setAnchorElement(null);
      return;
    }

    setChangingLanguage(true);

    void changeAppLanguage(
      language
    )
      .catch(
        (
          error: unknown
        ) => {
          console.error(
            "Failed to change language:",
            error
          );
        }
      )
      .finally(() => {
        setChangingLanguage(false);
        setAnchorElement(null);
      });
  };

  return (
    <>
      <Tooltip
        title={t("common.language")}
      >
        <Button
          color="inherit"
          onClick={handleOpen}
          aria-label={t(
            "common.language"
          )}
          aria-controls={
            menuOpen
              ? "language-menu"
              : undefined
          }
          aria-haspopup="true"
          aria-expanded={
            menuOpen
              ? "true"
              : undefined
          }
          disabled={changingLanguage}
          endIcon={
            changingLanguage ? (
              <CircularProgress
                size={14}
                color="inherit"
              />
            ) : (
              <ExpandMoreIcon
                fontSize="small"
              />
            )
          }
          sx={{
            minWidth: 0,
            px: {
              xs: 0.75,
              sm: 1.1,
            },
            py: 0.55,
            borderRadius: 1.5,
            color:
              "rgba(255, 255, 255, 0.94)",
            textTransform: "none",
            fontWeight: 800,
            "&:hover": {
              bgcolor:
                "rgba(255, 255, 255, 0.10)",
            },
          }}
        >
          <Box
            component="span"
            sx={{
              fontSize: "1rem",
              lineHeight: 1,
              mr: 0.75,
            }}
          >
            {currentOption.flag}
          </Box>

          <Typography
            component="span"
            variant="caption"
            fontWeight={800}
          >
            {currentOption.code}
          </Typography>
        </Button>
      </Tooltip>

      <Menu
        id="language-menu"
        anchorEl={anchorElement}
        open={menuOpen}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 210,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "#d8e1ef",
              boxShadow:
                "0 14px 36px rgba(3, 22, 79, 0.18)",
            },
          },
        }}
      >
        {supportedLanguages.map(
          (language) => {
            const option =
              languageOptions[language];
            const selected =
              language === currentLanguage;

            return (
              <MenuItem
                key={language}
                selected={selected}
                onClick={() => {
                  handleLanguageChange(
                    language
                  );
                }}
                sx={{
                  py: 1.1,
                  "&.Mui-selected": {
                    bgcolor: "#edf3ff",
                    "&:hover": {
                      bgcolor: "#e3edff",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 38,
                    fontSize: "1.2rem",
                  }}
                >
                  {option.flag}
                </ListItemIcon>

                <ListItemText
                  primary={option.label}
                  secondary={option.code}
                  primaryTypographyProps={{
                    fontWeight: selected
                      ? 800
                      : 650,
                    color: "#07184a",
                  }}
                  secondaryTypographyProps={{
                    fontSize: "0.7rem",
                    color: "#63728f",
                  }}
                />

                {selected && (
                  <CheckIcon
                    fontSize="small"
                    sx={{
                      ml: 1,
                      color: "#075cff",
                    }}
                  />
                )}
              </MenuItem>
            );
          }
        )}
      </Menu>
    </>
  );
};

export default LanguageSwitcher;
