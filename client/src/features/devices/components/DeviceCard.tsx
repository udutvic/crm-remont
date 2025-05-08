import React from "react";
import { Card, CardContent, Box, Typography, IconButton, List, ListItem, ListItemText } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Device, Client } from "types";
import { formatDate } from "utils/formatters";
import ClientInfo from "common/components/ClientInfo";
import DeviceIcon from "common/components/DeviceIcon";
interface DeviceCardProps {
  device: Device;
  clients: Client[];
  onEdit: (device: Device) => void;
  onDelete: (device: Device, nameField?: keyof Device) => void;
}
const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  clients,
  onEdit,
  onDelete
}) => {
  return (
    <Card sx={{ boxShadow: 1, borderRadius: 1 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <DeviceIcon 
                brand={device.brand}                 
                size="small" 
              />
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, ml: 1 }}>
                {device.brand} {device.model}
              </Typography>
            </Box>
            <Typography variant="body2" color="textSecondary">
              {device.serial || "-"}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton 
              onClick={() => onEdit(device)}
              size="small"
              sx={{ padding: 0.75 }}
            >
              <EditIcon sx={{ color: "green", fontSize: "1.1rem" }} />
            </IconButton>
            <IconButton 
              onClick={() => onDelete(device, "model")}
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
              primary="Client:" 
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
            <Box sx={{ ml: 2 }}>
              <ClientInfo 
                clientId={device.clientId} 
                clients={clients} 
                isMobileView={true}
              />
            </Box>
          </ListItem>
          <ListItem sx={{ px: 0, py: 0.5 }}>
            <ListItemText 
              primary="Serial Number:" 
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
              {device.serial || "-"}
            </Typography>
          </ListItem>
          <ListItem sx={{ px: 0, py: 0.5 }}>
            <ListItemText 
              primary="Date:" 
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
              {formatDate(device.createdAt)}
            </Typography>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};
export default DeviceCard;
