import React from "react";
import { Box } from "@mui/material";
import { Client } from "types";
import DataView from "common/components/DataView";
import ClientTableRow from "./ClientTableRow";
import ClientCard from "./ClientCard";
interface ClientListProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (client: Client, nameField?: keyof Client) => void;
  onSort: (field: keyof Client) => void;
}
const ClientList: React.FC<ClientListProps> = ({ 
  clients, 
  onEdit, 
  onDelete, 
  onSort 
}) => {
  return (
    <Box>
      <DataView
        data={clients}
        columns={[
          { id: 'name', label: 'Name', sx: { pl: 2 } },
          { id: 'phone', label: 'Phone' },
          { id: 'email', label: 'Email' },
          { 
            id: 'createdAt', 
            label: 'Date', 
            onClick: () => onSort("createdAt"),
            sx: { cursor: 'pointer' } 
          },
          { id: 'actions', label: 'Actions', sx: { pr: 2, width: 'auto' } }
        ]}
        emptyMessage="No clients found"
        renderTableRow={(client) => (
          <ClientTableRow 
            key={client.id}
            client={client} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        )}
        renderCard={(client) => (
          <ClientCard 
            key={client.id}
            client={client} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        )}
      />
    </Box>
  );
};
export default ClientList;
