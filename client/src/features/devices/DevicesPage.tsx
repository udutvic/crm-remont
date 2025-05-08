import React, { useState, useEffect } from "react";
import { Container } from "@mui/material";
import { Device, Client } from "types";
import { getDevices, createDevice, updateDevice, deleteDevice, getClients } from "index";
import LoadingIndicator from "components/ui/LoadingIndicator";
import ConfirmDeleteDialog from "components/ui/ConfirmDeleteDialog";
import useCrud from "hooks/useCrud";
import useSorting from "hooks/useSorting";
import PageHeader from "common/components/PageHeader";
import DeviceList from "./components/DeviceList";
import DeviceForm from "./components/DeviceForm";
const DevicesPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const { handleRequestSort, sortItems } = useSorting<Device>({
    defaultOrderBy: "createdAt"
  });
  const {
    items: devices,
    selectedItem: selectedDevice,
    openForm,
    loading,
    deleteDialogOpen,
    deleteDialogMessage,
    isDeleteEnabled,
    handleAdd: handleAddDevice,
    handleEdit: handleEditDevice,
    handleDelete: handleDeleteDevice,
    confirmDelete: confirmDeleteDevice,
    handleSubmit,
    handleCloseForm,
    handleCloseDeleteDialog,
  } = useCrud<Device>({
    getAll: getDevices,
    create: createDevice,
    update: updateDevice,
    remove: deleteDevice,
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
  useEffect(() => {
    if (openForm && clients.length === 0) {
      const loadClientsForForm = async () => {
        try {
          const clientsData = await getClients();       
          setClients(clientsData);
        } catch (error) {
          console.error("Error loading clients for form:", error);
        }
      };
      loadClientsForForm();
    }
  }, [openForm, clients.length]);
  const sortedDevices = sortItems(devices);
  if (loading) {
    return <LoadingIndicator message="Loading data..." />;
  }
  return (
    <Container
      maxWidth="lg"
      sx={{ 
        mt: { xs: 2, sm: 4 }, 
        mb: { xs: 2, sm: 4 },
        px: { xs: 1, sm: 2, md: 3 }
      }}
    >
      <PageHeader 
        title="Devices" 
        onAddClick={handleAddDevice} 
        addButtonText="Add Device" 
      />
      <DeviceList 
        devices={sortedDevices}
        clients={clients}
        onEdit={handleEditDevice}
        onDelete={handleDeleteDevice}
        onSort={handleRequestSort}
      />
      <DeviceForm
        open={openForm}
        device={selectedDevice}
        clients={clients}
        onSubmit={handleSubmit}
        onClose={handleCloseForm}
      />
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        message={deleteDialogMessage}
        onConfirm={confirmDeleteDevice}
        onClose={handleCloseDeleteDialog}
        isConfirmEnabled={isDeleteEnabled}
      />
    </Container>
  );
};
export default DevicesPage;
