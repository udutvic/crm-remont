import {
  useTranslation,
} from "react-i18next";

import {
  formatDate,
  formatDateTime,
  formatPrice,
} from "utils/formatters";

const useAppFormatters = () => {
  useTranslation();

  return {
    formatDate,
    formatDateTime,
    formatPrice,
  };
};

export default useAppFormatters;