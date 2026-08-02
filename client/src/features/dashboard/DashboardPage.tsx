import {
  useEffect,
  useState,
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
  getDashboardStats,
} from "index";
import type {
  DashboardStats,
} from "index";
import type {
  OrderStatus,
} from "types";

import RecentOrders from "./components/RecentOrders";
import StatisticsCards from "./components/StatisticsCards";
import StatusChip from "./components/StatusChip";

const DashboardPage = () => {
  const {
    t,
  } = useTranslation();

  const [
    stats,
    setStats,
  ] =
    useState<DashboardStats | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    hasLoadError,
    setHasLoadError,
  ] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadStats =
      async (): Promise<void> => {
        try {
          setLoading(true);
          setHasLoadError(
            false
          );

          const result =
            await getDashboardStats();

          if (isActive) {
            setStats(result);
          }
        } catch (
          error: unknown
        ) {
          console.error(
            "Dashboard statistics load failed:",
            error
          );

          if (isActive) {
            setStats(null);
            setHasLoadError(
              true
            );
          }
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

    void loadStats();

    return () => {
      isActive = false;
    };
  }, []);

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

        {stats && (
          <>
            <StatisticsCards
              clientsCount={
                stats.clientCount
              }
              devicesCount={
                stats.deviceCount
              }
              ordersCount={
                stats.orderCount
              }
              totalIncome={
                stats.totalIncome
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
                    stats.recentOrders
                  }
                  getStatusChip={
                    getStatusChip
                  }
                />
              </Grid>
            </Grid>
          </>
        )}
      </Stack>
    </Container>
  );
};

export default DashboardPage;
