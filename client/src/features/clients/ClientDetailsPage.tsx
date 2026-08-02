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
  CardActionArea,
  CardContent,
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
import { getClient } from "index";
import type { Client } from "types";

const parseId = (value: string | undefined): number | null => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const ClientDetailsPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { formatDate, formatPrice } = useAppFormatters();
  const clientId = parseId(id);

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (): Promise<void> => {
    if (!clientId) {
      setError(t("profilePages.errors.invalidClient"));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setClient(await getClient(clientId));
    } catch (requestError: unknown) {
      console.error("Client profile load failed:", requestError);
      setError(t("profilePages.errors.clientLoad"));
    } finally {
      setLoading(false);
    }
  }, [clientId, t]);

  useEffect(() => {
    void load();
  }, [load]);

  const devices = useMemo(() => client?.devices ?? [], [client?.devices]);
  const orders = useMemo(() => client?.orders ?? [], [client?.orders]);
  const active = orders.filter(
    (order) => order.status === "pending" || order.status === "in_progress"
  ).length;
  const income = orders
    .filter(
      (order) =>
        order.status ===
        "completed"
    )
    .reduce(
      (
        sum,
        order
      ) =>
        sum +
        Number(
          order.finalPrice ??
            0
        ),
      0
    );

  if (loading) {
    return <Box sx={{ minHeight: 360, display: "grid", placeItems: "center" }}><CircularProgress /></Box>;
  }

  if (!client || error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={2}>
          <Button component={Link} to="/clients" startIcon={<BackIcon />} sx={{ alignSelf: "flex-start" }}>
            {t("profilePages.actions.backToClients")}
          </Button>
          <Alert severity="error" action={clientId ? (
            <Button color="inherit" size="small" onClick={() => void load()}>
              {t("profilePages.actions.retry")}
            </Button>
          ) : undefined}>
            {error ?? t("profilePages.errors.clientLoad")}
          </Alert>
        </Stack>
      </Container>
    );
  }

  const info = [
    [t("profilePages.fields.phone"), client.phone],
    [t("profilePages.fields.secondaryPhone"), client.secondaryPhone ?? "-"],
    [t("profilePages.fields.email"), client.email ?? "-"],
    [t("profilePages.fields.address"), client.address ?? "-"],
    [t("profilePages.fields.note"), client.note ?? "-"],
  ];

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      <Stack spacing={3}>
        <Button component={Link} to="/clients" startIcon={<BackIcon />} sx={{ alignSelf: "flex-start" }}>
          {t("profilePages.actions.backToClients")}
        </Button>

        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            justifyContent="space-between"
            alignItems={{
              xs: "stretch",
              md: "center",
            }}
            spacing={2}
          >
            <Box>
              <Typography variant="overline" color="text.secondary">
                {t("profilePages.clientProfile")}
              </Typography>
              <Typography variant="h4" component="h1">{client.name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {t("profilePages.clientSince", { date: formatDate(client.createdAt) })}
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/orders"
              variant="contained"
              startIcon={
                <OrderIcon />
              }
              sx={{
                alignSelf: {
                  xs: "stretch",
                  md: "center",
                },
                minHeight: 40,
                px: 2.5,
                flexShrink: 0,
                whiteSpace:
                  "nowrap",
              }}
            >
              {t(
                "profilePages.actions.newRepair"
              )}
            </Button>
          </Stack>
        </Paper>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", lg: "repeat(4,1fr)" }, gap: 2 }}>
          {[
            [t("profilePages.stats.devices"), devices.length],
            [t("profilePages.stats.repairs"), orders.length],
            [t("profilePages.stats.activeRepairs"), active],
            [t("profilePages.stats.completedIncome"), formatPrice(income)],
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
              <Typography variant="h6" sx={{ mb: 2 }}>{t("profilePages.contactInformation")}</Typography>
              <Stack spacing={1.5}>
                {info.map(([label, value]) => (
                  <Box key={String(label)}>
                    <Typography variant="caption" color="text.secondary">{label}</Typography>
                    <Typography sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{value}</Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>{t("profilePages.clientDevices")}</Typography>
              {devices.length === 0 ? (
                <Typography color="text.secondary">{t("profilePages.empty.devices")}</Typography>
              ) : (
                <Stack spacing={1.5}>
                  {devices.map((device) => (
                    <Card key={device.id} variant="outlined">
                      <CardActionArea component={Link} to={`/devices/${device.id}`}>
                        <CardContent>
                          <Typography fontWeight={600}>{device.brand} {device.model}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {[device.imei1, device.serial, device.color].filter(Boolean).join(" • ") || t("profilePages.noIdentifier")}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  ))}
                </Stack>
              )}
            </Paper>
          </Stack>

          <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 } }}>
            <Typography variant="h6" sx={{ mb: 1 }}>{t("profilePages.repairHistory")}</Typography>
            <RepairHistory orders={orders} showDevice />
          </Paper>
        </Box>
      </Stack>
    </Container>
  );
};

export default ClientDetailsPage;
