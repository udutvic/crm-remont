import React from "react";
import { Container } from "@mui/material";
import { Client } from "types";
import { getClients, createClient, updateClient, deleteClient } from "index";
import LoadingIndicator from "components/ui/LoadingIndicator";
import ConfirmDeleteDialog from "components/ui/ConfirmDeleteDialog";
import useCrud from "hooks/useCrud";
import useSorting from "hooks/useSorting";
import PageHeader from "common/components/PageHeader";
import ClientList from "./components/ClientList";
import ClientForm from "./components/ClientForm";
const ClientsPage: React.FC = () => {
  const { handleRequestSort, sortItems } = useSorting<Client>({
    defaultOrderBy: "createdAt"
  });
  const {
    items: clients,
    selectedItem: selectedClient,
    openForm,
    loading,
    deleteDialogOpen,
    deleteDialogMessage,
    isDeleteEnabled,
    handleAdd: handleAddClient,
    handleEdit: handleEditClient,
    handleDelete: handleDeleteClient,
    confirmDelete: confirmDeleteClient,
    handleSubmit,
    handleCloseForm,
    handleCloseDeleteDialog,
  } = useCrud<Client>({
    getAll: getClients,
    create: createClient,
    update: updateClient,
    remove: deleteClient,
  });
  if (loading) {
    return <LoadingIndicator message="Loading data..." />;
  }
  const sortedClients = sortItems(clients);
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
        title="Clients" 
        onAddClick={handleAddClient} 
        addButtonText="Add Client" 
      />
      <ClientList 
        clients={sortedClients}
        onEdit={handleEditClient}
        onDelete={handleDeleteClient}
        onSort={handleRequestSort}
      />
      <ClientForm
        open={openForm}
        client={selectedClient}
        onSubmit={handleSubmit}
        onClose={handleCloseForm}
      />
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        message={deleteDialogMessage}
        onConfirm={confirmDeleteClient}
        onClose={handleCloseDeleteDialog}
        isConfirmEnabled={isDeleteEnabled}
      />
    </Container>
  );
};
export default ClientsPage;
