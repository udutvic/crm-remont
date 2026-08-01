import {
  ReactNode,
} from "react";
import {
  Box,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

import useAppFormatters from "hooks/useAppFormatters";
import {
  Order,
} from "types";

interface DetailItemProps {
  label: string;
  value: ReactNode;
  preserveWhitespace?: boolean;
}

interface DetailsSectionProps {
  title: string;
  children: ReactNode;
}

const DetailItem = ({
  label,
  value,
  preserveWhitespace = false,
}: DetailItemProps) => {
  return (
    <Box>
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{
          display: "block",
          lineHeight: 1.5,
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
  children,
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
      }}
    >
      <Typography
        variant="h6"
        component="h2"
      >
        {title}
      </Typography>

      <Divider
        sx={{
          my: 2,
        }}
      />

      <Stack spacing={2}>
        {children}
      </Stack>
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
      normalized ??
      notAvailable
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

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md:
            "repeat(2, minmax(0, 1fr))",
        },
        gap: 2,
      }}
    >
      <DetailsSection
        title={t(
          "orderDetails.sections.client"
        )}
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
          value={textOrFallback(
            order.client?.phone
          )}
        />

        <DetailItem
          label={t(
            "orderDetails.fields.secondaryPhone"
          )}
          value={textOrFallback(
            order.client
              ?.secondaryPhone
          )}
        />

        <DetailItem
          label={t(
            "orderDetails.fields.email"
          )}
          value={textOrFallback(
            order.client?.email
          )}
        />

        <DetailItem
          label={t(
            "orderDetails.fields.address"
          )}
          value={textOrFallback(
            order.client?.address
          )}
        />

        <DetailItem
          label={t(
            "orderDetails.fields.clientNote"
          )}
          value={textOrFallback(
            order.client?.note
          )}
          preserveWhitespace
        />
      </DetailsSection>

      <DetailsSection
        title={t(
          "orderDetails.sections.device"
        )}
      >
        <DetailItem
          label={t(
            "orderDetails.fields.deviceType"
          )}
          value={deviceType}
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
            "orderDetails.fields.color"
          )}
          value={textOrFallback(
            order.device.color
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
        />
      </DetailsSection>

      <DetailsSection
        title={t(
          "orderDetails.sections.intake"
        )}
      >
        <DetailItem
          label={t(
            "orderDetails.fields.reportedProblem"
          )}
          value={textOrFallback(
            order.problem
          )}
          preserveWhitespace
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
            getAccessDescription()
          }
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
      </DetailsSection>

      <DetailsSection
        title={t(
          "orderDetails.sections.repair"
        )}
      >
        <DetailItem
          label={t(
            "orderDetails.fields.diagnosis"
          )}
          value={textOrFallback(
            order.diagnosis
          )}
          preserveWhitespace
        />

        <DetailItem
          label={t(
            "orderDetails.fields.workPerformed"
          )}
          value={textOrFallback(
            order.workPerformed
          )}
          preserveWhitespace
        />

        <DetailItem
          label={t(
            "orderDetails.fields.internalNote"
          )}
          value={textOrFallback(
            order.internalNote
          )}
          preserveWhitespace
        />
      </DetailsSection>

      <DetailsSection
        title={t(
          "orderDetails.sections.price"
        )}
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
            "orderDetails.fields.completed"
          )}
          value={formatDateTime(
            order.completedAt
          )}
        />

        <DetailItem
          label={t(
            "orderDetails.fields.delivered"
          )}
          value={formatDateTime(
            order.deliveredAt
          )}
        />
      </DetailsSection>
    </Box>
  );
};

export default OrderDetailsContent;