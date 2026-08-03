import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  AxiosError,
} from "axios";
import {
  Alert,
  Container,
  Stack,
} from "@mui/material";
import type {
  GridPaginationModel,
  GridSortModel,
} from "@mui/x-data-grid";
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
  createRepairIntake,
  archiveOrder,
  getClients,
  getPagedOrders,
  markOrderDelivered,
  updateOrder,
  updateOrderStatus,
} from "index";
import formatOrderNumber from "utils/formatOrderNumber";
import type {
  Client,
  Order,
  OrderListDeliveryFilter,
  OrderListSortField,
  OrderPayload,
  OrderStatus,
  RepairIntakePayload,
} from "types";

import OrderFilters from "./components/OrderFilters";
import OrderForm from "./components/OrderForm";
import OrderList from "./components/OrderList";
import RepairIntakeForm from "./components/RepairIntakeForm";

interface ApiErrorResponse {
  error?: string;
}

type OrderStatusFilter =
  | OrderStatus
  | "all";

const SORT_FIELD_MAP: Record<
  string,
  OrderListSortField
> = {
  id: "id",
  receivedAt:
    "receivedAt",
  status: "status",
};

const OrdersPage = () => {
  const {
    t,
  } = useTranslation();

  const navigate =
    useNavigate();

  const [
    orders,
    setOrders,
  ] = useState<Order[]>([]);

  const [
    clients,
    setClients,
  ] = useState<Client[]>([]);

  const [
    total,
    setTotal,
  ] = useState(0);

  const [
    listLoading,
    setListLoading,
  ] = useState(true);

  const [
    hasLoaded,
    setHasLoaded,
  ] = useState(false);

  const [
    loadError,
    setLoadError,
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
    searchInput,
    setSearchInput,
  ] = useState("");

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<OrderStatusFilter>(
      "all"
    );

  const [
    deliveryFilter,
    setDeliveryFilter,
  ] =
    useState<OrderListDeliveryFilter>(
      "all"
    );

  const [
    startDate,
    setStartDate,
  ] = useState("");

  const [
    endDate,
    setEndDate,
  ] = useState("");

  const [
    paginationModel,
    setPaginationModel,
  ] =
    useState<GridPaginationModel>({
      page: 0,
      pageSize: 25,
    });

  const [
    sortModel,
    setSortModel,
  ] = useState<GridSortModel>([
    {
      field: "receivedAt",
      sort: "desc",
    },
  ]);

  const [
    reloadKey,
    setReloadKey,
  ] = useState(0);

  const [
    intakeOpen,
    setIntakeOpen,
  ] = useState(false);

  const [
    selectedOrder,
    setSelectedOrder,
  ] = useState<
    Order | undefined
  >(undefined);

  const [
    editFormOpen,
    setEditFormOpen,
  ] = useState(false);

  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] = useState(false);

  const [
    deleteDialogMessage,
    setDeleteDialogMessage,
  ] = useState("");

  const [
    archiveReason,
    setArchiveReason,
  ] = useState("");

  const [
    orderToDelete,
    setOrderToDelete,
  ] = useState<
    Order | null
  >(null);

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  const requestIdRef =
    useRef(0);

  const clientsLoadedRef =
    useRef(false);

  useEffect(() => {
    const timeout =
      window.setTimeout(
        () => {
          setSearchQuery(
            searchInput.trim()
          );

          setPaginationModel(
            (
              current
            ) => ({
              ...current,
              page: 0,
            })
          );
        },
        350
      );

    return () => {
      window.clearTimeout(
        timeout
      );
    };
  }, [searchInput]);

  const loadClients =
    useCallback(
      async (
        force = false
      ): Promise<boolean> => {
        if (
          clientsLoadedRef.current &&
          !force
        ) {
          return true;
        }

        try {
          const clientsData =
            await getClients();

          setClients(
            clientsData
          );

          clientsLoadedRef.current =
            true;

          return true;
        } catch (
          error: unknown
        ) {
          console.error(
            "Error loading clients:",
            error
          );

          setActionError(
            t(
              "ordersPage.errors.clientsLoadFailed"
            )
          );

          return false;
        }
      },
      [t]
    );

  const loadOrders =
    useCallback(
      async (): Promise<void> => {
        /*
         * reloadKey intentionally invalidates
         * this callback after mutations.
         */
        void reloadKey;

        const requestId =
          requestIdRef.current +
          1;

        requestIdRef.current =
          requestId;

        setListLoading(true);

        const firstSort =
          sortModel[0];

        const sortBy =
          firstSort
            ? SORT_FIELD_MAP[
                firstSort.field
              ] ??
              "receivedAt"
            : "receivedAt";

        const sortDirection =
          firstSort?.sort ===
          "asc"
            ? "asc"
            : "desc";

        try {
          const response =
            await getPagedOrders({
              q:
                searchQuery ||
                undefined,

              status:
                statusFilter,

              delivery:
                deliveryFilter,

              startDate:
                startDate ||
                undefined,

              endDate:
                endDate ||
                undefined,

              page:
                paginationModel.page +
                1,

              pageSize:
                paginationModel.pageSize,

              sortBy,
              sortDirection,
            });

          if (
            requestId !==
            requestIdRef.current
          ) {
            return;
          }

          const maximumPage =
            response.pagination
              .totalPages > 0
              ? response.pagination
                  .totalPages -
                1
              : 0;

          if (
            paginationModel.page >
            maximumPage
          ) {
            setPaginationModel(
              (
                current
              ) => ({
                ...current,
                page:
                  maximumPage,
              })
            );

            return;
          }

          setOrders(
            response.items
          );

          if (
            !clientsLoadedRef.current
          ) {
            const pageClientsById =
              new Map<number, Client>();

            for (
              const order of
              response.items
            ) {
              const client =
                order.client;

              if (
                client &&
                typeof client.id ===
                  "number"
              ) {
                pageClientsById.set(
                  client.id,
                  client
                );
              }
            }

            setClients([
              ...pageClientsById.values(),
            ]);
          }

          setTotal(
            response.pagination
              .total
          );

          setLoadError(null);
        } catch (
          error: unknown
        ) {
          if (
            requestId !==
            requestIdRef.current
          ) {
            return;
          }

          console.error(
            "Error loading paged orders:",
            error
          );

          const axiosError =
            error as AxiosError<ApiErrorResponse>;

          setLoadError(
            axiosError.response
              ?.data?.error ??
              t(
                "ordersPage.errors.loadFailed"
              )
          );
        } finally {
          if (
            requestId ===
            requestIdRef.current
          ) {
            setListLoading(
              false
            );

            setHasLoaded(true);
          }
        }
      },
      [
        deliveryFilter,
        endDate,
        paginationModel.page,
        paginationModel.pageSize,
        reloadKey,
        searchQuery,
        sortModel,
        startDate,
        statusFilter,
        t,
      ]
    );

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const reloadOrders =
    useCallback((): void => {
      setReloadKey(
        (value) =>
          value + 1
      );
    }, []);

  const resetPage =
    useCallback((): void => {
      setPaginationModel(
        (
          current
        ) => ({
          ...current,
          page: 0,
        })
      );
    }, []);

  const handleStatusFilterChange =
    useCallback(
      (
        value: OrderStatusFilter
      ): void => {
        setStatusFilter(
          value
        );

        resetPage();
      },
      [resetPage]
    );

  const handleDeliveryFilterChange =
    useCallback(
      (
        value:
          OrderListDeliveryFilter
      ): void => {
        setDeliveryFilter(
          value
        );

        resetPage();
      },
      [resetPage]
    );

  const handleStartDateChange =
    useCallback(
      (
        value: string
      ): void => {
        setStartDate(
          value
        );

        resetPage();
      },
      [resetPage]
    );

  const handleEndDateChange =
    useCallback(
      (
        value: string
      ): void => {
        setEndDate(value);
        resetPage();
      },
      [resetPage]
    );

  const handleResetFilters =
    useCallback((): void => {
      setSearchInput("");
      setSearchQuery("");
      setStatusFilter("all");
      setDeliveryFilter(
        "all"
      );
      setStartDate("");
      setEndDate("");

      setPaginationModel(
        (
          current
        ) => ({
          ...current,
          page: 0,
        })
      );
    }, []);

  const handlePaginationModelChange =
    useCallback(
      (
        model:
          GridPaginationModel
      ): void => {
        setPaginationModel(
          model
        );
      },
      []
    );

  const handleSortModelChange =
    useCallback(
      (
        model: GridSortModel
      ): void => {
        const nextModel =
          model.length > 0
            ? [
                model[
                  model.length -
                    1
                ],
              ]
            : [
                {
                  field:
                    "receivedAt",
                  sort: "desc" as const,
                },
              ];

        setSortModel(
          nextModel
        );

        resetPage();
      },
      [resetPage]
    );

  const handleChangeStatus =
    useCallback(
      async (
        id: number,
        status: OrderStatus
      ): Promise<void> => {
        try {
          setActionError(null);

          await updateOrderStatus(
            id,
            status
          );

          reloadOrders();
        } catch (
          error: unknown
        ) {
          console.error(
            "Error changing status:",
            error
          );

          const axiosError =
            error as AxiosError<ApiErrorResponse>;

          setActionError(
            axiosError.response
              ?.data?.error ??
              t(
                "ordersPage.errors.statusUpdateFailed"
              )
          );
        }
      },
      [
        reloadOrders,
        t,
      ]
    );

  const handleDeliverOrder =
    useCallback(
      async (
        id: number
      ): Promise<void> => {
        try {
          setActionError(null);

          await markOrderDelivered(
            id
          );

          reloadOrders();
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
        reloadOrders,
        t,
      ]
    );

  const handleViewOrder =
    useCallback(
      (
        order: Order
      ): void => {
        if (!order.id) {
          return;
        }

        navigate(
          `/orders/${order.id}`
        );
      },
      [navigate]
    );

  const handleEditOrder =
    useCallback(
      async (
        order: Order
      ): Promise<void> => {
        setActionError(null);

        if (
          !(await loadClients())
        ) {
          return;
        }

        setSelectedOrder(
          order
        );

        setEditFormOpen(
          true
        );
      },
      [loadClients]
    );

  const handleCloseEditForm =
    useCallback((): void => {
      setEditFormOpen(
        false
      );

      setSelectedOrder(
        undefined
      );
    }, []);

  const handleOrderSubmit =
    useCallback(
      async (
        payload: OrderPayload
      ): Promise<void> => {
        if (!selectedOrder?.id) {
          throw new Error(
            t(
              "orderDetails.errors.missingOrderId"
            )
          );
        }

        await updateOrder(
          selectedOrder.id,
          payload
        );

        handleCloseEditForm();
        reloadOrders();
      },
      [
        handleCloseEditForm,
        reloadOrders,
        selectedOrder?.id,
        t,
      ]
    );

  const handleDeleteOrder =
    useCallback(
      (
        order: Order
      ): void => {
        setOrderToDelete(
          order
        );

        setArchiveReason("");

        setDeleteDialogMessage(
          order._deleteMessage ??
            t(
              "ordersPage.archiveConfirmation",
              {
                id:
                  formatOrderNumber(
                    order.id
                  ),
              }
            )
        );

        setDeleteDialogOpen(
          true
        );
      },
      [t]
    );

  const handleCloseDeleteDialog =
    useCallback((): void => {
      if (deleting) {
        return;
      }

      setDeleteDialogOpen(
        false
      );

      setOrderToDelete(
        null
      );

      setArchiveReason("");
    }, [deleting]);

  const confirmDeleteOrder =
    useCallback(
      async (): Promise<void> => {
        if (
          !orderToDelete?.id ||
          deleting
        ) {
          return;
        }

        try {
          setDeleting(true);

          await archiveOrder(
            orderToDelete.id,
            archiveReason.trim()
          );

          setDeleteDialogOpen(
            false
          );

          setOrderToDelete(
            null
          );

          setArchiveReason("");

          if (
            orders.length ===
              1 &&
            paginationModel.page >
              0
          ) {
            setPaginationModel(
              (
                current
              ) => ({
                ...current,
                page:
                  current.page -
                  1,
              })
            );
          } else {
            reloadOrders();
          }
        } catch (
          error: unknown
        ) {
          console.error(
            "Error archiving order:",
            error
          );

          const axiosError =
            error as AxiosError<ApiErrorResponse>;

          setDeleteDialogMessage(
            axiosError.response
              ?.data?.error ??
              t(
                "ordersPage.errors.archiveFailed"
              )
          );

          setOrderToDelete(
            null
          );
        } finally {
          setDeleting(false);
        }
      },
      [
        archiveReason,
        deleting,
        orderToDelete?.id,
        orders.length,
        paginationModel.page,
        reloadOrders,
        t,
      ]
    );

  const handleOpenIntake =
    useCallback(
      async (): Promise<void> => {
        setActionError(null);

        if (
          !(await loadClients())
        ) {
          return;
        }

        setIntakeOpen(true);
      },
      [loadClients]
    );

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

        setPaginationModel(
          (
            current
          ) => ({
            ...current,
            page: 0,
          })
        );

        await loadClients(true);
        reloadOrders();
      },
      [
        loadClients,
        reloadOrders,
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

  if (
    listLoading &&
    !hasLoaded
  ) {
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
          <Alert
            severity="error"
            onClose={() => {
              setLoadError(null);
            }}
          >
            {loadError}
          </Alert>
        )}

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

        <OrderFilters
          searchValue={
            searchInput
          }
          status={
            statusFilter
          }
          delivery={
            deliveryFilter
          }
          startDate={
            startDate
          }
          endDate={endDate}
          disabled={
            deleting
          }
          onSearchChange={
            setSearchInput
          }
          onStatusChange={
            handleStatusFilterChange
          }
          onDeliveryChange={
            handleDeliveryFilterChange
          }
          onStartDateChange={
            handleStartDateChange
          }
          onEndDateChange={
            handleEndDateChange
          }
          onReset={
            handleResetFilters
          }
        />

        <OrderList
          orders={orders}
          clients={clients}
          total={total}
          loading={
            listLoading
          }
          paginationModel={
            paginationModel
          }
          sortModel={
            sortModel
          }
          onPaginationModelChange={
            handlePaginationModelChange
          }
          onSortModelChange={
            handleSortModelChange
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
          editFormOpen
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
          handleCloseEditForm
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
        title={t(
          "ordersPage.archiveDialog.title"
        )}
        confirmLabel={t(
          "ordersPage.archiveDialog.confirm"
        )}
        inputLabel={t(
          "ordersPage.archiveDialog.reason"
        )}
        inputValue={
          archiveReason
        }
        inputRequired
        inputMaxLength={500}
        inputHelperText={
          archiveReason.trim()
            ? t(
                "ordersPage.archiveDialog.reasonCounter",
                {
                  count:
                    archiveReason.length,
                }
              )
            : t(
                "ordersPage.archiveDialog.reasonRequired"
              )
        }
        onInputChange={
          setArchiveReason
        }
        confirmColor="warning"
        isConfirmEnabled={
          !deleting &&
          Boolean(
            orderToDelete
          ) &&
          archiveReason.trim()
            .length > 0
        }
      />
    </Container>
  );
};

export default OrdersPage;
