import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Add as AddIcon,
  ColorLensOutlined as ColorIcon,
  DevicesOutlined as DeviceIcon,
  LockOutlined as LockIcon,
  PersonOutline as PersonIcon,
  PhoneIphoneOutlined as PhoneIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  ButtonBase,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import {
  getDevicesByClient,
  searchClients,
} from "index";
import type {
  Client,
  Device,
  DeviceType,
} from "types";

import DeviceModelPicker from "./DeviceModelPicker";
import type { DeviceModelCatalogItem } from "./deviceModelApi";
import IntakeSectionCard from "./IntakeSectionCard";
import {
  accessTypeOptions,
  deviceTypeOptions,
} from "./intakeWizardConfig";

type AccessType =
  (typeof accessTypeOptions)[number]["value"];

interface ClientFields {
  name: string;
  phone: string;
  secondaryPhone: string;
  email: string;
  address: string;
  note: string;
}

interface DeviceFields {
  deviceType: DeviceType;
  brand: string;
  model: string;
  color: string;
  imei1: string;
  imei2: string;
  serial: string;
}

export interface CustomerDeviceDraft {
  selectedClient: Client | null;
  selectedDevice: Device | null;
  selectedCatalogModel: DeviceModelCatalogItem | null;
  availableDevices: Device[];
  client: ClientFields;
  device: DeviceFields;
  accessType: AccessType;
  accessCode: string;
  accessVerified: boolean;
}

interface CustomerDeviceStepProps {
  draft: CustomerDeviceDraft;
  onChange: (next: CustomerDeviceDraft) => void;
}

const emptyClientFields: ClientFields = {
  name: "",
  phone: "",
  secondaryPhone: "",
  email: "",
  address: "",
  note: "",
};

const emptyDeviceFields: DeviceFields = {
  deviceType: "phone",
  brand: "",
  model: "",
  color: "",
  imei1: "",
  imei2: "",
  serial: "",
};

export const initialCustomerDeviceDraft: CustomerDeviceDraft = {
  selectedClient: null,
  selectedDevice: null,
  selectedCatalogModel: null,
  availableDevices: [],
  client: emptyClientFields,
  device: emptyDeviceFields,
  accessType: "none",
  accessCode: "",
  accessVerified: false,
};

const clientToFields = (client: Client): ClientFields => ({
  name: client.name,
  phone: client.phone,
  secondaryPhone: client.secondaryPhone ?? "",
  email: client.email ?? "",
  address: client.address ?? "",
  note: client.note ?? "",
});

const deviceToFields = (device: Device): DeviceFields => ({
  deviceType: device.deviceType,
  brand: device.brand,
  model: device.model,
  color: device.color ?? "",
  imei1: device.imei1 ?? "",
  imei2: device.imei2 ?? "",
  serial: device.serial ?? "",
});

const getDeviceIdentifier = (device: Device): string =>
  device.imei1 ?? device.serial ?? device.imei2 ?? "—";

const PatternPreview = () => {
  const { t } = useTranslation();
  const selected = new Set([0, 3, 6, 4]);

  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, bgcolor: "grey.50" }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {t("intakeWizard.access.patternTitle")}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 46px)",
          gap: 2.25,
          width: "fit-content",
          mb: 2,
        }}
      >
        {Array.from({ length: 9 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: "2px solid",
              borderColor: selected.has(index) ? "primary.main" : "grey.400",
              bgcolor: selected.has(index) ? "primary.50" : "background.paper",
              display: "grid",
              placeItems: "center",
            }}
          >
            {selected.has(index) && (
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                }}
              />
            )}
          </Box>
        ))}
      </Box>

      <Button size="small" startIcon={<ColorIcon />}>
        {t("intakeWizard.actions.clearPattern")}
      </Button>
    </Paper>
  );
};

const CustomerDeviceStep = ({
  draft,
  onChange,
}: CustomerDeviceStepProps) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [clientOptions, setClientOptions] = useState<Client[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [devicesError, setDevicesError] = useState(false);
  const requestSequence = useRef(0);

  useEffect(() => {
    const query = searchQuery.trim();
    const requestId = ++requestSequence.current;

    if (query.length < 2 || draft.selectedClient) {
      setClientOptions([]);
      setSearching(false);
      setSearchError(false);
      return;
    }

    setSearching(true);
    setSearchError(false);

    const timeoutId = window.setTimeout(() => {
      void searchClients(query)
        .then((clients) => {
          if (requestSequence.current === requestId) {
            setClientOptions(clients);
          }
        })
        .catch(() => {
          if (requestSequence.current === requestId) {
            setClientOptions([]);
            setSearchError(true);
          }
        })
        .finally(() => {
          if (requestSequence.current === requestId) {
            setSearching(false);
          }
        });
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [draft.selectedClient, searchQuery]);

  const updateClientField = <K extends keyof ClientFields>(
    field: K,
    value: ClientFields[K]
  ) => {
    onChange({
      ...draft,
      client: { ...draft.client, [field]: value },
    });
  };

  const updateDeviceField = <K extends keyof DeviceFields>(
    field: K,
    value: DeviceFields[K]
  ) => {
    const clearsCatalogSelection = ["deviceType", "brand", "model"].includes(field);

    onChange({
      ...draft,
      selectedCatalogModel: clearsCatalogSelection
        ? null
        : draft.selectedCatalogModel,
      device: { ...draft.device, [field]: value },
    });
  };

  const selectClient = async (client: Client) => {
    const clientId = client.id;
    let devices = client.devices ?? [];

    setDevicesError(false);

    if (clientId && client.devices === undefined) {
      setDevicesLoading(true);

      try {
        devices = await getDevicesByClient(clientId);
      } catch {
        setDevicesError(true);
      } finally {
        setDevicesLoading(false);
      }
    }

    setSearchQuery(`${client.name} · ${client.phone}`);
    onChange({
      ...draft,
      selectedClient: client,
      selectedDevice: null,
      selectedCatalogModel: null,
      availableDevices: devices,
      client: clientToFields(client),
      device: emptyDeviceFields,
    });
  };

  const clearClientSelection = () => {
    setSearchQuery("");
    setClientOptions([]);
    setDevicesError(false);
    onChange({
      ...draft,
      selectedClient: null,
      selectedDevice: null,
      selectedCatalogModel: null,
      availableDevices: [],
      client: emptyClientFields,
      device: emptyDeviceFields,
    });
  };

  const selectDevice = (device: Device) => {
    onChange({
      ...draft,
      selectedDevice: device,
      selectedCatalogModel: null,
      device: deviceToFields(device),
    });
  };

  const clearDeviceSelection = () => {
    onChange({
      ...draft,
      selectedDevice: null,
      selectedCatalogModel: null,
      device: emptyDeviceFields,
    });
  };

  const selectCatalogModel = (model: DeviceModelCatalogItem) => {
    onChange({
      ...draft,
      selectedDevice: null,
      selectedCatalogModel: model,
      device: {
        ...draft.device,
        deviceType: model.deviceType,
        brand: model.brand,
        model: model.model,
      },
    });
  };

  const existingClientSelected = Boolean(draft.selectedClient);
  const existingDeviceSelected = Boolean(draft.selectedDevice);

  return (
    <Stack spacing={3}>
      <IntakeSectionCard
        icon={<PersonIcon />}
        title={t("intakeWizard.customer.title")}
        subtitle={t("intakeWizard.customer.subtitle")}
      >
        <Stack spacing={2}>
          <Autocomplete
            options={clientOptions}
            value={draft.selectedClient}
            inputValue={searchQuery}
            loading={searching}
            filterOptions={(options) => options}
            getOptionLabel={(option) => `${option.name} · ${option.phone}`}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onInputChange={(_, value, reason) => {
              if (reason !== "reset") {
                setSearchQuery(value);
              }
            }}
            onChange={(_, client) => {
              if (client) {
                void selectClient(client);
              }
            }}
            noOptionsText={
              searchQuery.trim().length < 2
                ? t("intakeRuntime.customerSearch.hint")
                : t("intakeRuntime.customerSearch.noResults")
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("intakeRuntime.customerSearch.label")}
                placeholder={t("intakeRuntime.customerSearch.placeholder")}
                helperText={t("intakeRuntime.customerSearch.hint")}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                    endAdornment: (
                      <>
                        {searching && <CircularProgress size={18} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  },
                }}
              />
            )}
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;

              return (
                <Box
                  component="li"
                  key={key}
                  {...optionProps}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 150px 1.2fr" },
                    gap: 1,
                  }}
                >
                  <Typography variant="body2" fontWeight={700}>
                    {option.name}
                  </Typography>
                  <Typography variant="caption" color="primary.main">
                    {option.phone}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {option.email ?? "—"}
                  </Typography>
                </Box>
              );
            }}
          />

          {searchError && (
            <Alert severity="error">{t("intakeRuntime.customerSearch.error")}</Alert>
          )}

          {existingClientSelected && (
            <Alert
              severity="success"
              action={
                <Button color="inherit" size="small" onClick={clearClientSelection}>
                  {t("intakeRuntime.customerSearch.change")}
                </Button>
              }
            >
              {t("intakeRuntime.customerSearch.selected")}: {" "}
              <strong>{draft.selectedClient?.name}</strong>
            </Alert>
          )}

          {!existingClientSelected && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={clearClientSelection}
              sx={{ alignSelf: "flex-start" }}
            >
              {t("intakeRuntime.customerSearch.useNew")}
            </Button>
          )}

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <TextField
                label={t("intakeWizard.customer.fullName")}
                value={draft.client.name}
                onChange={(event) => updateClientField("name", event.target.value)}
                disabled={existingClientSelected}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <TextField
                label={t("intakeWizard.customer.phone")}
                value={draft.client.phone}
                onChange={(event) => updateClientField("phone", event.target.value)}
                disabled={existingClientSelected}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label={t("intakeWizard.customer.secondaryPhone")}
                value={draft.client.secondaryPhone}
                onChange={(event) =>
                  updateClientField("secondaryPhone", event.target.value)
                }
                disabled={existingClientSelected}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label={t("intakeWizard.customer.email")}
                value={draft.client.email}
                onChange={(event) => updateClientField("email", event.target.value)}
                disabled={existingClientSelected}
                type="email"
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label={t("intakeWizard.customer.address")}
                value={draft.client.address}
                onChange={(event) => updateClientField("address", event.target.value)}
                disabled={existingClientSelected}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label={t("intakeWizard.customer.note")}
                value={draft.client.note}
                onChange={(event) => updateClientField("note", event.target.value)}
                disabled={existingClientSelected}
                multiline
                minRows={2}
                fullWidth
              />
            </Grid>
          </Grid>
        </Stack>
      </IntakeSectionCard>

      {existingClientSelected && (
        <IntakeSectionCard
          icon={<DeviceIcon />}
          title={t("intakeRuntime.devices.title")}
          subtitle={t("intakeRuntime.devices.hint")}
        >
          <Stack spacing={2}>
            {devicesLoading && (
              <Alert icon={<CircularProgress size={18} />} severity="info">
                {t("intakeRuntime.devices.loading")}
              </Alert>
            )}
            {devicesError && (
              <Alert severity="error">{t("intakeRuntime.devices.error")}</Alert>
            )}
            {!devicesLoading && draft.availableDevices.length === 0 && (
              <Alert severity="info">{t("intakeRuntime.devices.empty")}</Alert>
            )}

            {draft.availableDevices.length > 0 && (
              <Grid container spacing={2}>
                {draft.availableDevices.map((device) => {
                  const selected = draft.selectedDevice?.id === device.id;

                  return (
                    <Grid
                      key={device.id ?? `${device.brand}-${device.model}`}
                      size={{ xs: 12, sm: 6, lg: 4 }}
                    >
                      <ButtonBase
                        onClick={() => selectDevice(device)}
                        sx={{
                          width: "100%",
                          textAlign: "left",
                          border: "1px solid",
                          borderColor: selected ? "primary.main" : "divider",
                          bgcolor: selected ? "action.selected" : "background.paper",
                          borderRadius: 3,
                          p: 2,
                        }}
                      >
                        <Stack spacing={0.75}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <PhoneIcon color={selected ? "primary" : "inherit"} />
                            <Typography fontWeight={800}>
                              {device.brand} {device.model}
                            </Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            {t("intakeRuntime.devices.identifier")}: {getDeviceIdentifier(device)}
                          </Typography>
                          {device.color && (
                            <Chip size="small" label={device.color} sx={{ alignSelf: "flex-start" }} />
                          )}
                        </Stack>
                      </ButtonBase>
                    </Grid>
                  );
                })}
              </Grid>
            )}

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={clearDeviceSelection}
              sx={{ alignSelf: "flex-start" }}
            >
              {t("intakeRuntime.devices.useNew")}
            </Button>

            {existingDeviceSelected && (
              <Alert
                severity="success"
                action={
                  <Button color="inherit" size="small" onClick={clearDeviceSelection}>
                    {t("intakeRuntime.devices.change")}
                  </Button>
                }
              >
                {t("intakeRuntime.devices.selected")}: {" "}
                <strong>
                  {draft.selectedDevice?.brand} {draft.selectedDevice?.model}
                </strong>
              </Alert>
            )}
          </Stack>
        </IntakeSectionCard>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <IntakeSectionCard
            icon={<SearchIcon />}
            title={t("intakeWizard.device.modelSearch")}
          >
            <DeviceModelPicker
              value={draft.selectedCatalogModel}
              onSelect={selectCatalogModel}
            />
          </IntakeSectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            <IntakeSectionCard
              icon={<DeviceIcon />}
              title={t("intakeWizard.device.title")}
              subtitle={t("intakeWizard.device.subtitle")}
            >
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    select
                    label={t("intakeWizard.device.type")}
                    value={draft.device.deviceType}
                    onChange={(event) =>
                      updateDeviceField("deviceType", event.target.value as DeviceType)
                    }
                    disabled={existingDeviceSelected}
                    fullWidth
                    required
                  >
                    {deviceTypeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {t(option.labelKey)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    label={t("intakeWizard.device.brand")}
                    value={draft.device.brand}
                    onChange={(event) => updateDeviceField("brand", event.target.value)}
                    disabled={existingDeviceSelected}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    label={t("intakeWizard.device.model")}
                    value={draft.device.model}
                    onChange={(event) => updateDeviceField("model", event.target.value)}
                    disabled={existingDeviceSelected}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    label={t("intakeWizard.device.color")}
                    value={draft.device.color}
                    onChange={(event) => updateDeviceField("color", event.target.value)}
                    disabled={existingDeviceSelected}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    label={t("intakeWizard.device.imei1")}
                    value={draft.device.imei1}
                    onChange={(event) => updateDeviceField("imei1", event.target.value)}
                    disabled={existingDeviceSelected}
                    helperText={t("intakeWizard.device.imeiHint")}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    label={t("intakeWizard.device.imei2")}
                    value={draft.device.imei2}
                    onChange={(event) => updateDeviceField("imei2", event.target.value)}
                    disabled={existingDeviceSelected}
                    helperText={t("intakeWizard.device.imeiHint")}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label={t("intakeWizard.device.serial")}
                    value={draft.device.serial}
                    onChange={(event) => updateDeviceField("serial", event.target.value)}
                    disabled={existingDeviceSelected}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </IntakeSectionCard>

            <IntakeSectionCard
              icon={<LockIcon />}
              title={t("intakeWizard.access.title")}
              subtitle={t("intakeWizard.access.subtitle")}
            >
              <Grid container spacing={2} alignItems="flex-start">
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    select
                    label={t("intakeWizard.access.type")}
                    value={draft.accessType}
                    onChange={(event) => {
                      onChange({
                        ...draft,
                        accessType: event.target.value as AccessType,
                        accessCode: "",
                      });
                    }}
                    fullWidth
                    required
                  >
                    {accessTypeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {t(option.labelKey)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    label={t("intakeWizard.access.code")}
                    value={draft.accessCode}
                    onChange={(event) => {
                      onChange({ ...draft, accessCode: event.target.value });
                    }}
                    disabled={["none", "unknown"].includes(draft.accessType)}
                    type={draft.accessType === "password" ? "password" : "text"}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={draft.accessVerified}
                        onChange={(event) => {
                          onChange({ ...draft, accessVerified: event.target.checked });
                        }}
                      />
                    }
                    label={t("intakeWizard.access.verified")}
                    sx={{ mt: 0.75 }}
                  />
                </Grid>
                {draft.accessType === "pattern" && (
                  <Grid size={{ xs: 12 }}>
                    <PatternPreview />
                  </Grid>
                )}
              </Grid>
            </IntakeSectionCard>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default CustomerDeviceStep;
