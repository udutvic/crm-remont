import {
  useMemo,
} from "react";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  DataGrid,
} from "@mui/x-data-grid";
import type {
  GridColDef,
  GridColumnVisibilityModel,
  GridPaginationModel,
  GridSortModel,
} from "@mui/x-data-grid";
import {
  useTranslation,
} from "react-i18next";

import ClientInfo from "common/components/ClientInfo";
import DeviceIcon from "common/components/DeviceIcon";
import StatusSelect from "common/components/StatusSelect";
import useAppFormatters from "hooks/useAppFormatters";
import formatOrderNumber from "utils/formatOrderNumber";
import type {
  Client,
  Order,
  OrderStatus,
} from "types";

import {
  getOrderDisplayPrice,
  getOrderReceivedDate,
} from "../utils/orderDisplay";
import OrderDeliveryControl from "./OrderDeliveryControl";

interface OrderDataGridProps {
  orders: Order[];
  clients: Client[];
  total: number;
  loading: boolean;

  paginationModel: GridPaginationModel;
  sortModel: GridSortModel;

  onPaginationModelChange: (
    model: GridPaginationModel
  ) => void;

  onSortModelChange: (
    model: GridSortModel
  ) => void;

  onEdit: (
    order: Order
  ) => void;

  onDelete: (
    order: Order,
    nameField?: keyof Order
  ) => void;

  onStatusChange: (
    id: number,
    status: OrderStatus
  ) => void;

  onDeliver: (
    id: number
  ) => Promise<void>;

  onView: (
    order: Order
  ) => void;
}

interface OrderGridRow {
  id: number;
  order: Order;

  deviceName: string;
  clientName: string;

  price: number;
  receivedAt: Date | null;
  status: OrderStatus;
  deliveryState: string;
}

const OrderDataGrid = ({
  orders,
  clients,
  total,
  loading,
  paginationModel,
  sortModel,
  onPaginationModelChange,
  onSortModelChange,
  onEdit,
  onDelete,
  onStatusChange,
  onDeliver,
  onView,
}: OrderDataGridProps) => {
  const {
    t,
  } = useTranslation();

  const {
    formatDate,
    formatPrice,
  } = useAppFormatters();

  const theme =
    useTheme();

  const showClient =
    useMediaQuery(
      theme.breakpoints.up(
        "lg"
      )
    );

  const showExtendedColumns =
    useMediaQuery(
      theme.breakpoints.up(
        "xl"
      )
    );

  const rows =
    useMemo<OrderGridRow[]>(
      () =>
        orders.flatMap(
          (order) => {
            if (
              typeof order.id !==
              "number"
            ) {
              return [];
            }

            const client =
              order.client ??
              clients.find(
                (
                  currentClient
                ) =>
                  currentClient.id ===
                  order.clientId
              );

            const displayPrice =
              getOrderDisplayPrice(
                order
              );

            const receivedValue =
              getOrderReceivedDate(
                order
              );

            const receivedDate =
              receivedValue
                ? new Date(
                    receivedValue
                  )
                : null;

            return [
              {
                id: order.id,
                order,

                deviceName:
                  `${order.device.brand} ${order.device.model}`,

                clientName:
                  client?.name ??
                  "",

                price:
                  displayPrice.amount,

                receivedAt:
                  receivedDate &&
                  !Number.isNaN(
                    receivedDate.getTime()
                  )
                    ? receivedDate
                    : null,

                status:
                  order.status,

                deliveryState:
                  order.deliveredAt ??
                  order.status,
              },
            ];
          }
        ),
      [
        clients,
        orders,
      ]
    );

  const columns =
    useMemo<
      GridColDef<OrderGridRow>[]
    >(
      () => [
        {
          field: "id",

          headerName: t(
            "ordersPage.columns.id"
          ),

          width: 105,
          minWidth: 95,
          maxWidth: 115,

          hideable: false,

          renderCell: ({
            row,
          }) => (
            <Typography
              variant="body2"
              fontWeight={500}
              noWrap
            >
              {formatOrderNumber(
                row.id
              )}
            </Typography>
          ),
        },
        {
          field:
            "deviceName",

          headerName: t(
            "ordersPage.columns.device"
          ),

          flex: 1,
          minWidth: 155,

          sortable: false,
          hideable: false,

          renderCell: ({
            row,
          }) => (
            <Tooltip
              title={
                row.deviceName
              }
              placement="top"
            >
              <Box
                sx={{
                  display:
                    "flex",

                  alignItems:
                    "center",

                  minWidth: 0,
                  width: "100%",
                }}
              >
                <DeviceIcon
                  brand={
                    row.order
                      .device.brand
                  }
                  size="small"
                />

                <Typography
                  variant="body2"
                  noWrap
                  sx={{
                    ml: 1,
                    minWidth: 0,
                  }}
                >
                  {
                    row.deviceName
                  }
                </Typography>
              </Box>
            </Tooltip>
          ),
        },
        {
          field:
            "clientName",

          headerName: t(
            "ordersPage.columns.client"
          ),

          flex: 1.15,
          minWidth: 190,

          sortable: false,

          renderCell: ({
            row,
          }) => (
            <Box
              sx={{
                width: "100%",
                minWidth: 0,
                overflow:
                  "hidden",
              }}
            >
              <ClientInfo
                clientId={
                  row.order
                    .clientId
                }
                clients={
                  clients
                }
              />
            </Box>
          ),
        },
        {
          field: "price",

          headerName: t(
            "ordersPage.columns.price"
          ),

          type: "number",
          width: 135,
          sortable: false,

          renderCell: ({
            row,
          }) => {
            const displayPrice =
              getOrderDisplayPrice(
                row.order
              );

            const priceType =
              displayPrice.type ===
              "final"
                ? t(
                    "ordersPage.priceTypes.final"
                  )
                : t(
                    "ordersPage.priceTypes.estimated"
                  );

            return (
              <Stack
                spacing={0}
                sx={{
                  minWidth: 0,
                }}
              >
                <Typography
                  variant="body2"
                  noWrap
                >
                  {formatPrice(
                    displayPrice.amount
                  )}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                >
                  {priceType}
                </Typography>
              </Stack>
            );
          },
        },
        {
          field:
            "receivedAt",

          headerName: t(
            "ordersPage.columns.received"
          ),

          type: "dateTime",
          width: 145,

          renderCell: ({
            row,
          }) => (
            <Typography
              variant="body2"
              sx={{
                lineHeight: 1.35,
              }}
            >
              {formatDate(
                getOrderReceivedDate(
                  row.order
                )
              )}
            </Typography>
          ),
        },
        {
          field: "status",

          headerName: t(
            "ordersPage.columns.status"
          ),

          width: 195,
          minWidth: 180,

          hideable: false,

          renderCell: ({
            row,
          }) => (
            <Box
              onClick={(
                event
              ) => {
                event.stopPropagation();
              }}
              sx={{
                width: "100%",
              }}
            >
              <StatusSelect
                id={row.id}
                status={
                  row.status
                }
                onStatusChange={
                  onStatusChange
                }
              />
            </Box>
          ),
        },
        {
          field:
            "deliveryState",

          headerName: t(
            "ordersPage.columns.delivery"
          ),

          width: 180,
          minWidth: 165,

          sortable: false,
          filterable: false,
          hideable: false,

          renderCell: ({
            row,
          }) => (
            <Box
              onClick={(
                event
              ) => {
                event.stopPropagation();
              }}
              sx={{
                width: "100%",
              }}
            >
              <OrderDeliveryControl
                order={
                  row.order
                }
                onDeliver={
                  onDeliver
                }
              />
            </Box>
          ),
        },
        {
          field: "actions",

          headerName: t(
            "ordersPage.columns.actions"
          ),

          width: 125,
          minWidth: 120,

          sortable: false,
          filterable: false,
          hideable: false,

          renderCell: ({
            row,
          }) => (
            <Box
              onClick={(
                event
              ) => {
                event.stopPropagation();
              }}
              sx={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap: 0.25,
              }}
            >
              <Tooltip
                title={t(
                  "ordersPage.actions.view"
                )}
              >
                <IconButton
                  size="small"
                  onClick={() => {
                    onView(
                      row.order
                    );
                  }}
                  aria-label={t(
                    "ordersPage.actions.view"
                  )}
                >
                  <VisibilityIcon
                    fontSize="small"
                    color="primary"
                  />
                </IconButton>
              </Tooltip>

              <Tooltip
                title={t(
                  "ordersPage.actions.edit"
                )}
              >
                <IconButton
                  size="small"
                  onClick={() => {
                    onEdit(
                      row.order
                    );
                  }}
                  aria-label={t(
                    "ordersPage.actions.edit"
                  )}
                  sx={{
                    color:
                      "success.main",
                  }}
                >
                  <EditIcon
                    fontSize="small"
                  />
                </IconButton>
              </Tooltip>

              <Tooltip
                title={t(
                  "ordersPage.actions.delete"
                )}
              >
                <IconButton
                  size="small"
                  onClick={() => {
                    const orderWithMessage =
                      {
                        ...row.order,

                        _deleteMessage:
                          t(
                            "ordersPage.deleteConfirmation",
                            {
                              id:
                                formatOrderNumber(
                                  row.id
                                ),
                            }
                          ),
                      };

                    onDelete(
                      orderWithMessage
                    );
                  }}
                  aria-label={t(
                    "ordersPage.actions.delete"
                  )}
                  sx={{
                    color:
                      "error.main",
                  }}
                >
                  <DeleteIcon
                    fontSize="small"
                  />
                </IconButton>
              </Tooltip>
            </Box>
          ),
        },
      ],
      [
        clients,
        formatDate,
        formatPrice,
        onDelete,
        onDeliver,
        onEdit,
        onStatusChange,
        onView,
        t,
      ]
    );

  const columnVisibilityModel =
    useMemo<GridColumnVisibilityModel>(
      () => ({
        clientName:
          showClient,

        price:
          showExtendedColumns,

        receivedAt:
          showExtendedColumns,
      }),
      [
        showClient,
        showExtendedColumns,
      ]
    );

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        pagination
        paginationMode="server"
        sortingMode="server"
        rowCount={total}
        loading={loading}
        paginationModel={
          paginationModel
        }
        sortModel={
          sortModel
        }
        onPaginationModelChange={
          onPaginationModelChange
        }
        onSortModelChange={
          onSortModelChange
        }
        pageSizeOptions={[
          10,
          25,
          50,
          100,
        ]}
        disableRowSelectionOnClick
        disableColumnMenu
        disableColumnSelector
        columnVisibilityModel={
          columnVisibilityModel
        }
        rowHeight={92}
        columnHeaderHeight={
          54
        }
        onRowDoubleClick={({
          row,
        }) => {
          onView(
            row.order
          );
        }}
        localeText={{
          noRowsLabel: t(
            "ordersPage.empty"
          ),
        }}
        sx={{
          border: 0,

          backgroundColor:
            "background.paper",

          boxShadow: 2,
          borderRadius: 1,

          "& .MuiDataGrid-columnHeaders":
            {
              backgroundColor:
                "#f7f7fa",

              fontWeight: 600,
            },

          "& .MuiDataGrid-columnHeaderTitle":
            {
              fontWeight: 600,
            },

          "& .MuiDataGrid-cell":
            {
              display: "flex",
              alignItems:
                "center",

              py: 1,
              overflow:
                "hidden",
            },

          "& .MuiDataGrid-row:hover":
            {
              backgroundColor:
                "action.hover",
            },

          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within":
            {
              outline: "none",
            },
        }}
      />
    </Box>
  );
};

export default OrderDataGrid;
