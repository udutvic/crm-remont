import {
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";
import { Link } from "react-router";

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

interface DeviceCardProps {
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

const DeviceCard = ({
  device,
  clients,
  onEdit,
  onDelete,
}: DeviceCardProps) => {
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

  const deviceTypeLabel =
    t(
      `devicesPage.deviceTypes.${device.deviceType}`
    );

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

  const labelSx = {
    variant: "body2",
    color: "text.secondary",
    fontWeight: 500,
  };

  return (
    <Card
      sx={{
        boxShadow: 1,
        borderRadius: 1,
      }}
    >
      <CardContent
        sx={{
          p: 2,
          "&:last-child": {
            pb: 2,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            gap: 1,
            mb: 2,
          }}
        >
          <Box
            sx={{
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 0.5,
              }}
            >
              <DeviceIcon
                brand={
                  device.brand
                }
                size="small"
              />

              <Typography
                component={Link}
                to={device.id ? `/devices/${device.id}` : "/devices"}
                variant="h6"
                noWrap
                color="primary"
                sx={{
                  fontSize:
                    "1rem",
                  fontWeight: 600,
                  ml: 1,
                }}
              >
                {deviceName}
              </Typography>
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflowWrap:
                  "anywhere",
              }}
            >
              {identifier
                ? `${t(
                    `devicesPage.identifiers.${identifier.type}`
                  )}: ${identifier.value}`
                : t(
                    "devicesPage.identifiers.none"
                  )}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              flexShrink: 0,
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
              sx={{
                p: 0.75,
              }}
            >
              <EditIcon
                sx={{
                  color: "green",
                  fontSize:
                    "1.1rem",
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
              sx={{
                p: 0.75,
              }}
            >
              <DeleteIcon
                sx={{
                  color: "red",
                  fontSize:
                    "1.1rem",
                }}
              />
            </IconButton>
          </Box>
        </Box>

        <List
          sx={{
            p: 0,
          }}
        >
          <ListItem
            sx={{
              px: 0,
              py: 0.5,
            }}
          >
            <ListItemText
              primary={`${t(
                "devicesPage.labels.client"
              )}:`}
              slotProps={{
                primary: {
                  sx: labelSx,
                },
              }}
              sx={{
                flex:
                  "0 0 35%",
              }}
            />

            <Box
              sx={{
                ml: 2,
                minWidth: 0,
              }}
            >
              <ClientInfo
                clientId={
                  device.clientId
                }
                clients={clients}
                isMobileView
              />
            </Box>
          </ListItem>

          <ListItem
            sx={{
              px: 0,
              py: 0.5,
            }}
          >
            <ListItemText
              primary={`${t(
                "devicesPage.labels.deviceType"
              )}:`}
              slotProps={{
                primary: {
                  sx: labelSx,
                },
              }}
              sx={{
                flex:
                  "0 0 35%",
              }}
            />

            <Typography
              variant="body2"
              sx={{
                ml: 2,
                overflowWrap:
                  "anywhere",
              }}
            >
              {deviceTypeLabel}
              {device.color
                ? ` • ${device.color}`
                : ""}
            </Typography>
          </ListItem>

          <ListItem
            sx={{
              px: 0,
              py: 0.5,
            }}
          >
            <ListItemText
              primary={`${t(
                "devicesPage.labels.date"
              )}:`}
              slotProps={{
                primary: {
                  sx: labelSx,
                },
              }}
              sx={{
                flex:
                  "0 0 35%",
              }}
            />

            <Typography
              variant="body2"
              sx={{
                ml: 2,
              }}
            >
              {formatDate(
                device.createdAt
              )}
            </Typography>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default DeviceCard;
