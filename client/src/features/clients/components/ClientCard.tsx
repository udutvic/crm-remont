import {
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  Avatar,
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

import {
  Client,
} from "types";
import {
  getAvatarUrl,
} from "utils/formatters";

interface ClientCardProps {
  client: Client;

  onEdit: (
    client: Client
  ) => void;

  onDelete: (
    client: Client,
    nameField?: keyof Client
  ) => void;
}

const ClientCard = ({
  client,
  onEdit,
  onDelete,
}: ClientCardProps) => {
  const {
    t,
  } = useTranslation();

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
            display="flex"
            alignItems="center"
            sx={{
              minWidth: 0,
            }}
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
                width: 40,
                height: 40,
                mr: 1.5,
              }}
            />

            <Typography
              variant="h6"
              noWrap
              sx={{
                fontSize:
                  "1rem",
                fontWeight: 600,
              }}
            >
              {client.name}
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
                onEdit(client);
              }}
              size="small"
              aria-label={t(
                "clientsPage.actions.edit"
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
                "clientsPage.actions.delete"
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
                "clientsPage.labels.phone"
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
              {client.phone}
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
                "clientsPage.labels.email"
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
              {client.email ||
                "-"}
            </Typography>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default ClientCard;
