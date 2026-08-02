import {
  Avatar,
  Box,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import type { Client } from "types";
import { getAvatarUrl } from "utils/formatters";

interface ClientInfoProps {
  client?: Client;
  clientId?: number;
  clients?: Client[];
  isMobileView?: boolean;
}

const ClientInfo = ({
  client,
  clientId,
  clients,
  isMobileView = false,
}: ClientInfoProps) => {
  const { t } = useTranslation();

  const clientData =
    client ??
    (clientId && clients
      ? clients.find(
          (currentClient) =>
            currentClient.id === clientId
        )
      : undefined);

  const avatarSize = isMobileView
    ? 24
    : {
        xs: 28,
        sm: 36,
      };

  const containerSx = {
    ml: isMobileView ? 2 : 0,
  };

  if (!clientData) {
    return (
      <Box
        display="flex"
        alignItems="center"
        sx={containerSx}
      >
        <Avatar
          alt={t("clientInfo.avatarAlt")}
          sx={{
            width: avatarSize,
            height: avatarSize,
            mr: 1,
            bgcolor: "grey.300",
          }}
        />

        <Typography
          color="text.secondary"
          sx={{
            fontSize: isMobileView
              ? "0.875rem"
              : "inherit",
          }}
        >
          {t("clientInfo.noOwner")}
        </Typography>
      </Box>
    );
  }

  const clientName =
    clientData.name ||
    t("clientInfo.unknown");

  const avatarUrl =
    clientData.avatarUrl ||
    getAvatarUrl(clientName);

  return (
    <Box
      display="flex"
      alignItems="center"
      sx={containerSx}
    >
      <Avatar
        src={avatarUrl}
        alt={clientName}
        sx={{
          width: avatarSize,
          height: avatarSize,
          mr: 1,
        }}
      />

      <Box>
        <Typography
          variant={
            isMobileView
              ? "body2"
              : "subtitle2"
          }
          fontWeight={600}
          sx={{
            lineHeight: 1.2,
            fontSize: isMobileView
              ? "inherit"
              : {
                  xs: "0.825rem",
                  sm: "0.875rem",
                },
          }}
        >
          {clientName}
        </Typography>

        {!isMobileView && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: {
                xs: "0.7rem",
                sm: "0.75rem",
              },
            }}
          >
            {clientData.email || "-"}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ClientInfo;
