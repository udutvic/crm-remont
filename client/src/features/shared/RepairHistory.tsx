import type { ChipProps } from "@mui/material";
import {
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import useAppFormatters from "hooks/useAppFormatters";
import type { Order, OrderStatus } from "types";

interface RepairHistoryProps {
  orders: Order[];
  showDevice?: boolean;
}

const statusColor = (status: OrderStatus): ChipProps["color"] => {
  switch (status) {
    case "pending":
      return "warning";
    case "in_progress":
      return "info";
    case "completed":
      return "success";
    case "unrepairable":
      return "error";
    default:
      return "default";
  }
};

const RepairHistory = ({ orders, showDevice = false }: RepairHistoryProps) => {
  const { t } = useTranslation();
  const { formatDateTime, formatPrice } = useAppFormatters();

  const orderPrice = (order: Order): number | null => {
    const raw = order.finalPrice ?? order.estimatedPrice ?? order.price ?? null;
    if (raw === null || raw === undefined) return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  };

  if (orders.length === 0) {
    return (
      <Typography color="text.secondary">
        {t("profilePages.empty.repairs")}
      </Typography>
    );
  }

  return (
    <Stack divider={<Divider flexItem />}>
      {orders.map((order) => {
        const price = orderPrice(order);

        return (
          <Box key={order.id} sx={{ py: 2 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              spacing={1.5}
            >
              <Box sx={{ minWidth: 0 }}>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                  <Button
                    component={Link}
                    to={`/orders/${order.id}`}
                    size="small"
                    sx={{ px: 0, minWidth: "auto", fontWeight: 700 }}
                  >
                    #{String(order.id).padStart(6, "0")}
                  </Button>

                  <Chip
                    size="small"
                    color={statusColor(order.status)}
                    label={t(`profilePages.status.${order.status}`)}
                  />

                  {order.deliveredAt && (
                    <Chip
                      size="small"
                      variant="outlined"
                      label={t("profilePages.delivered")}
                    />
                  )}
                </Stack>

                <Typography sx={{ mt: 0.75, overflowWrap: "anywhere" }}>
                  {order.problem}
                </Typography>

                {showDevice && order.device && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {order.device.brand} {order.device.model}
                  </Typography>
                )}
              </Box>

              <Box sx={{ textAlign: { xs: "left", sm: "right" }, flexShrink: 0 }}>
                <Typography variant="body2">
                  {formatDateTime(order.receivedAt ?? order.createdAt)}
                </Typography>
                <Typography fontWeight={600}>
                  {price === null ? "-" : formatPrice(price)}
                </Typography>
              </Box>
            </Stack>
          </Box>
        );
      })}
    </Stack>
  );
};

export default RepairHistory;
