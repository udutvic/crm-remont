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
      borderRadius: 2.5,
      borderColor: "#d8e2f0",
      bgcolor: "#ffffff",
      boxShadow: "0 5px 20px rgba(5, 25, 72, 0.045)",
    }}
  >
    <CardContent
      sx={{
        p: {
          xs: 2,
          sm: 2.25,
        },
        "&:last-child": {
          pb: {
            xs: 2,
            sm: 2.25,
          },
        },
      }}
    >
      <Stack spacing={1.75}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="flex-start"
        >
          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              width: 30,
              height: 30,
              borderRadius: 1.5,
              bgcolor: "#eaf1ff",
              color: "#075cff",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h6"
              component="h2"
              fontWeight={800}
              color="#07184a"
              sx={{
                fontSize: {
                  xs: "0.98rem",
                  sm: "1.04rem",
                },
              }}
            >
              {title}
            </Typography>

            {subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.2 }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>

        <Divider sx={{ borderColor: "#e3eaf4" }} />
        {children}
      </Stack>
    </CardContent>
  </Card>
);

export default IntakeSectionCard;
