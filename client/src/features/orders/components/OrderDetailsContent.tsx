import type {
  ReactNode,
} from "react";
import {
  AssignmentOutlined as IntakeIcon,
  BuildOutlined as RepairIcon,
  DevicesOutlined as DeviceIcon,
  HistoryOutlined as TimelineIcon,
  PaymentsOutlined as PriceIcon,
  PersonOutline as ClientIcon,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

import useAppFormatters from "hooks/useAppFormatters";
import type {
  Order,
} from "types";

import AccessCodeReveal from "./AccessCodeReveal";

interface DetailItemProps {
  label: string;
  value: ReactNode;
  preserveWhitespace?: boolean;
  wide?: boolean;
  highlighted?: boolean;
}

interface DetailsSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  fullWidth?: boolean;
}

const DetailItem = ({
  label,
  value,
  preserveWhitespace = false,
  wide = false,
  highlighted = false,
}: DetailItemProps) => {
  return (
    <Box
      sx={{
        gridColumn: wide
          ? "1 / -1"
          : "auto",

        p: highlighted
          ? 1.5
          : 0,

        borderRadius:
          highlighted
            ? 1.5
            : 0,

        backgroundColor:
          highlighted
            ? "warning.50"
            : "transparent",

        border:
          highlighted
            ? "1px solid"
            : "none",

        borderColor:
          highlighted
            ? "warning.200"
            : "transparent",
      }}
    >
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{
          display: "block",
          lineHeight: 1.4,
          mb: 0.35,
        }}
      >
        {label}
      </Typography>

      <Typography
        component="div"
        variant="body2"
        sx={{
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

const DetailsSection = ({
  title,
  icon,
  children,
  fullWidth = false,
}: DetailsSectionProps) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: {
          xs: 2,
          sm: 3,
        },

        height: "100%",

        gridColumn:
          fullWidth
            ? "1 / -1"
            : "auto",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
      >
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            color: "primary.main",
          }}
        >
          {icon}
        </Box>

        <Typography
          variant="h6"
          component="h2"
        >
          {title}
        </Typography>
      </Stack>

      <Divider
        sx={{
          my: 2,
        }}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm:
              "repeat(2, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        {children}
      </Box>
    </Paper>
  );
};

const OrderDetailsContent = ({
  order,
}: {
  order: Order;
}) => {
  const {
    t,
  } = useTranslation();

  const {
    formatDateTime,
    formatPrice,
  } = useAppFormatters();

  const notAvailable =
    t(
      "common.notAvailable"
    );

  const textOrFallback = (
    value?: string | null
  ): string => {
    const normalized =
      value?.trim();

    return (
      normalized ||
      notAvailable
    );
  };

  const linkedValue = ({
    value,
    href,
  }: {
    value?: string | null;
    href: (
      normalized: string
    ) => string;
  }): ReactNode => {
    const normalized =
      value?.trim();

    if (!normalized) {
      return notAvailable;
    }

    return (
      <Link
        href={href(
          normalized
        )}
        underline="hover"
      >
        {normalized}
      </Link>
    );
  };

  const getAccessDescription =
    (): string => {
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

  const estimatedPrice =
    order.estimatedPrice ??
    order.price;

  const deviceType =
    t(
      `orderDetails.deviceTypes.${order.device.deviceType}`
    );

  const deliveredLabel =
    order.status ===
    "unrepairable"
      ? t(
          "delivery.returnedWithoutRepair"
        )
      : t(
          "orderDetails.fields.delivered"
        );

  return (
    <Box
      sx={{
        display: "grid",

        gridTemplateColumns: {
          xs: "1fr",
          lg:
            "repeat(2, minmax(0, 1fr))",
        },

        gap: 2,
      }}
    >
      <DetailsSection
        title={t(
          "orderDetails.sections.client"
        )}
        icon={
          <ClientIcon />
        }
      >
        <DetailItem
          label={t(
            "orderDetails.fields.name"
          )}
          value={
            order.client?.name ??
            t(
              "orderDetails.clientFallback",
              {
                id:
                  order.clientId,
              }
            )
          }
        />

        <DetailItem
          label={t(
            "orderDetails.fields.phone"
          )}
          value={linkedValue({
            value:
              order.client?.phone,

            href: (
              phone
            ) => `tel:${phone}`,
          })}
        />

        <DetailItem
          label={t(
            "orderDetails.fields.secondaryPhone"
          )}
          value={linkedValue({
            value:
              order.client
                ?.secondaryPhone,

            href: (
              phone
            ) => `tel:${phone}`,
          })}
        />

        <DetailItem
          label={t(
            "orderDetails.fields.email"
          )}
          value={linkedValue({
            value:
              order.client?.email,

            href: (
              email
            ) => `mailto:${email}`,
          })}
        />

        <DetailItem
          label={t(
            "orderDetails.fields.address"
          )}
          value={textOrFallback(
            order.client?.address
          )}
          wide
        />

        <DetailItem
          label={t(
            "orderDetails.fields.clientNote"
          )}
          value={textOrFallback(
            order.client?.note
          )}
          preserveWhitespace
          wide
        />
      </DetailsSection>

      <DetailsSection
        title={t(
          "orderDetails.sections.device"
        )}
        icon={
          <DeviceIcon />
        }
      >
        <DetailItem
          label={t(
            "orderDetails.fields.deviceType"
          )}
          value={deviceType}
        />

        <DetailItem
          label={t(
            "orderDetails.fields.color"
          )}
          value={textOrFallback(
            order.device.color
          )}
        />

        <DetailItem
          label={t(
            "orderDetails.fields.brand"
          )}
          value={textOrFallback(
            order.device.brand
          )}
        />

        <DetailItem
          label={t(
            "orderDetails.fields.model"
          )}
          value={textOrFallback(
            order.device.model
          )}
        />

        <DetailItem
          label={t(
            "orderDetails.fields.imei1"
          )}
          value={textOrFallback(
            order.device.imei1
          )}
        />

        <DetailItem
          label={t(
            "orderDetails.fields.imei2"
          )}
          value={textOrFallback(
            order.device.imei2
          )}
        />

        <DetailItem
          label={t(
            "orderDetails.fields.serialNumber"
          )}
          value={textOrFallback(
            order.device.serial
          )}
          wide
        />
      </DetailsSection>

      <DetailsSection
        title={t(
          "orderDetails.sections.intake"
        )}
        icon={
          <IntakeIcon />
        }
        fullWidth
      >
        <DetailItem
          label={t(
            "orderDetails.fields.reportedProblem"
          )}
          value={textOrFallback(
            order.problem
          )}
          preserveWhitespace
          wide
        />

        <DetailItem
          label={t(
            "orderDetails.fields.deviceCondition"
          )}
          value={textOrFallback(
            order.deviceCondition
          )}
          preserveWhitespace
        />

        <DetailItem
          label={t(
            "orderDetails.fields.accessories"
          )}
          value={textOrFallback(
            order.accessories
          )}
          preserveWhitespace
        />

        <DetailItem
          label={t(
            "orderDetails.fields.deviceAccess"
          )}
          value={
            <AccessCodeReveal
              orderId={order.id}
              accessType={
                order.accessType
              }
              hasAccessCode={
                Boolean(
                  order.hasAccessCode
                )
              }
              description={
                getAccessDescription()
              }
            />
          }
          wide
        />
      </DetailsSection>

      <DetailsSection
        title={t(
          "orderDetails.sections.repair"
        )}
        icon={
          <RepairIcon />
        }
        fullWidth
      >
        <DetailItem
          label={t(
            "orderDetails.fields.diagnosis"
          )}
          value={textOrFallback(
            order.diagnosis
          )}
          preserveWhitespace
          wide
        />

        <DetailItem
          label={t(
            "orderDetails.fields.workPerformed"
          )}
          value={textOrFallback(
            order.workPerformed
          )}
          preserveWhitespace
          wide
        />

        <DetailItem
          label={t(
            "orderDetails.fields.internalNote"
          )}
          value={textOrFallback(
            order.internalNote
          )}
          preserveWhitespace
          wide
          highlighted
        />
      </DetailsSection>

      <DetailsSection
        title={t(
          "orderDetails.sections.price"
        )}
        icon={
          <PriceIcon />
        }
      >
        <DetailItem
          label={t(
            "orderDetails.fields.estimatedPrice"
          )}
          value={formatPrice(
            estimatedPrice
          )}
        />

        <DetailItem
          label={t(
            "orderDetails.fields.finalPrice"
          )}
          value={formatPrice(
            order.finalPrice
          )}
        />
      </DetailsSection>

      <DetailsSection
        title={t(
          "orderDetails.sections.timeline"
        )}
        icon={
          <TimelineIcon />
        }
      >
        <DetailItem
          label={t(
            "orderDetails.fields.created"
          )}
          value={formatDateTime(
            order.createdAt
          )}
        />

        <DetailItem
          label={t(
            "orderDetails.fields.lastUpdated"
          )}
          value={formatDateTime(
            order.updatedAt
          )}
        />

        <DetailItem
          label={t(
            "orderDetails.fields.received"
          )}
          value={formatDateTime(
            order.receivedAt ??
              order.createdAt
          )}
        />

        <DetailItem
          label={t(
            "orderDetails.fields.dueDate"
          )}
          value={formatDateTime(
            order.dueAt
          )}
        />

        <DetailItem
          label={t(
            "orderDetails.fields.completed"
          )}
          value={formatDateTime(
            order.completedAt
          )}
        />

        <DetailItem
          label={
            deliveredLabel
          }
          value={formatDateTime(
            order.deliveredAt
          )}
        />
      </DetailsSection>
    </Box>
  );
};

export default OrderDetailsContent;
