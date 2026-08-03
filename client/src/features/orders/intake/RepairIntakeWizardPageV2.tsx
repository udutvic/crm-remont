import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  BatteryChargingFullOutlined as BatteryIcon,
  BuildOutlined as BuildIcon,
  CameraAltOutlined as CameraIcon,
  CheckCircleOutline as CheckIcon,
  CleaningServicesOutlined as CleaningIcon,
  ColorLensOutlined as ColorIcon,
  DeleteOutline as DeleteIcon,
  DevicesOutlined as DeviceIcon,
  Inventory2Outlined as InventoryIcon,
  LockOutlined as LockIcon,
  PersonOutline as PersonIcon,
  PhoneIphoneOutlined as PhoneIcon,
  Search as SearchIcon,
  WarningAmberOutlined as WarningIcon,
} from "@mui/icons-material";
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  ButtonBase,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Step,
  StepButton,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

import {
  getDevicesByClient,
  searchClients,
} from "index";
import type {
  Client,
  Device,
  DeviceType,
} from "types";

import {
  accessTypeOptions,
  additionalIssueKeys,
  approvalOptions,
  batteryOptions,
  communicationOptions,
  contaminationKeys,
  deviceTypeOptions,
  durationOptions,
  inspectionGroups,
  intakeStepKeys,
  overallConditionOptions,
  repairRiskKeys,
  repairTypeOptions,
  reviewSections,
  sampleModelNames,
} from "./intakeWizardConfig";

interface SectionCardProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

type AccessType =
  (typeof accessTypeOptions)[number]["value"];

type InspectionGroupId =
  (typeof inspectionGroups)[number]["id"];

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

interface CustomerDeviceDraft {
  selectedClient: Client | null;
  selectedDevice: Device | null;
  availableDevices: Device[];
  client: ClientFields;
  device: DeviceFields;
  accessType: AccessType;
  accessCode: string;
  accessVerified: boolean;
}

interface CustomerDeviceStepProps {
  draft: CustomerDeviceDraft;
  onChange: (
    next: CustomerDeviceDraft
  ) => void;
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

const initialCustomerDeviceDraft: CustomerDeviceDraft = {
  selectedClient: null,
  selectedDevice: null,
  availableDevices: [],
  client: emptyClientFields,
  device: emptyDeviceFields,
  accessType: "none",
  accessCode: "",
  accessVerified: false,
};

const groupIcons: Record<
  InspectionGroupId,
  ReactNode
> = {
  display: <PhoneIcon />,
  rearGlass: <DeviceIcon />,
  camera: <CameraIcon />,
  frame: <PhoneIcon />,
};

const SectionCard = ({
  icon,
  title,
  subtitle,
  children,
}: SectionCardProps) => (
  <Card
    variant="outlined"
    sx={{
      height: "100%",
      borderRadius: 3,
      borderColor: "divider",
      boxShadow:
        "0 10px 32px rgba(15, 23, 42, 0.05)",
    }}
  >
    <CardContent
      sx={{
        p: {
          xs: 2,
          sm: 2.5,
        },
        "&:last-child": {
          pb: {
            xs: 2,
            sm: 2.5,
          },
        },
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          spacing={1.25}
          alignItems="flex-start"
        >
          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              width: 38,
              height: 38,
              borderRadius: 2.25,
              bgcolor: "primary.50",
              color: "primary.main",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h6"
              component="h2"
              fontWeight={750}
              sx={{
                fontSize: {
                  xs: "1rem",
                  sm: "1.08rem",
                },
              }}
            >
              {title}
            </Typography>

            {subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.25 }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>

        <Divider />
        {children}
      </Stack>
    </CardContent>
  </Card>
);

const clientToFields = (
  client: Client
): ClientFields => ({
  name: client.name,
  phone: client.phone,
  secondaryPhone:
    client.secondaryPhone ?? "",
  email: client.email ?? "",
  address: client.address ?? "",
  note: client.note ?? "",
});

const deviceToFields = (
  device: Device
): DeviceFields => ({
  deviceType: device.deviceType,
  brand: device.brand,
  model: device.model,
  color: device.color ?? "",
  imei1: device.imei1 ?? "",
  imei2: device.imei2 ?? "",
  serial: device.serial ?? "",
});

const getDeviceIdentifier = (
  device: Device
): string =>
  device.imei1 ??
  device.serial ??
  device.imei2 ??
  "—";

const PatternPreview = () => {
  const { t } = useTranslation();
  const selected =
    new Set([0, 3, 6, 4]);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 3,
        bgcolor: "grey.50",
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 2 }}
      >
        {t(
          "intakeWizard.access.patternTitle"
        )}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, 46px)",
          gap: 2.25,
          width: "fit-content",
          mb: 2,
        }}
      >
        {Array.from({ length: 9 }).map(
          (_, index) => (
            <Box
              key={index}
              sx={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                border: "2px solid",
                borderColor:
                  selected.has(index)
                    ? "primary.main"
                    : "grey.400",
                bgcolor:
                  selected.has(index)
                    ? "primary.50"
                    : "background.paper",
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
          )
        )}
      </Box>

      <Button
        size="small"
        startIcon={<ColorIcon />}
      >
        {t(
          "intakeWizard.actions.clearPattern"
        )}
      </Button>
    </Paper>
  );
};

const CustomerDeviceStep = ({
  draft,
  onChange,
}: CustomerDeviceStepProps) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] =
    useState("");
  const [clientOptions, setClientOptions] =
    useState<Client[]>([]);
  const [searching, setSearching] =
    useState(false);
  const [searchError, setSearchError] =
    useState(false);
  const [devicesLoading, setDevicesLoading] =
    useState(false);
  const [devicesError, setDevicesError] =
    useState(false);
  const requestSequence = useRef(0);

  useEffect(() => {
    const query = searchQuery.trim();
    const requestId =
      ++requestSequence.current;

    if (query.length < 2) {
      setClientOptions([]);
      setSearching(false);
      setSearchError(false);
      return;
    }

    setSearching(true);
    setSearchError(false);

    const timeoutId = window.setTimeout(
      () => {
        void searchClients(query)
          .then((clients) => {
            if (
              requestSequence.current !==
              requestId
            ) {
              return;
            }

            setClientOptions(clients);
          })
          .catch(() => {
            if (
              requestSequence.current !==
              requestId
            ) {
              return;
            }

            setClientOptions([]);
            setSearchError(true);
          })
          .finally(() => {
            if (
              requestSequence.current ===
              requestId
            ) {
              setSearching(false);
            }
          });
      },
      400
    );

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  const updateClientField = (
    field: keyof ClientFields,
    value: string
  ) => {
    onChange({
      ...draft,
      client: {
        ...draft.client,
        [field]: value,
      },
    });
  };

  const updateDeviceField = (
    field: keyof DeviceFields,
    value: string
  ) => {
    onChange({
      ...draft,
      device: {
        ...draft.device,
        [field]: value,
      },
    });
  };

  const selectClient = async (
    client: Client
  ) => {
    const clientId = client.id;
    let devices = client.devices ?? [];

    setDevicesError(false);

    if (
      clientId &&
      client.devices === undefined
    ) {
      setDevicesLoading(true);

      try {
        devices =
          await getDevicesByClient(
            clientId
          );
      } catch {
        setDevicesError(true);
      } finally {
        setDevicesLoading(false);
      }
    }

    setSearchQuery(
      `${client.name} · ${client.phone}`
    );

    onChange({
      ...draft,
      selectedClient: client,
      selectedDevice: null,
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
      availableDevices: [],
      client: emptyClientFields,
      device: emptyDeviceFields,
    });
  };

  const selectDevice = (
    device: Device
  ) => {
    onChange({
      ...draft,
      selectedDevice: device,
      device: deviceToFields(device),
    });
  };

  const clearDeviceSelection = () => {
    onChange({
      ...draft,
      selectedDevice: null,
      device: emptyDeviceFields,
    });
  };

  const existingClientSelected =
    Boolean(draft.selectedClient);
  const existingDeviceSelected =
    Boolean(draft.selectedDevice);

  return (
    <Stack spacing={3}>
      <SectionCard
        icon={<PersonIcon />}
        title={t(
          "intakeWizard.customer.title"
        )}
        subtitle={t(
          "intakeWizard.customer.subtitle"
        )}
      >
        <Stack spacing={2}>
          <Autocomplete
            options={clientOptions}
            value={draft.selectedClient}
            inputValue={searchQuery}
            loading={searching}
            filterOptions={(options) =>
              options
            }
            getOptionLabel={(option) =>
              `${option.name} · ${option.phone}`
            }
            isOptionEqualToValue={(
              option,
              value
            ) =>
              option.id === value.id
            }
            onInputChange={(
              _,
              value,
              reason
            ) => {
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
                ? t(
                    "intakeRuntime.customerSearch.hint"
                  )
                : t(
                    "intakeRuntime.customerSearch.noResults"
                  )
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={t(
                  "intakeRuntime.customerSearch.label"
                )}
                placeholder={t(
                  "intakeRuntime.customerSearch.placeholder"
                )}
                helperText={t(
                  "intakeRuntime.customerSearch.hint"
                )}
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
                        {searching && (
                          <CircularProgress
                            size={18}
                          />
                        )}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  },
                }}
              />
            )}
            renderOption={(props, option) => {
              const {
                key,
                ...optionProps
              } = props;

              return (
                <Box
                  component="li"
                  key={key}
                  {...optionProps}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "1fr 150px 1.2fr",
                    },
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={700}
                  >
                    {option.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="primary.main"
                  >
                    {option.phone}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    noWrap
                  >
                    {option.email ?? "—"}
                  </Typography>
                </Box>
              );
            }}
          />

          {searchError && (
            <Alert severity="error">
              {t(
                "intakeRuntime.customerSearch.error"
              )}
            </Alert>
          )}

          {existingClientSelected && (
            <Alert
              severity="success"
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={
                    clearClientSelection
                  }
                >
                  {t(
                    "intakeRuntime.customerSearch.change"
                  )}
                </Button>
              }
            >
              {t(
                "intakeRuntime.customerSearch.selected"
              )}
              {": "}
              <strong>
                {draft.selectedClient?.name}
              </strong>
            </Alert>
          )}

          {!existingClientSelected && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={clearClientSelection}
              sx={{ alignSelf: "flex-start" }}
            >
              {t(
                "intakeRuntime.customerSearch.useNew"
              )}
            </Button>
          )}

          <Grid container spacing={2}>
            <Grid
              size={{ xs: 12, lg: 6 }}
            >
              <TextField
                label={t(
                  "intakeWizard.customer.fullName"
                )}
                value={draft.client.name}
                onChange={(event) => {
                  updateClientField(
                    "name",
                    event.target.value
                  );
                }}
                disabled={existingClientSelected}
                fullWidth
                required
              />
            </Grid>

            <Grid
              size={{ xs: 12, lg: 6 }}
            >
              <TextField
                label={t(
                  "intakeWizard.customer.phone"
                )}
                value={draft.client.phone}
                onChange={(event) => {
                  updateClientField(
                    "phone",
                    event.target.value
                  );
                }}
                disabled={existingClientSelected}
                fullWidth
                required
              />
            </Grid>

            <Grid
              size={{ xs: 12, sm: 6 }}
            >
              <TextField
                label={t(
                  "intakeWizard.customer.secondaryPhone"
                )}
                value={
                  draft.client.secondaryPhone
                }
                onChange={(event) => {
                  updateClientField(
                    "secondaryPhone",
                    event.target.value
                  );
                }}
                disabled={existingClientSelected}
                fullWidth
              />
            </Grid>

            <Grid
              size={{ xs: 12, sm: 6 }}
            >
              <TextField
                label={t(
                  "intakeWizard.customer.email"
                )}
                value={draft.client.email}
                onChange={(event) => {
                  updateClientField(
                    "email",
                    event.target.value
                  );
                }}
                disabled={existingClientSelected}
                type="email"
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label={t(
                  "intakeWizard.customer.address"
                )}
                value={draft.client.address}
                onChange={(event) => {
                  updateClientField(
                    "address",
                    event.target.value
                  );
                }}
                disabled={existingClientSelected}
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label={t(
                  "intakeWizard.customer.note"
                )}
                value={draft.client.note}
                onChange={(event) => {
                  updateClientField(
                    "note",
                    event.target.value
                  );
                }}
                disabled={existingClientSelected}
                multiline
                minRows={2}
                fullWidth
              />
            </Grid>
          </Grid>
        </Stack>
      </SectionCard>

      {existingClientSelected && (
        <SectionCard
          icon={<DeviceIcon />}
          title={t(
            "intakeRuntime.devices.title"
          )}
          subtitle={t(
            "intakeRuntime.devices.hint"
          )}
        >
          <Stack spacing={2}>
            {devicesLoading && (
              <Alert
                icon={
                  <CircularProgress
                    size={18}
                  />
                }
                severity="info"
              >
                {t(
                  "intakeRuntime.devices.loading"
                )}
              </Alert>
            )}

            {devicesError && (
              <Alert severity="error">
                {t(
                  "intakeRuntime.devices.error"
                )}
              </Alert>
            )}

            {!devicesLoading &&
              draft.availableDevices.length ===
                0 && (
                <Alert severity="info">
                  {t(
                    "intakeRuntime.devices.empty"
                  )}
                </Alert>
              )}

            {draft.availableDevices.length >
              0 && (
              <Grid container spacing={2}>
                {draft.availableDevices.map(
                  (device) => {
                    const selected =
                      draft.selectedDevice?.id ===
                      device.id;

                    return (
                      <Grid
                        key={
                          device.id ??
                          `${device.brand}-${device.model}`
                        }
                        size={{
                          xs: 12,
                          sm: 6,
                          lg: 4,
                        }}
                      >
                        <ButtonBase
                          onClick={() => {
                            selectDevice(device);
                          }}
                          sx={{
                            width: "100%",
                            textAlign: "left",
                            border: "1px solid",
                            borderColor: selected
                              ? "primary.main"
                              : "divider",
                            bgcolor: selected
                              ? "action.selected"
                              : "background.paper",
                            borderRadius: 3,
                            p: 2,
                          }}
                        >
                          <Stack spacing={0.75}>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <PhoneIcon
                                color={
                                  selected
                                    ? "primary"
                                    : "inherit"
                                }
                              />
                              <Typography
                                fontWeight={800}
                              >
                                {device.brand}{" "}
                                {device.model}
                              </Typography>
                            </Stack>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              {t(
                                "intakeRuntime.devices.identifier"
                              )}
                              {": "}
                              {getDeviceIdentifier(
                                device
                              )}
                            </Typography>
                            {device.color && (
                              <Chip
                                size="small"
                                label={device.color}
                                sx={{
                                  alignSelf:
                                    "flex-start",
                                }}
                              />
                            )}
                          </Stack>
                        </ButtonBase>
                      </Grid>
                    );
                  }
                )}
              </Grid>
            )}

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={clearDeviceSelection}
              sx={{ alignSelf: "flex-start" }}
            >
              {t(
                "intakeRuntime.devices.useNew"
              )}
            </Button>

            {existingDeviceSelected && (
              <Alert
                severity="success"
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={
                      clearDeviceSelection
                    }
                  >
                    {t(
                      "intakeRuntime.devices.change"
                    )}
                  </Button>
                }
              >
                {t(
                  "intakeRuntime.devices.selected"
                )}
                {": "}
                <strong>
                  {draft.selectedDevice?.brand}{" "}
                  {draft.selectedDevice?.model}
                </strong>
              </Alert>
            )}
          </Stack>
        </SectionCard>
      )}

      <Grid container spacing={3}>
        <Grid
          size={{ xs: 12, lg: 4 }}
        >
          <SectionCard
            icon={<SearchIcon />}
            title={t(
              "intakeWizard.device.modelSearch"
            )}
          >
            <Stack spacing={1.25}>
              <TextField
                placeholder={t(
                  "intakeWizard.device.modelSearchPlaceholder"
                )}
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Typography
                variant="caption"
                fontWeight={750}
                color="text.secondary"
              >
                {t(
                  "intakeWizard.device.popularModels"
                )}
              </Typography>

              <List
                dense
                sx={{
                  maxHeight: 315,
                  overflowY: "auto",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                {sampleModelNames.map(
                  (model) => (
                    <ListItemButton
                      key={model}
                    >
                      <ListItemIcon
                        sx={{ minWidth: 30 }}
                      >
                        <PhoneIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={model}
                        primaryTypographyProps={{
                          variant: "body2",
                          fontWeight: 600,
                        }}
                      />
                    </ListItemButton>
                  )
                )}
              </List>

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                fullWidth
              >
                {t(
                  "intakeWizard.actions.addModel"
                )}
              </Button>
            </Stack>
          </SectionCard>
        </Grid>

        <Grid
          size={{ xs: 12, lg: 8 }}
        >
          <Stack spacing={3}>
            <SectionCard
              icon={<DeviceIcon />}
              title={t(
                "intakeWizard.device.title"
              )}
              subtitle={t(
                "intakeWizard.device.subtitle"
              )}
            >
              <Grid container spacing={2}>
                <Grid
                  size={{ xs: 12, sm: 4 }}
                >
                  <TextField
                    select
                    label={t(
                      "intakeWizard.device.type"
                    )}
                    value={
                      draft.device.deviceType
                    }
                    onChange={(event) => {
                      updateDeviceField(
                        "deviceType",
                        event.target.value
                      );
                    }}
                    disabled={existingDeviceSelected}
                    fullWidth
                    required
                  >
                    {deviceTypeOptions.map(
                      (option) => (
                        <MenuItem
                          key={option.value}
                          value={option.value}
                        >
                          {t(
                            option.labelKey
                          )}
                        </MenuItem>
                      )
                    )}
                  </TextField>
                </Grid>

                <Grid
                  size={{ xs: 12, sm: 4 }}
                >
                  <TextField
                    label={t(
                      "intakeWizard.device.brand"
                    )}
                    value={draft.device.brand}
                    onChange={(event) => {
                      updateDeviceField(
                        "brand",
                        event.target.value
                      );
                    }}
                    disabled={existingDeviceSelected}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid
                  size={{ xs: 12, sm: 4 }}
                >
                  <TextField
                    label={t(
                      "intakeWizard.device.model"
                    )}
                    value={draft.device.model}
                    onChange={(event) => {
                      updateDeviceField(
                        "model",
                        event.target.value
                      );
                    }}
                    disabled={existingDeviceSelected}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid
                  size={{ xs: 12, sm: 4 }}
                >
                  <TextField
                    label={t(
                      "intakeWizard.device.color"
                    )}
                    value={draft.device.color}
                    onChange={(event) => {
                      updateDeviceField(
                        "color",
                        event.target.value
                      );
                    }}
                    disabled={existingDeviceSelected}
                    fullWidth
                  />
                </Grid>

                <Grid
                  size={{ xs: 12, sm: 4 }}
                >
                  <TextField
                    label={t(
                      "intakeWizard.device.imei1"
                    )}
                    value={draft.device.imei1}
                    onChange={(event) => {
                      updateDeviceField(
                        "imei1",
                        event.target.value
                      );
                    }}
                    disabled={existingDeviceSelected}
                    helperText={t(
                      "intakeWizard.device.imeiHint"
                    )}
                    fullWidth
                  />
                </Grid>

                <Grid
                  size={{ xs: 12, sm: 4 }}
                >
                  <TextField
                    label={t(
                      "intakeWizard.device.imei2"
                    )}
                    value={draft.device.imei2}
                    onChange={(event) => {
                      updateDeviceField(
                        "imei2",
                        event.target.value
                      );
                    }}
                    disabled={existingDeviceSelected}
                    helperText={t(
                      "intakeWizard.device.imeiHint"
                    )}
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    label={t(
                      "intakeWizard.device.serial"
                    )}
                    value={draft.device.serial}
                    onChange={(event) => {
                      updateDeviceField(
                        "serial",
                        event.target.value
                      );
                    }}
                    disabled={existingDeviceSelected}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard
              icon={<LockIcon />}
              title={t(
                "intakeWizard.access.title"
              )}
              subtitle={t(
                "intakeWizard.access.subtitle"
              )}
            >
              <Grid
                container
                spacing={2}
                alignItems="flex-start"
              >
                <Grid
                  size={{ xs: 12, md: 4 }}
                >
                  <TextField
                    select
                    label={t(
                      "intakeWizard.access.type"
                    )}
                    value={draft.accessType}
                    onChange={(event) => {
                      onChange({
                        ...draft,
                        accessType:
                          event.target.value as AccessType,
                        accessCode: "",
                      });
                    }}
                    fullWidth
                    required
                  >
                    {accessTypeOptions.map(
                      (option) => (
                        <MenuItem
                          key={option.value}
                          value={option.value}
                        >
                          {t(
                            option.labelKey
                          )}
                        </MenuItem>
                      )
                    )}
                  </TextField>
                </Grid>

                <Grid
                  size={{ xs: 12, md: 4 }}
                >
                  <TextField
                    label={t(
                      "intakeWizard.access.code"
                    )}
                    value={draft.accessCode}
                    onChange={(event) => {
                      onChange({
                        ...draft,
                        accessCode:
                          event.target.value,
                      });
                    }}
                    disabled={[
                      "none",
                      "unknown",
                    ].includes(
                      draft.accessType
                    )}
                    type={
                      draft.accessType ===
                      "password"
                        ? "password"
                        : "text"
                    }
                    fullWidth
                  />
                </Grid>

                <Grid
                  size={{ xs: 12, md: 4 }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          draft.accessVerified
                        }
                        onChange={(event) => {
                          onChange({
                            ...draft,
                            accessVerified:
                              event.target.checked,
                          });
                        }}
                      />
                    }
                    label={t(
                      "intakeWizard.access.verified"
                    )}
                    sx={{ mt: 0.75 }}
                  />
                </Grid>

                {draft.accessType ===
                  "pattern" && (
                  <Grid size={{ xs: 12 }}>
                    <PatternPreview />
                  </Grid>
                )}
              </Grid>
            </SectionCard>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

const DeviceInspectionStep = () => {
  const { t } = useTranslation();
  const [overallCondition, setOverallCondition] =
    useState("likeNew");
  const [batteryCondition, setBatteryCondition] =
    useState("unknown");

  return (
    <Stack spacing={3}>
      <SectionCard
        icon={<DeviceIcon />}
        title={t(
          "intakeWizard.inspection.overallTitle"
        )}
        subtitle={t(
          "intakeWizard.inspection.overallSubtitle"
        )}
      >
        <Grid container spacing={2}>
          {overallConditionOptions.map(
            (option, index) => {
              const selected =
                overallCondition ===
                option.value;
              const tone = [
                "success.main",
                "warning.main",
                "warning.dark",
                "error.main",
              ][index];

              return (
                <Grid
                  key={option.value}
                  size={{
                    xs: 12,
                    sm: 6,
                    lg: 3,
                  }}
                >
                  <ButtonBase
                    onClick={() => {
                      setOverallCondition(
                        option.value
                      );
                    }}
                    sx={{
                      width: "100%",
                      height: "100%",
                      textAlign: "left",
                      alignItems: "stretch",
                      border: "1px solid",
                      borderColor: selected
                        ? tone
                        : "divider",
                      borderRadius: 3,
                      p: 2,
                      bgcolor: selected
                        ? "action.selected"
                        : "background.paper",
                    }}
                  >
                    <Stack spacing={1}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <Radio
                          checked={selected}
                          size="small"
                          sx={{
                            p: 0,
                            color: tone,
                            "&.Mui-checked": {
                              color: tone,
                            },
                          }}
                        />
                        <Typography
                          fontWeight={800}
                          sx={{ color: tone }}
                        >
                          {t(option.labelKey)}
                        </Typography>
                      </Stack>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {t(
                          option.descriptionKey
                        )}
                      </Typography>
                    </Stack>
                  </ButtonBase>
                </Grid>
              );
            }
          )}
        </Grid>
      </SectionCard>

      <Typography
        variant="h6"
        fontWeight={800}
      >
        {t(
          "intakeWizard.inspection.visualTitle"
        )}
      </Typography>

      <Grid container spacing={2}>
        {inspectionGroups.map((group) => (
          <Grid
            key={group.id}
            size={{
              xs: 12,
              sm: 6,
              xl: 3,
            }}
          >
            <SectionCard
              icon={groupIcons[group.id]}
              title={t(group.titleKey)}
            >
              <Stack spacing={0.25}>
                {group.optionKeys.map(
                  (optionKey) => (
                    <FormControlLabel
                      key={optionKey}
                      control={
                        <Checkbox size="small" />
                      }
                      label={t(optionKey)}
                    />
                  )
                )}
                <TextField
                  label={t(
                    "intakeWizard.inspection.note"
                  )}
                  multiline
                  minRows={2}
                  fullWidth
                  sx={{ mt: 1 }}
                />
              </Stack>
            </SectionCard>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <SectionCard
            icon={<WarningIcon />}
            title={t(
              "intakeWizard.inspection.additional.title"
            )}
          >
            <Stack spacing={0.25}>
              {additionalIssueKeys.map(
                (key) => (
                  <FormControlLabel
                    key={key}
                    control={
                      <Checkbox size="small" />
                    }
                    label={t(key)}
                  />
                )
              )}
              <TextField
                label={t(
                  "intakeWizard.inspection.additional.note"
                )}
                multiline
                minRows={2}
                fullWidth
                sx={{ mt: 1 }}
              />
            </Stack>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <SectionCard
            icon={<CleaningIcon />}
            title={t(
              "intakeWizard.inspection.contamination.title"
            )}
          >
            <Stack spacing={0.25}>
              {contaminationKeys.map(
                (key) => (
                  <FormControlLabel
                    key={key}
                    control={
                      <Checkbox size="small" />
                    }
                    label={t(key)}
                  />
                )
              )}
              <TextField
                label={t(
                  "intakeWizard.inspection.contamination.note"
                )}
                multiline
                minRows={2}
                fullWidth
                sx={{ mt: 1 }}
              />
            </Stack>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <SectionCard
            icon={<BatteryIcon />}
            title={t(
              "intakeWizard.inspection.battery.title"
            )}
          >
            <RadioGroup
              value={batteryCondition}
              onChange={(event) => {
                setBatteryCondition(
                  event.target.value
                );
              }}
            >
              {batteryOptions.map(
                (option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio size="small" />}
                    label={t(option.labelKey)}
                    sx={{
                      mx: 0,
                      mb: 0.5,
                      px: 1,
                      borderRadius: 2,
                      bgcolor: "grey.50",
                    }}
                  />
                )
              )}
            </RadioGroup>
          </SectionCard>
        </Grid>
      </Grid>
    </Stack>
  );
};

const RepairPlanStep = () => {
  const { t } = useTranslation();
  const [repairType, setRepairType] =
    useState("diagnostics");

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 4 }}>
        <SectionCard
          icon={<BuildIcon />}
          title={t(
            "intakeWizard.repair.typeTitle"
          )}
        >
          <Stack spacing={1.5}>
            <TextField
              placeholder={t(
                "intakeWizard.repair.typeSearch"
              )}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Typography
              variant="caption"
              fontWeight={750}
              color="text.secondary"
            >
              {t(
                "intakeWizard.repair.frequentTypes"
              )}
            </Typography>
            <List
              dense
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              {repairTypeOptions.map(
                (option) => (
                  <ListItemButton
                    key={option.value}
                    selected={
                      repairType ===
                      option.value
                    }
                    onClick={() => {
                      setRepairType(
                        option.value
                      );
                    }}
                  >
                    <ListItemIcon
                      sx={{ minWidth: 32 }}
                    >
                      <BuildIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={t(
                        option.labelKey
                      )}
                    />
                  </ListItemButton>
                )
              )}
            </List>
            <TextField
              label={t(
                "intakeWizard.repair.otherType"
              )}
              multiline
              minRows={2}
              fullWidth
            />
          </Stack>
        </SectionCard>
      </Grid>

      <Grid size={{ xs: 12, lg: 4 }}>
        <SectionCard
          icon={<DeviceIcon />}
          title={t(
            "intakeWizard.repair.problemTitle"
          )}
        >
          <Stack spacing={2}>
            <TextField
              label={t(
                "intakeWizard.repair.customerProblem"
              )}
              multiline
              minRows={5}
              fullWidth
            />
            <TextField
              label={t(
                "intakeWizard.repair.diagnosis"
              )}
              multiline
              minRows={5}
              fullWidth
            />
          </Stack>
        </SectionCard>
      </Grid>

      <Grid size={{ xs: 12, lg: 4 }}>
        <SectionCard
          icon={<WarningIcon />}
          title={t(
            "intakeWizard.repair.risksTitle"
          )}
          subtitle={t(
            "intakeWizard.repair.risksSubtitle"
          )}
        >
          <Stack spacing={0.25}>
            {repairRiskKeys.map(
              (key, index) => (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      size="small"
                      defaultChecked={[
                        0,
                        2,
                        4,
                        6,
                      ].includes(index)}
                    />
                  }
                  label={t(key)}
                />
              )
            )}
            <TextField
              label={t(
                "intakeWizard.repair.riskNote"
              )}
              multiline
              minRows={3}
              fullWidth
              sx={{ mt: 1 }}
            />
          </Stack>
        </SectionCard>
      </Grid>
    </Grid>
  );
};

const PricePartsStep = () => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 4 }}>
        <SectionCard
          icon={<InventoryIcon />}
          title={t(
            "intakeWizard.price.title"
          )}
        >
          <Stack spacing={2}>
            <TextField
              label={t(
                "intakeWizard.price.targetPrice"
              )}
              defaultValue="1500"
              type="number"
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      {t(
                        "intakeWizard.price.currency"
                      )}
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Paper
              variant="outlined"
              sx={{
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Typography
                variant="caption"
                fontWeight={750}
                sx={{
                  display: "block",
                  px: 1.5,
                  py: 1,
                  bgcolor: "grey.50",
                }}
              >
                {t(
                  "intakeWizard.price.breakdown"
                )}
              </Typography>
              {[
                {
                  label: t(
                    "intakeWizard.price.partLine"
                  ),
                  value: "1 200 Kč",
                },
                {
                  label: t(
                    "intakeWizard.price.laborLine"
                  ),
                  value: "300 Kč",
                },
              ].map((line) => (
                <Stack
                  key={line.label}
                  direction="row"
                  justifyContent="space-between"
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="body2">
                    {line.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                  >
                    {line.value}
                  </Typography>
                </Stack>
              ))}
            </Paper>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
            >
              {t(
                "intakeWizard.actions.addLine"
              )}
            </Button>
            <Typography
              variant="subtitle2"
              fontWeight={800}
            >
              {t(
                "intakeWizard.price.approvalTitle"
              )}
            </Typography>
            <RadioGroup defaultValue="approved">
              {approvalOptions.map(
                (option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio size="small" />}
                    label={t(option.labelKey)}
                  />
                )
              )}
            </RadioGroup>
          </Stack>
        </SectionCard>
      </Grid>

      <Grid size={{ xs: 12, lg: 4 }}>
        <Stack spacing={3}>
          <SectionCard
            icon={<BatteryIcon />}
            title={t(
              "intakeWizard.schedule.title"
            )}
          >
            <RadioGroup defaultValue="24h">
              {durationOptions.map(
                (option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio size="small" />}
                    label={t(option.labelKey)}
                  />
                )
              )}
            </RadioGroup>
            <TextField
              label={t(
                "intakeWizard.schedule.date"
              )}
              type="date"
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </SectionCard>

          <SectionCard
            icon={<InventoryIcon />}
            title={t(
              "intakeWizard.parts.title"
            )}
          >
            <Stack spacing={1.5}>
              <TextField
                placeholder={t(
                  "intakeWizard.parts.search"
                )}
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Typography
                variant="caption"
                fontWeight={750}
                color="text.secondary"
              >
                {t(
                  "intakeWizard.parts.selected"
                )}
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: 2.5,
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                >
                  <Avatar
                    variant="rounded"
                    sx={{
                      bgcolor: "grey.100",
                      color: "primary.main",
                    }}
                  >
                    <PhoneIcon />
                  </Avatar>
                  <Box
                    sx={{
                      minWidth: 0,
                      flexGrow: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={750}
                      noWrap
                    >
                      {t(
                        "intakeWizard.parts.sampleName"
                      )}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="primary.main"
                      display="block"
                    >
                      {t(
                        "intakeWizard.parts.sampleSku"
                      )}
                    </Typography>
                    <Typography
                      variant="caption"
                      fontWeight={700}
                    >
                      {t(
                        "intakeWizard.parts.samplePrice"
                      )}
                    </Typography>
                  </Box>
                  <IconButton size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Paper>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
              >
                {t(
                  "intakeWizard.actions.addPart"
                )}
              </Button>
              <Alert severity="info">
                {t(
                  "intakeWizard.parts.reservationHint"
                )}
              </Alert>
            </Stack>
          </SectionCard>
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, lg: 4 }}>
        <SectionCard
          icon={<PersonIcon />}
          title={t(
            "intakeWizard.communication.title"
          )}
          subtitle={t(
            "intakeWizard.communication.subtitle"
          )}
        >
          <Stack spacing={1}>
            {communicationOptions.map(
              (option, index) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      defaultChecked={
                        index !== 1
                      }
                    />
                  }
                  label={t(option.labelKey)}
                />
              )
            )}
            <TextField
              label={t(
                "intakeWizard.communication.note"
              )}
              multiline
              minRows={8}
              fullWidth
              sx={{ mt: 1 }}
            />
          </Stack>
        </SectionCard>
      </Grid>
    </Grid>
  );
};

const ReviewStep = () => {
  const { t } = useTranslation();

  return (
    <Stack spacing={3}>
      <Alert
        severity="success"
        sx={{ borderRadius: 3 }}
      >
        {t(
          "intakeWizard.review.hint"
        )}
      </Alert>
      <Grid container spacing={2}>
        {reviewSections.map((section) => (
          <Grid
            key={section.titleKey}
            size={{
              xs: 12,
              sm: 6,
              lg: 4,
            }}
          >
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: 3,
                height: "100%",
              }}
            >
              <Stack spacing={1.25}>
                <Typography
                  variant="h6"
                  fontWeight={800}
                >
                  {t(section.titleKey)}
                </Typography>
                {section.lineKeys.map(
                  (lineKey) => (
                    <Stack
                      key={lineKey}
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >
                      <CheckIcon
                        color="success"
                        fontSize="small"
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {t(lineKey)}
                      </Typography>
                    </Stack>
                  )
                )}
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

const RepairIntakeWizardPageV2 = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] =
    useState(0);
  const [customerDeviceDraft, setCustomerDeviceDraft] =
    useState<CustomerDeviceDraft>(
      initialCustomerDeviceDraft
    );

  const isLastStep =
    activeStep ===
    intakeStepKeys.length - 1;

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <CustomerDeviceStep
            draft={customerDeviceDraft}
            onChange={
              setCustomerDeviceDraft
            }
          />
        );
      case 1:
        return <DeviceInspectionStep />;
      case 2:
        return <RepairPlanStep />;
      case 3:
        return <PricePartsStep />;
      default:
        return <ReviewStep />;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100%",
        bgcolor: "grey.50",
        py: {
          xs: 2,
          md: 3,
        },
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 2,
                sm: 3,
              },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              background:
                "linear-gradient(135deg, rgba(25, 118, 210, 0.08), rgba(255, 255, 255, 0.98) 48%)",
            }}
          >
            <Stack spacing={3}>
              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{
                  xs: "flex-start",
                  sm: "center",
                }}
              >
                <Box>
                  <Chip
                    label={t(
                      "intakeWizard.badge"
                    )}
                    color="primary"
                    variant="outlined"
                    sx={{ mb: 1.25 }}
                  />
                  <Typography
                    variant="h4"
                    component="h1"
                    fontWeight={850}
                  >
                    {t(
                      "intakeWizard.title"
                    )}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {t(
                      "intakeWizard.subtitle"
                    )}
                  </Typography>
                </Box>

                <Chip
                  label={t(
                    "intakeWizard.stepCounter",
                    {
                      current:
                        activeStep + 1,
                      total:
                        intakeStepKeys.length,
                    }
                  )}
                  color="primary"
                  sx={{ fontWeight: 750 }}
                />
              </Stack>

              <Box
                sx={{
                  overflowX: "auto",
                  pb: 0.5,
                }}
              >
                <Stepper
                  nonLinear
                  activeStep={activeStep}
                  sx={{
                    minWidth: 760,
                    "& .MuiStepLabel-label": {
                      fontWeight: 650,
                    },
                    "& .MuiStepIcon-root.Mui-completed": {
                      color: "success.main",
                    },
                  }}
                >
                  {intakeStepKeys.map(
                    (key, index) => (
                      <Step
                        key={key}
                        completed={
                          index < activeStep
                        }
                      >
                        <StepButton
                          color="inherit"
                          onClick={() => {
                            setActiveStep(index);
                          }}
                        >
                          {t(key)}
                        </StepButton>
                      </Step>
                    )
                  )}
                </Stepper>
              </Box>
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 2,
                sm: 3,
              },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            {renderStep()}
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack
              direction={{
                xs: "column-reverse",
                sm: "row",
              }}
              spacing={2}
              justifyContent="space-between"
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                disabled={activeStep === 0}
                onClick={() => {
                  setActiveStep(
                    (current) =>
                      Math.max(
                        current - 1,
                        0
                      )
                  );
                }}
              >
                {t(
                  "intakeWizard.actions.back"
                )}
              </Button>

              <Button
                variant="contained"
                endIcon={
                  isLastStep
                    ? <CheckIcon />
                    : <ArrowForwardIcon />
                }
                disabled={isLastStep}
                onClick={() => {
                  setActiveStep(
                    (current) =>
                      Math.min(
                        current + 1,
                        intakeStepKeys.length - 1
                      )
                  );
                }}
              >
                {isLastStep
                  ? t(
                      "intakeWizard.actions.createLater"
                    )
                  : t(
                      "intakeWizard.actions.continue"
                    )}
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};

export default RepairIntakeWizardPageV2;
