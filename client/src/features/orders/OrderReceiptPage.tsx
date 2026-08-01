import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  ReactNode,
} from "react";
import type {
  AxiosError,
} from "axios";
import {
  ArrowBack as ArrowBackIcon,
  PrintOutlined as PrintIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Divider,
  GlobalStyles,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";
import {
  useNavigate,
  useParams,
} from "react-router";

import LoadingIndicator from "components/ui/LoadingIndicator";
import serviceReceiptConfig from "config/serviceReceiptConfig";
import useAppFormatters from "hooks/useAppFormatters";
import {
  getOrder,
} from "index";
import type {
  Order,
  OrderStatus,
} from "types";
import formatOrderNumber from "utils/formatOrderNumber";

interface ApiErrorResponse {
  error?: string;
}

interface FieldProps {
  label: string;
  value: ReactNode;
  wide?: boolean;
  preserveWhitespace?: boolean;
}

interface ServiceHeaderProps {
  copyLabel: string;
  title: string;
  orderNumber: string;
  compact?: boolean;
}

const Field = ({
  label,
  value,
  wide = false,
  preserveWhitespace = false,
}: FieldProps) => {
  return (
    <Box
      sx={{
        gridColumn:
          wide
            ? "1 / -1"
            : "auto",

        minWidth: 0,
      }}
    >
      <Typography
        component="div"
        sx={{
          fontSize: "0.62rem",
          fontWeight: 700,
          color: "text.secondary",
          textTransform:
            "uppercase",
          letterSpacing:
            "0.035em",
          lineHeight: 1.25,
          mb: 0.25,
        }}
      >
        {label}
      </Typography>

      <Typography
        component="div"
        sx={{
          fontSize: "0.79rem",
          lineHeight: 1.32,
          overflowWrap:
            "anywhere",

          whiteSpace:
            preserveWhitespace
              ? "pre-wrap"
              : "normal",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

const ServiceHeader = ({
  copyLabel,
  title,
  orderNumber,
  compact = false,
}: ServiceHeaderProps) => {
  const details = [
    serviceReceiptConfig.legalName,
    serviceReceiptConfig.address,

    [
      serviceReceiptConfig.companyId
        ? `IČO: ${serviceReceiptConfig.companyId}`
        : "",

      serviceReceiptConfig.vatId
        ? `DIČ: ${serviceReceiptConfig.vatId}`
        : "",
    ]
      .filter(Boolean)
      .join(" · "),

    [
      serviceReceiptConfig.phone,
      serviceReceiptConfig.email,
    ]
      .filter(Boolean)
      .join(" · "),
  ].filter(Boolean);

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      spacing={2}
    >
      <Box
        sx={{
          minWidth: 0,
        }}
      >
        <Typography
          component="div"
          sx={{
            fontSize: compact
              ? "1rem"
              : "1.3rem",

            fontWeight: 800,
            lineHeight: 1.05,
          }}
        >
          {
            serviceReceiptConfig.brandName
          }
        </Typography>

        {details.map(
          (detail) => (
            <Typography
              key={detail}
              color="text.secondary"
              sx={{
                mt: 0.18,
                fontSize: compact
                  ? "0.62rem"
                  : "0.68rem",

                lineHeight: 1.25,
              }}
            >
              {detail}
            </Typography>
          )
        )}
      </Box>

      <Box
        sx={{
          textAlign: "right",
          minWidth: 0,
        }}
      >
        <Typography
          component="div"
          sx={{
            fontSize: compact
              ? "0.78rem"
              : "0.9rem",

            fontWeight: 800,
            textTransform:
              "uppercase",
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>

        <Typography
          component="div"
          sx={{
            mt: 0.25,
            fontSize: compact
              ? "0.85rem"
              : "1rem",

            fontWeight: 800,
          }}
        >
          {orderNumber}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mt: 0.15,
            fontSize: "0.6rem",
            textTransform:
              "uppercase",
          }}
        >
          {copyLabel}
        </Typography>
      </Box>
    </Stack>
  );
};

const statusTranslationKeys: Record<
  OrderStatus,
  string
> = {
  pending:
    "statuses.pending",

  in_progress:
    "statuses.inProgress",

  completed:
    "statuses.completed",

  unrepairable:
    "statuses.unrepairable",

  cancelled:
    "statuses.cancelled",
};

const OrderReceiptPage = () => {
  const {
    t,
  } = useTranslation();

  const {
    formatDateTime,
    formatPrice,
  } = useAppFormatters();

  const navigate =
    useNavigate();

  const {
    id,
  } = useParams<{
    id: string;
  }>();

  const [
    order,
    setOrder,
  ] = useState<Order | null>(
    null
  );

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

  const loadOrder =
    useCallback(
      async (): Promise<void> => {
        const orderId =
          Number(id);

        if (
          !Number.isInteger(
            orderId
          ) ||
          orderId <= 0
        ) {
          setErrorMessage(
            t(
              "orderDetails.errors.invalidId"
            )
          );

          setLoading(false);

          return;
        }

        try {
          setLoading(true);
          setErrorMessage(null);

          const data =
            await getOrder(
              orderId
            );

          setOrder(data);
        } catch (
          error: unknown
        ) {
          console.error(
            "Error loading receipt:",
            error
          );

          const axiosError =
            error as AxiosError<ApiErrorResponse>;

          if (
            axiosError.response
              ?.status === 404
          ) {
            setErrorMessage(
              t(
                "orderDetails.errors.notFound"
              )
            );

            return;
          }

          setErrorMessage(
            axiosError.response
              ?.data?.error ??
              t(
                "receipt.errors.loadFailed"
              )
          );
        } finally {
          setLoading(false);
        }
      },
      [
        id,
        t,
      ]
    );

  useEffect(() => {
    void loadOrder();
  }, [loadOrder]);

  const orderNumber =
    formatOrderNumber(
      order?.id
    );

  useEffect(() => {
    if (!order) {
      return;
    }

    const previousTitle =
      document.title;

    document.title =
      `${t(
        "receipt.title"
      )} ${orderNumber}`;

    return () => {
      document.title =
        previousTitle;
    };
  }, [
    order,
    orderNumber,
    t,
  ]);

  const terms =
    useMemo(
      () => [
        t(
          "receipt.terms.item1"
        ),
        t(
          "receipt.terms.item2"
        ),
        t(
          "receipt.terms.item3"
        ),
        t(
          "receipt.terms.item4"
        ),
        t(
          "receipt.terms.item5"
        ),
        t(
          "receipt.terms.item6"
        ),
        t(
          "receipt.terms.item7"
        ),
        t(
          "receipt.terms.item8"
        ),
      ],
      [t]
    );

  const notAvailable =
    t(
      "common.notAvailable"
    );

  const textOrFallback = (
    value?: string | null
  ): string => {
    return (
      value?.trim() ||
      notAvailable
    );
  };

  const getAccessDescription =
    (): string => {
      if (!order) {
        return notAvailable;
      }

      switch (
        order.accessType
      ) {
        case "pin":
          return order.hasAccessCode
            ? t(
                "orderDetails.access.pinProvided"
              )
            : t(
                "orderDetails.access.pinNotProvided"
              );

        case "password":
          return order.hasAccessCode
            ? t(
                "orderDetails.access.passwordProvided"
              )
            : t(
                "orderDetails.access.passwordNotProvided"
              );

        case "pattern":
          return order.hasAccessCode
            ? t(
                "orderDetails.access.patternProvided"
              )
            : t(
                "orderDetails.access.patternNotProvided"
              );

        case "unknown":
          return t(
            "orderDetails.access.unknown"
          );

        case "none":
        default:
          return t(
            "orderDetails.access.none"
          );
      }
    };

  if (loading) {
    return (
      <LoadingIndicator
        message={t(
          "receipt.loading"
        )}
      />
    );
  }

  if (
    errorMessage ||
    !order
  ) {
    return (
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          p: 3,
        }}
      >
        <Stack spacing={2}>
          <Button
            startIcon={
              <ArrowBackIcon />
            }
            onClick={() => {
              navigate(
                "/orders"
              );
            }}
            sx={{
              alignSelf:
                "flex-start",
            }}
          >
            {t(
              "orderDetails.backToOrders"
            )}
          </Button>

          <Alert severity="error">
            {errorMessage ??
              t(
                "receipt.errors.loadFailed"
              )}
          </Alert>
        </Stack>
      </Box>
    );
  }

  const estimatedPrice =
    order.estimatedPrice ??
    order.price;

  const deviceType =
    t(
      `orderDetails.deviceTypes.${order.device.deviceType}`
    );

  const clientName =
    order.client?.name ??
    t(
      "orderDetails.clientFallback",
      {
        id:
          order.clientId,
      }
    );

  const identifiers =
    [
      order.device.imei1,
      order.device.imei2,
      order.device.serial,
    ]
      .map(
        (value) =>
          value?.trim()
      )
      .filter(
        (
          value
        ): value is string =>
          Boolean(value)
      )
      .join(" / ") ||
    notAvailable;

  const issuedAt =
    order.deliveredAt
      ? formatDateTime(
          order.deliveredAt
        )
      : t(
          "receipt.blankLine"
        );

  return (
    <>
      <GlobalStyles
        styles={{
          "@page": {
            size: "A4 portrait",
            margin: "7mm",
          },

          "@media print": {
            "html, body": {
              backgroundColor:
                "#ffffff !important",
            },

            "html, body, #root":
              {
                margin: 0,
                padding: 0,
                width: "100%",
                minHeight: 0,
              },

            body: {
              printColorAdjust:
                "exact",
              WebkitPrintColorAdjust:
                "exact",
            },

            ".receipt-actions":
              {
                display:
                  "none !important",
              },

            ".receipt-page":
              {
                padding:
                  "0 !important",
                minHeight:
                  "auto !important",
                background:
                  "#ffffff !important",
              },

            ".receipt-document":
              {
                width:
                  "100% !important",
                maxWidth:
                  "none !important",
                minHeight:
                  "auto !important",
                margin:
                  "0 !important",
                padding:
                  "0 !important",
                border:
                  "none !important",
                boxShadow:
                  "none !important",
              },
          },
        }}
      />

      <Box
        className="receipt-page"
        sx={{
          minHeight: "100vh",
          backgroundColor:
            "#eef0f3",

          py: {
            xs: 2,
            sm: 3,
          },

          px: {
            xs: 1,
            sm: 2,
          },
        }}
      >
        <Stack
          className="receipt-actions"
          spacing={1}
          sx={{
            maxWidth: "210mm",
            mx: "auto",
            mb: 2,
          }}
        >
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1}
            justifyContent="space-between"
          >
            <Button
              variant="outlined"
              startIcon={
                <ArrowBackIcon />
              }
              onClick={() => {
                navigate(
                  `/orders/${order.id}`
                );
              }}
            >
              {t(
                "receipt.actions.back"
              )}
            </Button>

            <Button
              variant="contained"
              startIcon={
                <PrintIcon />
              }
              onClick={() => {
                window.print();
              }}
            >
              {t(
                "receipt.actions.print"
              )}
            </Button>
          </Stack>

          <Alert severity="info">
            {t(
              "receipt.printHint"
            )}
          </Alert>

          {(
            !serviceReceiptConfig.legalName ||
            !serviceReceiptConfig.address
          ) && (
            <Alert severity="warning">
              {t(
                "receipt.configurationWarning"
              )}
            </Alert>
          )}
        </Stack>

        <Paper
          className="receipt-document"
          elevation={3}
          sx={{
            width: "210mm",
            maxWidth:
              "calc(100vw - 16px)",

            minHeight: "283mm",
            mx: "auto",
            p: {
              xs: 1.5,
              sm: 2.5,
            },

            boxSizing:
              "border-box",
          }}
        >
          {/* Service copy */}
          <Box
            sx={{
              minHeight: "190mm",
              display: "flex",
              flexDirection:
                "column",
            }}
          >
            <ServiceHeader
              title={t(
                "receipt.serviceCopyTitle"
              )}
              copyLabel={t(
                "receipt.serviceCopy"
              )}
              orderNumber={
                orderNumber
              }
            />

            <Divider
              sx={{
                my: 1.25,
                borderColor:
                  "text.primary",
              }}
            />

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  sm:
                    "repeat(4, minmax(0, 1fr))",
                },

                gap: 1.15,
              }}
            >
              <Field
                label={t(
                  "orderDetails.fields.name"
                )}
                value={clientName}
              />

              <Field
                label={t(
                  "orderDetails.fields.phone"
                )}
                value={textOrFallback(
                  order.client?.phone
                )}
              />

              <Field
                label={t(
                  "orderDetails.fields.received"
                )}
                value={formatDateTime(
                  order.receivedAt ??
                    order.createdAt
                )}
              />

              <Field
                label={t(
                  "orderDetails.fields.dueDate"
                )}
                value={formatDateTime(
                  order.dueAt
                )}
              />

              <Field
                label={t(
                  "orderDetails.fields.deviceType"
                )}
                value={deviceType}
              />

              <Field
                label={t(
                  "orderDetails.fields.brand"
                )}
                value={textOrFallback(
                  order.device.brand
                )}
              />

              <Field
                label={t(
                  "orderDetails.fields.model"
                )}
                value={textOrFallback(
                  order.device.model
                )}
              />

              <Field
                label={t(
                  "orderDetails.fields.color"
                )}
                value={textOrFallback(
                  order.device.color
                )}
              />

              <Field
                label={t(
                  "receipt.fields.identifiers"
                )}
                value={identifiers}
                wide
              />

              <Field
                label={t(
                  "orderDetails.fields.reportedProblem"
                )}
                value={textOrFallback(
                  order.problem
                )}
                preserveWhitespace
                wide
              />

              <Field
                label={t(
                  "orderDetails.fields.deviceCondition"
                )}
                value={textOrFallback(
                  order.deviceCondition
                )}
                preserveWhitespace
                wide
              />

              <Field
                label={t(
                  "orderDetails.fields.accessories"
                )}
                value={textOrFallback(
                  order.accessories
                )}
                preserveWhitespace
              />

              <Field
                label={t(
                  "orderDetails.fields.deviceAccess"
                )}
                value={
                  getAccessDescription()
                }
              />

              <Field
                label={t(
                  "orderDetails.fields.estimatedPrice"
                )}
                value={formatPrice(
                  estimatedPrice
                )}
              />

              <Field
                label={t(
                  "common.status"
                )}
                value={t(
                  statusTranslationKeys[
                    order.status
                  ]
                )}
              />
            </Box>

            <Box
              sx={{
                mt: 1.35,
                border: "1px solid",
                borderColor:
                  "divider",
                borderRadius: 0.75,
                overflow: "hidden",
              }}
            >
              <Typography
                component="h2"
                sx={{
                  px: 1.25,
                  py: 0.6,
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  textTransform:
                    "uppercase",
                  backgroundColor:
                    "#f2f3f5",
                  borderBottom:
                    "1px solid",
                  borderColor:
                    "divider",
                }}
              >
                {t(
                  "receipt.terms.title"
                )}
              </Typography>

              <Box
                component="ol"
                sx={{
                  m: 0,
                  py: 0.8,
                  pr: 1.25,
                  pl: 3.25,

                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm:
                      "repeat(2, minmax(0, 1fr))",
                  },

                  columnGap: 2,
                  rowGap: 0.35,

                  "& li": {
                    pl: 0.2,
                    fontSize:
                      "0.64rem",
                    lineHeight: 1.28,
                    breakInside:
                      "avoid",
                  },
                }}
              >
                {terms.map(
                  (term) => (
                    <li key={term}>
                      {term}
                    </li>
                  )
                )}
              </Box>

              {serviceReceiptConfig.termsUrl && (
                <Typography
                  sx={{
                    px: 1.25,
                    pb: 0.75,
                    fontSize:
                      "0.61rem",
                    color:
                      "text.secondary",
                  }}
                >
                  {t(
                    "receipt.terms.fullTerms",
                    {
                      url:
                        serviceReceiptConfig.termsUrl,
                    }
                  )}
                </Typography>
              )}
            </Box>

            <Typography
              sx={{
                mt: 0.85,
                fontSize: "0.64rem",
                lineHeight: 1.3,
              }}
            >
              {t(
                "receipt.confirmation"
              )}
            </Typography>

            <Box
              sx={{
                mt: "auto",
                pt: 5,

                display: "grid",

                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",

                gap: 5,
              }}
            >
              <Box>
                <Box
                  sx={{
                    borderTop:
                      "1px solid",
                  }}
                />

                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize:
                      "0.64rem",
                    textAlign:
                      "center",
                  }}
                >
                  {t(
                    "receipt.signatures.customer"
                  )}
                </Typography>
              </Box>

              <Box>
                <Box
                  sx={{
                    borderTop:
                      "1px solid",
                  }}
                />

                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize:
                      "0.64rem",
                    textAlign:
                      "center",
                  }}
                >
                  {t(
                    "receipt.signatures.service"
                  )}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Cut line */}
          <Box
            sx={{
              my: 1.5,
              position: "relative",
              borderTop:
                "1px dashed",
              borderColor:
                "text.secondary",
            }}
          >
            <Typography
              sx={{
                position:
                  "absolute",
                left: "50%",
                top: 0,
                px: 1,
                transform:
                  "translate(-50%, -50%)",

                backgroundColor:
                  "background.paper",

                color:
                  "text.secondary",

                fontSize: "0.58rem",
                textTransform:
                  "uppercase",
                whiteSpace:
                  "nowrap",
              }}
            >
              {t(
                "receipt.cutLine"
              )}
            </Typography>
          </Box>

          {/* Customer copy */}
          <Box
            sx={{
              minHeight: "72mm",
              display: "flex",
              flexDirection:
                "column",
            }}
          >
            <ServiceHeader
              compact
              title={t(
                "receipt.customerCopyTitle"
              )}
              copyLabel={t(
                "receipt.customerCopy"
              )}
              orderNumber={
                orderNumber
              }
            />

            <Divider
              sx={{
                my: 0.85,
              }}
            />

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  sm:
                    "repeat(4, minmax(0, 1fr))",
                },

                gap: 0.85,
              }}
            >
              <Field
                label={t(
                  "orderDetails.fields.name"
                )}
                value={clientName}
              />

              <Field
                label={t(
                  "orderDetails.fields.phone"
                )}
                value={textOrFallback(
                  order.client?.phone
                )}
              />

              <Field
                label={t(
                  "orderDetails.fields.received"
                )}
                value={formatDateTime(
                  order.receivedAt ??
                    order.createdAt
                )}
              />

              <Field
                label={t(
                  "orderDetails.fields.estimatedPrice"
                )}
                value={formatPrice(
                  estimatedPrice
                )}
              />

              <Field
                label={t(
                  "orderDetails.sections.device"
                )}
                value={`${order.device.brand} ${order.device.model}`}
              />

              <Field
                label={t(
                  "receipt.fields.identifiers"
                )}
                value={identifiers}
              />

              <Field
                label={t(
                  "orderDetails.fields.reportedProblem"
                )}
                value={textOrFallback(
                  order.problem
                )}
                preserveWhitespace
                wide
              />
            </Box>

            <Box
              sx={{
                mt: "auto",
                pt: 1.15,

                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm:
                    "repeat(3, minmax(0, 1fr))",
                },

                gap: 1.5,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize:
                      "0.62rem",
                    fontWeight: 700,
                  }}
                >
                  {t(
                    "receipt.fields.receivedByCustomer"
                  )}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.35,
                    fontSize:
                      "0.72rem",
                    borderBottom:
                      "1px dotted",
                    minHeight: 18,
                  }}
                >
                  {issuedAt}
                </Typography>
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize:
                      "0.62rem",
                    fontWeight: 700,
                  }}
                >
                  {t(
                    "receipt.fields.paid"
                  )}
                </Typography>

                <Box
                  sx={{
                    mt: 0.35,
                    minHeight: 18,
                    borderBottom:
                      "1px dotted",
                  }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize:
                      "0.62rem",
                    fontWeight: 700,
                  }}
                >
                  {t(
                    "receipt.fields.stampAndSignature"
                  )}
                </Typography>

                <Box
                  sx={{
                    mt: 0.35,
                    minHeight: 18,
                    borderBottom:
                      "1px dotted",
                  }}
                />
              </Box>
            </Box>

            {serviceReceiptConfig.termsUrl && (
              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.8,
                  fontSize: "0.58rem",
                  textAlign: "center",
                }}
              >
                {t(
                  "receipt.customerTerms",
                  {
                    url:
                      serviceReceiptConfig.termsUrl,
                  }
                )}
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default OrderReceiptPage;
