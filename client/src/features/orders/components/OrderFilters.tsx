import {
  Clear as ClearIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import type {
  SelectChangeEvent,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

import type {
  OrderListDeliveryFilter,
  OrderStatus,
} from "types";

type OrderStatusFilter =
  | OrderStatus
  | "all";

interface OrderFiltersProps {
  searchValue: string;
  status: OrderStatusFilter;
  delivery: OrderListDeliveryFilter;
  startDate: string;
  endDate: string;
  disabled?: boolean;

  onSearchChange: (
    value: string
  ) => void;

  onStatusChange: (
    value: OrderStatusFilter
  ) => void;

  onDeliveryChange: (
    value: OrderListDeliveryFilter
  ) => void;

  onStartDateChange: (
    value: string
  ) => void;

  onEndDateChange: (
    value: string
  ) => void;

  onReset: () => void;
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

  unrepairable:
    "statuses.unrepairable",

  cancelled:
    "statuses.cancelled",
};

const OrderFilters = ({
  searchValue,
  status,
  delivery,
  startDate,
  endDate,
  disabled = false,
  onSearchChange,
  onStatusChange,
  onDeliveryChange,
  onStartDateChange,
  onEndDateChange,
  onReset,
}: OrderFiltersProps) => {
  const {
    t,
  } = useTranslation();

  const hasActiveFilters =
    Boolean(
      searchValue.trim() ||
        status !== "all" ||
        delivery !== "all" ||
        startDate ||
        endDate
    );

  return (
    <Paper
      variant="outlined"
      sx={{
        p: {
          xs: 1.5,
          sm: 2,
        },
      }}
    >
      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            sm:
              "repeat(2, minmax(0, 1fr))",
            lg:
              "minmax(240px, 2fr) repeat(4, minmax(150px, 1fr)) auto",
          },

          gap: 1.5,
          alignItems: "center",
        }}
      >
        <TextField
          value={searchValue}
          onChange={(
            event
          ) => {
            onSearchChange(
              event.target.value
            );
          }}
          label={t(
            "ordersPage.listTools.searchLabel"
          )}
          placeholder={t(
            "ordersPage.listTools.searchPlaceholder"
          )}
          size="small"
          disabled={disabled}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    fontSize="small"
                  />
                </InputAdornment>
              ),
            },
          }}
        />

        <FormControl
          size="small"
          disabled={disabled}
        >
          <InputLabel id="order-list-status-label">
            {t(
              "common.status"
            )}
          </InputLabel>

          <Select
            labelId="order-list-status-label"
            value={status}
            label={t(
              "common.status"
            )}
            onChange={(
              event: SelectChangeEvent
            ) => {
              onStatusChange(
                event.target
                  .value as OrderStatusFilter
              );
            }}
          >
            <MenuItem value="all">
              {t(
                "common.all"
              )}
            </MenuItem>

            {statusOptions.map(
              (
                currentStatus
              ) => (
                <MenuItem
                  key={
                    currentStatus
                  }
                  value={
                    currentStatus
                  }
                >
                  {t(
                    statusTranslationKeys[
                      currentStatus
                    ]
                  )}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>

        <FormControl
          size="small"
          disabled={disabled}
        >
          <InputLabel id="order-list-delivery-label">
            {t(
              "ordersPage.listTools.deliveryLabel"
            )}
          </InputLabel>

          <Select
            labelId="order-list-delivery-label"
            value={delivery}
            label={t(
              "ordersPage.listTools.deliveryLabel"
            )}
            onChange={(
              event: SelectChangeEvent
            ) => {
              onDeliveryChange(
                event.target
                  .value as OrderListDeliveryFilter
              );
            }}
          >
            <MenuItem value="all">
              {t(
                "ordersPage.listTools.deliveryAll"
              )}
            </MenuItem>

            <MenuItem value="ready">
              {t(
                "ordersPage.listTools.deliveryReady"
              )}
            </MenuItem>

            <MenuItem value="not_delivered">
              {t(
                "ordersPage.listTools.deliveryNotDelivered"
              )}
            </MenuItem>

            <MenuItem value="delivered">
              {t(
                "ordersPage.listTools.deliveryDelivered"
              )}
            </MenuItem>
          </Select>
        </FormControl>

        <TextField
          type="date"
          value={startDate}
          onChange={(
            event
          ) => {
            onStartDateChange(
              event.target.value
            );
          }}
          label={t(
            "ordersPage.listTools.startDate"
          )}
          size="small"
          disabled={disabled}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />

        <TextField
          type="date"
          value={endDate}
          onChange={(
            event
          ) => {
            onEndDateChange(
              event.target.value
            );
          }}
          label={t(
            "ordersPage.listTools.endDate"
          )}
          size="small"
          disabled={disabled}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />

        <Stack
          direction="row"
          justifyContent={{
            xs: "stretch",
            lg: "flex-end",
          }}
        >
          <Button
            type="button"
            variant="text"
            startIcon={
              <ClearIcon />
            }
            disabled={
              disabled ||
              !hasActiveFilters
            }
            onClick={
              onReset
            }
            sx={{
              width: {
                xs: "100%",
                lg: "auto",
              },

              whiteSpace:
                "nowrap",
            }}
          >
            {t(
              "ordersPage.listTools.reset"
            )}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default OrderFilters;
