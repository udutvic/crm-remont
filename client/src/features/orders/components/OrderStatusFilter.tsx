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

interface OrderStatusFilterProps {
  statusFilter: string;

  onFilterChange: (
    event: SelectChangeEvent
  ) => void;
}

const OrderStatusFilter = ({
  statusFilter,
  onFilterChange,
}: OrderStatusFilterProps) => {
  const theme = useTheme();

  const isMobile =
    useMediaQuery(
      theme.breakpoints.down("sm")
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
            sm: 200,
          },
        }}
      >
        <InputLabel
          id={labelId}
        >
          {t("common.status")}
        </InputLabel>

        <Select
          labelId={labelId}
          value={statusFilter}
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
            {t("common.all")}
          </MenuItem>

          <MenuItem value="pending">
            {t(
              "statuses.pending"
            )}
          </MenuItem>

          <MenuItem value="in_progress">
            {t(
              "statuses.inProgress"
            )}
          </MenuItem>

          <MenuItem value="completed">
            {t(
              "statuses.completed"
            )}
          </MenuItem>

          <MenuItem value="cancelled">
            {t(
              "statuses.cancelled"
            )}
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default OrderStatusFilter;