import React from "react";
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  useMediaQuery,
  useTheme,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import { Order, Client } from "types";
import { formatDate } from "utils/formatters";
import ClientInfo from "common/components/ClientInfo";
import DeviceIcon from "common/components/DeviceIcon";
interface RecentOrdersProps {
  orders: Order[];
  clients: Client[];
  getStatusChip: (status: string) => React.ReactNode;
}
const RecentOrders: React.FC<RecentOrdersProps> = ({
  orders,
  clients,
  getStatusChip,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const formatOrderId = (order: Order) => {
    const index = orders.findIndex((o) => o.id === order.id);
    return `#PR-${(orders.length - index).toString().padStart(4, "0")}`;
  };
  if (isMobile) {
    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Last 5 Orders
        </Typography>
        <Stack spacing={2}>
          {orders.slice(0, 5).map((order) => (
            <Card key={order.id} sx={{ boxShadow: 1 }}>
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    {formatOrderId(order)}
                  </Typography>
                  {getStatusChip(order.status)}
                </Box>
                <List sx={{ p: 0 }}>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemText
                      primary="Device:"
                      slotProps={{
                        primary: {
                          sx: {
                            variant: "body2",
                            color: "text.secondary",
                            fontWeight: 500,
                          },
                        },
                      }}
                      sx={{ flex: "0 0 35%" }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                      <DeviceIcon 
                        brand={order.device?.brand}                        
                        size="small" 
                        color={undefined}
                      />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {order.device?.brand} {order.device?.model}
                      </Typography>
                    </Box>
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemText
                      primary="Client:"
                      slotProps={{
                        primary: {
                          sx: {
                            variant: "body2",
                            color: "text.secondary",
                            fontWeight: 500,
                          },
                        },
                      }}
                      sx={{ flex: "0 0 35%" }}
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
                      primary="Date:"
                      slotProps={{
                        primary: {
                          sx: {
                            variant: "body2",
                            color: "text.secondary",
                            fontWeight: 500,
                          },
                        },
                      }}
                      sx={{ flex: "0 0 35%" }}
                    />
                    <Typography variant="body2" sx={{ ml: 2 }}>
                      {formatDate(order.createdAt)}
                    </Typography>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    );
  }
  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Recent Last 5 Orders
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Device</TableCell>
            <TableCell>Client</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.slice(0, 5).map((order) => (
            <TableRow key={order.id}>
              <TableCell>{formatOrderId(order)}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DeviceIcon 
                    brand={order.device?.brand}                    
                    size="small" 
                  />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {order.device?.brand} {order.device?.model}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <ClientInfo clientId={order.clientId} clients={clients} />
              </TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell>{getStatusChip(order.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};
export default RecentOrders;
