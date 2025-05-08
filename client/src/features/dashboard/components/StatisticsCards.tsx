import React from "react";
import { Grid, Card, CardContent, Box, Typography } from "@mui/material";
import {
  PeopleOutline as PeopleIcon,
  PhoneAndroid as DeviceIcon,
  Assignment as OrderIcon,
  AttachMoney as MoneyIcon,
} from "@mui/icons-material";
import { formatPrice } from "utils/formatters";
interface StatisticsCardsProps {
  clientsCount: number;
  devicesCount: number;
  ordersCount: number;
  totalIncome: number;
}
const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  clientsCount,
  devicesCount,
  ordersCount,
  totalIncome,
}) => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <PeopleIcon fontSize="large" sx={{ color: "#FFB703" }} />
              <Box ml={2}>
                <Typography color="textSecondary" variant="subtitle1">
                  Clients
                </Typography>
                <Typography variant="h4">{clientsCount}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <DeviceIcon fontSize="large" sx={{ color: "#219EBC" }} />
              <Box ml={2}>
                <Typography color="textSecondary" variant="subtitle1">
                  Devices
                </Typography>
                <Typography variant="h4">{devicesCount}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <OrderIcon fontSize="large" sx={{ color: "#8ECAE6" }} />
              <Box ml={2}>
                <Typography color="textSecondary" variant="subtitle1">
                  Orders
                </Typography>
                <Typography variant="h4">{ordersCount}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <MoneyIcon fontSize="large" sx={{ color: "#4CAF50" }} />
              <Box ml={2}>
                <Typography color="textSecondary" variant="subtitle1">
                  Income
                </Typography>
                <Typography variant="h4">{formatPrice(totalIncome)}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
export default StatisticsCards;
