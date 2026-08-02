import type {
  ReactNode,
} from "react";
import {
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

import ClientInfo from "common/components/ClientInfo";
import DeviceIcon from "common/components/DeviceIcon";
import useAppFormatters from "hooks/useAppFormatters";
import formatOrderNumber from "utils/formatOrderNumber";
import type {
  Order,
  OrderStatus,
} from "types";

interface RecentOrdersProps {
  orders: Order[];

  getStatusChip: (
    status: OrderStatus
  ) => ReactNode;
}

const RecentOrders = ({
  orders,
  getStatusChip,
}: RecentOrdersProps) => {
  const {
    t,
  } = useTranslation();

  const {
    formatDate,
  } = useAppFormatters();

  const theme =
    useTheme();

  const isMobile =
    useMediaQuery(
      theme.breakpoints.down(
        "sm"
      )
    );

  const recentOrders =
    orders.slice(0, 5);

  const getReceivedDate = (
    order: Order
  ): string | undefined => {
    return (
      order.receivedAt ??
      order.createdAt
    );
  };

  const labelSx = {
    variant: "body2",
    color: "text.secondary",
    fontWeight: 500,
  };

  if (isMobile) {
    return (
      <Box>
        <Typography
          variant="h6"
          gutterBottom
        >
          {t(
            "dashboardPage.recentOrders.title"
          )}
        </Typography>

        {recentOrders.length ===
        0 ? (
          <Paper
            variant="outlined"
            sx={{
              p: 3,
            }}
          >
            <Typography
              color="text.secondary"
            >
              {t(
                "dashboardPage.recentOrders.empty"
              )}
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {recentOrders.map(
              (order) => (
                <Card
                  key={order.id}
                  sx={{
                    boxShadow: 1,
                  }}
                >
                  <CardContent
                    sx={{
                      p: 2,

                      "&:last-child":
                        {
                          pb: 2,
                        },
                    }}
                  >
                    <Box
                      sx={{
                        display:
                          "flex",

                        justifyContent:
                          "space-between",

                        alignItems:
                          "center",

                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight={
                          600
                        }
                      >
                        {formatOrderNumber(
                          order.id
                        )}
                      </Typography>

                      {getStatusChip(
                        order.status
                      )}
                    </Box>

                    <List
                      sx={{
                        p: 0,
                      }}
                    >
                      <ListItem
                        sx={{
                          px: 0,
                          py: 0.5,
                        }}
                      >
                        <ListItemText
                          primary={`${t(
                            "dashboardPage.recentOrders.labels.device"
                          )}:`}
                          slotProps={{
                            primary: {
                              sx: labelSx,
                            },
                          }}
                          sx={{
                            flex:
                              "0 0 35%",
                          }}
                        />

                        <Box
                          sx={{
                            display:
                              "flex",

                            alignItems:
                              "center",

                            ml: 2,
                            minWidth: 0,
                          }}
                        >
                          <DeviceIcon
                            brand={
                              order
                                .device
                                ?.brand
                            }
                            size="small"
                          />

                          <Typography
                            variant="body2"
                            noWrap
                            sx={{
                              ml: 1,
                            }}
                          >
                            {
                              order
                                .device
                                ?.brand
                            }{" "}
                            {
                              order
                                .device
                                ?.model
                            }
                          </Typography>
                        </Box>
                      </ListItem>

                      <ListItem
                        sx={{
                          px: 0,
                          py: 0.5,
                        }}
                      >
                        <ListItemText
                          primary={`${t(
                            "dashboardPage.recentOrders.labels.client"
                          )}:`}
                          slotProps={{
                            primary: {
                              sx: labelSx,
                            },
                          }}
                          sx={{
                            flex:
                              "0 0 35%",
                          }}
                        />

                        <Box
                          sx={{
                            ml: 2,
                            minWidth: 0,
                          }}
                        >
                          <ClientInfo
                            client={
                              order.client
                            }
                            isMobileView
                          />
                        </Box>
                      </ListItem>

                      <ListItem
                        sx={{
                          px: 0,
                          py: 0.5,
                        }}
                      >
                        <ListItemText
                          primary={`${t(
                            "dashboardPage.recentOrders.labels.received"
                          )}:`}
                          slotProps={{
                            primary: {
                              sx: labelSx,
                            },
                          }}
                          sx={{
                            flex:
                              "0 0 35%",
                          }}
                        />

                        <Typography
                          variant="body2"
                          sx={{
                            ml: 2,
                          }}
                        >
                          {formatDate(
                            getReceivedDate(
                              order
                            )
                          )}
                        </Typography>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              )
            )}
          </Stack>
        )}
      </Box>
    );
  }

  return (
    <Paper
      sx={{
        p: 3,
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
      >
        {t(
          "dashboardPage.recentOrders.title"
        )}
      </Typography>

      {recentOrders.length ===
      0 ? (
        <Typography
          color="text.secondary"
        >
          {t(
            "dashboardPage.recentOrders.empty"
          )}
        </Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                {t(
                  "dashboardPage.recentOrders.columns.id"
                )}
              </TableCell>

              <TableCell>
                {t(
                  "dashboardPage.recentOrders.columns.device"
                )}
              </TableCell>

              <TableCell>
                {t(
                  "dashboardPage.recentOrders.columns.client"
                )}
              </TableCell>

              <TableCell>
                {t(
                  "dashboardPage.recentOrders.columns.received"
                )}
              </TableCell>

              <TableCell>
                {t(
                  "dashboardPage.recentOrders.columns.status"
                )}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {recentOrders.map(
              (order) => (
                <TableRow
                  key={order.id}
                >
                  <TableCell>
                    {formatOrderNumber(
                      order.id
                    )}
                  </TableCell>

                  <TableCell>
                    <Box
                      sx={{
                        display:
                          "flex",

                        alignItems:
                          "center",
                      }}
                    >
                      <DeviceIcon
                        brand={
                          order.device
                            ?.brand
                        }
                        size="small"
                      />

                      <Typography
                        variant="body2"
                        sx={{
                          ml: 1,
                        }}
                      >
                        {
                          order.device
                            ?.brand
                        }{" "}
                        {
                          order.device
                            ?.model
                        }
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <ClientInfo
                      client={
                        order.client
                      }
                    />
                  </TableCell>

                  <TableCell>
                    {formatDate(
                      getReceivedDate(
                        order
                      )
                    )}
                  </TableCell>

                  <TableCell>
                    {getStatusChip(
                      order.status
                    )}
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
};

export default RecentOrders;
