import React from "react";
import { Box } from "@mui/material";
import { Device, Client } from "types";
import DataView from "common/components/DataView";
import DeviceTableRow from "./DeviceTableRow";
import DeviceCard from "./DeviceCard";
interface DeviceListProps {
  devices: Device[];
  clients: Client[];
  onEdit: (device: Device) => void;
  onDelete: (device: Device, nameField?: keyof Device) => void;
  onSort: (field: keyof Device) => void;
}
const DeviceList: React.FC<DeviceListProps> = ({
  devices,
  clients,
  onEdit,
  onDelete,
  onSort
}) => {
  return (
    <Box>
      <DataView
        data={devices}
        columns={[
          { id: 'brand', label: 'Brand', sx: { pl: 2 } },
          { id: 'model', label: 'Model' },
          { id: 'serial', label: 'Serial Number', sx: { display: { xs: "none", md: "table-cell" } } },
          { id: 'client', label: 'Client' },
          { 
            id: 'createdAt', 
            label: 'Date', 
            onClick: () => onSort("createdAt"),
            sx: { cursor: 'pointer' } 
          },
          { id: 'actions', label: 'Actions', sx: { pr: 2, width: 'auto' } }
        ]}
        emptyMessage="No devices found"
        renderTableRow={(device) => (
          <DeviceTableRow
            key={device.id}
            device={device}
            clients={clients}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
        renderCard={(device) => (
          <DeviceCard
            key={device.id}
            device={device}
            clients={clients}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      />
    </Box>
  );
};
export default DeviceList;
