import React from "react";
import { Box } from "@mui/material";
import { Order, OrderStatus, Client } from "types";
import DataView from "common/components/DataView";
import OrderTableRow from "./OrderTableRow";
import OrderCard from "./OrderCard";
interface OrderListProps {
  orders: Order[];
  clients: Client[];
  onEdit: (order: Order) => void;
  onDelete: (order: Order, nameField?: keyof Order) => void;
  onStatusChange: (id: number, status: OrderStatus) => void;
  onSort: (field: keyof Order) => void;
  formatOrderId: (order: Order) => string;
}
const OrderList: React.FC<OrderListProps> = ({
  orders,
  clients,
  onEdit,
  onDelete,
  onStatusChange,
  onSort,
  formatOrderId
}) => {
  return (
    <Box>
      <DataView
        data={orders}
        columns={[
          { id: 'id', label: 'ID', sx: { pl: 2 } },
          { id: 'deviceName', label: 'Device' },
          { id: 'client', label: 'Client', sx: { display: { xs: "none", md: "table-cell" } } },
          { 
            id: 'price', 
            label: 'Price', 
            sx: { display: { xs: "none", md: "table-cell" } } 
          },
          { 
            id: 'createdAt', 
            label: 'Date', 
            onClick: () => onSort("createdAt"),
            sx: { cursor: 'pointer', display: { xs: "none", md: "table-cell" } } 
          },
          { id: 'status', label: 'Status' },
          { id: 'actions', label: 'Actions', sx: { pr: 2, width: 'auto' } }
        ]}
        emptyMessage="No orders found"
        renderTableRow={(order) => (
          <OrderTableRow
            key={order.id}
            order={order}
            clients={clients}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            formatOrderId={formatOrderId}
          />
        )}
        renderCard={(order) => (
          <OrderCard
            key={order.id}
            order={order}
            clients={clients}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            formatOrderId={formatOrderId}
          />
        )}
      />
    </Box>
  );
};
export default OrderList;
