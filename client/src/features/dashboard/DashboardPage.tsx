import {
  useMemo,
} from "react";
import type {
  ReactNode,
} from "react";
import {
  Alert,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

import LoadingIndicator from "components/ui/LoadingIndicator";
import {
  getClients,
  getDevices,
  getOrders,
} from "index";
import useCrud from "hooks/useCrud";
import type {
  Client,
  Device,
  Order,
  OrderStatus,
} from "types";

import RecentOrders from "./components/RecentOrders";
import StatisticsCards from "./components/StatisticsCards";
import StatusChip from "./components/StatusChip";

const DashboardPage = () => {
  const {
    t,
  } = useTranslation();

  const {
    items: clients,
    loading: clientsLoading,
    error: clientsError,
  } = useCrud<Client>({
    getAll: getClients,

    create: () =>
      Promise.resolve(
        {} as Client
      ),

    update: () =>
      Promise.resolve(
        {} as Client
      ),

    remove: () =>
      Promise.resolve(),
  });

  const {
    items: devices,
    loading: devicesLoading,
    error: devicesError,
  } = useCrud<Device>({
    getAll: getDevices,

    create: () =>
      Promise.resolve(
        {} as Device
      ),

    update: () =>
      Promise.resolve(
        {} as Device
      ),

    remove: () =>
      Promise.resolve(),
  });

  const {
    items: orders,
    loading: ordersLoading,
    error: ordersError,
  } = useCrud<Order>({
    getAll: getOrders,

    create: () =>
      Promise.resolve(
        {} as Order
      ),

    update: () =>
      Promise.resolve(
        {} as Order
      ),

    remove: () =>
      Promise.resolve(),
  });

  const loading =
    clientsLoading ||
    devicesLoading ||
    ordersLoading;

  const hasLoadError =
    Boolean(
      clientsError ||
        devicesError ||
        ordersError
    );

  const totalIncome =
    useMemo(() => {
      return orders
        .filter(
          (order) =>
            order.status ===
            "completed"
        )
        .reduce(
          (sum, order) =>
            sum +
            (order.finalPrice ??
              order.price ??
              0),
          0
        );
    }, [orders]);

  const sortedOrders =
    useMemo(() => {
      return [...orders].sort(
        (first, second) =>
          (second.id ?? 0) -
          (first.id ?? 0)
      );
    }, [orders]);

  const getStatusChip = (
    status: OrderStatus
  ): ReactNode => {
    return (
      <StatusChip
        status={status}
      />
    );
  };

  if (loading) {
    return (
      <LoadingIndicator
        message={t(
          "dashboardPage.loading"
        )}
      />
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: {
          xs: 2,
          sm: 4,
        },
        mb: 4,
      }}
    >
      <Stack spacing={3}>
        <Typography
          sx={{
            pt: {
              xs: 1,
              sm: 3,
            },
          }}
          variant="h4"
          component="h1"
        >
          {t(
            "dashboardPage.title"
          )}
        </Typography>

        {hasLoadError && (
          <Alert severity="error">
            {t(
              "dashboardPage.errors.loadFailed"
            )}
          </Alert>
        )}

        <StatisticsCards
          clientsCount={
            clients.length
          }
          devicesCount={
            devices.length
          }
          ordersCount={
            orders.length
          }
          totalIncome={
            totalIncome
          }
        />

        <Grid
          container
          spacing={3}
        >
          <Grid
            size={{
              xs: 12,
            }}
          >
            <RecentOrders
              orders={
                sortedOrders
              }
              clients={
                clients
              }
              getStatusChip={
                getStatusChip
              }
            />
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
};

export default DashboardPage;
