import { useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { Alert, Box, Button, Container, Stack, Typography } from "@mui/material";
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router";
import OrderDetailsContent from "./components/OrderDetailsContent";
import {
  getClients,
  getOrder,
  markOrderDelivered,
  updateOrder,
  updateOrderStatus,
} from "index";
import LoadingIndicator from "components/ui/LoadingIndicator";
import { Client, Order, OrderPayload, OrderStatus } from "types";
import StatusSelect from "common/components/StatusSelect";
import OrderForm from "./components/OrderForm";
import OrderDeliveryControl from "./components/OrderDeliveryControl";

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
  const [actionError, setActionError] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

  const [editFormOpen, setEditFormOpen] = useState(false);

  const [openingEditForm, setOpeningEditForm] = useState(false);

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

  const handleStatusChange = useCallback(
    async (orderId: number, status: OrderStatus): Promise<void> => {
      try {
        setActionError(null);

        await updateOrderStatus(orderId, status);

        await loadOrder();
      } catch (error: unknown) {
        console.error("Error changing order status:", error);

        const axiosError = error as AxiosError<ApiErrorResponse>;

        setActionError(
          axiosError.response?.data?.error ?? "Failed to change order status.",
        );
      }
    },
    [loadOrder],
  );

  const handleDeliver = useCallback(
    async (orderId: number): Promise<void> => {
      try {
        setActionError(null);

        await markOrderDelivered(orderId);

        await loadOrder();
      } catch (error: unknown) {
        console.error("Error delivering order:", error);

        const axiosError = error as AxiosError<ApiErrorResponse>;

        setActionError(
          axiosError.response?.data?.error ?? "Failed to mark order as delivered.",
        );

        throw error;
      }
    },
    [loadOrder],
  );

  const handleOpenEditForm = useCallback(async (): Promise<void> => {
    try {
      setOpeningEditForm(true);
      setActionError(null);

      const clientsData = await getClients();

      setClients(clientsData);
      setEditFormOpen(true);
    } catch (error: unknown) {
      console.error("Error loading clients:", error);

      const axiosError = error as AxiosError<ApiErrorResponse>;

      setActionError(
        axiosError.response?.data?.error ?? "Failed to prepare the edit form.",
      );
    } finally {
      setOpeningEditForm(false);
    }
  }, []);

  const handleUpdateOrder = useCallback(
    async (payload: OrderPayload): Promise<void> => {
      if (!order?.id) {
        throw new Error("Order ID is missing.");
      }

      await updateOrder(order.id, payload);

      await loadOrder();

      setEditFormOpen(false);
    },
    [loadOrder, order?.id],
  );

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
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1}
            justifyContent="space-between"
            alignItems={{
              xs: "stretch",
              sm: "center",
            }}
            sx={{
              mb: 2,
            }}
          >
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => {
                navigate("/orders");
              }}
              sx={{
                alignSelf: {
                  xs: "flex-start",
                  sm: "auto",
                },
              }}
            >
              Back to Orders
            </Button>

            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              disabled={openingEditForm}
              onClick={() => {
                void handleOpenEditForm();
              }}
            >
              {openingEditForm ? "Loading..." : "Edit Order"}
            </Button>
          </Stack>

          <Alert severity="error">{errorMessage ?? "Order not found."}</Alert>
        </Stack>
        {order && (
  <OrderForm
    open={editFormOpen}
    order={order}
    clients={clients}
    onSubmit={handleUpdateOrder}
    onClose={() => {
      setEditFormOpen(false);
    }}
  />
)}
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
          </Stack>
        </Box>
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={1.5}
          alignItems={{
            xs: "stretch",
            sm: "center",
          }}
          sx={{
            width: {
              xs: "100%",
              sm: "auto",
            },
          }}
        >
          <Box
            sx={{
              minWidth: {
                xs: "100%",
                sm: 160,
              },
            }}
          >
            <StatusSelect
              status={order.status}
              id={order.id ?? 0}
              onStatusChange={(orderId, status) => {
                void handleStatusChange(orderId, status);
              }}
            />
          </Box>

          <OrderDeliveryControl
            order={order}
            onDeliver={handleDeliver}
          />
        </Stack>
        {actionError && (
          <Alert
            severity="error"
            onClose={() => {
              setActionError(null);
            }}
          >
            {actionError}
          </Alert>
        )}
        <OrderDetailsContent order={order} />
      </Stack>
    </Container>
  );
};

export default OrderDetailsPage;
