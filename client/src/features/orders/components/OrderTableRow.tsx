import React from "react";
import { TableRow, TableCell, Box, IconButton, Typography } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Order, Client, OrderStatus } from "types";
import { formatDate, formatPrice } from "utils/formatters";
import ClientInfo from "common/components/ClientInfo";
import StatusSelect from "common/components/StatusSelect";
import DeviceIcon from "../../../common/components/DeviceIcon";
interface OrderTableRowProps {
  order: Order;
  clients: Client[];
  onEdit: (order: Order) => void;
  onDelete: (order: Order, nameField?: keyof Order) => void;
  onStatusChange: (id: number, status: OrderStatus) => void;
  formatOrderId: (order: Order) => string;
}
const OrderTableRow: React.FC<OrderTableRowProps> = ({
  order,
  clients,
  onEdit,
  onDelete,
  onStatusChange,
  formatOrderId
}) => {
  return (
    <TableRow>
      <TableCell sx={{ pl: 2, py: 2 }}>
        {formatOrderId(order)}
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DeviceIcon 
            brand={order.device.brand}            
            size="small" 
          />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {order.device.brand} {order.device.model}
          </Typography>
        </Box>
      </TableCell>
      <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
        <ClientInfo 
          clientId={order.clientId} 
          clients={clients} 
        />
      </TableCell>
      <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
        {formatPrice(order.price)}
      </TableCell>
      <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
        {formatDate(order.createdAt)}
      </TableCell>
      <TableCell>
        <StatusSelect
          status={order.status}
          onStatusChange={onStatusChange}
          id={order.id || 0}
        />
      </TableCell>
      <TableCell sx={{ pr: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 1 }}>
          <IconButton 
            onClick={() => onEdit(order)}
            size="small"
          >
            <EditIcon sx={{ color: "green" }} />
          </IconButton>
          <IconButton 
            onClick={() => {
              const formattedId = formatOrderId(order);
              const orderWithCustomMessage = {
                ...order,
                _deleteMessage: `Are you sure you want to delete order <b>${formattedId}</b>?`
              };
              onDelete(orderWithCustomMessage);
            }}
            size="small"
          >
            <DeleteIcon sx={{ color: "red" }} />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
};
export default OrderTableRow;
