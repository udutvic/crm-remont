import { useState } from "react";
import {
  Button,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  HourglassEmpty as HourglassEmptyIcon,
  LocalShippingOutlined as LocalShippingOutlinedIcon,
} from "@mui/icons-material";

import { Order } from "types";
import { formatDate } from "utils/formatters";

import {
  getOrderDeliveryState,
} from "../utils/orderDisplay";

interface OrderDeliveryControlProps {
  order: Order;

  onDeliver: (
    id: number
  ) => Promise<void>;
}

const OrderDeliveryControl = ({
  order,
  onDeliver,
}: OrderDeliveryControlProps) => {
  const [
    delivering,
    setDelivering,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(null);

  const deliveryState =
    getOrderDeliveryState(order);

  const handleDeliver =
    async (): Promise<void> => {
      if (
        !order.id ||
        delivering
      ) {
        return;
      }

      try {
        setDelivering(true);
        setErrorMessage(null);

        await onDeliver(order.id);
      } catch (error: unknown) {
        console.error(
          "Error delivering order:",
          error
        );

        setErrorMessage(
          "Failed to mark as delivered."
        );
      } finally {
        setDelivering(false);
      }
    };

  if (
    deliveryState ===
    "delivered"
  ) {
    return (
      <Stack
        spacing={0.5}
        alignItems="flex-start"
      >
        <Chip
          icon={
            <CheckCircleOutlineIcon />
          }
          label="Delivered"
          color="success"
          size="small"
        />

        <Typography
          variant="caption"
          color="text.secondary"
        >
          {formatDate(
            order.deliveredAt ??
              undefined
          )}
        </Typography>
      </Stack>
    );
  }

  if (
    deliveryState ===
    "ready"
  ) {
    return (
      <Stack
        spacing={0.75}
        alignItems="flex-start"
      >
        <Chip
          label="Ready"
          color="warning"
          size="small"
        />

        <Button
          type="button"
          variant="contained"
          color="success"
          size="small"
          disabled={
            !order.id ||
            delivering
          }
          startIcon={
            delivering ? (
              <CircularProgress
                size={14}
                color="inherit"
              />
            ) : (
              <LocalShippingOutlinedIcon />
            )
          }
          onClick={() => {
            void handleDeliver();
          }}
        >
          {delivering
            ? "Delivering..."
            : "Deliver"}
        </Button>

        {errorMessage && (
          <Typography
            variant="caption"
            color="error"
          >
            {errorMessage}
          </Typography>
        )}
      </Stack>
    );
  }

  return (
    <Chip
      icon={<HourglassEmptyIcon />}
      label="Not ready"
      size="small"
      variant="outlined"
    />
  );
};

export default OrderDeliveryControl;