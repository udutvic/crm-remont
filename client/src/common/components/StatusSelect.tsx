import { FormControl, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { OrderStatus } from "types";
interface StatusSelectProps {
  status: OrderStatus;
  onStatusChange: (id: number, status: OrderStatus) => void;
  id: number;
  isMobileView?: boolean;
}
const StatusSelect = ({ status, onStatusChange, id, isMobileView = false }: StatusSelectProps) => {
  return (
    <FormControl 
      size="small" 
      sx={{ minWidth: isMobileView ? 120 : 'auto' }}
      fullWidth={!isMobileView}
    >
      <Select
        value={status}
        onChange={(e: SelectChangeEvent) => onStatusChange(id, e.target.value as OrderStatus)}
        size="small"
        sx={{
          backgroundColor:
            status === "pending"
              ? "#ed6c02"
              : status === "in_progress"
              ? "#0288d1"
              : status === "completed"
              ? "#2e7d32"
              : "#d32f2f",
          color: "white",
          fontSize: { xs: "0.7rem", sm: "0.75rem" },
          "& .MuiSelect-select": {
            padding: { xs: "4px 8px", sm: "8px 14px" },
          },
        }}
      >
        <MenuItem value="pending" sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>
          Pending
        </MenuItem>
        <MenuItem value="in_progress" sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>
          In Progress
        </MenuItem>
        <MenuItem value="completed" sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>
          Completed
        </MenuItem>
        <MenuItem value="cancelled" sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>
          Cancelled
        </MenuItem>
      </Select>
    </FormControl>
  );
};
export default StatusSelect;
