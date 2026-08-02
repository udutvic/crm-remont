import {
  Chip,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

import type {
  OrderStatus,
} from "types";

interface StatusChipProps {
  status: OrderStatus;
}

type ChipColor =
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning";

const statusColors: Record<
  OrderStatus,
  ChipColor
> = {
  pending: "warning",
  in_progress: "info",
  completed: "success",
  cancelled: "error",
  unrepairable:
    "secondary",
};

const statusTranslationKeys: Record<
  OrderStatus,
  string
> = {
  pending:
    "statuses.pending",
  in_progress:
    "statuses.inProgress",
  completed:
    "statuses.completed",
  cancelled:
    "statuses.cancelled",
  unrepairable:
    "statuses.unrepairable",
};

const StatusChip = ({
  status,
}: StatusChipProps) => {
  const {
    t,
  } = useTranslation();

  return (
    <Chip
      label={t(
        statusTranslationKeys[
          status
        ]
      )}
      color={
        statusColors[status]
      }
      size="small"
    />
  );
};

export default StatusChip;
