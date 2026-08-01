import { Order } from "types";

export type OrderDeliveryState =
  | "not_ready"
  | "ready"
  | "delivered";

export interface OrderDisplayPrice {
  amount: number;
  type: "estimated" | "final";
}

export const getOrderDisplayPrice = (
  order: Order
): OrderDisplayPrice => {
  if (order.finalPrice !== null &&
      order.finalPrice !== undefined) {
    return {
      amount: order.finalPrice,
      type: "final",
    };
  }

  return {
    amount:
      order.estimatedPrice ??
      order.price ??
      0,
    type: "estimated",
  };
};

export const getOrderDeliveryState = (
  order: Order
): OrderDeliveryState => {
  if (order.deliveredAt) {
    return "delivered";
  }

  if (order.status === "completed") {
    return "ready";
  }

  return "not_ready";
};

export const getOrderReceivedDate = (
  order: Order
): string | undefined => {
  return order.receivedAt ??
    order.createdAt;
};