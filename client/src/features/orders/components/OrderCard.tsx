import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
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

import ClientInfo from "common/components/ClientInfo";
import DeviceIcon from "common/components/DeviceIcon";
import StatusSelect from "common/components/StatusSelect";
import useAppFormatters from "hooks/useAppFormatters";
import {
  Client,
  Order,
  OrderStatus,
} from "types";

import {
  getOrderDisplayPrice,
  getOrderReceivedDate,
} from "../utils/orderDisplay";
import OrderDeliveryControl from "./OrderDeliveryControl";

interface OrderCardProps {
  order: Order;
  clients: Client[];

  onEdit: (
    order: Order
  ) => void;

  onDelete: (
    order: Order,
    nameField?: keyof Order
  ) => void;

  onStatusChange: (
    id: number,
    status: OrderStatus
  ) => void;

  onDeliver: (
    id: number
  ) => Promise<void>;

  onView: (
    order: Order
  ) => void;

  formatOrderId: (
    order: Order
  ) => string;
}

const OrderCard = ({
  order,
  clients,
  onEdit,
  onDelete,
  onStatusChange,
  onDeliver,
  onView,
  formatOrderId,
}: OrderCardProps) => {
  const {
    t,
  } = useTranslation();

  const {
    formatDate,
    formatPrice,
  } = useAppFormatters();

  const displayPrice =
    getOrderDisplayPrice(
      order
    );

  const receivedDate =
    getOrderReceivedDate(
      order
    );

  const priceTypeLabel =
    displayPrice.type === "final"
      ? t(
          "ordersPage.priceTypes.final"
        )
      : t(
          "ordersPage.priceTypes.estimated"
        );

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
            <Typography
              variant="h6"
              sx={{
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              {formatOrderId(
                order
              )}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <DeviceIcon
                brand={
                  order.device.brand
                }
                size="small"
              />

              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
                sx={{
                  ml: 1,
                }}
              >
                {
                  order.device
                    .brand
                }{" "}
                {
                  order.device
                    .model
                }
              </Typography>
            </Box>
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
                onView(order);
              }}
              size="small"
              disabled={!order.id}
              aria-label={t(
                "ordersPage.actions.view"
              )}
              sx={{
                p: 0.75,
              }}
            >
              <VisibilityIcon
                sx={{
                  color:
                    "primary.main",
                  fontSize:
                    "1.1rem",
                }}
              />
            </IconButton>

            <IconButton
              onClick={() => {
                onEdit(order);
              }}
              size="small"
              aria-label={t(
                "ordersPage.actions.edit"
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
              onClick={() => {
                const formattedId =
                  formatOrderId(
                    order
                  );

                const orderWithCustomMessage =
                  {
                    ...order,
                    _deleteMessage:
                      t(
                        "ordersPage.deleteConfirmation",
                        {
                          id:
                            formattedId,
                        }
                      ),
                  };

                onDelete(
                  orderWithCustomMessage
                );
              }}
              size="small"
              aria-label={t(
                "ordersPage.actions.delete"
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
                "ordersPage.labels.client"
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
                  order.clientId
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
              alignItems:
                "flex-start",
            }}
          >
            <ListItemText
              primary={`${t(
                "ordersPage.labels.price"
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
              }}
            >
              <Typography variant="body2">
                {formatPrice(
                  displayPrice.amount
                )}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {priceTypeLabel}
              </Typography>
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
                "ordersPage.labels.received"
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
                receivedDate
              )}
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
                "ordersPage.labels.status"
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
              }}
            >
              <StatusSelect
                status={
                  order.status
                }
                onStatusChange={
                  onStatusChange
                }
                id={
                  order.id ?? 0
                }
                isMobileView
              />
            </Box>
          </ListItem>

          <ListItem
            sx={{
              px: 0,
              py: 0.5,
              alignItems:
                "flex-start",
            }}
          >
            <ListItemText
              primary={`${t(
                "ordersPage.labels.delivery"
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
              }}
            >
              <OrderDeliveryControl
                order={order}
                onDeliver={
                  onDeliver
                }
              />
            </Box>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
