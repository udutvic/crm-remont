export const formatDate = (dateString?: string): string => {
  return dateString ? new Date(dateString).toLocaleDateString("uk-UA") : "-";
};
export const formatPrice = (price?: number): string => {
  return price ? `${price} ₴` : "-";
};
export const getAvatarUrl = (name: string): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;
};
