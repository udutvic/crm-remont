export const formatDate = (dateString?: string): string => {
  return dateString ? new Date(dateString).toLocaleDateString("uk-UA") : "-";
};

export const formatDateTime = (
  dateString?: string | null
): string => {
  if (!dateString) {
    return "-";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString(
    "cs-CZ",
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

  return `${price.toLocaleString(
    "cs-CZ",
    {
      maximumFractionDigits: 0,
    }
  )} Kč`;
};
export const getAvatarUrl = (name: string): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;
};
