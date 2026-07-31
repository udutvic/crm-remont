import React from "react";
import { Chip } from "@mui/material";
interface StatusChipProps {
  status: string;
}
const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  let color:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning" = "default";
  let label = "";
  switch (status) {
    case "pending":
      color = "warning";
      label = "Pending";
      break;
    case "in_progress":
      color = "info";
      label = "In Progress";
      break;
    case "completed":
      color = "success";
      label = "Completed";
      break;
    case "cancelled":
      color = "error";
      label = "Cancelled";
      break;
  }
  return (
    <Chip
      label={label}
      color={color}
      size="small"
    />
  );
};
export default StatusChip;
