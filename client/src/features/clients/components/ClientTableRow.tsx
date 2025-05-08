import React from "react";
import { TableRow, TableCell, Box, Typography, Avatar, IconButton } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Client } from "types";
import { formatDate, getAvatarUrl } from "utils/formatters";
interface ClientTableRowProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (client: Client, nameField?: keyof Client) => void;
}
const ClientTableRow: React.FC<ClientTableRowProps> = ({ client, onEdit, onDelete }) => {
  return (
    <TableRow>
      <TableCell sx={{ pl: 2, py: 2 }}>
        <Box
          display="flex"
          alignItems="center"
        >
          <Avatar
            src={
              client.avatarUrl ||
              getAvatarUrl(client.name)
            }
            alt={client.name}
            sx={{ width: 36, height: 36, mr: 1 }}
          />
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              sx={{ lineHeight: 1.2 }}
            >
              {client.name}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ display: "block" }}
            >
              {client.email || "-"}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>{client.phone}</TableCell>
      <TableCell>{client.email || "-"}</TableCell>
      <TableCell>
        {formatDate(client.createdAt)}
      </TableCell>
      <TableCell sx={{ pr: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 1 }}>
          <IconButton 
            onClick={() => onEdit(client)}
            size="small"
          >
            <EditIcon sx={{ color: "green" }} />
          </IconButton>
          <IconButton 
            onClick={() => onDelete(client, "name")}
            size="small"
          >
            <DeleteIcon sx={{ color: "red" }} />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
};
export default ClientTableRow;
