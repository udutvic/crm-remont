import {
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";
import { Link } from "react-router";

import useAppFormatters from "hooks/useAppFormatters";
import {
  Client,
} from "types";
import {
  getAvatarUrl,
} from "utils/formatters";

interface ClientTableRowProps {
  client: Client;

  onEdit: (
    client: Client
  ) => void;

  onDelete: (
    client: Client,
    nameField?: keyof Client
  ) => void;
}

const ClientTableRow = ({
  client,
  onEdit,
  onDelete,
}: ClientTableRowProps) => {
  const {
    t,
  } = useTranslation();

  const {
    formatDate,
  } = useAppFormatters();

  const handleDelete =
    (): void => {
      const clientWithDeleteMessage:
        Client & {
          _deleteMessage: string;
        } = {
          ...client,
          _deleteMessage: t(
            "clientsPage.deleteConfirmation",
            {
              name:
                client.name,
            }
          ),
        };

      onDelete(
        clientWithDeleteMessage
      );
    };

  return (
    <TableRow>
      <TableCell
        sx={{
          pl: 2,
          py: 2,
        }}
      >
        <Box
          display="flex"
          alignItems="center"
        >
          <Avatar
            src={
              client.avatarUrl ||
              getAvatarUrl(
                client.name
              )
            }
            alt={client.name}
            sx={{
              width: 36,
              height: 36,
              mr: 1,
            }}
          />

          <Box>
            <Typography
              component={Link}
              to={client.id ? `/clients/${client.id}` : "/clients"}
              variant="subtitle2"
              fontWeight={600}
              color="primary"
              sx={{
                lineHeight: 1.2,
              }}
            >
              {client.name}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display:
                  "block",
              }}
            >
              {client.email ||
                "-"}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      <TableCell>
        {client.phone}
      </TableCell>

      <TableCell>
        {client.email || "-"}
      </TableCell>

      <TableCell>
        {formatDate(
          client.createdAt
        )}
      </TableCell>

      <TableCell
        sx={{
          pr: 2,
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
              onEdit(client);
            }}
            size="small"
            aria-label={t(
              "clientsPage.actions.edit"
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
              "clientsPage.actions.delete"
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

export default ClientTableRow;
