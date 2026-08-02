import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

import type {
  OrderStatus,
} from "types";

interface StatusSelectProps {
  status: OrderStatus;

  onStatusChange: (
    id: number,
    status: OrderStatus
  ) => void;

  id: number;
  isMobileView?: boolean;
}

const statusColors: Record<
  OrderStatus,
  string
> = {
  pending: "#ed6c02",
  in_progress: "#0288d1",
  completed: "#2e7d32",
  cancelled: "#d32f2f",
  unrepairable: "#9c27b0",
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

const statusOptions: OrderStatus[] = [
  "pending",
  "in_progress",
  "completed",
  "unrepairable",
  "cancelled",
];

const StatusSelect = ({
  status,
  onStatusChange,
  id,
  isMobileView = false,
}: StatusSelectProps) => {
  const {
    t,
  } = useTranslation();

  return (
    <FormControl
      size="small"
      sx={{
        minWidth:
          isMobileView
            ? 150
            : 175,
        maxWidth: 210,
      }}
    >
      <Select
        value={status}
        onChange={(
          event: SelectChangeEvent
        ) => {
          onStatusChange(
            id,
            event.target
              .value as OrderStatus
          );
        }}
        size="small"
        sx={{
          backgroundColor:
            statusColors[
              status
            ],

          color: "white",

          fontSize: {
            xs: "0.7rem",
            sm: "0.75rem",
          },

          "& .MuiSelect-select":
            {
              padding: {
                xs: "4px 8px",
                sm: "8px 14px",
              },

              overflow:
                "hidden",

              textOverflow:
                "ellipsis",

              whiteSpace:
                "nowrap",
            },
        }}
      >
        {statusOptions.map(
          (option) => (
            <MenuItem
              key={option}
              value={option}
              sx={{
                fontSize: {
                  xs: "0.7rem",
                  sm: "0.75rem",
                },
              }}
            >
              {t(
                statusTranslationKeys[
                  option
                ]
              )}
            </MenuItem>
          )
        )}
      </Select>
    </FormControl>
  );
};

export default StatusSelect;
