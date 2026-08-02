import type {
  ReactNode,
} from "react";
import {
  CalendarMonthOutlined as CalendarIcon,
  Edit as EditIcon,
  EventOutlined as DueDateIcon,
  PaymentsOutlined as PaymentsIcon,
  PersonOutline as PersonIcon,
  PrintOutlined as PrintIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

import DeviceIcon from "common/components/DeviceIcon";
import StatusSelect from "common/components/StatusSelect";
import useAppFormatters from "hooks/useAppFormatters";
import type {
  Order,
  OrderStatus,
} from "types";
import formatOrderNumber from "utils/formatOrderNumber";

import {
  getOrderDisplayPrice,
  getOrderReceivedDate,
} from "../utils/orderDisplay";
import OrderDeliveryControl from "./OrderDeliveryControl";

interface OrderDetailsHeaderProps {
  order: Order;
  openingEditForm: boolean;

  onEdit: () => void;
  onReceipt: () => void;

  onStatusChange: (
    id: number,
    status: OrderStatus
  ) => void;

  onDeliver: (
    id: number
  ) => Promise<void>;
}

interface SummaryItemProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}

const SummaryItem = ({
  icon,
  label,
  value,
}: SummaryItemProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.25,
        alignItems: "flex-start",
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          width: 38,
          height: 38,
          flex: "0 0 auto",
          borderRadius: 1.5,
          color: "primary.main",
          backgroundColor:
            "action.hover",
        }}
      >
        {icon}
      </Box>

      <Box
        sx={{
          minWidth: 0,
        }}
      >
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{
            display: "block",
            lineHeight: 1.3,
          }}
        >
          {label}
        </Typography>

        <Typography
          variant="body1"
          fontWeight={600}
          sx={{
            overflowWrap:
              "anywhere",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

const OrderDetailsHeader = ({
  order,
  openingEditForm,
  onEdit,
  onReceipt,
  onStatusChange,
  onDeliver,
}: OrderDetailsHeaderProps) => {
  const {
    t,
  } = useTranslation();

  const {
    formatDateTime,
    formatPrice,
  } = useAppFormatters();

  const orderNumber =
    formatOrderNumber(
      order.id
    );

  const clientName =
    order.client?.name ??
    t(
      "orderDetails.clientFallback",
      {
        id: order.clientId,
      }
    );

  const receivedDate =
    getOrderReceivedDate(
      order
    );

  const displayPrice =
    getOrderDisplayPrice(
      order
    );

  const priceTypeLabel =
    displayPrice.type ===
    "final"
      ? t(
          "ordersPage.priceTypes.final"
        )
      : t(
          "ordersPage.priceTypes.estimated"
        );

  const phone =
    order.client?.phone?.trim();

  const email =
    order.client?.email?.trim();

  return (
    <Paper
      variant="outlined"
      sx={{
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: {
            xs: 2,
            sm: 3,
          },
        }}
      >
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{
            xs: "stretch",
            md: "flex-start",
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="flex-start"
            sx={{
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                width: 52,
                height: 52,
                flex: "0 0 auto",
                borderRadius: 2,
                color: "primary.main",
                backgroundColor:
                  "action.hover",
              }}
            >
              <DeviceIcon
                brand={
                  order.device.brand
                }
              />
            </Box>

            <Box
              sx={{
                minWidth: 0,
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  overflowWrap:
                    "anywhere",
                }}
              >
                {t(
                  "orderDetails.title",
                  {
                    number:
                      orderNumber,
                  }
                )}
              </Typography>

              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  mt: 0.25,
                  overflowWrap:
                    "anywhere",
                }}
              >
                {order.device.brand}{" "}
                {order.device.model}
              </Typography>

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={{
                  xs: 0.5,
                  sm: 1.5,
                }}
                sx={{
                  mt: 1.25,
                }}
              >
                <Stack
                  direction="row"
                  spacing={0.75}
                  alignItems="center"
                >
                  <PersonIcon
                    fontSize="small"
                    color="action"
                  />

                  <Typography variant="body2">
                    {clientName}
                  </Typography>
                </Stack>

                {phone && (
                  <Link
                    href={`tel:${phone}`}
                    variant="body2"
                    underline="hover"
                  >
                    {phone}
                  </Link>
                )}

                {email && (
                  <Link
                    href={`mailto:${email}`}
                    variant="body2"
                    underline="hover"
                    sx={{
                      overflowWrap:
                        "anywhere",
                    }}
                  >
                    {email}
                  </Link>
                )}
              </Stack>
            </Box>
          </Stack>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1}
            sx={{
              alignSelf: {
                xs: "stretch",
                md: "flex-start",
              },
            }}
          >
            <Button
              variant="contained"
              startIcon={
                <PrintIcon />
              }
              onClick={
                onReceipt
              }
              sx={{
                whiteSpace:
                  "nowrap",
              }}
            >
              {t(
                "receipt.actions.open"
              )}
            </Button>

            <Button
              variant="outlined"
              startIcon={
                <EditIcon />
              }
              disabled={
                openingEditForm
              }
              onClick={
                onEdit
              }
              sx={{
                whiteSpace:
                  "nowrap",
              }}
            >
              {openingEditForm
                ? t(
                    "common.loading"
                  )
                : t(
                    "orderDetails.editOrder"
                  )}
            </Button>
          </Stack>
        </Stack>

        <Divider
          sx={{
            my: 2.5,
          }}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm:
                "repeat(2, minmax(0, 1fr))",
              lg:
                "repeat(3, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          <SummaryItem
            icon={
              <CalendarIcon />
            }
            label={t(
              "orderDetails.fields.received"
            )}
            value={formatDateTime(
              receivedDate
            )}
          />

          <SummaryItem
            icon={
              <DueDateIcon />
            }
            label={t(
              "orderDetails.fields.dueDate"
            )}
            value={formatDateTime(
              order.dueAt
            )}
          />

          <SummaryItem
            icon={
              <PaymentsIcon />
            }
            label={priceTypeLabel}
            value={formatPrice(
              displayPrice.amount
            )}
          />
        </Box>
      </Box>

      <Divider />

      <Box
        sx={{
          p: {
            xs: 2,
            sm: 2.5,
          },

          backgroundColor:
            "background.default",
        }}
      >
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={2}
          alignItems={{
            xs: "stretch",
            md: "center",
          }}
        >
          <Box
            sx={{
              minWidth: {
                xs: 0,
                md: 210,
              },
            }}
          >
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{
                display: "block",
                mb: 0.5,
              }}
            >
              {t(
                "common.status"
              )}
            </Typography>

            <StatusSelect
              status={
                order.status
              }
              id={
                order.id ?? 0
              }
              onStatusChange={
                onStatusChange
              }
            />
          </Box>

          <Box
            sx={{
              minWidth: {
                xs: 0,
                md: 190,
              },
            }}
          >
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{
                display: "block",
                mb: 0.5,
              }}
            >
              {t(
                "ordersPage.columns.delivery"
              )}
            </Typography>

            <OrderDeliveryControl
              order={order}
              onDeliver={
                onDeliver
              }
            />
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};

export default OrderDetailsHeader;
