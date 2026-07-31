import React, { useMemo } from "react";
import { Container, Typography, Grid } from "@mui/material";
import { Client, Device, Order } from "types";
import { getClients, getDevices, getOrders } from 'index';
import LoadingIndicator from "components/ui/LoadingIndicator";
import useCrud from "hooks/useCrud";
import StatisticsCards from "./components/StatisticsCards";
import RecentOrders from "./components/RecentOrders";
import StatusChip from "./components/StatusChip";
const DashboardPage: React.FC = () => {
  const {
    items: clients,
    loading: clientsLoading,
  } = useCrud<Client>({
    getAll: getClients,
    create: () => Promise.resolve({} as Client), 
    update: () => Promise.resolve({} as Client), 
    remove: () => Promise.resolve(), 
  });
  const {
    items: devices,
    loading: devicesLoading,
  } = useCrud<Device>({
    getAll: getDevices,
    create: () => Promise.resolve({} as Device), 
    update: () => Promise.resolve({} as Device), 
    remove: () => Promise.resolve(), 
  });
  const {
    items: orders,
    loading: ordersLoading,
  } = useCrud<Order>({
    getAll: getOrders,
    create: () => Promise.resolve({} as Order), 
    update: () => Promise.resolve({} as Order), 
    remove: () => Promise.resolve(), 
  });
  const loading = clientsLoading || devicesLoading || ordersLoading;
  const totalIncome = useMemo(() => {
    return orders
      .filter((order) => order.status === "completed")
      .reduce((sum, order) => sum + (order.price || 0), 0);
  }, [orders]);
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
  }, [orders]);
  const getStatusChip = (status: string) => {
    return <StatusChip status={status} />;
  };
  if (loading) {
    return <LoadingIndicator message="Loading data..." />;
  }
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography sx={{ pt: 3 }} variant="h4" gutterBottom>
        Dashboard
      </Typography>
      {}
      <StatisticsCards 
        clientsCount={clients.length}
        devicesCount={devices.length}
        ordersCount={orders.length}
        totalIncome={totalIncome}
      />
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {}
        <Grid size={{ xs: 12 }}>
          <RecentOrders 
            orders={sortedOrders}
            clients={clients}
            getStatusChip={getStatusChip}
          />
        </Grid>
      </Grid>
    </Container>
  );
};
export default DashboardPage;
