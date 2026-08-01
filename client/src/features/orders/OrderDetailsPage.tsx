import { useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router";

import LoadingIndicator from "components/ui/LoadingIndicator";
import { getOrder } from "index";
import { Order } from "types";

interface ApiErrorResponse {
  error?: string;
}

const OrderDetailsPage = () => {
  const navigate = useNavigate();

  const { id } = useParams<{
    id: string;
  }>();

  const [order, setOrder] = useState<Order | null>(null);

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadOrder = useCallback(async (): Promise<void> => {
    const orderId = Number(id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      setErrorMessage("Invalid order ID.");
      setLoading(false);

      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const data = await getOrder(orderId);

      setOrder(data);
    } catch (error: unknown) {
      console.error("Error loading order:", error);

      const axiosError = error as AxiosError<ApiErrorResponse>;

      if (axiosError.response?.status === 404) {
        setErrorMessage("Order not found.");
      } else {
        setErrorMessage(axiosError.response?.data?.error ?? "Failed to load order.");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadOrder();
  }, [loadOrder]);

  if (loading) {
    return <LoadingIndicator message="Loading order..." />;
  }

  if (errorMessage || !order) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          mt: 4,
          mb: 4,
        }}
      >
        <Stack spacing={2}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => {
              navigate("/orders");
            }}
            sx={{
              alignSelf: "flex-start",
            }}
          >
            Back to Orders
          </Button>

          <Alert severity="error">{errorMessage ?? "Order not found."}</Alert>
        </Stack>
      </Container>
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
        mb: {
          xs: 2,
          sm: 4,
        },
      }}
    >
      <Stack spacing={3}>
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => {
              navigate("/orders");
            }}
            sx={{
              mb: 2,
            }}
          >
            Back to Orders
          </Button>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{
              xs: "flex-start",
              sm: "center",
            }}
          >
            <Box>
              <Typography
                variant="h4"
                component="h1"
              >
                Order #{order.id}
              </Typography>

              <Typography color="text.secondary">
                {order.device.brand} {order.device.model}
              </Typography>
            </Box>

            <Chip
              label={order.status.replace("_", " ")}
              color={
                order.status === "completed"
                  ? "success"
                  : order.status === "cancelled"
                    ? "error"
                    : order.status === "in_progress"
                      ? "primary"
                      : order.status === "pending"
                        ? "warning"
                        : "default"
              }
              sx={{
                textTransform: "capitalize",
              }}
            />
          </Stack>
        </Box>

        <Paper
          variant="outlined"
          sx={{
            p: {
              xs: 2,
              sm: 3,
            },
          }}
        >
          <Stack spacing={2}>
            <Box>
              <Typography
                variant="overline"
                color="text.secondary"
              >
                Client
              </Typography>

              <Typography>{order.client?.name ?? `Client #${order.clientId}`}</Typography>

              {order.client?.phone && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {order.client.phone}
                </Typography>
              )}
            </Box>

            <Box>
              <Typography
                variant="overline"
                color="text.secondary"
              >
                Device
              </Typography>

              <Typography>
                {order.device.brand} {order.device.model}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="overline"
                color="text.secondary"
              >
                Reported Problem
              </Typography>

              <Typography
                sx={{
                  whiteSpace: "pre-wrap",
                }}
              >
                {order.problem}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default OrderDetailsPage;
