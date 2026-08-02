const ORDER_NUMBER_LENGTH = 6;

const formatOrderNumber = (
  orderId?: number | null
): string => {
  if (
    !Number.isInteger(orderId) ||
    Number(orderId) <= 0
  ) {
    return "#------";
  }

  return `#${String(orderId).padStart(
    ORDER_NUMBER_LENGTH,
    "0"
  )}`;
};

export default formatOrderNumber;
