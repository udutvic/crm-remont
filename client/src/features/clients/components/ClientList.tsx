import {
  Box,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

import DataView from "common/components/DataView";
import {
  Client,
} from "types";

import ClientCard from "./ClientCard";
import ClientTableRow from "./ClientTableRow";

interface ClientListProps {
  clients: Client[];

  onEdit: (
    client: Client
  ) => void;

  onDelete: (
    client: Client,
    nameField?: keyof Client
  ) => void;

  onSort: (
    field: keyof Client
  ) => void;
}

const ClientList = ({
  clients,
  onEdit,
  onDelete,
  onSort,
}: ClientListProps) => {
  const {
    t,
  } = useTranslation();

  return (
    <Box>
      <DataView
        data={clients}
        columns={[
          {
            id: "name",
            label: t(
              "clientsPage.columns.name"
            ),
            sx: {
              pl: 2,
            },
          },
          {
            id: "phone",
            label: t(
              "clientsPage.columns.phone"
            ),
          },
          {
            id: "email",
            label: t(
              "clientsPage.columns.email"
            ),
          },
          {
            id: "createdAt",
            label: t(
              "clientsPage.columns.date"
            ),
            onClick: () => {
              onSort(
                "createdAt"
              );
            },
            sx: {
              cursor: "pointer",
            },
          },
          {
            id: "actions",
            label: t(
              "clientsPage.columns.actions"
            ),
            sx: {
              pr: 2,
              width: "auto",
            },
          },
        ]}
        emptyMessage={t(
          "clientsPage.empty"
        )}
        renderTableRow={(
          client
        ) => (
          <ClientTableRow
            key={client.id}
            client={client}
            onEdit={onEdit}
            onDelete={
              onDelete
            }
          />
        )}
        renderCard={(
          client
        ) => (
          <ClientCard
            key={client.id}
            client={client}
            onEdit={onEdit}
            onDelete={
              onDelete
            }
          />
        )}
      />
    </Box>
  );
};

export default ClientList;
