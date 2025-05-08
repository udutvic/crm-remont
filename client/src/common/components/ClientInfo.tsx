import { Box, Avatar, Typography } from "@mui/material";
import { getAvatarUrl } from "utils/formatters";
import { Client } from "types";
interface ClientInfoProps {
  client?: Client;
  clientId?: number;
  clients?: Client[];
  isMobileView?: boolean;
}
const ClientInfo = ({ client, clientId, clients, isMobileView = false }: ClientInfoProps) => {
  let clientData = client;
  if (!clientData && clientId && clients) {
    clientData = clients.find(c => c.id === clientId);
  }
  if (!clientData) {
    return (
      <Box
        display="flex"
        alignItems="center"
        sx={{ ml: isMobileView ? 2 : 0 }}
      >
        <Avatar
          sx={{
            width: isMobileView ? 24 : { xs: 28, sm: 36 },
            height: isMobileView ? 24 : { xs: 28, sm: 36 },
            mr: 1,
            bgcolor: "grey.300",
          }}
        />
        <Typography
          color="textSecondary"
          sx={{ fontSize: isMobileView ? "0.875rem" : "inherit" }}
        >
          No owner
        </Typography>
      </Box>
    );
  }
  const avatarUrl = clientData.avatarUrl || getAvatarUrl(clientData.name || "U");
  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{ ml: isMobileView ? 2 : 0 }}
    >
      <Avatar
        src={avatarUrl}
        alt={clientData.name || "Avatar"}
        sx={{
          width: isMobileView ? 24 : { xs: 28, sm: 36 },
          height: isMobileView ? 24 : { xs: 28, sm: 36 },
          mr: 1,
        }}
      />
      <Box>
        <Typography
          variant={isMobileView ? "body2" : "subtitle2"}
          fontWeight={600}
          sx={{
            lineHeight: 1.2,
            fontSize: isMobileView ? "inherit" : { xs: "0.825rem", sm: "0.875rem" },
          }}
        >
          {clientData.name || "Unknown"}
        </Typography>
        {!isMobileView && (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
          >
            {clientData.email || "-"}
          </Typography>
        )}
      </Box>
    </Box>
  );
};
export default ClientInfo;
