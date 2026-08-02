import {
  Assignment as OrderIcon,
  AttachMoney as MoneyIcon,
  PeopleOutline as PeopleIcon,
  PhoneAndroid as DeviceIcon,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

import useAppFormatters from "hooks/useAppFormatters";

interface StatisticsCardsProps {
  clientsCount: number;
  devicesCount: number;
  ordersCount: number;
  totalIncome: number;
}

const StatisticsCards = ({
  clientsCount,
  devicesCount,
  ordersCount,
  totalIncome,
}: StatisticsCardsProps) => {
  const {
    t,
  } = useTranslation();

  const {
    formatPrice,
  } = useAppFormatters();

  return (
    <Grid
      container
      spacing={3}
    >
      <Grid
        size={{
          xs: 12,
          sm: 6,
          md: 3,
        }}
      >
        <Card
          sx={{
            height: "100%",
          }}
        >
          <CardContent>
            <Box
              display="flex"
              alignItems="center"
            >
              <PeopleIcon
                fontSize="large"
                sx={{
                  color:
                    "#FFB703",
                }}
              />

              <Box ml={2}>
                <Typography
                  color="text.secondary"
                  variant="subtitle1"
                >
                  {t(
                    "dashboardPage.statistics.clients"
                  )}
                </Typography>

                <Typography variant="h4">
                  {clientsCount}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid
        size={{
          xs: 12,
          sm: 6,
          md: 3,
        }}
      >
        <Card
          sx={{
            height: "100%",
          }}
        >
          <CardContent>
            <Box
              display="flex"
              alignItems="center"
            >
              <DeviceIcon
                fontSize="large"
                sx={{
                  color:
                    "#219EBC",
                }}
              />

              <Box ml={2}>
                <Typography
                  color="text.secondary"
                  variant="subtitle1"
                >
                  {t(
                    "dashboardPage.statistics.devices"
                  )}
                </Typography>

                <Typography variant="h4">
                  {devicesCount}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid
        size={{
          xs: 12,
          sm: 6,
          md: 3,
        }}
      >
        <Card
          sx={{
            height: "100%",
          }}
        >
          <CardContent>
            <Box
              display="flex"
              alignItems="center"
            >
              <OrderIcon
                fontSize="large"
                sx={{
                  color:
                    "#8ECAE6",
                }}
              />

              <Box ml={2}>
                <Typography
                  color="text.secondary"
                  variant="subtitle1"
                >
                  {t(
                    "dashboardPage.statistics.orders"
                  )}
                </Typography>

                <Typography variant="h4">
                  {ordersCount}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid
        size={{
          xs: 12,
          sm: 6,
          md: 3,
        }}
      >
        <Card
          sx={{
            height: "100%",
          }}
        >
          <CardContent>
            <Box
              display="flex"
              alignItems="center"
            >
              <MoneyIcon
                fontSize="large"
                sx={{
                  color:
                    "#4CAF50",
                }}
              />

              <Box ml={2}>
                <Typography
                  color="text.secondary"
                  variant="subtitle1"
                >
                  {t(
                    "dashboardPage.statistics.income"
                  )}
                </Typography>

                <Typography variant="h4">
                  {formatPrice(
                    totalIncome
                  )}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatisticsCards;
