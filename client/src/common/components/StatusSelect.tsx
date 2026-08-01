import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

import {
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
            ? 120
            : "auto",
      }}
      fullWidth={!isMobileView}
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
            status === "pending"
              ? "#ed6c02"
              : status ===
                  "in_progress"
                ? "#0288d1"
                : status ===
                    "completed"
                  ? "#2e7d32"
                  : "#d32f2f",

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
            },
        }}
      >
        <MenuItem
          value="pending"
          sx={{
            fontSize: {
              xs: "0.7rem",
              sm: "0.75rem",
            },
          }}
        >
          {t("statuses.pending")}
        </MenuItem>

        <MenuItem
          value="in_progress"
          sx={{
            fontSize: {
              xs: "0.7rem",
              sm: "0.75rem",
            },
          }}
        >
          {t(
            "statuses.inProgress"
          )}
        </MenuItem>

        <MenuItem
          value="completed"
          sx={{
            fontSize: {
              xs: "0.7rem",
              sm: "0.75rem",
            },
          }}
        >
          {t(
            "statuses.completed"
          )}
        </MenuItem>

        <MenuItem
          value="cancelled"
          sx={{
            fontSize: {
              xs: "0.7rem",
              sm: "0.75rem",
            },
          }}
        >
          {t(
            "statuses.cancelled"
          )}
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default StatusSelect;