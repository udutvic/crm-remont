import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Alert,
  Container,
  Stack,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

import PageHeader from "common/components/PageHeader";
import ConfirmDeleteDialog from "components/ui/ConfirmDeleteDialog";
import LoadingIndicator from "components/ui/LoadingIndicator";
import {
  createDevice,
  deleteDevice,
  getClients,
  getDevices,
  updateDevice,
} from "index";
import useCrud from "hooks/useCrud";
import useSorting from "hooks/useSorting";
import {
  Client,
  Device,
  DevicePayload,
} from "types";

import DeviceForm from "./components/DeviceForm";
import DeviceList from "./components/DeviceList";

const DevicesPage = () => {
  const {
    t,
  } = useTranslation();

  const [
    clients,
    setClients,
  ] = useState<Client[]>([]);

  const [
    clientLoadError,
    setClientLoadError,
  ] = useState(false);

  const {
    handleRequestSort,
    sortItems,
  } = useSorting<Device>({
    defaultOrderBy:
      "createdAt",
  });

  const {
    items: devices,
    selectedItem:
      selectedDevice,
    openForm,
    loading,
    error: loadError,
    deleteDialogOpen,
    deleteDialogMessage,
    isDeleteEnabled,
    handleAdd:
      handleAddDevice,
    handleEdit:
      handleEditDevice,
    handleDelete:
      handleDeleteDevice,
    confirmDelete:
      confirmDeleteDevice,
    handleSubmit,
    handleCloseForm,
    handleCloseDeleteDialog,
  } = useCrud<
    Device,
    DevicePayload
  >({
    getAll: getDevices,
    create: createDevice,
    update: updateDevice,
    remove: deleteDevice,
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

          setClientLoadError(
            false
          );
        } catch (
          error: unknown
        ) {
          console.error(
            "Error loading clients:",
            error
          );

          setClientLoadError(
            true
          );
        }
      },
      []
    );

  useEffect(() => {
    void loadClients();
  }, [loadClients]);

  useEffect(() => {
    if (
      openForm &&
      clients.length === 0
    ) {
      void loadClients();
    }
  }, [
    clients.length,
    loadClients,
    openForm,
  ]);

  const sortedDevices =
    sortItems(devices);

  if (loading) {
    return (
      <LoadingIndicator
        message={t(
          "devicesPage.loading"
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
          "devicesPage.title"
        )}
        onAddClick={
          handleAddDevice
        }
        addButtonText={t(
          "devicesPage.addDevice"
        )}
      />

      <Stack spacing={2}>
        {loadError && (
          <Alert severity="error">
            {t(
              "devicesPage.errors.loadFailed"
            )}
          </Alert>
        )}

        {clientLoadError && (
          <Alert severity="error">
            {t(
              "devicesPage.errors.clientsLoadFailed"
            )}
          </Alert>
        )}

        <DeviceList
          devices={
            sortedDevices
          }
          clients={clients}
          onEdit={
            handleEditDevice
          }
          onDelete={
            handleDeleteDevice
          }
          onSort={
            handleRequestSort
          }
        />
      </Stack>

      <DeviceForm
        open={openForm}
        device={
          selectedDevice
        }
        clients={clients}
        onSubmit={handleSubmit}
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
          confirmDeleteDevice
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

export default DevicesPage;
