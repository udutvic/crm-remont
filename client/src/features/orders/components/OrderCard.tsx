import React from "react";
import { Card, CardContent, Box, Typography, IconButton, List, ListItem, ListItemText } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Order, OrderStatus, Client } from "types";
import { formatDate, formatPrice } from "utils/formatters";
import StatusSelect from "common/components/StatusSelect";
import ClientInfo from "common/components/ClientInfo";
import DeviceIcon from "../../../common/components/DeviceIcon";
interface OrderCardProps {
  order: Order;
  clients: Client[];
  onEdit: (order: Order) => void;
  onDelete: (order: Order, nameField?: keyof Order) => void;
  onStatusChange: (id: number, status: OrderStatus) => void;
  formatOrderId: (order: Order) => string;
}
const OrderCard: React.FC<OrderCardProps> = ({
  order,
  clients,
  onEdit,
  onDelete,
  onStatusChange,
  formatOrderId
}) => {
  return (
    <Card sx={{ boxShadow: 1, borderRadius: 1 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
              {formatOrderId(order)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DeviceIcon 
                brand={order.device.brand}                 
                size="small" 
              />
              <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                {order.device.brand} {order.device.model}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton 
              onClick={() => onEdit(order)}
              size="small"
              sx={{ padding: 0.75 }}
            >
              <EditIcon sx={{ color: "green", fontSize: "1.1rem" }} />
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
              sx={{ padding: 0.75 }}
            >
              <DeleteIcon sx={{ color: "red", fontSize: "1.1rem" }} />
            </IconButton>
          </Box>
        </Box>
        <List sx={{ p: 0 }}>
          <ListItem sx={{ px: 0, py: 0.5 }}>
            <ListItemText 
              primary="Client:" 
              slotProps={{
                primary: {
                  sx: {
                    variant: 'body2', 
                    color: 'text.secondary',
                    fontWeight: 500
                  }
                }
              }} 
              sx={{ flex: '0 0 35%' }}
            />
            <Box sx={{ ml: 2 }}>
              <ClientInfo 
                clientId={order.clientId} 
                clients={clients} 
                isMobileView={true}
              />
            </Box>
          </ListItem>
          <ListItem sx={{ px: 0, py: 0.5 }}>
            <ListItemText 
              primary="Price:" 
              slotProps={{
                primary: {
                  sx: {
                    variant: 'body2', 
                    color: 'text.secondary',
                    fontWeight: 500
                  }
                }
              }} 
              sx={{ flex: '0 0 35%' }}
            />
            <Typography variant="body2" sx={{ ml: 2 }}>
              {formatPrice(order.price)}
            </Typography>
          </ListItem>
          <ListItem sx={{ px: 0, py: 0.5 }}>
            <ListItemText 
              primary="Date:" 
              slotProps={{
                primary: {
                  sx: {
                    variant: 'body2', 
                    color: 'text.secondary',
                    fontWeight: 500
                  }
                }
              }} 
              sx={{ flex: '0 0 35%' }}
            />
            <Typography variant="body2" sx={{ ml: 2 }}>
              {formatDate(order.createdAt)}
            </Typography>
          </ListItem>
          <ListItem sx={{ px: 0, py: 0.5 }}>
            <ListItemText 
              primary="Status:" 
              slotProps={{
                primary: {
                  sx: {
                    variant: 'body2', 
                    color: 'text.secondary',
                    fontWeight: 500
                  }
                }
              }} 
              sx={{ flex: '0 0 35%' }}
            />
            <Box sx={{ ml: 2 }}>
              <StatusSelect
                status={order.status}
                onStatusChange={onStatusChange}
                id={order.id || 0}
                isMobileView={true}
              />
            </Box>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};
export default OrderCard;
