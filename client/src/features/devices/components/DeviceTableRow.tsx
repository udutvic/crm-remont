import {
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

import ClientInfo from "common/components/ClientInfo";
import DeviceIcon from "common/components/DeviceIcon";
import useAppFormatters from "hooks/useAppFormatters";
import {
  Client,
  Device,
} from "types";

import {
  getPrimaryDeviceIdentifier,
} from "../utils/getPrimaryDeviceIdentifier";

interface DeviceTableRowProps {
  device: Device;
  clients: Client[];

  onEdit: (
    device: Device
  ) => void;

  onDelete: (
    device: Device,
    nameField?: keyof Device
  ) => void;
}

const DeviceTableRow = ({
  device,
  clients,
  onEdit,
  onDelete,
}: DeviceTableRowProps) => {
  const {
    t,
  } = useTranslation();

  const {
    formatDate,
  } = useAppFormatters();

  const identifier =
    getPrimaryDeviceIdentifier(
      device
    );

  const deviceName =
    `${device.brand} ${device.model}`.trim();

  const handleDelete =
    (): void => {
      const deviceWithDeleteMessage:
        Device & {
          _deleteMessage: string;
        } = {
          ...device,
          _deleteMessage: t(
            "devicesPage.deleteConfirmation",
            {
              device:
                deviceName,
            }
          ),
        };

      onDelete(
        deviceWithDeleteMessage
      );
    };

  return (
    <TableRow>
      <TableCell
        sx={{
          pl: 2,
          py: 2,
          fontSize:
            "0.875rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <DeviceIcon
            brand={device.brand}
            size="small"
          />

          <Typography
            variant="body2"
            sx={{
              ml: 1,
            }}
          >
            {device.brand}
          </Typography>
        </Box>
      </TableCell>

      <TableCell
        sx={{
          py: 2,
          fontSize:
            "0.875rem",
        }}
      >
        {device.model}
      </TableCell>

      <TableCell
        sx={{
          display: {
            xs: "none",
            md: "table-cell",
          },
          py: 2,
          fontSize:
            "0.875rem",
        }}
      >
        {identifier ? (
          <Box>
            <Typography variant="body2">
              {
                identifier.value
              }
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {t(
                `devicesPage.identifiers.${identifier.type}`
              )}
            </Typography>
          </Box>
        ) : (
          "-"
        )}
      </TableCell>

      <TableCell
        sx={{
          py: 2,
          fontSize:
            "0.875rem",
        }}
      >
        <ClientInfo
          clientId={
            device.clientId
          }
          clients={clients}
        />
      </TableCell>

      <TableCell
        sx={{
          py: 2,
          fontSize:
            "0.875rem",
        }}
      >
        {formatDate(
          device.createdAt
        )}
      </TableCell>

      <TableCell
        sx={{
          pr: 2,
          py: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent:
              "flex-start",
            alignItems: "center",
            gap: 1,
          }}
        >
          <IconButton
            onClick={() => {
              onEdit(device);
            }}
            size="small"
            aria-label={t(
              "devicesPage.actions.edit"
            )}
          >
            <EditIcon
              sx={{
                color: "green",
              }}
            />
          </IconButton>

          <IconButton
            onClick={
              handleDelete
            }
            size="small"
            aria-label={t(
              "devicesPage.actions.delete"
            )}
          >
            <DeleteIcon
              sx={{
                color: "red",
              }}
            />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default DeviceTableRow;
