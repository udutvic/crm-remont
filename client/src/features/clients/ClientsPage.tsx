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
  createClient,
  deleteClient,
  getClients,
  lookupClientByPhone,
  updateClient,
} from "index";
import useCrud from "hooks/useCrud";
import useSorting from "hooks/useSorting";
import {
  Client,
  ClientPayload,
} from "types";

import ClientForm from "./components/ClientForm";
import ClientList from "./components/ClientList";

const ClientsPage = () => {
  const {
    t,
  } = useTranslation();

  const {
    handleRequestSort,
    sortItems,
  } = useSorting<Client>({
    defaultOrderBy:
      "createdAt",
  });

  const {
    items: clients,
    selectedItem:
      selectedClient,
    openForm,
    loading,
    error: loadError,
    deleteDialogOpen,
    deleteDialogMessage,
    isDeleteEnabled,
    handleAdd:
      handleAddClient,
    handleEdit:
      handleEditClient,
    handleDelete:
      handleDeleteClient,
    confirmDelete:
      confirmDeleteClient,
    handleSubmit,
    handleCloseForm,
    handleCloseDeleteDialog,
  } = useCrud<
    Client,
    ClientPayload
  >({
    getAll: getClients,
    create: createClient,
    update: updateClient,
    remove: deleteClient,
  });

  if (loading) {
    return (
      <LoadingIndicator
        message={t(
          "clientsPage.loading"
        )}
      />
    );
  }

  const sortedClients =
    sortItems(clients);

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
          "clientsPage.title"
        )}
        onAddClick={
          handleAddClient
        }
        addButtonText={t(
          "clientsPage.addClient"
        )}
      />

      <Stack spacing={2}>
        {loadError && (
          <Alert severity="error">
            {t(
              "clientsPage.errors.loadFailed"
            )}
          </Alert>
        )}

        <ClientList
          clients={
            sortedClients
          }
          onEdit={
            handleEditClient
          }
          onDelete={
            handleDeleteClient
          }
          onSort={
            handleRequestSort
          }
        />
      </Stack>

      <ClientForm
        open={openForm}
        client={selectedClient}
        onSubmit={handleSubmit}
        onClose={
          handleCloseForm
        }
        onLookupByPhone={
          lookupClientByPhone
        }
        onClientFound={
          handleEditClient
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
          confirmDeleteClient
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

export default ClientsPage;
