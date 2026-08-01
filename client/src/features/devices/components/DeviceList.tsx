import {
  Box,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

import DataView from "common/components/DataView";
import {
  Client,
  Device,
} from "types";

import DeviceCard from "./DeviceCard";
import DeviceTableRow from "./DeviceTableRow";

interface DeviceListProps {
  devices: Device[];
  clients: Client[];

  onEdit: (
    device: Device
  ) => void;

  onDelete: (
    device: Device,
    nameField?: keyof Device
  ) => void;

  onSort: (
    field: keyof Device
  ) => void;
}

const DeviceList = ({
  devices,
  clients,
  onEdit,
  onDelete,
  onSort,
}: DeviceListProps) => {
  const {
    t,
  } = useTranslation();

  return (
    <Box>
      <DataView
        data={devices}
        columns={[
          {
            id: "brand",
            label: t(
              "devicesPage.columns.brand"
            ),
            sx: {
              pl: 2,
            },
          },
          {
            id: "model",
            label: t(
              "devicesPage.columns.model"
            ),
          },
          {
            id: "imei1",
            label: t(
              "devicesPage.columns.identifier"
            ),
            sx: {
              display: {
                xs: "none",
                md: "table-cell",
              },
            },
          },
          {
            id: "client",
            label: t(
              "devicesPage.columns.client"
            ),
          },
          {
            id: "createdAt",
            label: t(
              "devicesPage.columns.date"
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
              "devicesPage.columns.actions"
            ),
            sx: {
              pr: 2,
              width: "auto",
            },
          },
        ]}
        emptyMessage={t(
          "devicesPage.empty"
        )}
        renderTableRow={(
          device
        ) => (
          <DeviceTableRow
            key={device.id}
            device={device}
            clients={clients}
            onEdit={onEdit}
            onDelete={
              onDelete
            }
          />
        )}
        renderCard={(
          device
        ) => (
          <DeviceCard
            key={device.id}
            device={device}
            clients={clients}
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

export default DeviceList;
