import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Alert,
  Container,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";
import {
  useNavigate,
} from "react-router";

import PageHeader from "common/components/PageHeader";
import ConfirmDeleteDialog from "components/ui/ConfirmDeleteDialog";
import LoadingIndicator from "components/ui/LoadingIndicator";
import {
  createOrder,
  createRepairIntake,
  deleteOrder,
  getClients,
  getOrders,
  markOrderDelivered,
  updateOrder,
  updateOrderStatus,
} from "index";
import useCrud from "hooks/useCrud";
import useSorting from "hooks/useSorting";
import formatOrderNumber from "utils/formatOrderNumber";
import type {
  Client,
  Order,
  OrderPayload,
  OrderStatus,
  RepairIntakePayload,
} from "types";

import OrderForm from "./components/OrderForm";
import OrderList from "./components/OrderList";
import OrderStatusFilter from "./components/OrderStatusFilter";
import RepairIntakeForm from "./components/RepairIntakeForm";

const OrdersPage = () => {
  const {
    t,
  } = useTranslation();

  const navigate =
    useNavigate();

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("all");

  const [
    clients,
    setClients,
  ] = useState<Client[]>([]);

  const [
    intakeOpen,
    setIntakeOpen,
  ] = useState(false);

  const [
    actionErrorKey,
    setActionErrorKey,
  ] = useState<
    string | null
  >(null);

  const {
    handleRequestSort,
    sortItems,
  } = useSorting<Order>({
    defaultOrderBy:
      "createdAt",
  });

  const {
    items: orders,
    selectedItem:
      selectedOrder,
    openForm,
    loading,
    error: loadError,
    deleteDialogOpen,
    deleteDialogMessage,
    isDeleteEnabled,
    loadItems: loadOrders,
    handleEdit:
      handleEditOrder,
    handleDelete:
      handleDeleteOrder,
    confirmDelete:
      confirmDeleteOrder,
    handleSubmit:
      handleOrderSubmit,
    handleCloseForm,
    handleCloseDeleteDialog,
  } = useCrud<
    Order,
    OrderPayload
  >({
    getAll: getOrders,
    create: createOrder,
    update: updateOrder,
    remove: deleteOrder,
  });

  const loadClients =
    useCallback(
      async (): Promise<void> => {
        try {
          const clientsData =
            await getClients();

          setClients(
            clientsData
          );
        } catch (
          error: unknown
        ) {
          console.error(
            "Error loading clients:",
            error
          );

          setActionErrorKey(
            "ordersPage.errors.clientsLoadFailed"
          );
        }
      },
      []
    );

  useEffect(() => {
    void loadClients();
  }, [loadClients]);

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter(
          (order) =>
            order.status ===
            statusFilter
        );

  const sortedOrders =
    sortItems(
      filteredOrders
    );

  const handleFilterChange =
    useCallback(
      (
        event: SelectChangeEvent
      ): void => {
        setStatusFilter(
          event.target.value
        );
      },
      []
    );

  const handleChangeStatus =
    useCallback(
      async (
        id: number,
        status: OrderStatus
      ): Promise<void> => {
        try {
          setActionErrorKey(
            null
          );

          await updateOrderStatus(
            id,
            status
          );

          await loadOrders();
        } catch (
          error: unknown
        ) {
          console.error(
            "Error changing status:",
            error
          );

          setActionErrorKey(
            "ordersPage.errors.statusUpdateFailed"
          );
        }
      },
      [loadOrders]
    );

  const handleDeliverOrder =
    useCallback(
      async (
        id: number
      ): Promise<void> => {
        await markOrderDelivered(
          id
        );

        await loadOrders();
      },
      [loadOrders]
    );

  const handleViewOrder =
    useCallback(
      (order: Order): void => {
        if (!order.id) {
          return;
        }

        navigate(
          `/orders/${order.id}`
        );
      },
      [navigate]
    );

  const handleOpenIntake =
    useCallback((): void => {
      setActionErrorKey(
        null
      );

      setIntakeOpen(true);
    }, []);

  const handleCreateIntake =
    useCallback(
      async (
        payload:
          RepairIntakePayload
      ): Promise<void> => {
        await createRepairIntake(
          payload
        );

        setIntakeOpen(false);

        await Promise.all([
          loadOrders(),
          loadClients(),
        ]);
      },
      [
        loadClients,
        loadOrders,
      ]
    );

  const formatOrderId =
    useCallback(
      (
        order: Order
      ): string =>
        formatOrderNumber(
          order.id
        ),
      []
    );

  if (loading) {
    return (
      <LoadingIndicator
        message={t(
          "ordersPage.loading"
        )}
      />
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

        px: {
          xs: 1,
          sm: 2,
          md: 3,
        },
      }}
    >
      <PageHeader
        title={t(
          "ordersPage.title"
        )}
        onAddClick={
          handleOpenIntake
        }
        addButtonText={t(
          "ordersPage.addOrder"
        )}
      />

      <Stack spacing={2}>
        {loadError && (
          <Alert severity="error">
            {t(
              "ordersPage.errors.loadFailed"
            )}
          </Alert>
        )}

        {actionErrorKey && (
          <Alert
            severity="error"
            onClose={() => {
              setActionErrorKey(
                null
              );
            }}
          >
            {t(
              actionErrorKey
            )}
          </Alert>
        )}

        <OrderStatusFilter
          statusFilter={
            statusFilter
          }
          onFilterChange={
            handleFilterChange
          }
        />

        <OrderList
          orders={
            sortedOrders
          }
          clients={
            clients
          }
          onView={
            handleViewOrder
          }
          onEdit={
            handleEditOrder
          }
          onDelete={
            handleDeleteOrder
          }
          onStatusChange={
            handleChangeStatus
          }
          onDeliver={
            handleDeliverOrder
          }
          onSort={
            handleRequestSort
          }
          formatOrderId={
            formatOrderId
          }
        />
      </Stack>

      <RepairIntakeForm
        open={
          intakeOpen
        }
        clients={
          clients
        }
        onSubmit={
          handleCreateIntake
        }
        onClose={() => {
          setIntakeOpen(
            false
          );
        }}
      />

      <OrderForm
        open={
          openForm
        }
        order={
          selectedOrder
        }
        clients={
          clients
        }
        onSubmit={
          handleOrderSubmit
        }
        onClose={
          handleCloseForm
        }
      />

      <ConfirmDeleteDialog
        open={
          deleteDialogOpen
        }
        message={
          deleteDialogMessage
        }
        onConfirm={
          confirmDeleteOrder
        }
        onClose={
          handleCloseDeleteDialog
        }
        isConfirmEnabled={
          isDeleteEnabled
        }
      />
    </Container>
  );
};

export default OrdersPage;
