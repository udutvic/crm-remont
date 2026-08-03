import type { ReactNode } from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

interface IntakeSectionCardProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const IntakeSectionCard = ({
  icon,
  title,
  subtitle,
  children,
}: IntakeSectionCardProps) => (
  <Card
    variant="outlined"
    sx={{
      height: "100%",
      borderRadius: 3,
      borderColor: "divider",
      boxShadow: "0 10px 32px rgba(15, 23, 42, 0.05)",
    }}
  >
    <CardContent
      sx={{
        p: { xs: 2, sm: 2.5 },
        "&:last-child": { pb: { xs: 2, sm: 2.5 } },
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" spacing={1.25} alignItems="flex-start">
          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              width: 38,
              height: 38,
              borderRadius: 2.25,
              bgcolor: "primary.50",
              color: "primary.main",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h6"
              component="h2"
              fontWeight={750}
              sx={{ fontSize: { xs: "1rem", sm: "1.08rem" } }}
            >
              {title}
            </Typography>

            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>

        <Divider />
        {children}
      </Stack>
    </CardContent>
  </Card>
);

export default IntakeSectionCard;
