import {
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

import DataCards from "common/components/DataCards";
import type {
  Client,
  Order,
  OrderStatus,
} from "types";

import OrderCard from "./OrderCard";
import OrderDataGrid from "./OrderDataGrid";

interface OrderListProps {
  orders: Order[];
  clients: Client[];

  onEdit: (
    order: Order
  ) => void;

  onDelete: (
    order: Order,
    nameField?: keyof Order
  ) => void;

  onStatusChange: (
    id: number,
    status: OrderStatus
  ) => void;

  onDeliver: (
    id: number
  ) => Promise<void>;

  onView: (
    order: Order
  ) => void;

  onSort: (
    field: keyof Order
  ) => void;

  formatOrderId: (
    order: Order
  ) => string;
}

const OrderList = ({
  orders,
  clients,
  onEdit,
  onDelete,
  onStatusChange,
  onDeliver,
  onView,
  formatOrderId,
}: OrderListProps) => {
  const {
    t,
  } = useTranslation();

  const theme =
    useTheme();

  const useCards =
    useMediaQuery(
      theme.breakpoints.down(
        "md"
      )
    );

  if (useCards) {
    return (
      <DataCards
        data={orders}
        emptyMessage={t(
          "ordersPage.empty"
        )}
        renderCard={(
          order
        ) => (
          <OrderCard
            key={order.id}
            order={order}
            clients={clients}
            onEdit={onEdit}
            onDelete={
              onDelete
            }
            onStatusChange={
              onStatusChange
            }
            onDeliver={
              onDeliver
            }
            onView={onView}
            formatOrderId={
              formatOrderId
            }
          />
        )}
      />
    );
  }

  return (
    <OrderDataGrid
      orders={orders}
      clients={clients}
      onEdit={onEdit}
      onDelete={onDelete}
      onStatusChange={
        onStatusChange
      }
      onDeliver={onDeliver}
      onView={onView}
    />
  );
};

export default OrderList;
