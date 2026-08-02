import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowBackOutlined as BackIcon,
  AssignmentOutlined as OrderIcon,
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
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router";

import RepairHistory from "features/shared/RepairHistory";
import useAppFormatters from "hooks/useAppFormatters";
import { getDevice } from "index";
import type { Device } from "types";

const parseId = (value: string | undefined): number | null => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const DeviceDetailsPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { formatDate } = useAppFormatters();
  const deviceId = parseId(id);

  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (): Promise<void> => {
    if (!deviceId) {
      setError(t("profilePages.errors.invalidDevice"));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setDevice(await getDevice(deviceId));
    } catch (requestError: unknown) {
      console.error("Device profile load failed:", requestError);
      setError(t("profilePages.errors.deviceLoad"));
    } finally {
      setLoading(false);
    }
  }, [deviceId, t]);

  useEffect(() => {
    void load();
  }, [load]);

  const orders = useMemo(() => device?.orders ?? [], [device?.orders]);
  const active = orders.filter(
    (order) => order.status === "pending" || order.status === "in_progress"
  ).length;

  if (loading) {
    return <Box sx={{ minHeight: 360, display: "grid", placeItems: "center" }}><CircularProgress /></Box>;
  }

  if (!device || error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={2}>
          <Button component={Link} to="/devices" startIcon={<BackIcon />} sx={{ alignSelf: "flex-start" }}>
            {t("profilePages.actions.backToDevices")}
          </Button>
          <Alert severity="error" action={deviceId ? (
            <Button color="inherit" size="small" onClick={() => void load()}>
              {t("profilePages.actions.retry")}
            </Button>
          ) : undefined}>
            {error ?? t("profilePages.errors.deviceLoad")}
          </Alert>
        </Stack>
      </Container>
    );
  }

  const identifiers = [
    [t("profilePages.fields.imei1"), device.imei1 ?? "-"],
    [t("profilePages.fields.imei2"), device.imei2 ?? "-"],
    [t("profilePages.fields.serial"), device.serial ?? "-"],
    [t("profilePages.fields.color"), device.color ?? "-"],
  ];

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      <Stack spacing={3}>
        <Button component={Link} to="/devices" startIcon={<BackIcon />} sx={{ alignSelf: "flex-start" }}>
          {t("profilePages.actions.backToDevices")}
        </Button>

        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="overline" color="text.secondary">{t("profilePages.deviceProfile")}</Typography>
              <Typography variant="h4" component="h1">{device.brand} {device.model}</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                <Chip label={t(`devicesPage.deviceTypes.${device.deviceType}`)} />
                {device.color && <Chip variant="outlined" label={device.color} />}
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {t("profilePages.deviceSince", { date: formatDate(device.createdAt) })}
              </Typography>
            </Box>
            <Button component={Link} to="/orders" variant="contained" startIcon={<OrderIcon />}>
              {t("profilePages.actions.newRepair")}
            </Button>
          </Stack>
        </Paper>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3,1fr)" }, gap: 2 }}>
          {[
            [t("profilePages.stats.repairs"), orders.length],
            [t("profilePages.stats.activeRepairs"), active],
            [t("profilePages.stats.lastRepair"), orders[0] ? formatDate(orders[0].receivedAt ?? orders[0].createdAt) : "-"],
          ].map(([label, value]) => (
            <Card key={String(label)} variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.secondary">{label}</Typography>
                <Typography variant="h5" sx={{ mt: 0.5 }}>{value}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(280px,.8fr) minmax(0,1.8fr)" }, gap: 3, alignItems: "start" }}>
          <Stack spacing={3}>
            <Paper variant="outlined" sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>{t("profilePages.owner")}</Typography>
              {device.client ? (
                <Button
                  component={Link}
                  to={`/clients/${device.client.id}`}
                  variant="outlined"
                  fullWidth
                  sx={{ justifyContent: "flex-start", textTransform: "none", py: 1.5 }}
                >
                  <Box sx={{ textAlign: "left" }}>
                    <Typography fontWeight={600}>{device.client.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{device.client.phone}</Typography>
                  </Box>
                </Button>
              ) : (
                <Typography color="text.secondary">{t("profilePages.unknownClient")}</Typography>
              )}
            </Paper>

            <Paper variant="outlined" sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>{t("profilePages.identifiers")}</Typography>
              <Stack spacing={1.5}>
                {identifiers.map(([label, value]) => (
                  <Box key={String(label)}>
                    <Typography variant="caption" color="text.secondary">{label}</Typography>
                    <Typography sx={{ overflowWrap: "anywhere" }}>{value}</Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Stack>

          <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 } }}>
            <Typography variant="h6" sx={{ mb: 1 }}>{t("profilePages.repairHistory")}</Typography>
            <RepairHistory orders={orders} />
          </Paper>
        </Box>
      </Stack>
    </Container>
  );
};

export default DeviceDetailsPage;
