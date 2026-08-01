import {
  useState,
} from "react";
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  HourglassEmpty as HourglassEmptyIcon,
  LocalShippingOutlined as LocalShippingOutlinedIcon,
} from "@mui/icons-material";
import {
  Button,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

import useAppFormatters from "hooks/useAppFormatters";
import type {
  Order,
} from "types";

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
  const {
    t,
  } = useTranslation();

  const {
    formatDate,
  } = useAppFormatters();

  const [
    delivering,
    setDelivering,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<
    string | null
  >(null);

  const deliveryState =
    getOrderDeliveryState(
      order
    );

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

        await onDeliver(
          order.id
        );
      } catch (
        error: unknown
      ) {
        console.error(
          "Error delivering order:",
          error
        );

        setErrorMessage(
          t("delivery.error")
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
          label={t(
            "delivery.delivered"
          )}
          color="success"
          size="small"
        />

        <Typography
          variant="caption"
          color="text.secondary"
        >
          {formatDate(
            order.deliveredAt
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
          label={t(
            "delivery.ready"
          )}
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
            ? t(
                "delivery.delivering"
              )
            : t(
                "delivery.deliver"
              )}
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
      icon={
        <HourglassEmptyIcon />
      }
      label={t(
        "delivery.notReady"
      )}
      size="small"
      variant="outlined"
    />
  );
};

export default OrderDeliveryControl;
