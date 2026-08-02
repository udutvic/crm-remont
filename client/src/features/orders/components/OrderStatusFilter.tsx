import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

import type {
  OrderStatus,
} from "types";

interface OrderStatusFilterProps {
  statusFilter: string;

  onFilterChange: (
    event: SelectChangeEvent
  ) => void;
}

const statusOptions: OrderStatus[] = [
  "pending",
  "in_progress",
  "completed",
  "unrepairable",
  "cancelled",
];

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

const OrderStatusFilter = ({
  statusFilter,
  onFilterChange,
}: OrderStatusFilterProps) => {
  const theme =
    useTheme();

  const isMobile =
    useMediaQuery(
      theme.breakpoints.down(
        "sm"
      )
    );

  const {
    t,
  } = useTranslation();

  const labelId =
    "order-status-filter-label";

  return (
    <Box
      sx={{
        mb: {
          xs: 2,
          sm: 3,
        },
      }}
    >
      <FormControl
        sx={{
          minWidth: {
            xs: "100%",
            sm: 220,
          },
        }}
      >
        <InputLabel
          id={labelId}
        >
          {t(
            "common.status"
          )}
        </InputLabel>

        <Select
          labelId={labelId}
          value={
            statusFilter
          }
          label={t(
            "common.status"
          )}
          onChange={
            onFilterChange
          }
          size={
            isMobile
              ? "small"
              : "medium"
          }
        >
          <MenuItem value="all">
            {t(
              "common.all"
            )}
          </MenuItem>

          {statusOptions.map(
            (status) => (
              <MenuItem
                key={status}
                value={status}
              >
                {t(
                  statusTranslationKeys[
                    status
                  ]
                )}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>
    </Box>
  );
};

export default OrderStatusFilter;
