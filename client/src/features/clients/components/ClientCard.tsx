import React from "react";
import { Card, CardContent, Box, Typography, Avatar, IconButton, List, ListItem, ListItemText } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Client } from "types";
import { getAvatarUrl } from "utils/formatters";
interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (client: Client, nameField?: keyof Client) => void;
}
const ClientCard: React.FC<ClientCardProps> = ({ client, onEdit, onDelete }) => {
  return (
    <Card sx={{ boxShadow: 1, borderRadius: 1 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box display="flex" alignItems="center">
            <Avatar
              src={
                client.avatarUrl ||
                getAvatarUrl(client.name)
              }
              alt={client.name}
              sx={{ width: 40, height: 40, mr: 1.5 }}
            />
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
              {client.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton 
              onClick={() => onEdit(client)}
              size="small"
              sx={{ padding: 0.75 }}
            >
              <EditIcon sx={{ color: "green", fontSize: "1.1rem" }} />
            </IconButton>
            <IconButton 
              onClick={() => onDelete(client, "name")}
              size="small"
              sx={{ padding: 0.75 }}
            >
              <DeleteIcon sx={{ color: "red", fontSize: "1.1rem" }} />
            </IconButton>
          </Box>
        </Box>
        <List sx={{ p: 0 }}>
          <ListItem sx={{ px: 0, py: 0.5 }}>
            <ListItemText 
              primary="Phone:" 
              slotProps={{
                primary: {
                  sx: {
                    variant: 'body2', 
                    color: 'text.secondary',
                    fontWeight: 500
                  }
                }
              }} 
              sx={{ flex: '0 0 35%' }}
            />
            <Typography variant="body2" sx={{ ml: 2 }}>
              {client.phone}
            </Typography>
          </ListItem>
          <ListItem sx={{ px: 0, py: 0.5 }}>
            <ListItemText 
              primary="Email:" 
              slotProps={{
                primary: {
                  sx: {
                    variant: 'body2', 
                    color: 'text.secondary',
                    fontWeight: 500
                  }
                }
              }} 
              sx={{ flex: '0 0 35%' }}
            />
            <Typography variant="body2" sx={{ ml: 2 }}>
              {client.email || "-"}
            </Typography>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};
export default ClientCard;
