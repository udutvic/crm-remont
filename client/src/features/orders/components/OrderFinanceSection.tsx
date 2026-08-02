import {
  useCallback,
  useEffect,
  useState,
} from "react";
import type {
  AxiosError,
} from "axios";
import {
  AccountBalanceWalletOutlined as FinanceIcon,
  EditOutlined as EditIcon,
  TrendingDownOutlined as CostIcon,
  TrendingUpOutlined as ProfitIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

import useAuth from "features/auth/context/useAuth";
import useAppFormatters from "hooks/useAppFormatters";
import {
  getOrderFinance,
  updateOrderFinance,
} from "index";
import type {
  OrderFinanceResponse,
} from "types";

interface OrderFinanceSectionProps {
  orderId: number;
  onChanged:
    () => Promise<void> | void;
}

interface FinanceErrorResponse {
  code?: string;
  error?: string;
  details?: Record<
    string,
    string
  >;
}

const wholeMoneyInput = (
  value: string
): string => {
  const wholePart =
    value
      .replace(
        /\s/g,
        ""
      )
      .split(
        /[.,]/
      )[0];

  return wholePart.replace(
    /[^0-9]/g,
    ""
  );
};

const wholeMoneyString = (
  value: number
): string =>
  String(
    Math.max(
      0,
      Math.round(
        Number(value) ||
          0
      )
    )
  );

const OrderFinanceSection = ({
  orderId,
  onChanged,
}: OrderFinanceSectionProps) => {
  const {
    t,
  } = useTranslation();

  const {
    user,
  } = useAuth();

  const {
    formatPrice,
  } = useAppFormatters();

  const [
    finance,
    setFinance,
  ] = useState<
    OrderFinanceResponse | null
  >(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    editOpen,
    setEditOpen,
  ] = useState(false);

  const [
    finalPrice,
    setFinalPrice,
  ] = useState("0");

  const [
    discount,
    setDiscount,
  ] = useState("0");

  const [
    otherCosts,
    setOtherCosts,
  ] = useState("0");

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<
    string | null
  >(null);

  const isAdmin =
    user?.role ===
    "admin";

  const loadFinance =
    useCallback(
      async (): Promise<void> => {
        try {
          setLoading(true);
          setErrorMessage(
            null
          );

          const response =
            await getOrderFinance(
              orderId
            );

          setFinance(
            response
          );
        } catch (
          error: unknown
        ) {
          console.error(
            "Order finance load failed:",
            error
          );

          const axiosError =
            error as AxiosError<FinanceErrorResponse>;

          setErrorMessage(
            axiosError.response
              ?.data?.error ??
              t(
                "orderFinance.errors.load"
              )
          );
        } finally {
          setLoading(false);
        }
      },
      [
        orderId,
        t,
      ]
    );

  useEffect(() => {
    void loadFinance();
  }, [
    loadFinance,
  ]);

  const openEdit =
    (): void => {
      if (!finance) {
        return;
      }

      setFinalPrice(
        wholeMoneyString(
          finance.summary
            .finalPrice
        )
      );

      setDiscount(
        wholeMoneyString(
          finance.summary
            .discount
        )
      );

      setOtherCosts(
        wholeMoneyString(
          finance.summary
            .otherCosts ??
            0
        )
      );

      setErrorMessage(null);
      setEditOpen(true);
    };

  const closeEdit =
    (): void => {
      if (saving) {
        return;
      }

      setEditOpen(false);
      setErrorMessage(null);
    };

  const numberValue = (
    value: string
  ): number =>
    Number(value);

  const finalPriceNumber =
    numberValue(
      finalPrice
    );

  const discountNumber =
    numberValue(
      discount
    );

  const otherCostsNumber =
    numberValue(
      otherCosts
    );

  const valuesValid =
    [
      finalPriceNumber,
      discountNumber,
      otherCostsNumber,
    ].every(
      (
        value
      ) =>
        Number.isInteger(
          value
        ) &&
        value >= 0
    );

  const saveFinance =
    async (): Promise<void> => {
      if (
        !valuesValid ||
        !isAdmin
      ) {
        return;
      }

      try {
        setSaving(true);
        setErrorMessage(null);

        const response =
          await updateOrderFinance(
            orderId,
            {
              finalPrice:
                finalPriceNumber,
              discount:
                discountNumber,
              otherCosts:
                otherCostsNumber,
            }
          );

        setFinance(response);
        setEditOpen(false);

        await onChanged();
      } catch (
        error: unknown
      ) {
        console.error(
          "Order finance update failed:",
          error
        );

        const axiosError =
          error as AxiosError<FinanceErrorResponse>;

        const details =
          axiosError.response
            ?.data?.details;

        setErrorMessage(
          details
            ? Object.values(
                details
              )
                .filter(Boolean)
                .join(" ")
            : axiosError.response
                ?.data?.error ??
              t(
                "orderFinance.errors.save"
              )
        );
      } finally {
        setSaving(false);
      }
    };

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          p: {
            xs: 2,
            sm: 3,
          },
        }}
      >
        <Stack spacing={2}>
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1.5}
            alignItems={{
              sm: "center",
            }}
            justifyContent="space-between"
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <Box
                sx={{
                  display:
                    "grid",
                  placeItems:
                    "center",
                  color:
                    "primary.main",
                }}
              >
                <FinanceIcon />
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  component="h2"
                >
                  {t(
                    "orderFinance.title"
                  )}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {t(
                    "orderFinance.subtitle"
                  )}
                </Typography>
              </Box>
            </Stack>

            {isAdmin &&
              finance?.canEdit && (
                <Button
                  variant="outlined"
                  startIcon={
                    <EditIcon />
                  }
                  onClick={
                    openEdit
                  }
                >
                  {t(
                    "orderFinance.actions.edit"
                  )}
                </Button>
              )}
          </Stack>

          <Divider />

          {errorMessage && (
            <Alert severity="error">
              {errorMessage}
            </Alert>
          )}

          {loading ? (
            <Stack
              alignItems="center"
              sx={{
                py: 4,
              }}
            >
              <CircularProgress
                size={30}
              />
            </Stack>
          ) : finance ? (
            <>
              <Box
                sx={{
                  display:
                    "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm:
                      "repeat(2, minmax(0, 1fr))",
                    lg:
                      "repeat(4, minmax(0, 1fr))",
                  },
                  gap: 1.5,
                }}
              >
                {([
                  [
                    "total",
                    finance.summary
                      .customerTotal,
                  ],
                  [
                    "parts",
                    finance.summary
                      .partsSaleTotal,
                  ],
                  [
                    "labor",
                    finance.summary
                      .laborPrice,
                  ],
                  [
                    "discount",
                    -finance.summary
                      .discount,
                  ],
                ] as const).map(
                  (
                    [
                      key,
                      value,
                    ]
                  ) => (
                    <Paper
                      key={key}
                      variant="outlined"
                      sx={{
                        p: 2,
                      }}
                    >
                      <Typography
                        variant="overline"
                        color="text.secondary"
                      >
                        {t(
                          `orderFinance.customer.${key}`
                        )}
                      </Typography>

                      <Typography
                        variant={
                          key ===
                          "total"
                            ? "h5"
                            : "h6"
                        }
                        fontWeight={
                          key ===
                          "total"
                            ? 800
                            : 700
                        }
                      >
                        {formatPrice(
                          value
                        )}
                      </Typography>
                    </Paper>
                  )
                )}
              </Box>

              <Typography
                variant="subtitle1"
                fontWeight={700}
              >
                {t(
                  "orderFinance.parts.title"
                )}
              </Typography>

              {finance.parts
                .length === 0 ? (
                <Typography
                  color="text.secondary"
                >
                  {t(
                    "orderFinance.parts.empty"
                  )}
                </Typography>
              ) : (
                <TableContainer>
                  <Table
                    size="small"
                    sx={{
                      minWidth: 650,
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          {t(
                            "orderFinance.parts.part"
                          )}
                        </TableCell>

                        <TableCell
                          align="right"
                        >
                          {t(
                            "orderFinance.parts.quantity"
                          )}
                        </TableCell>

                        <TableCell
                          align="right"
                        >
                          {t(
                            "orderFinance.parts.unitPrice"
                          )}
                        </TableCell>

                        <TableCell
                          align="right"
                        >
                          {t(
                            "orderFinance.parts.total"
                          )}
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {finance.parts.map(
                        (
                          part
                        ) => (
                          <TableRow
                            key={
                              part.inventoryItemId
                            }
                          >
                            <TableCell>
                              <Typography
                                fontWeight={
                                  700
                                }
                              >
                                {
                                  part.name
                                }
                              </Typography>

                              <Typography
                                component="code"
                                variant="caption"
                                color="text.secondary"
                              >
                                {
                                  part.sku
                                }
                              </Typography>
                            </TableCell>

                            <TableCell
                              align="right"
                            >
                              {
                                part.quantity
                              }
                            </TableCell>

                            <TableCell
                              align="right"
                            >
                              {formatPrice(
                                part.unitPrice
                              )}
                            </TableCell>

                            <TableCell
                              align="right"
                            >
                              <Typography
                                fontWeight={
                                  700
                                }
                              >
                                {formatPrice(
                                  part.saleTotal
                                )}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {finance
                .internalVisible && (
                <>
                  <Divider />

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <CostIcon
                      color="warning"
                    />

                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                    >
                      {t(
                        "orderFinance.internal.title"
                      )}
                    </Typography>
                  </Stack>

                  <Box
                    sx={{
                      display:
                        "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm:
                          "repeat(2, minmax(0, 1fr))",
                        lg:
                          "repeat(4, minmax(0, 1fr))",
                      },
                      gap: 1.5,
                    }}
                  >
                    {([
                      [
                        "partsCost",
                        finance.summary
                          .partsCostTotal ??
                          0,
                      ],
                      [
                        "otherCosts",
                        finance.summary
                          .otherCosts ??
                          0,
                      ],
                      [
                        "profit",
                        finance.summary
                          .grossProfit ??
                          0,
                      ],
                      [
                        "margin",
                        finance.summary
                          .marginPercent ??
                          0,
                      ],
                    ] as const).map(
                      (
                        [
                          key,
                          value,
                        ]
                      ) => (
                        <Paper
                          key={key}
                          variant="outlined"
                          sx={{
                            p: 2,
                          }}
                        >
                          <Typography
                            variant="overline"
                            color="text.secondary"
                          >
                            {t(
                              `orderFinance.internal.${key}`
                            )}
                          </Typography>

                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            {key ===
                              "profit" && (
                              <ProfitIcon
                                color={
                                  value >=
                                  0
                                    ? "success"
                                    : "error"
                                }
                              />
                            )}

                            <Typography
                              variant="h6"
                              fontWeight={
                                700
                              }
                            >
                              {key ===
                              "margin"
                                ? `${value.toLocaleString(
                                    undefined,
                                    {
                                      maximumFractionDigits:
                                        2,
                                    }
                                  )} %`
                                : formatPrice(
                                    value
                                  )}
                            </Typography>
                          </Stack>
                        </Paper>
                      )
                    )}
                  </Box>

                  <Alert severity="info">
                    {t(
                      "orderFinance.internal.adminOnly"
                    )}
                  </Alert>
                </>
              )}
            </>
          ) : null}
        </Stack>
      </Paper>

      <Dialog
        open={editOpen}
        onClose={
          closeEdit
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {t(
            "orderFinance.dialog.title"
          )}
        </DialogTitle>

        <DialogContent>
          <Stack
            spacing={2}
            sx={{
              pt: 1,
            }}
          >
            {errorMessage && (
              <Alert severity="error">
                {errorMessage}
              </Alert>
            )}

            <TextField
              label={t(
                "orderFinance.dialog.finalPrice"
              )}
              type="text"
              value={
                finalPrice
              }
              onChange={(
                event
              ) => {
                setFinalPrice(
                  wholeMoneyInput(
                    event.target
                      .value
                  )
                );
              }}
              slotProps={{
                htmlInput: {
                  inputMode:
                    "numeric",
                  pattern:
                    "[0-9]*",
                },
              }}
              fullWidth
            />

            <Alert severity="info">
              {t(
                "orderFinance.dialog.fixedTotalHint"
              )}
            </Alert>

            <TextField
              label={t(
                "orderFinance.dialog.discount"
              )}
              type="text"
              value={
                discount
              }
              onChange={(
                event
              ) => {
                setDiscount(
                  wholeMoneyInput(
                    event.target
                      .value
                  )
                );
              }}
              slotProps={{
                htmlInput: {
                  inputMode:
                    "numeric",
                  pattern:
                    "[0-9]*",
                },
              }}
              fullWidth
            />

            <TextField
              label={t(
                "orderFinance.dialog.otherCosts"
              )}
              type="text"
              value={
                otherCosts
              }
              onChange={(
                event
              ) => {
                setOtherCosts(
                  wholeMoneyInput(
                    event.target
                      .value
                  )
                );
              }}
              helperText={t(
                "orderFinance.dialog.otherCostsHint"
              )}
              slotProps={{
                htmlInput: {
                  inputMode:
                    "numeric",
                  pattern:
                    "[0-9]*",
                },
              }}
              fullWidth
            />

            {!valuesValid && (
              <Alert severity="error">
                {t(
                  "orderFinance.errors.nonNegative"
                )}
              </Alert>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={
              closeEdit
            }
            disabled={saving}
          >
            {t(
              "orderFinance.actions.cancel"
            )}
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              void saveFinance();
            }}
            disabled={
              saving ||
              !valuesValid
            }
          >
            {saving
              ? t(
                  "orderFinance.actions.saving"
                )
              : t(
                  "orderFinance.actions.save"
                )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrderFinanceSection;
