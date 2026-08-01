import {
  Box,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

import DataView from "common/components/DataView";
import {
  Client,
  Order,
  OrderStatus,
} from "types";

import OrderCard from "./OrderCard";
import OrderTableRow from "./OrderTableRow";

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
  onSort,
  formatOrderId,
}: OrderListProps) => {
  const {
    t,
  } = useTranslation();

  return (
    <Box>
      <DataView
        data={orders}
        columns={[
          {
            id: "id",
            label: t(
              "ordersPage.columns.id"
            ),
            sx: {
              pl: 2,
            },
          },
          {
            id: "deviceName",
            label: t(
              "ordersPage.columns.device"
            ),
          },
          {
            id: "client",
            label: t(
              "ordersPage.columns.client"
            ),
            sx: {
              display: {
                xs: "none",
                md: "table-cell",
              },
            },
          },
          {
            id: "price",
            label: t(
              "ordersPage.columns.price"
            ),
            sx: {
              display: {
                xs: "none",
                md: "table-cell",
              },
            },
          },
          {
            id: "receivedAt",
            label: t(
              "ordersPage.columns.received"
            ),
            onClick: () => {
              onSort(
                "receivedAt"
              );
            },
            sx: {
              cursor: "pointer",
              display: {
                xs: "none",
                md: "table-cell",
              },
            },
          },
          {
            id: "status",
            label: t(
              "ordersPage.columns.status"
            ),
          },
          {
            id: "delivery",
            label: t(
              "ordersPage.columns.delivery"
            ),
          },
          {
            id: "actions",
            label: t(
              "ordersPage.columns.actions"
            ),
            sx: {
              pr: 2,
              width: "auto",
            },
          },
        ]}
        emptyMessage={t(
          "ordersPage.empty"
        )}
        renderTableRow={(
          order
        ) => (
          <OrderTableRow
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
    </Box>
  );
};

export default OrderList;
