import React from "react";
import { Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, useMediaQuery, useTheme } from "@mui/material";
interface OrderStatusFilterProps {
  statusFilter: string;
  onFilterChange: (event: SelectChangeEvent) => void;
}
const OrderStatusFilter: React.FC<OrderStatusFilterProps> = ({ statusFilter, onFilterChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box sx={{ mb: { xs: 2, sm: 3 } }}>
      <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={statusFilter}
          label="Status"
          onChange={onFilterChange}
          size={isMobile ? "small" : "medium"}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="in_progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
export default OrderStatusFilter;
