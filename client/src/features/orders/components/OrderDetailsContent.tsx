import {
  Box,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";

import { Order } from "types";
import {
  formatDateTime,
  formatPrice,
} from "utils/formatters";

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
          overflowWrap: "anywhere",
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

const textOrDash = (
  value?: string | null
): string => {
  const normalized =
    value?.trim();

  return normalized || "-";
};

const formatDeviceType = (
  value: string
): string => {
  return value
    .replace(/_/g, " ")
    .replace(
      /^./,
      (character) =>
        character.toUpperCase()
    );
};

const getAccessDescription = (
  order: Order
): string => {
  switch (order.accessType) {
    case "pin":
      return order.hasAccessCode
        ? "PIN provided"
        : "PIN not provided";

    case "password":
      return order.hasAccessCode
        ? "Password provided"
        : "Password not provided";

    case "pattern":
      return order.hasAccessCode
        ? "Pattern provided"
        : "Pattern not provided";

    case "unknown":
      return "Unknown";

    case "none":
    default:
      return "No access code";
  }
};

const OrderDetailsContent = ({
  order,
}: {
  order: Order;
}) => {
  const estimatedPrice =
    order.estimatedPrice ??
    order.price;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "repeat(2, minmax(0, 1fr))",
        },
        gap: 2,
      }}
    >
      <DetailsSection title="Client">
        <DetailItem
          label="Name"
          value={
            order.client?.name ??
            `Client #${order.clientId}`
          }
        />

        <DetailItem
          label="Phone"
          value={textOrDash(
            order.client?.phone
          )}
        />

        <DetailItem
          label="Secondary Phone"
          value={textOrDash(
            order.client
              ?.secondaryPhone
          )}
        />

        <DetailItem
          label="Email"
          value={textOrDash(
            order.client?.email
          )}
        />

        <DetailItem
          label="Address"
          value={textOrDash(
            order.client?.address
          )}
        />

        <DetailItem
          label="Client Note"
          value={textOrDash(
            order.client?.note
          )}
          preserveWhitespace
        />
      </DetailsSection>

      <DetailsSection title="Device">
        <DetailItem
          label="Device Type"
          value={formatDeviceType(
            order.device.deviceType
          )}
        />

        <DetailItem
          label="Brand"
          value={textOrDash(
            order.device.brand
          )}
        />

        <DetailItem
          label="Model"
          value={textOrDash(
            order.device.model
          )}
        />

        <DetailItem
          label="Color"
          value={textOrDash(
            order.device.color
          )}
        />

        <DetailItem
          label="IMEI 1"
          value={textOrDash(
            order.device.imei1
          )}
        />

        <DetailItem
          label="IMEI 2"
          value={textOrDash(
            order.device.imei2
          )}
        />

        <DetailItem
          label="Serial Number"
          value={textOrDash(
            order.device.serial
          )}
        />
      </DetailsSection>

      <DetailsSection title="Intake">
        <DetailItem
          label="Reported Problem"
          value={textOrDash(
            order.problem
          )}
          preserveWhitespace
        />

        <DetailItem
          label="Device Condition"
          value={textOrDash(
            order.deviceCondition
          )}
          preserveWhitespace
        />

        <DetailItem
          label="Accessories"
          value={textOrDash(
            order.accessories
          )}
          preserveWhitespace
        />

        <DetailItem
          label="Device Access"
          value={getAccessDescription(
            order
          )}
        />

        <DetailItem
          label="Received"
          value={formatDateTime(
            order.receivedAt ??
            order.createdAt
          )}
        />

        <DetailItem
          label="Due Date"
          value={formatDateTime(
            order.dueAt
          )}
        />
      </DetailsSection>

      <DetailsSection title="Repair">
        <DetailItem
          label="Diagnosis"
          value={textOrDash(
            order.diagnosis
          )}
          preserveWhitespace
        />

        <DetailItem
          label="Work Performed"
          value={textOrDash(
            order.workPerformed
          )}
          preserveWhitespace
        />

        <DetailItem
          label="Internal Note"
          value={textOrDash(
            order.internalNote
          )}
          preserveWhitespace
        />
      </DetailsSection>

      <DetailsSection title="Price">
        <DetailItem
          label="Estimated Price"
          value={formatPrice(
            estimatedPrice
          )}
        />

        <DetailItem
          label="Final Price"
          value={formatPrice(
            order.finalPrice
          )}
        />
      </DetailsSection>

      <DetailsSection title="Timeline">
        <DetailItem
          label="Created"
          value={formatDateTime(
            order.createdAt
          )}
        />

        <DetailItem
          label="Last Updated"
          value={formatDateTime(
            order.updatedAt
          )}
        />

        <DetailItem
          label="Completed"
          value={formatDateTime(
            order.completedAt
          )}
        />

        <DetailItem
          label="Delivered"
          value={formatDateTime(
            order.deliveredAt
          )}
        />
      </DetailsSection>
    </Box>
  );
};

export default OrderDetailsContent;