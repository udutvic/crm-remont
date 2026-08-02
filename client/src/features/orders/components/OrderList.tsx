import {
  Box,
  LinearProgress,
  TablePagination,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import type {
  GridPaginationModel,
  GridSortModel,
} from "@mui/x-data-grid";
import {
  useTranslation,
} from "react-i18next";

import DataCards from "common/components/DataCards";
import type {
  Client,
  Order,
  OrderStatus,
} from "types";

import OrderCard from "./OrderCard";
import OrderDataGrid from "./OrderDataGrid";

interface OrderListProps {
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

  formatOrderId: (
    order: Order
  ) => string;
}

const OrderList = ({
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
  formatOrderId,
}: OrderListProps) => {
  const {
    t,
  } = useTranslation();

  const theme =
    useTheme();

  const useCards =
    useMediaQuery(
      theme.breakpoints.down(
        "md"
      )
    );

  if (useCards) {
    return (
      <Box>
        {loading && (
          <LinearProgress
            sx={{
              mb: 1,
            }}
          />
        )}

        <DataCards
          data={orders}
          emptyMessage={t(
            "ordersPage.empty"
          )}
          renderCard={(
            order
          ) => (
            <OrderCard
              key={order.id}
              order={order}
              clients={clients}
              onEdit={onEdit}
              onDelete={
                onDelete
              }
              onStatusChange={
                onStatusChange
              }
              onDeliver={
                onDeliver
              }
              onView={onView}
              formatOrderId={
                formatOrderId
              }
            />
          )}
        />

        <TablePagination
          component="div"
          count={total}
          page={
            paginationModel.page
          }
          rowsPerPage={
            paginationModel.pageSize
          }
          rowsPerPageOptions={[
            10,
            25,
            50,
            100,
          ]}
          onPageChange={(
            _event,
            page
          ) => {
            onPaginationModelChange({
              page,
              pageSize:
                paginationModel.pageSize,
            });
          }}
          onRowsPerPageChange={(
            event
          ) => {
            onPaginationModelChange({
              page: 0,
              pageSize:
                Number(
                  event.target.value
                ),
            });
          }}
          labelRowsPerPage={t(
            "ordersPage.listTools.rowsPerPage"
          )}
          labelDisplayedRows={({
            from,
            to,
            count,
          }) =>
            t(
              "ordersPage.listTools.displayedRows",
              {
                from,
                to,
                count,
              }
            )
          }
        />
      </Box>
    );
  }

  return (
    <OrderDataGrid
      orders={orders}
      clients={clients}
      total={total}
      loading={loading}
      paginationModel={
        paginationModel
      }
      sortModel={sortModel}
      onPaginationModelChange={
        onPaginationModelChange
      }
      onSortModelChange={
        onSortModelChange
      }
      onEdit={onEdit}
      onDelete={onDelete}
      onStatusChange={
        onStatusChange
      }
      onDeliver={onDeliver}
      onView={onView}
    />
  );
};

export default OrderList;
