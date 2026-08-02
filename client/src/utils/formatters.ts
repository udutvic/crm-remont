import i18n from "i18n";

const languageLocales: Record<
  string,
  string
> = {
  en: "en-US",
  uk: "uk-UA",
  cs: "cs-CZ",
};

const getCurrentLocale =
  (): string => {
    const language =
      i18n.resolvedLanguage ??
      i18n.language ??
      "en";

    const languageCode =
      language
        .split("-")[0]
        .toLowerCase();

    return (
      languageLocales[
        languageCode
      ] ?? "en-US"
    );
  };

export const formatDate = (
  dateString?: string | null
): string => {
  if (!dateString) {
    return "-";
  }

  const date =
    new Date(dateString);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }

  return date.toLocaleDateString(
    getCurrentLocale(),
    {
      dateStyle: "medium",
    }
  );
};

export const formatDateTime = (
  dateString?: string | null
): string => {
  if (!dateString) {
    return "-";
  }

  const date =
    new Date(dateString);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }

  return date.toLocaleString(
    getCurrentLocale(),
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
};

export const formatPrice = (
  price?: number | null
): string => {
  if (
    price === null ||
    price === undefined ||
    Number.isNaN(price)
  ) {
    return "-";
  }

  const formattedPrice =
    price.toLocaleString(
      getCurrentLocale(),
      {
        maximumFractionDigits: 0,
      }
    );

  return `${formattedPrice} Kč`;
};

export const getAvatarUrl = (
  name: string
): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}`;
};