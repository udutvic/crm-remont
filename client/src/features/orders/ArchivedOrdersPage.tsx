import {
  useEffect,
  useState,
} from "react";
import type {
  AxiosError,
} from "axios";
import {
  RefreshOutlined as RefreshIcon,
  RestartAltOutlined as ResetIcon,
  RestoreOutlined as RestoreIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";
import type {
  TFunction,
} from "i18next";

import ClientInfo from "common/components/ClientInfo";
import DeviceIcon from "common/components/DeviceIcon";
import PageHeader from "common/components/PageHeader";
import ConfirmDeleteDialog from "components/ui/ConfirmDeleteDialog";
import useAppFormatters from "hooks/useAppFormatters";
import {
  getArchivedOrders,
  restoreOrder,
} from "index";
import type {
  AuthErrorResponse,
  Order,
  OrderStatus,
} from "types";
import formatOrderNumber from "utils/formatOrderNumber";

const STATUS_KEYS: Record<OrderStatus, string> = {
  pending: "statuses.pending",
  in_progress: "statuses.inProgress",
  completed: "statuses.completed",
  cancelled: "statuses.cancelled",
  unrepairable: "statuses.unrepairable",
};

const getDisplayPrice = (order: Order): number =>
  order.finalPrice ??
  order.estimatedPrice ??
  order.price ??
  0;

const getArchivedByLabel = (
  order: Order,
  t: TFunction
): string => {
  if (order.archivedByUser) {
    return `${order.archivedByUser.name} (${order.archivedByUser.email})`;
  }

  return order.archivedBy
    ? `#${order.archivedBy}`
    : t("archivePage.systemUser");
};

const getErrorMessage = (
  error: unknown,
  fallback: string
): string => {
  const axiosError =
    error as AxiosError<AuthErrorResponse>;

  return axiosError.response
    ?.data?.error ?? fallback;
};

interface ArchiveListProps {
  items: Order[];
  onRestore: (order: Order) => void;
}

const DeviceSummary = ({ order }: { order: Order }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
    }}
  >
    <DeviceIcon
      brand={order.device?.brand}
      size="small"
    />
    <Typography
      variant="body2"
      sx={{ ml: 1 }}
    >
      {order.device?.brand} {order.device?.model}
    </Typography>
  </Box>
);

const ArchivedOrderCards = ({
  items,
  onRestore,
}: ArchiveListProps) => {
  const { t } = useTranslation();
  const {
    formatDateTime,
    formatPrice,
  } = useAppFormatters();

  return (
    <Stack spacing={1} sx={{ p: 1 }}>
      {items.map((order) => (
        <Card key={order.id} variant="outlined">
          <CardContent>
            <Stack spacing={1.25}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
              >
                <Typography fontWeight={700}>
                  {formatOrderNumber(order.id)}
                </Typography>
                <Chip
                  size="small"
                  label={t(STATUS_KEYS[order.status])}
                />
              </Stack>

              <DeviceSummary order={order} />
              <ClientInfo
                client={order.client}
                isMobileView
              />

              <Typography variant="body2">
                {t("archivePage.labels.price")}: {formatPrice(
                  getDisplayPrice(order)
                )}
              </Typography>
              <Typography variant="body2">
                {t("archivePage.labels.archivedAt")}: {formatDateTime(
                  order.archivedAt
                )}
              </Typography>
              <Typography variant="body2">
                {t("archivePage.labels.archivedBy")}: {getArchivedByLabel(
                  order,
                  t
                )}
              </Typography>
              <Typography
                variant="body2"
                sx={{ overflowWrap: "anywhere" }}
              >
                {t("archivePage.labels.reason")}: {order.archiveReason ??
                  t("common.notAvailable")}
              </Typography>

              <Button
                variant="outlined"
                color="success"
                startIcon={<RestoreIcon />}
                onClick={() => onRestore(order)}
              >
                {t("archivePage.actions.restore")}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

const ArchivedOrderTable = ({
  items,
  onRestore,
}: ArchiveListProps) => {
  const { t } = useTranslation();
  const {
    formatDateTime,
    formatPrice,
  } = useAppFormatters();

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t("archivePage.columns.order")}</TableCell>
            <TableCell>{t("archivePage.columns.device")}</TableCell>
            <TableCell>{t("archivePage.columns.client")}</TableCell>
            <TableCell>{t("archivePage.columns.status")}</TableCell>
            <TableCell>{t("archivePage.columns.price")}</TableCell>
            <TableCell>{t("archivePage.columns.archived")}</TableCell>
            <TableCell>{t("archivePage.columns.reason")}</TableCell>
            <TableCell align="right">
              {t("archivePage.columns.actions")}
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {items.map((order) => (
            <TableRow key={order.id} hover>
              <TableCell sx={{ whiteSpace: "nowrap" }}>
                {formatOrderNumber(order.id)}
              </TableCell>
              <TableCell>
                <DeviceSummary order={order} />
              </TableCell>
              <TableCell>
                <ClientInfo client={order.client} />
              </TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={t(STATUS_KEYS[order.status])}
                />
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>
                {formatPrice(getDisplayPrice(order))}
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: "nowrap" }}
                >
                  {formatDateTime(order.archivedAt)}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {getArchivedByLabel(order, t)}
                </Typography>
              </TableCell>
              <TableCell sx={{ maxWidth: 320 }}>
                <Typography
                  variant="body2"
                  sx={{ overflowWrap: "anywhere" }}
                >
                  {order.archiveReason ?? t("common.notAvailable")}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Tooltip title={t("archivePage.actions.restore")}>
                  <IconButton
                    color="success"
                    onClick={() => onRestore(order)}
                    aria-label={t("archivePage.actions.restore")}
                  >
                    <RestoreIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

interface ArchiveContentProps extends ArchiveListProps {
  loading: boolean;
  mobile: boolean;
}

const ArchiveContent = ({
  loading,
  mobile,
  items,
  onRestore,
}: ArchiveContentProps) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 260,
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="text.secondary">
          {t("archivePage.empty")}
        </Typography>
      </Box>
    );
  }

  return mobile ? (
    <ArchivedOrderCards
      items={items}
      onRestore={onRestore}
    />
  ) : (
    <ArchivedOrderTable
      items={items}
      onRestore={onRestore}
    />
  );
};

const ArchivedOrdersPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const mobile = useMediaQuery(
    theme.breakpoints.down("md")
  );

  const [items, setItems] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderToRestore, setOrderToRestore] = useState<Order | null>(null);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setPage(0);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    let active = true;

    const handleLoadArchive = async (): Promise<void> => {
      try {
        setLoading(true);
        setErrorMessage(null);

        const response = await getArchivedOrders({
          q: searchQuery || undefined,
          page: page + 1,
          pageSize,
        });

        if (!active) {
          return;
        }

        const maximumPage = Math.max(
          0,
          response.pagination.totalPages - 1
        );

        if (page > maximumPage) {
          setPage(maximumPage);
          return;
        }

        setItems(response.items);
        setTotal(response.pagination.total);
      } catch (error: unknown) {
        if (!active) {
          return;
        }

        console.error("Archived orders load failed:", error);
        setErrorMessage(
          getErrorMessage(
            error,
            t("archivePage.errors.loadFailed")
          )
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void handleLoadArchive();

    return () => {
      active = false;
    };
  }, [page, pageSize, refreshVersion, searchQuery, t]);

  const handleRestore = async (): Promise<void> => {
    if (!orderToRestore?.id || restoring) {
      return;
    }

    try {
      setRestoring(true);
      setErrorMessage(null);
      await restoreOrder(orderToRestore.id);
      setOrderToRestore(null);

      if (items.length === 1 && page > 0) {
        setPage((current) => current - 1);
      } else {
        setRefreshVersion((current) => current + 1);
      }
    } catch (error: unknown) {
      console.error("Order restore failed:", error);
      setErrorMessage(
        getErrorMessage(
          error,
          t("archivePage.errors.restoreFailed")
        )
      );
    } finally {
      setRestoring(false);
    }
  };

  const handleResetFilters = (): void => {
    setSearchInput("");
    setSearchQuery("");
    setPage(0);
  };

  const handleRefresh = (): void => {
    setRefreshVersion((current) => current + 1);
  };

  const handleCloseRestoreDialog = (): void => {
    if (!restoring) {
      setOrderToRestore(null);
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: { xs: 2, sm: 4 },
        mb: 4,
        px: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <PageHeader title={t("archivePage.title")} />

      <Stack spacing={2}>
        <Alert severity="info">
          {t("archivePage.description")}
        </Alert>

        <Paper
          variant="outlined"
          sx={{ p: { xs: 1.5, sm: 2 } }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
          >
            <TextField
              fullWidth
              size="small"
              label={t("archivePage.search.label")}
              placeholder={t("archivePage.search.placeholder")}
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
            <Button
              variant="outlined"
              startIcon={<ResetIcon />}
              onClick={handleResetFilters}
            >
              {t("archivePage.actions.reset")}
            </Button>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
            >
              {t("archivePage.actions.refresh")}
            </Button>
          </Stack>
        </Paper>

        {errorMessage && (
          <Alert
            severity="error"
            onClose={() => setErrorMessage(null)}
          >
            {errorMessage}
          </Alert>
        )}

        <Paper variant="outlined" sx={{ overflow: "hidden" }}>
          <ArchiveContent
            loading={loading}
            mobile={mobile}
            items={items}
            onRestore={setOrderToRestore}
          />

          <TablePagination
            component="div"
            count={total}
            page={page}
            rowsPerPage={pageSize}
            onPageChange={(_event, nextPage) => setPage(nextPage)}
            onRowsPerPageChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50, 100]}
            labelRowsPerPage={t(
              "archivePage.pagination.rowsPerPage"
            )}
          />
        </Paper>
      </Stack>

      <ConfirmDeleteDialog
        open={Boolean(orderToRestore)}
        title={t("archivePage.restoreDialog.title")}
        message={t("archivePage.restoreDialog.message", {
          id: orderToRestore
            ? formatOrderNumber(orderToRestore.id)
            : "",
        })}
        confirmLabel={t("archivePage.restoreDialog.confirm")}
        confirmColor="success"
        isConfirmEnabled={!restoring}
        onClose={handleCloseRestoreDialog}
        onConfirm={() => void handleRestore()}
      />
    </Container>
  );
};

export default ArchivedOrdersPage;
