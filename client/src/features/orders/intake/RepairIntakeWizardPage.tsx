import {
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
  Avatar,
  Box,
  Button,
  ButtonBase,
  Card,
  CardContent,
  Checkbox,
  Chip,
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
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

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

const sampleCustomers = [
  {
    name: "Jan Novák",
    phone: "+420 777 123 456",
    email: "jan.novak@email.cz",
  },
  {
    name: "Petr Svoboda",
    phone: "+420 608 987 654",
    email: "petr.svoboda@email.cz",
  },
  {
    name: "Klára Dvořáková",
    phone: "+420 776 555 333",
    email: "klara.dvorakova@email.cz",
  },
] as const;

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

const PatternPreview = () => {
  const {
    t,
  } = useTranslation();

  const selected =
    new Set([
      0,
      3,
      6,
      4,
    ]);

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
        {Array.from({
          length: 9,
        }).map((_, index) => (
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
        ))}
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

const CustomerDeviceStep = () => {
  const {
    t,
  } = useTranslation();

  const [
    accessType,
    setAccessType,
  ] = useState<AccessType>(
    "none"
  );

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
        <Grid
          container
          spacing={2}
        >
          <Grid
            size={{
              xs: 12,
              lg: 6,
            }}
          >
            <Grid
              container
              spacing={2}
            >
              <Grid size={{ xs: 12 }}>
                <TextField
                  label={t(
                    "intakeWizard.customer.fullName"
                  )}
                  fullWidth
                  required
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  label={t(
                    "intakeWizard.customer.secondaryPhone"
                  )}
                  fullWidth
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  label={t(
                    "intakeWizard.customer.email"
                  )}
                  type="email"
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  label={t(
                    "intakeWizard.customer.address"
                  )}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid
            size={{
              xs: 12,
              lg: 6,
            }}
          >
            <Stack spacing={1.5}>
              <TextField
                label={t(
                  "intakeWizard.customer.phone"
                )}
                placeholder={t(
                  "intakeWizard.customer.phonePlaceholder"
                )}
                fullWidth
                required
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

              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 2.5,
                  overflow: "hidden",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    px: 1.5,
                    py: 1,
                    bgcolor: "grey.50",
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={750}
                  >
                    {t(
                      "intakeWizard.customer.foundTitle"
                    )}
                  </Typography>

                  <Button size="small">
                    {t(
                      "intakeWizard.customer.selectExisting"
                    )}
                  </Button>
                </Stack>

                <List disablePadding>
                  {sampleCustomers.map(
                    (customer) => (
                      <ListItemButton
                        key={customer.phone}
                        divider
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "1fr",
                            md: "1fr 150px 1.2fr",
                          },
                          gap: 1,
                          py: 0.75,
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={700}
                        >
                          {customer.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="primary.main"
                        >
                          {customer.phone}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          noWrap
                        >
                          {customer.email}
                        </Typography>
                      </ListItemButton>
                    )
                  )}
                </List>
              </Paper>

              <TextField
                label={t(
                  "intakeWizard.customer.note"
                )}
                placeholder={t(
                  "intakeWizard.customer.notePlaceholder"
                )}
                multiline
                minRows={2}
                fullWidth
              />
            </Stack>
          </Grid>
        </Grid>
      </SectionCard>

      <Grid
        container
        spacing={3}
      >
        <Grid
          size={{
            xs: 12,
            lg: 4,
          }}
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
                        sx={{
                          minWidth: 30,
                        }}
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
          size={{
            xs: 12,
            lg: 8,
          }}
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
              <Grid
                container
                spacing={2}
              >
                <Grid
                  size={{
                    xs: 12,
                    sm: 4,
                  }}
                >
                  <TextField
                    select
                    label={t(
                      "intakeWizard.device.type"
                    )}
                    defaultValue="phone"
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
                  size={{
                    xs: 12,
                    sm: 4,
                  }}
                >
                  <TextField
                    label={t(
                      "intakeWizard.device.brand"
                    )}
                    placeholder={t(
                      "intakeWizard.device.brandPlaceholder"
                    )}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 4,
                  }}
                >
                  <TextField
                    label={t(
                      "intakeWizard.device.model"
                    )}
                    placeholder={t(
                      "intakeWizard.device.modelPlaceholder"
                    )}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 4,
                  }}
                >
                  <TextField
                    label={t(
                      "intakeWizard.device.color"
                    )}
                    placeholder={t(
                      "intakeWizard.device.colorPlaceholder"
                    )}
                    fullWidth
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 4,
                  }}
                >
                  <TextField
                    label={t(
                      "intakeWizard.device.imei1"
                    )}
                    helperText={t(
                      "intakeWizard.device.imeiHint"
                    )}
                    fullWidth
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 4,
                  }}
                >
                  <TextField
                    label={t(
                      "intakeWizard.device.imei2"
                    )}
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
                    placeholder={t(
                      "intakeWizard.device.serialPlaceholder"
                    )}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Button
                size="small"
                startIcon={<ColorIcon />}
                sx={{ alignSelf: "flex-start" }}
              >
                {t(
                  "intakeWizard.actions.addColor"
                )}
              </Button>
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
                  size={{
                    xs: 12,
                    md: 4,
                  }}
                >
                  <TextField
                    select
                    label={t(
                      "intakeWizard.access.type"
                    )}
                    value={accessType}
                    onChange={(event) => {
                      setAccessType(
                        event.target.value as AccessType
                      );
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
                  size={{
                    xs: 12,
                    md: 4,
                  }}
                >
                  <TextField
                    label={t(
                      "intakeWizard.access.code"
                    )}
                    placeholder={t(
                      "intakeWizard.access.codePlaceholder"
                    )}
                    disabled={[
                      "none",
                      "unknown",
                    ].includes(
                      accessType
                    )}
                    type={
                      accessType ===
                      "password"
                        ? "password"
                        : "text"
                    }
                    fullWidth
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 4,
                  }}
                >
                  <FormControlLabel
                    control={<Checkbox />}
                    label={t(
                      "intakeWizard.access.verified"
                    )}
                    sx={{ mt: 0.75 }}
                  />
                </Grid>

                {accessType ===
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
  const {
    t,
  } = useTranslation();

  const [
    overallCondition,
    setOverallCondition,
  ] = useState("likeNew");

  const [
    batteryCondition,
    setBatteryCondition,
  ] = useState("unknown");

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
        <Grid
          container
          spacing={2}
        >
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
                      borderColor:
                        selected
                          ? tone
                          : "divider",
                      borderRadius: 3,
                      p: 2,
                      bgcolor:
                        selected
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
                          {t(
                            option.labelKey
                          )}
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

      <Grid
        container
        spacing={2}
      >
        {inspectionGroups.map(
          (group) => (
            <Grid
              key={group.id}
              size={{
                xs: 12,
                sm: 6,
                xl: 3,
              }}
            >
              <SectionCard
                icon={
                  groupIcons[
                    group.id
                  ]
                }
                title={t(
                  group.titleKey
                )}
              >
                <Stack spacing={0.25}>
                  {group.optionKeys.map(
                    (optionKey) => (
                      <FormControlLabel
                        key={optionKey}
                        control={
                          <Checkbox size="small" />
                        }
                        label={t(
                          optionKey
                        )}
                      />
                    )
                  )}

                  <TextField
                    label={t(
                      "intakeWizard.inspection.note"
                    )}
                    placeholder={t(
                      "intakeWizard.inspection.notePlaceholder"
                    )}
                    multiline
                    minRows={2}
                    fullWidth
                    sx={{ mt: 1 }}
                  />
                </Stack>
              </SectionCard>
            </Grid>
          )
        )}
      </Grid>

      <Grid
        container
        spacing={2}
      >
        <Grid
          size={{
            xs: 12,
            lg: 4,
          }}
        >
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

        <Grid
          size={{
            xs: 12,
            lg: 4,
          }}
        >
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

        <Grid
          size={{
            xs: 12,
            lg: 4,
          }}
        >
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
                    label={t(
                      option.labelKey
                    )}
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
  const {
    t,
  } = useTranslation();

  const [
    repairType,
    setRepairType,
  ] = useState(
    "diagnostics"
  );

  return (
    <Grid
      container
      spacing={3}
    >
      <Grid
        size={{
          xs: 12,
          lg: 4,
        }}
      >
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
                      sx={{
                        minWidth: 32,
                      }}
                    >
                      <BuildIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={t(
                        option.labelKey
                      )}
                      primaryTypographyProps={{
                        variant: "body2",
                      }}
                    />
                  </ListItemButton>
                )
              )}
            </List>

            <TextField
              label={t(
                "intakeWizard.repair.otherType"
              )}
              placeholder={t(
                "intakeWizard.repair.otherPlaceholder"
              )}
              multiline
              minRows={2}
              fullWidth
            />
          </Stack>
        </SectionCard>
      </Grid>

      <Grid
        size={{
          xs: 12,
          lg: 4,
        }}
      >
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

      <Grid
        size={{
          xs: 12,
          lg: 4,
        }}
      >
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
  const {
    t,
  } = useTranslation();

  return (
    <Grid
      container
      spacing={3}
    >
      <Grid
        size={{
          xs: 12,
          lg: 4,
        }}
      >
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
                  label:
                    t(
                      "intakeWizard.price.partLine"
                    ),
                  value: "1 200 Kč",
                },
                {
                  label:
                    t(
                      "intakeWizard.price.laborLine"
                    ),
                  value: "300 Kč",
                },
              ].map((line) => (
                <Stack
                  key={line.label}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
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
                    label={t(
                      option.labelKey
                    )}
                  />
                )
              )}
            </RadioGroup>
          </Stack>
        </SectionCard>
      </Grid>

      <Grid
        size={{
          xs: 12,
          lg: 4,
        }}
      >
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
                    label={t(
                      option.labelKey
                    )}
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
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
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
                      <Chip
                        size="small"
                        color="success"
                        label={t(
                          "intakeWizard.parts.conditionNew"
                        )}
                      />
                    </Stack>

                    <Typography
                      variant="caption"
                      color="primary.main"
                      display="block"
                      noWrap
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

      <Grid
        size={{
          xs: 12,
          lg: 4,
        }}
      >
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
                  label={t(
                    option.labelKey
                  )}
                />
              )
            )}

            <TextField
              label={t(
                "intakeWizard.communication.note"
              )}
              placeholder={t(
                "intakeWizard.communication.notePlaceholder"
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
  const {
    t,
  } = useTranslation();

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

      <Grid
        container
        spacing={2}
      >
        {reviewSections.map(
          (section) => (
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
                    {t(
                      section.titleKey
                    )}
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
          )
        )}
      </Grid>
    </Stack>
  );
};

const RepairIntakeWizardPage = () => {
  const {
    t,
  } = useTranslation();

  const [
    activeStep,
    setActiveStep,
  ] = useState(0);

  const isLastStep =
    activeStep ===
    intakeStepKeys.length - 1;

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <CustomerDeviceStep />;
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
                    (
                      key,
                      index
                    ) => (
                      <Step
                        key={key}
                        completed={
                          index <
                          activeStep
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

export default RepairIntakeWizardPage;
