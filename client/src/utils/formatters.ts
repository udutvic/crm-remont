export const formatDate = (dateString?: string): string => {
  return dateString ? new Date(dateString).toLocaleDateString("uk-UA") : "-";
};
export const formatPrice = (price?: number): string => {
<<<<<<< HEAD
  return price ? `${price} Kč` : "-";
=======
  return price ? `${price} ₴` : "-";
>>>>>>> 647724de4edd4a608cbb3601a1a46f696ce924df
};
export const getAvatarUrl = (name: string): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;
};
