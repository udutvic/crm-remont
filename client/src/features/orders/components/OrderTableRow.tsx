import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
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

interface OrderTableRowProps {
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

const OrderTableRow = ({
  order,
  clients,
  onEdit,
  onDelete,
  onStatusChange,
  onDeliver,
  onView,
  formatOrderId,
}: OrderTableRowProps) => {
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

  return (
    <TableRow>
      <TableCell
        sx={{
          pl: 2,
          py: 2,
        }}
      >
        {formatOrderId(
          order
        )}
      </TableCell>

      <TableCell>
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
            sx={{
              ml: 1,
            }}
          >
            {order.device.brand}{" "}
            {order.device.model}
          </Typography>
        </Box>
      </TableCell>

      <TableCell
        sx={{
          display: {
            xs: "none",
            md: "table-cell",
          },
        }}
      >
        <ClientInfo
          clientId={
            order.clientId
          }
          clients={clients}
        />
      </TableCell>

      <TableCell
        sx={{
          display: {
            xs: "none",
            md: "table-cell",
          },
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
      </TableCell>

      <TableCell
        sx={{
          display: {
            xs: "none",
            md: "table-cell",
          },
        }}
      >
        {formatDate(
          receivedDate
        )}
      </TableCell>

      <TableCell>
        <StatusSelect
          status={
            order.status
          }
          onStatusChange={
            onStatusChange
          }
          id={order.id ?? 0}
        />
      </TableCell>

      <TableCell>
        <OrderDeliveryControl
          order={order}
          onDeliver={
            onDeliver
          }
        />
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
              onView(order);
            }}
            size="small"
            disabled={!order.id}
            aria-label={t(
              "ordersPage.actions.view"
            )}
          >
            <VisibilityIcon
              sx={{
                color:
                  "primary.main",
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
          >
            <EditIcon
              sx={{
                color: "green",
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

export default OrderTableRow;
