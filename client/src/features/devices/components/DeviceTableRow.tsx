import React from "react";
import { TableRow, TableCell, Box, IconButton, Typography } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Device, Client } from "types";
import { formatDate } from "utils/formatters";
import ClientInfo from "common/components/ClientInfo";
import DeviceIcon from "../../../common/components/DeviceIcon";
interface DeviceTableRowProps {
  device: Device;
  clients: Client[];
  onEdit: (device: Device) => void;
  onDelete: (device: Device, nameField?: keyof Device) => void;
}
const DeviceTableRow: React.FC<DeviceTableRowProps> = ({
  device,
  clients,
  onEdit,
  onDelete
}) => {
  return (
    <TableRow>
      <TableCell sx={{ pl: 2, py: 2, fontSize: "0.875rem" }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DeviceIcon 
            brand={device.brand}              
            size="small" 
          />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {device.brand}
          </Typography>
        </Box>
      </TableCell>
      <TableCell sx={{ py: 2, fontSize: "0.875rem" }}>
        {device.model}
      </TableCell>
      <TableCell
        sx={{
          display: { xs: "none", md: "table-cell" },
          py: 2,
          fontSize: "0.875rem",
        }}
      >
        {device.serial || "-"}
      </TableCell>
      <TableCell sx={{ py: 2, fontSize: "0.875rem" }}>
        <ClientInfo clientId={device.clientId} clients={clients} />        
      </TableCell>
      <TableCell sx={{ py: 2, fontSize: "0.875rem" }}>
        {formatDate(device.createdAt)}
      </TableCell>
      <TableCell sx={{ pr: 2, py: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 1,
          }}
        >
          <IconButton
            onClick={() => onEdit(device)}
            size="small"
          >
            <EditIcon sx={{ color: "green" }} />
          </IconButton>
          <IconButton
            onClick={() => onDelete(device, "model")}
            size="small"
          >
            <DeleteIcon sx={{ color: "red" }} />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
};
export default DeviceTableRow;
