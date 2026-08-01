import {
  useCallback,
  useEffect,
  useState,
} from "react";
import type {
  AxiosError,
} from "axios";
import {
  RefreshOutlined as RefreshIcon,
  RestartAltOutlined as ResetIcon,
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
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

import PageHeader from "common/components/PageHeader";
import {
  getAuditLogs,
} from "index";
import useAppFormatters from "hooks/useAppFormatters";
import type {
  AuditLog,
  AuditLogEntityFilter,
  AuthErrorResponse,
} from "types";

const ENTITY_OPTIONS:
  AuditLogEntityFilter[] =
  [
    "all",
    "auth",
    "client",
    "device",
    "intake",
    "order",
    "stats",
  ];

const AuditLogPage = () => {
  const {
    t,
  } = useTranslation();

  const theme =
    useTheme();

  const mobile =
    useMediaQuery(
      theme.breakpoints.down(
        "md"
      )
    );

  const {
    formatDateTime,
  } = useAppFormatters();

  const [
    items,
    setItems,
  ] = useState<AuditLog[]>([]);

  const [
    total,
    setTotal,
  ] = useState(0);

  const [
    page,
    setPage,
  ] = useState(0);

  const [
    pageSize,
    setPageSize,
  ] = useState(25);

  const [
    actionInput,
    setActionInput,
  ] = useState("");

  const [
    actionQuery,
    setActionQuery,
  ] = useState("");

  const [
    entityType,
    setEntityType,
  ] =
    useState<AuditLogEntityFilter>(
      "all"
    );

  const [
    startDate,
    setStartDate,
  ] = useState("");

  const [
    endDate,
    setEndDate,
  ] = useState("");

  const [
    reloadKey,
    setReloadKey,
  ] = useState(0);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<
    string | null
  >(null);

  useEffect(() => {
    const timeout =
      window.setTimeout(
        () => {
          setActionQuery(
            actionInput.trim()
          );

          setPage(0);
        },
        350
      );

    return () => {
      window.clearTimeout(
        timeout
      );
    };
  }, [actionInput]);

  const loadAuditLogs =
    useCallback(
      async (): Promise<void> => {
        /*
         * reloadKey intentionally
         * invalidates this request.
         */
        void reloadKey;

        try {
          setLoading(true);
          setErrorMessage(
            null
          );

          const response =
            await getAuditLogs({
              page:
                page + 1,
              pageSize,

              action:
                actionQuery ||
                undefined,

              entityType:
                entityType ===
                "all"
                  ? undefined
                  : entityType,

              startDate:
                startDate ||
                undefined,

              endDate:
                endDate ||
                undefined,
            });

          const maximumPage =
            Math.max(
              0,
              response.pagination
                .totalPages - 1
            );

          if (
            page >
            maximumPage
          ) {
            setPage(
              maximumPage
            );

            return;
          }

          setItems(
            response.items
          );

          setTotal(
            response.pagination
              .total
          );
        } catch (
          error: unknown
        ) {
          console.error(
            "Audit log load failed:",
            error
          );

          const axiosError =
            error as AxiosError<AuthErrorResponse>;

          setErrorMessage(
            axiosError.response
              ?.data?.error ??
              t(
                "auditPage.errors.loadFailed"
              )
          );
        } finally {
          setLoading(false);
        }
      },
      [
        actionQuery,
        endDate,
        entityType,
        page,
        pageSize,
        reloadKey,
        startDate,
        t,
      ]
    );

  useEffect(() => {
    void loadAuditLogs();
  }, [loadAuditLogs]);

  const handleReset =
    (): void => {
      setActionInput("");
      setActionQuery("");
      setEntityType("all");
      setStartDate("");
      setEndDate("");
      setPage(0);
    };

  const actionLabel = (
    action: string
  ): string =>
    t(
      `auditPage.actions.${action}`,
      {
        defaultValue:
          action,
      }
    );

  const entityLabel = (
    value?: string | null
  ): string => {
    if (!value) {
      return t(
        "common.notAvailable"
      );
    }

    return t(
      `auditPage.entities.${value}`,
      {
        defaultValue:
          value,
      }
    );
  };

  const userLabel = (
    item: AuditLog
  ): string =>
    item.user
      ? `${item.user.name} (${item.user.email})`
      : t(
          "auditPage.systemUser"
        );

  const statusColor = (
    statusCode: number
  ):
    | "success"
    | "warning"
    | "error" => {
    if (
      statusCode >= 200 &&
      statusCode < 400
    ) {
      return "success";
    }

    if (
      statusCode < 500
    ) {
      return "warning";
    }

    return "error";
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: {
          xs: 2,
          sm: 4,
        },
        mb: 4,
        px: {
          xs: 1,
          sm: 2,
          md: 3,
        },
      }}
    >
      <PageHeader
        title={t(
          "auditPage.title"
        )}
      />

      <Stack spacing={2}>
        <Paper
          variant="outlined"
          sx={{
            p: {
              xs: 1.5,
              sm: 2,
            },
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm:
                  "repeat(2, minmax(0, 1fr))",
                lg:
                  "minmax(220px, 2fr) minmax(180px, 1fr) repeat(2, minmax(160px, 1fr)) auto",
              },
              gap: 1.5,
              alignItems: "center",
            }}
          >
            <TextField
              size="small"
              label={t(
                "auditPage.filters.action"
              )}
              value={actionInput}
              onChange={(
                event
              ) => {
                setActionInput(
                  event.target.value
                );
              }}
              placeholder={t(
                "auditPage.filters.actionPlaceholder"
              )}
            />

            <FormControl
              size="small"
            >
              <InputLabel>
                {t(
                  "auditPage.filters.entity"
                )}
              </InputLabel>

              <Select
                label={t(
                  "auditPage.filters.entity"
                )}
                value={entityType}
                onChange={(
                  event
                ) => {
                  setEntityType(
                    event.target
                      .value as
                      AuditLogEntityFilter
                  );

                  setPage(0);
                }}
              >
                {ENTITY_OPTIONS.map(
                  (
                    option
                  ) => (
                    <MenuItem
                      key={
                        option
                      }
                      value={
                        option
                      }
                    >
                      {t(
                        option ===
                          "all"
                          ? "auditPage.entities.all"
                          : `auditPage.entities.${option}`
                      )}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>

            <TextField
              size="small"
              type="date"
              label={t(
                "auditPage.filters.startDate"
              )}
              value={startDate}
              onChange={(
                event
              ) => {
                setStartDate(
                  event.target.value
                );

                setPage(0);
              }}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <TextField
              size="small"
              type="date"
              label={t(
                "auditPage.filters.endDate"
              )}
              value={endDate}
              onChange={(
                event
              ) => {
                setEndDate(
                  event.target.value
                );

                setPage(0);
              }}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <Stack
              direction="row"
              spacing={1}
            >
              <Button
                variant="outlined"
                startIcon={
                  <ResetIcon />
                }
                onClick={
                  handleReset
                }
              >
                {t(
                  "auditPage.filters.reset"
                )}
              </Button>

              <Button
                variant="contained"
                startIcon={
                  <RefreshIcon />
                }
                onClick={() => {
                  setReloadKey(
                    (
                      value
                    ) =>
                      value + 1
                  );
                }}
              >
                {t(
                  "auditPage.refresh"
                )}
              </Button>
            </Stack>
          </Box>
        </Paper>

        {errorMessage && (
          <Alert severity="error">
            {errorMessage}
          </Alert>
        )}

        <Paper
          variant="outlined"
          sx={{
            overflow: "hidden",
          }}
        >
          {loading ? (
            <Box
              sx={{
                minHeight: 260,
                display: "grid",
                placeItems:
                  "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : items.length ===
            0 ? (
            <Box
              sx={{
                p: 4,
                textAlign:
                  "center",
              }}
            >
              <Typography
                color="text.secondary"
              >
                {t(
                  "auditPage.empty"
                )}
              </Typography>
            </Box>
          ) : mobile ? (
            <Stack
              spacing={1}
              sx={{
                p: 1,
              }}
            >
              {items.map(
                (
                  item
                ) => (
                  <Card
                    key={
                      item.id
                    }
                    variant="outlined"
                  >
                    <CardContent>
                      <Stack
                        spacing={1}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          spacing={1}
                        >
                          <Typography
                            fontWeight={700}
                          >
                            {actionLabel(
                              item.action
                            )}
                          </Typography>

                          <Chip
                            size="small"
                            color={statusColor(
                              item.statusCode
                            )}
                            label={
                              item.statusCode
                            }
                          />
                        </Stack>

                        <Typography
                          variant="body2"
                        >
                          {formatDateTime(
                            item.createdAt
                          )}
                        </Typography>

                        <Typography
                          variant="body2"
                        >
                          {userLabel(
                            item
                          )}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {entityLabel(
                            item.entityType
                          )}
                          {item.entityId
                            ? ` #${item.entityId}`
                            : ""}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            overflowWrap:
                              "anywhere",
                          }}
                        >
                          {item.method}{" "}
                          {item.path}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                )
              )}
            </Stack>
          ) : (
            <TableContainer>
              <Table
                size="small"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {t(
                        "auditPage.columns.date"
                      )}
                    </TableCell>

                    <TableCell>
                      {t(
                        "auditPage.columns.user"
                      )}
                    </TableCell>

                    <TableCell>
                      {t(
                        "auditPage.columns.action"
                      )}
                    </TableCell>

                    <TableCell>
                      {t(
                        "auditPage.columns.entity"
                      )}
                    </TableCell>

                    <TableCell>
                      {t(
                        "auditPage.columns.request"
                      )}
                    </TableCell>

                    <TableCell align="right">
                      {t(
                        "auditPage.columns.status"
                      )}
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {items.map(
                    (
                      item
                    ) => (
                      <TableRow
                        key={
                          item.id
                        }
                        hover
                      >
                        <TableCell
                          sx={{
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {formatDateTime(
                            item.createdAt
                          )}
                        </TableCell>

                        <TableCell>
                          {userLabel(
                            item
                          )}
                        </TableCell>

                        <TableCell>
                          {actionLabel(
                            item.action
                          )}
                        </TableCell>

                        <TableCell>
                          {entityLabel(
                            item.entityType
                          )}
                          {item.entityId
                            ? ` #${item.entityId}`
                            : ""}
                        </TableCell>

                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily:
                                "monospace",
                              overflowWrap:
                                "anywhere",
                            }}
                          >
                            {item.method}{" "}
                            {item.path}
                          </Typography>
                        </TableCell>

                        <TableCell align="right">
                          <Chip
                            size="small"
                            color={statusColor(
                              item.statusCode
                            )}
                            label={
                              item.statusCode
                            }
                          />
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(
              _event,
              nextPage
            ) => {
              setPage(
                nextPage
              );
            }}
            rowsPerPage={
              pageSize
            }
            onRowsPerPageChange={(
              event
            ) => {
              setPageSize(
                Number(
                  event.target
                    .value
                )
              );

              setPage(0);
            }}
            rowsPerPageOptions={[
              10,
              25,
              50,
              100,
            ]}
            labelRowsPerPage={t(
              "auditPage.pagination.rowsPerPage"
            )}
            labelDisplayedRows={({
              from,
              to,
              count,
            }) =>
              t(
                "auditPage.pagination.displayedRows",
                {
                  from,
                  to,
                  count,
                }
              )
            }
          />
        </Paper>
      </Stack>
    </Container>
  );
};

export default AuditLogPage;
