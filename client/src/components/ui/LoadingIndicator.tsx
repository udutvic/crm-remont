import React from "react";
import { Box, Paper, Typography, Avatar } from "@mui/material";
import { Assignment as OrderIcon } from "@mui/icons-material";
interface LoadingIndicatorProps {
  message?: string;
}
const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = "Loading data...",
}) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
    >
      <Paper
        elevation={0}
        sx={{ p: 4, textAlign: "center" }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Box mb={2}>
            <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
              <OrderIcon fontSize="large" />
            </Avatar>
          </Box>
          <Typography
            variant="h6"
            sx={{ mb: 2 }}
          >
            {message}
          </Typography>
          <Box>
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              style={{ display: "block", margin: "auto" }}
            >
              <circle
                cx="20"
                cy="20"
                r="18"
                stroke="#1976d2"
                strokeWidth="4"
                fill="none"
                strokeDasharray="90 60"
                strokeLinecap="round"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 20 20"
                  to="360 20 20"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
export default LoadingIndicator;
