import React, { useState, useEffect, useCallback } from "react";
import { Container, SelectChangeEvent } from "@mui/material";
import { Order, OrderStatus, Client } from "types";
import {
  getOrders,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getClients,
} from "index";
import LoadingIndicator from "components/ui/LoadingIndicator";
import ConfirmDeleteDialog from "components/ui/ConfirmDeleteDialog";
import useCrud from "hooks/useCrud";
import useSorting from "hooks/useSorting";
import PageHeader from "common/components/PageHeader";
import OrderList from "./components/OrderList";
import OrderStatusFilter from "./components/OrderStatusFilter";
import OrderForm from "./components/OrderForm";
const OrdersPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [clients, setClients] = useState<Client[]>([]);
  const { handleRequestSort, sortItems } = useSorting<Order>({
    defaultOrderBy: "createdAt"
  });
  const {
    items: orders,
    selectedItem: selectedOrder,
    openForm,
    loading,
    deleteDialogOpen,
    deleteDialogMessage,
    isDeleteEnabled,
    loadItems: loadOrders,
    handleAdd: handleAddOrder,
    handleEdit: handleEditOrder,
    handleDelete: handleDeleteOrder,
    confirmDelete: confirmDeleteOrder,
    handleSubmit,
    handleCloseForm,
    handleCloseDeleteDialog,
  } = useCrud<Order>({
    getAll: getOrders,
    create: createOrder,
    update: updateOrder,
    remove: deleteOrder,
  });
  useEffect(() => {
    const loadClients = async () => {
      try {
        const clientsData = await getClients();
        setClients(clientsData);
      } catch (error) {
        console.error("Error loading clients:", error);
      }
    };
    loadClients();
  }, []);
  const filteredOrders = statusFilter === "all"
    ? orders
    : orders.filter((order) => order.status === statusFilter);
  const sortedOrders = sortItems(filteredOrders);
  const handleFilterChange = useCallback((event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
  }, []);
  const handleChangeStatus = useCallback(async (id: number, status: OrderStatus) => {
    try {
      await updateOrderStatus(id, status);
      loadOrders();
    } catch (error) {
      console.error("Error changing status:", error);
    }
  }, [loadOrders]);
  const formatOrderId = useCallback((order: Order) => {
    const index = filteredOrders.findIndex((o) => o.id === order.id);
    return `#PR-${(filteredOrders.length - index).toString().padStart(4, "0")}`;
  }, [filteredOrders]);
  if (loading) {
    return <LoadingIndicator message="Loading data..." />;
  }
  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: { xs: 2, sm: 4 },
        mb: { xs: 2, sm: 4 },
        px: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <PageHeader 
        title="Orders" 
        onAddClick={handleAddOrder} 
        addButtonText="Add Order" 
      />
      <OrderStatusFilter 
        statusFilter={statusFilter}
        onFilterChange={handleFilterChange}
      />
      <OrderList 
        orders={sortedOrders}
        clients={clients}
        onEdit={handleEditOrder}
        onDelete={handleDeleteOrder}
        onStatusChange={handleChangeStatus}
        onSort={handleRequestSort}
        formatOrderId={formatOrderId}
      />
      <OrderForm
        open={openForm}
        order={selectedOrder}
        clients={clients}
        onSubmit={handleSubmit}
        onClose={handleCloseForm}
      />
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        message={deleteDialogMessage}
        onConfirm={confirmDeleteOrder}
        onClose={handleCloseDeleteDialog}
        isConfirmEnabled={isDeleteEnabled}
      />
    </Container>
  );
};
export default OrdersPage;
