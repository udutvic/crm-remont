import {
  useState,
  type ReactNode,
} from "react";
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  BuildOutlined as BuildIcon,
  CheckCircleOutline as CheckIcon,
  DevicesOutlined as DeviceIcon,
  Inventory2Outlined as InventoryIcon,
  PersonOutline as PersonIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
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

interface SectionCardProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

type AccessType =
  | "none"
  | "pin"
  | "password"
  | "pattern"
  | "unknown";

const stepKeys = [
  "intakeWizard.steps.customerDevice",
  "intakeWizard.steps.inspection",
  "intakeWizard.steps.repairPlan",
  "intakeWizard.steps.priceParts",
  "intakeWizard.steps.review",
] as const;

const inspectionGroups = [
  {
    titleKey:
      "intakeWizard.inspection.groups.display.title",
    optionKeys: [
      "intakeWizard.inspection.groups.display.hairlineScratches",
      "intakeWizard.inspection.groups.display.deepScratches",
      "intakeWizard.inspection.groups.display.cracked",
      "intakeWizard.inspection.groups.display.deadPixels",
    ],
  },
  {
    titleKey:
      "intakeWizard.inspection.groups.rearCover.title",
    optionKeys: [
      "intakeWizard.inspection.groups.rearCover.scratches",
      "intakeWizard.inspection.groups.rearCover.crackedGlass",
      "intakeWizard.inspection.groups.rearCover.looseCover",
      "intakeWizard.inspection.groups.rearCover.dents",
    ],
  },
  {
    titleKey:
      "intakeWizard.inspection.groups.frameButtons.title",
    optionKeys: [
      "intakeWizard.inspection.groups.frameButtons.scuffs",
      "intakeWizard.inspection.groups.frameButtons.bentFrame",
      "intakeWizard.inspection.groups.frameButtons.damagedButtons",
      "intakeWizard.inspection.groups.frameButtons.missingParts",
    ],
  },
] as const;

const findingKeys = [
  "intakeWizard.inspection.findings.dirty",
  "intakeWizard.inspection.findings.liquid",
  "intakeWizard.inspection.findings.nonOriginal",
  "intakeWizard.inspection.findings.noPower",
  "intakeWizard.inspection.findings.swollenBattery",
] as const;

const riskKeys = [
  "intakeWizard.repair.risks.dataLoss",
  "intakeWizard.repair.risks.unrepairable",
  "intakeWizard.repair.risks.noWarranty",
  "intakeWizard.repair.risks.hiddenDefects",
  "intakeWizard.repair.risks.waterResistance",
] as const;

const reviewSections = [
  {
    titleKey:
      "intakeWizard.review.sections.customer.title",
    lineKeys: [
      "intakeWizard.review.sections.customer.contact",
      "intakeWizard.review.sections.customer.billing",
    ],
  },
  {
    titleKey:
      "intakeWizard.review.sections.device.title",
    lineKeys: [
      "intakeWizard.review.sections.device.identity",
      "intakeWizard.review.sections.device.access",
    ],
  },
  {
    titleKey:
      "intakeWizard.review.sections.inspection.title",
    lineKeys: [
      "intakeWizard.review.sections.inspection.visual",
      "intakeWizard.review.sections.inspection.findings",
    ],
  },
  {
    titleKey:
      "intakeWizard.review.sections.repair.title",
    lineKeys: [
      "intakeWizard.review.sections.repair.diagnosis",
      "intakeWizard.review.sections.repair.price",
    ],
  },
] as const;

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
          sm: 3,
        },
        "&:last-child": {
          pb: {
            xs: 2,
            sm: 3,
          },
        },
      }}
    >
      <Stack spacing={2.5}>
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="flex-start"
        >
          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              width: 40,
              height: 40,
              borderRadius: 2.5,
              bgcolor: "primary.50",
              color: "primary.main",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>

          <Box>
            <Typography
              variant="h6"
              component="h2"
              fontWeight={700}
            >
              {title}
            </Typography>

            {subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.25,
                }}
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

const SearchAdornment = () => (
  <InputAdornment position="start">
    <SearchIcon fontSize="small" />
  </InputAdornment>
);

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
      <Grid
        container
        spacing={3}
      >
        <Grid
          size={{
            xs: 12,
            lg: 5,
          }}
        >
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
              <TextField
                label={t(
                  "intakeWizard.customer.phone"
                )}
                placeholder={t(
                  "intakeWizard.customer.phonePlaceholder"
                )}
                fullWidth
                slotProps={{
                  input: {
                    startAdornment:
                      <SearchAdornment />,
                  },
                }}
              />

              <Alert
                severity="info"
                sx={{
                  borderRadius: 2,
                }}
              >
                {t(
                  "intakeWizard.customer.lookupHint"
                )}
              </Alert>

              <Grid
                container
                spacing={2}
              >
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <TextField
                    label={t(
                      "intakeWizard.customer.fullName"
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

                <Grid
                  size={{
                    xs: 12,
                  }}
                >
                  <TextField
                    label={t(
                      "intakeWizard.customer.address"
                    )}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Stack>
          </SectionCard>
        </Grid>

        <Grid
          size={{
            xs: 12,
            lg: 7,
          }}
        >
          <SectionCard
            icon={<DeviceIcon />}
            title={t(
              "intakeWizard.device.title"
            )}
            subtitle={t(
              "intakeWizard.device.subtitle"
            )}
          >
            <Stack spacing={2}>
              <TextField
                label={t(
                  "intakeWizard.device.searchModel"
                )}
                placeholder={t(
                  "intakeWizard.device.searchModelPlaceholder"
                )}
                fullWidth
                slotProps={{
                  input: {
                    startAdornment:
                      <SearchAdornment />,
                  },
                }}
              />

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
                  >
                    <MenuItem value="phone">
                      {t(
                        "intakeWizard.device.types.phone"
                      )}
                    </MenuItem>
                    <MenuItem value="tablet">
                      {t(
                        "intakeWizard.device.types.tablet"
                      )}
                    </MenuItem>
                    <MenuItem value="laptop">
                      {t(
                        "intakeWizard.device.types.laptop"
                      )}
                    </MenuItem>
                    <MenuItem value="smartwatch">
                      {t(
                        "intakeWizard.device.types.smartwatch"
                      )}
                    </MenuItem>
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
                      "intakeWizard.device.imeiSerial"
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
                      "intakeWizard.device.color"
                    )}
                    placeholder={t(
                      "intakeWizard.device.colorPlaceholder"
                    )}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>

      <SectionCard
        icon={<CheckIcon />}
        title={t(
          "intakeWizard.access.title"
        )}
        subtitle={t(
          "intakeWizard.access.subtitle"
        )}
      >
        <Stack spacing={2}>
          <ToggleButtonGroup
            value={accessType}
            exclusive
            onChange={(
              _,
              value: AccessType | null
            ) => {
              if (value) {
                setAccessType(value);
              }
            }}
            sx={{
              flexWrap: "wrap",
              gap: 1,
              "& .MuiToggleButtonGroup-grouped": {
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                px: 2.5,
              },
            }}
          >
            <ToggleButton value="none">
              {t(
                "intakeWizard.access.none"
              )}
            </ToggleButton>
            <ToggleButton value="pin">
              {t(
                "intakeWizard.access.pin"
              )}
            </ToggleButton>
            <ToggleButton value="password">
              {t(
                "intakeWizard.access.password"
              )}
            </ToggleButton>
            <ToggleButton value="pattern">
              {t(
                "intakeWizard.access.pattern"
              )}
            </ToggleButton>
            <ToggleButton value="unknown">
              {t(
                "intakeWizard.access.unknown"
              )}
            </ToggleButton>
          </ToggleButtonGroup>

          {[
            "pin",
            "password",
          ].includes(accessType) && (
            <TextField
              label={t(
                accessType === "pin"
                  ? "intakeWizard.access.pin"
                  : "intakeWizard.access.password"
              )}
              type="password"
              sx={{
                maxWidth: 420,
              }}
            />
          )}

          {accessType ===
            "pattern" && (
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 3,
                maxWidth: 420,
                bgcolor: "grey.50",
              }}
            >
              <Typography
                fontWeight={700}
                gutterBottom
              >
                {t(
                  "intakeWizard.access.patternTitle"
                )}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                {t(
                  "intakeWizard.access.patternHint"
                )}
              </Typography>
            </Paper>
          )}
        </Stack>
      </SectionCard>
    </Stack>
  );
};

const DeviceInspectionStep = () => {
  const {
    t,
  } = useTranslation();

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
        <ToggleButtonGroup
          exclusive
          defaultValue="good"
          sx={{
            flexWrap: "wrap",
            gap: 1,
            "& .MuiToggleButtonGroup-grouped": {
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              px: 3,
            },
          }}
        >
          <ToggleButton value="excellent">
            {t(
              "intakeWizard.inspection.conditions.excellent"
            )}
          </ToggleButton>
          <ToggleButton value="good">
            {t(
              "intakeWizard.inspection.conditions.good"
            )}
          </ToggleButton>
          <ToggleButton value="used">
            {t(
              "intakeWizard.inspection.conditions.used"
            )}
          </ToggleButton>
          <ToggleButton value="damaged">
            {t(
              "intakeWizard.inspection.conditions.damaged"
            )}
          </ToggleButton>
        </ToggleButtonGroup>
      </SectionCard>

      <Grid
        container
        spacing={3}
      >
        {inspectionGroups.map(
          (group) => (
            <Grid
              key={group.titleKey}
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <SectionCard
                icon={<CheckIcon />}
                title={t(
                  group.titleKey
                )}
              >
                <Stack spacing={0.5}>
                  {group.optionKeys.map(
                    (optionKey) => (
                      <FormControlLabel
                        key={optionKey}
                        control={
                          <Checkbox />
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
                    multiline
                    minRows={2}
                    fullWidth
                    sx={{
                      mt: 1,
                    }}
                  />
                </Stack>
              </SectionCard>
            </Grid>
          )
        )}
      </Grid>

      <Grid
        container
        spacing={3}
      >
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <SectionCard
            icon={<BuildIcon />}
            title={t(
              "intakeWizard.inspection.findingsTitle"
            )}
          >
            <Stack>
              {findingKeys.map(
                (findingKey) => (
                  <FormControlLabel
                    key={findingKey}
                    control={
                      <Checkbox />
                    }
                    label={t(
                      findingKey
                    )}
                  />
                )
              )}
            </Stack>
          </SectionCard>
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <SectionCard
            icon={<CheckIcon />}
            title={t(
              "intakeWizard.inspection.intakeNoteTitle"
            )}
          >
            <TextField
              label={t(
                "intakeWizard.inspection.generalNote"
              )}
              placeholder={t(
                "intakeWizard.inspection.generalNotePlaceholder"
              )}
              multiline
              minRows={6}
              fullWidth
            />
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

  return (
    <Grid
      container
      spacing={3}
    >
      <Grid
        size={{
          xs: 12,
          lg: 7,
        }}
      >
        <SectionCard
          icon={<BuildIcon />}
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
              minRows={4}
              fullWidth
            />

            <TextField
              label={t(
                "intakeWizard.repair.preliminaryDiagnosis"
              )}
              multiline
              minRows={4}
              fullWidth
            />

            <TextField
              select
              label={t(
                "intakeWizard.repair.type"
              )}
              defaultValue="diagnostics"
              fullWidth
            >
              <MenuItem value="diagnostics">
                {t(
                  "intakeWizard.repair.types.diagnostics"
                )}
              </MenuItem>
              <MenuItem value="display">
                {t(
                  "intakeWizard.repair.types.display"
                )}
              </MenuItem>
              <MenuItem value="battery">
                {t(
                  "intakeWizard.repair.types.battery"
                )}
              </MenuItem>
              <MenuItem value="board">
                {t(
                  "intakeWizard.repair.types.board"
                )}
              </MenuItem>
            </TextField>
          </Stack>
        </SectionCard>
      </Grid>

      <Grid
        size={{
          xs: 12,
          lg: 5,
        }}
      >
        <SectionCard
          icon={<CheckIcon />}
          title={t(
            "intakeWizard.repair.risksTitle"
          )}
          subtitle={t(
            "intakeWizard.repair.risksSubtitle"
          )}
        >
          <Stack>
            {riskKeys.map(
              (riskKey) => (
                <FormControlLabel
                  key={riskKey}
                  control={
                    <Checkbox />
                  }
                  label={t(
                    riskKey
                  )}
                />
              )
            )}

            <TextField
              label={t(
                "intakeWizard.repair.otherRisk"
              )}
              multiline
              minRows={3}
              fullWidth
              sx={{
                mt: 1.5,
              }}
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
          lg: 7,
        }}
      >
        <SectionCard
          icon={<InventoryIcon />}
          title={t(
            "intakeWizard.price.title"
          )}
        >
          <Stack spacing={2}>
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
                  label={t(
                    "intakeWizard.price.labor"
                  )}
                  type="number"
                  defaultValue={0}
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
                    "intakeWizard.price.parts"
                  )}
                  type="number"
                  defaultValue={0}
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
                    "intakeWizard.price.total"
                  )}
                  type="number"
                  defaultValue={0}
                  fullWidth
                />
              </Grid>
            </Grid>

            <TextField
              label={t(
                "intakeWizard.price.searchPart"
              )}
              placeholder={t(
                "intakeWizard.price.searchPartPlaceholder"
              )}
              fullWidth
              slotProps={{
                input: {
                  startAdornment:
                    <SearchAdornment />,
                },
              }}
            />

            <Alert severity="info">
              {t(
                "intakeWizard.price.partsHint"
              )}
            </Alert>
          </Stack>
        </SectionCard>
      </Grid>

      <Grid
        size={{
          xs: 12,
          lg: 5,
        }}
      >
        <SectionCard
          icon={<CheckIcon />}
          title={t(
            "intakeWizard.price.scheduleTitle"
          )}
        >
          <Stack spacing={2}>
            <TextField
              label={t(
                "intakeWizard.price.dueAt"
              )}
              type="datetime-local"
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <TextField
              select
              label={t(
                "intakeWizard.price.approval"
              )}
              defaultValue="contact"
              fullWidth
            >
              <MenuItem value="approved">
                {t(
                  "intakeWizard.price.approvals.approved"
                )}
              </MenuItem>
              <MenuItem value="contact">
                {t(
                  "intakeWizard.price.approvals.contact"
                )}
              </MenuItem>
              <MenuItem value="limit">
                {t(
                  "intakeWizard.price.approvals.limit"
                )}
              </MenuItem>
            </TextField>

            <Stack>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                  />
                }
                label={t(
                  "intakeWizard.price.communication.phone"
                )}
              />
              <FormControlLabel
                control={
                  <Checkbox />
                }
                label={t(
                  "intakeWizard.price.communication.sms"
                )}
              />
              <FormControlLabel
                control={
                  <Checkbox />
                }
                label={t(
                  "intakeWizard.price.communication.email"
                )}
              />
            </Stack>
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
        sx={{
          borderRadius: 3,
        }}
      >
        {t(
          "intakeWizard.review.success"
        )}
      </Alert>

      <Grid
        container
        spacing={3}
      >
        {reviewSections.map(
          (section) => (
            <Grid
              key={section.titleKey}
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: "100%",
                }}
              >
                <Stack spacing={1.5}>
                  <Typography
                    variant="h6"
                    fontWeight={700}
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
                          {t(
                            lineKey
                          )}
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
    stepKeys.length - 1;

  const renderStep = (): ReactNode => {
    switch (activeStep) {
      case 0:
        return <CustomerDeviceStep />;
      case 1:
        return <DeviceInspectionStep />;
      case 2:
        return <RepairPlanStep />;
      case 3:
        return <PricePartsStep />;
      case 4:
        return <ReviewStep />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100%",
        bgcolor: "grey.50",
        py: {
          xs: 2,
          md: 4,
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
                md: 4,
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
                    sx={{
                      mb: 1.5,
                    }}
                  />

                  <Typography
                    variant="h4"
                    component="h1"
                    fontWeight={800}
                  >
                    {t(
                      "intakeWizard.title"
                    )}
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{
                      mt: 0.75,
                    }}
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
                        stepKeys.length,
                    }
                  )}
                  color="primary"
                  sx={{
                    fontWeight: 700,
                  }}
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
                      fontWeight: 600,
                    },
                    "& .MuiStepIcon-root.Mui-active": {
                      color: "primary.main",
                    },
                    "& .MuiStepIcon-root.Mui-completed": {
                      color: "success.main",
                    },
                  }}
                >
                  {stepKeys.map(
                    (
                      stepKey,
                      index
                    ) => (
                      <Step
                        key={stepKey}
                        completed={
                          index <
                          activeStep
                        }
                      >
                        <StepButton
                          color="inherit"
                          onClick={() => {
                            setActiveStep(
                              index
                            );
                          }}
                        >
                          {t(
                            stepKey
                          )}
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
                md: 4,
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
                startIcon={
                  <ArrowBackIcon />
                }
                disabled={
                  activeStep === 0
                }
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
                        stepKeys.length - 1
                      )
                  );
                }}
              >
                {t(
                  isLastStep
                    ? "intakeWizard.actions.createLater"
                    : "intakeWizard.actions.continue"
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
