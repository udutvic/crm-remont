import {
  useCallback,
  useEffect,
  useState,
} from "react";
import type {
  AxiosError,
} from "axios";
import {
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import {
  Alert,
  Button,
  Container,
  Stack,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";
import {
  useNavigate,
  useParams,
} from "react-router";

import LoadingIndicator from "components/ui/LoadingIndicator";
import {
  getClients,
  getDevices,
  getOrder,
  markOrderDelivered,
  updateOrder,
  updateOrderStatus,
} from "index";
import type {
  Client,
  Device,
  Order,
  OrderPayload,
  OrderStatus,
} from "types";

import OrderDetailsContent from "./components/OrderDetailsContent";
import OrderDetailsHeader from "./components/OrderDetailsHeader";
import OrderFinanceSection from "./components/OrderFinanceSection";
import OrderForm from "./components/OrderForm";
import OrderPartsSection from "./components/OrderPartsSection";
import OrderPhotosSection from "./components/OrderPhotosSection";

interface ApiErrorResponse {
  error?: string;
}

type LoadError =
  | "invalidId"
  | "notFound"
  | "loadFailed"
  | null;

const OrderDetailsPage = () => {
  const {
    t,
  } = useTranslation();

  const navigate =
    useNavigate();

  const {
    id,
  } = useParams<{
    id: string;
  }>();

  const [
    order,
    setOrder,
  ] = useState<Order | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    loadError,
    setLoadError,
  ] = useState<LoadError>(
    null
  );

  const [
    serverLoadError,
    setServerLoadError,
  ] = useState<
    string | null
  >(null);

  const [
    actionError,
    setActionError,
  ] = useState<
    string | null
  >(null);

  const [
    clients,
    setClients,
  ] = useState<Client[]>([]);

  const [
    devices,
    setDevices,
  ] = useState<Device[]>([]);

  const [
    formReferencesLoaded,
    setFormReferencesLoaded,
  ] = useState(false);

  const [
    editFormOpen,
    setEditFormOpen,
  ] = useState(false);

  const [
    openingEditForm,
    setOpeningEditForm,
  ] = useState(false);

  const loadOrder =
    useCallback(
      async (): Promise<void> => {
        const orderId =
          Number(id);

        if (
          !Number.isInteger(
            orderId
          ) ||
          orderId <= 0
        ) {
          setOrder(null);
          setLoadError(
            "invalidId"
          );
          setServerLoadError(
            null
          );
          setLoading(false);

          return;
        }

        try {
          setLoading(true);
          setLoadError(null);
          setServerLoadError(
            null
          );

          const data =
            await getOrder(
              orderId
            );

          setOrder(data);
        } catch (
          error: unknown
        ) {
          console.error(
            "Error loading order:",
            error
          );

          setOrder(null);

          const axiosError =
            error as AxiosError<ApiErrorResponse>;

          if (
            axiosError.response
              ?.status === 404
          ) {
            setLoadError(
              "notFound"
            );

            return;
          }

          const apiError =
            axiosError.response
              ?.data?.error;

          if (apiError) {
            setServerLoadError(
              apiError
            );

            setLoadError(null);
          } else {
            setLoadError(
              "loadFailed"
            );
          }
        } finally {
          setLoading(false);
        }
      },
      [id]
    );

  useEffect(() => {
    void loadOrder();
  }, [loadOrder]);

  const handleStatusChange =
    useCallback(
      async (
        orderId: number,
        status: OrderStatus
      ): Promise<void> => {
        try {
          setActionError(null);

          await updateOrderStatus(
            orderId,
            status
          );

          await loadOrder();
        } catch (
          error: unknown
        ) {
          console.error(
            "Error changing order status:",
            error
          );

          const axiosError =
            error as AxiosError<ApiErrorResponse>;

          setActionError(
            axiosError.response
              ?.data?.error ??
              t(
                "orderDetails.errors.statusUpdateFailed"
              )
          );
        }
      },
      [
        loadOrder,
        t,
      ]
    );

  const handleDeliver =
    useCallback(
      async (
        orderId: number
      ): Promise<void> => {
        try {
          setActionError(null);

          await markOrderDelivered(
            orderId
          );

          await loadOrder();
        } catch (
          error: unknown
        ) {
          console.error(
            "Error delivering order:",
            error
          );

          const axiosError =
            error as AxiosError<ApiErrorResponse>;

          setActionError(
            axiosError.response
              ?.data?.error ??
              t(
                "orderDetails.errors.deliveryFailed"
              )
          );

          throw error;
        }
      },
      [
        loadOrder,
        t,
      ]
    );

  const handleOpenEditForm =
    useCallback(
      async (): Promise<void> => {
        try {
          setOpeningEditForm(
            true
          );

          setActionError(null);

          if (
            !formReferencesLoaded
          ) {
            const [
              clientsData,
              devicesData,
            ] = await Promise.all([
              getClients(),
              getDevices(),
            ]);

            setClients(
              clientsData
            );

            setDevices(
              devicesData
            );

            setFormReferencesLoaded(
              true
            );
          }

          setEditFormOpen(
            true
          );
        } catch (
          error: unknown
        ) {
          console.error(
            "Error loading edit form references:",
            error
          );

          const axiosError =
            error as AxiosError<ApiErrorResponse>;

          setActionError(
            axiosError.response
              ?.data?.error ??
              t(
                "orderDetails.errors.editPreparationFailed"
              )
          );
        } finally {
          setOpeningEditForm(
            false
          );
        }
      },
      [
        formReferencesLoaded,
        t,
      ]
    );

  const handleUpdateOrder =
    useCallback(
      async (
        payload: OrderPayload
      ): Promise<void> => {
        if (!order?.id) {
          throw new Error(
            t(
              "orderDetails.errors.missingOrderId"
            )
          );
        }

        await updateOrder(
          order.id,
          payload
        );

        await loadOrder();

        setEditFormOpen(false);
      },
      [
        loadOrder,
        order?.id,
        t,
      ]
    );

  const getLoadErrorMessage =
    (): string => {
      if (serverLoadError) {
        return serverLoadError;
      }

      switch (loadError) {
        case "invalidId":
          return t(
            "orderDetails.errors.invalidId"
          );

        case "notFound":
          return t(
            "orderDetails.errors.notFound"
          );

        case "loadFailed":
        default:
          return t(
            "orderDetails.errors.loadFailed"
          );
      }
    };

  if (loading) {
    return (
      <LoadingIndicator
        message={t(
          "orderDetails.loadingOrder"
        )}
      />
    );
  }

  if (
    loadError ||
    serverLoadError ||
    !order
  ) {
    return (
      <Container
        maxWidth="xl"
        sx={{
          mt: 4,
          mb: 4,
        }}
      >
        <Stack spacing={2}>
          <Button
            startIcon={
              <ArrowBackIcon />
            }
            onClick={() => {
              navigate(
                "/orders"
              );
            }}
            sx={{
              alignSelf:
                "flex-start",
            }}
          >
            {t(
              "orderDetails.backToOrders"
            )}
          </Button>

          <Alert severity="error">
            {
              getLoadErrorMessage()
            }
          </Alert>
        </Stack>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xl"
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
        <Button
          startIcon={
            <ArrowBackIcon />
          }
          onClick={() => {
            navigate(
              "/orders"
            );
          }}
          sx={{
            alignSelf:
              "flex-start",
          }}
        >
          {t(
            "orderDetails.backToOrders"
          )}
        </Button>

        <OrderDetailsHeader
          order={order}
          openingEditForm={
            openingEditForm
          }
          onEdit={() => {
            void handleOpenEditForm();
          }}
          onReceipt={() => {
            if (order.id) {
              navigate(
                `/orders/${order.id}/receipt`
              );
            }
          }}
          onStatusChange={(
            orderId,
            status
          ) => {
            void handleStatusChange(
              orderId,
              status
            );
          }}
          onDeliver={
            handleDeliver
          }
        />

        {actionError && (
          <Alert
            severity="error"
            onClose={() => {
              setActionError(
                null
              );
            }}
          >
            {actionError}
          </Alert>
        )}

        <OrderDetailsContent
          order={order}
        />

        {order.id && (
          <OrderPhotosSection
            orderId={order.id}
          />
        )}

        <OrderPartsSection
          order={order}
          onChanged={loadOrder}
        />

        {order.id && (
          <OrderFinanceSection
            orderId={order.id}
            onChanged={loadOrder}
          />
        )}
      </Stack>

      <OrderForm
        open={editFormOpen}
        order={order}
        clients={clients}
        devices={devices}
        onSubmit={
          handleUpdateOrder
        }
        onClose={() => {
          setEditFormOpen(
            false
          );
        }}
      />
    </Container>
  );
};

export default OrderDetailsPage;
