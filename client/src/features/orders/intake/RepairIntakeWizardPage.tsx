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

interface SectionCardProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

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
      boxShadow: "0 10px 32px rgba(15, 23, 42, 0.05)",
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

const steps = [
  "Zákazník a zařízení",
  "Stav zařízení",
  "Diagnostika a plán",
  "Cena a díly",
  "Kontrola",
];

const inspectionGroups = [
  {
    title: "Displej",
    options: [
      "Vlasové škrábance",
      "Hlubší škrábance",
      "Prasklý displej",
      "Mrtvé pixely",
    ],
  },
  {
    title: "Zadní kryt",
    options: [
      "Škrábance",
      "Prasklé sklo",
      "Uvolněný kryt",
      "Promáčknutí",
    ],
  },
  {
    title: "Rám a tlačítka",
    options: [
      "Oděrky",
      "Ohnutý rám",
      "Poškozená tlačítka",
      "Chybějící části",
    ],
  },
];

const CustomerDeviceStep = () => {
  const [
    accessType,
    setAccessType,
  ] = useState("none");

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
            title="Zákazník"
            subtitle="Vyhledejte existujícího zákazníka nebo založte nového."
          >
            <Stack spacing={2}>
              <TextField
                label="Telefon"
                placeholder="+420 777 123 456"
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

              <Alert
                severity="info"
                sx={{
                  borderRadius: 2,
                }}
              >
                Po zadání telefonu zde nabídneme nalezeného zákazníka a jeho zařízení.
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
                    label="Jméno a příjmení"
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
                    label="E-mail"
                    type="email"
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Adresa"
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
            title="Zařízení"
            subtitle="Model bude možné vyhledat v katalogu a údaje se doplní automaticky."
          >
            <Stack spacing={2}>
              <TextField
                label="Vyhledat model"
                placeholder="Např. iPhone 15 Pro Max"
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
                    label="Typ zařízení"
                    defaultValue="phone"
                    fullWidth
                  >
                    <MenuItem value="phone">Telefon</MenuItem>
                    <MenuItem value="tablet">Tablet</MenuItem>
                    <MenuItem value="laptop">Notebook</MenuItem>
                    <MenuItem value="smartwatch">Chytré hodinky</MenuItem>
                  </TextField>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 4,
                  }}
                >
                  <TextField
                    label="Výrobce"
                    placeholder="Apple"
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
                    label="Model"
                    placeholder="iPhone 15 Pro Max"
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
                    label="IMEI / sériové číslo"
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
                    label="Barva"
                    placeholder="Natural Titanium"
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
        title="Přístup do zařízení"
        subtitle="Přístupový údaj se uloží šifrovaně."
      >
        <Stack spacing={2}>
          <ToggleButtonGroup
            value={accessType}
            exclusive
            onChange={(
              _,
              value: string | null
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
            <ToggleButton value="none">Bez kódu</ToggleButton>
            <ToggleButton value="pin">PIN</ToggleButton>
            <ToggleButton value="password">Heslo</ToggleButton>
            <ToggleButton value="pattern">Gesto</ToggleButton>
            <ToggleButton value="unknown">Neznámé</ToggleButton>
          </ToggleButtonGroup>

          {[
            "pin",
            "password",
          ].includes(accessType) && (
            <TextField
              label={
                accessType === "pin"
                  ? "PIN"
                  : "Heslo"
              }
              type="password"
              sx={{
                maxWidth: 420,
              }}
            />
          )}

          {accessType === "pattern" && (
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
                Grafický klíč 3 × 3
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Interaktivní mřížku doplníme v dalším balíku.
              </Typography>
            </Paper>
          )}
        </Stack>
      </SectionCard>
    </Stack>
  );
};

const DeviceInspectionStep = () => (
  <Stack spacing={3}>
    <SectionCard
      icon={<DeviceIcon />}
      title="Celkový stav zařízení"
      subtitle="Rychlé hodnocení při převzetí zařízení."
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
        <ToggleButton value="excellent">Výborný</ToggleButton>
        <ToggleButton value="good">Dobrý</ToggleButton>
        <ToggleButton value="used">Běžně opotřebený</ToggleButton>
        <ToggleButton value="damaged">Poškozený</ToggleButton>
      </ToggleButtonGroup>
    </SectionCard>

    <Grid
      container
      spacing={3}
    >
      {inspectionGroups.map(
        (group) => (
          <Grid
            key={group.title}
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <SectionCard
              icon={<CheckIcon />}
              title={group.title}
            >
              <Stack spacing={0.5}>
                {group.options.map(
                  (option) => (
                    <FormControlLabel
                      key={option}
                      control={<Checkbox />}
                      label={option}
                    />
                  )
                )}

                <TextField
                  label="Poznámka"
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
          title="Další zjištění"
        >
          <Stack>
            {[
              "Zařízení je znečištěné",
              "Známky kontaktu s kapalinou",
              "Neoriginální díly",
              "Zařízení se nezapíná",
              "Baterie je nafouklá",
            ].map((label) => (
              <FormControlLabel
                key={label}
                control={<Checkbox />}
                label={label}
              />
            ))}
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
          title="Poznámka k převzetí"
        >
          <TextField
            label="Obecná poznámka"
            placeholder="Doplňující informace o stavu zařízení..."
            multiline
            minRows={6}
            fullWidth
          />
        </SectionCard>
      </Grid>
    </Grid>
  </Stack>
);

const RepairPlanStep = () => (
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
        title="Problém a předběžná diagnostika"
      >
        <Stack spacing={2}>
          <TextField
            label="Popis problému zákazníkem"
            multiline
            minRows={4}
            fullWidth
          />

          <TextField
            label="Předběžná diagnostika"
            multiline
            minRows={4}
            fullWidth
          />

          <TextField
            select
            label="Typ opravy"
            defaultValue="diagnostics"
            fullWidth
          >
            <MenuItem value="diagnostics">Diagnostika</MenuItem>
            <MenuItem value="display">Výměna displeje</MenuItem>
            <MenuItem value="battery">Výměna baterie</MenuItem>
            <MenuItem value="board">Oprava základní desky</MenuItem>
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
        title="Rizika opravy"
        subtitle="Rizika budou uvedena v přejímacím protokolu."
      >
        <Stack>
          {[
            "Možná ztráta dat",
            "Zařízení může být neopravitelné",
            "Oprava bez záruky",
            "Možné skryté vady",
            "Ztráta voděodolnosti",
          ].map((label) => (
            <FormControlLabel
              key={label}
              control={<Checkbox />}
              label={label}
            />
          ))}

          <TextField
            label="Další riziko"
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

const PricePartsStep = () => (
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
        title="Cena a díly"
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
                label="Práce"
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
                label="Díly"
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
                label="Celkem"
                type="number"
                defaultValue={0}
                fullWidth
              />
            </Grid>
          </Grid>

          <TextField
            label="Vyhledat díl ve skladu"
            placeholder="Název, SKU nebo čárový kód"
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

          <Alert severity="info">
            V této fázi se díl pouze vybere. Rezervaci a skutečné odepsání doplníme později.
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
        title="Termín a komunikace"
      >
        <Stack spacing={2}>
          <TextField
            label="Předpokládaný termín dokončení"
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
            label="Schválení opravy"
            defaultValue="contact"
            fullWidth
          >
            <MenuItem value="approved">Schváleno při převzetí</MenuItem>
            <MenuItem value="contact">Kontaktovat před opravou</MenuItem>
            <MenuItem value="limit">Schváleno do cenového limitu</MenuItem>
          </TextField>

          <Stack>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Telefon"
            />
            <FormControlLabel
              control={<Checkbox />}
              label="SMS"
            />
            <FormControlLabel
              control={<Checkbox />}
              label="E-mail"
            />
          </Stack>
        </Stack>
      </SectionCard>
    </Grid>
  </Grid>
);

const ReviewStep = () => (
  <Stack spacing={3}>
    <Alert
      severity="success"
      sx={{
        borderRadius: 3,
      }}
    >
      Zde bude před vytvořením zakázky kompletní kontrola všech vyplněných údajů.
    </Alert>

    <Grid
      container
      spacing={3}
    >
      {[
        {
          title: "Zákazník",
          lines: [
            "Jméno a kontakt",
            "Fakturační údaje",
          ],
        },
        {
          title: "Zařízení",
          lines: [
            "Model, IMEI a barva",
            "Přístup do zařízení",
          ],
        },
        {
          title: "Stav při převzetí",
          lines: [
            "Vizuální kontrola",
            "Další zjištění",
          ],
        },
        {
          title: "Oprava",
          lines: [
            "Diagnostika a rizika",
            "Cena, termín a díly",
          ],
        },
      ].map((item) => (
        <Grid
          key={item.title}
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
                {item.title}
              </Typography>

              {item.lines.map(
                (line) => (
                  <Stack
                    key={line}
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
                      {line}
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

const stepContent = [
  <CustomerDeviceStep key="customer-device" />,
  <DeviceInspectionStep key="inspection" />,
  <RepairPlanStep key="repair-plan" />,
  <PricePartsStep key="price-parts" />,
  <ReviewStep key="review" />,
];

const RepairIntakeWizardPage = () => {
  const [
    activeStep,
    setActiveStep,
  ] = useState(0);

  const isLastStep =
    activeStep ===
    steps.length - 1;

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
                    label="Nový příjem"
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
                    Příjem zařízení do opravy
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{
                      mt: 0.75,
                    }}
                  >
                    Přehledný průvodce od zákazníka až po finální kontrolu zakázky.
                  </Typography>
                </Box>

                <Chip
                  label={`Krok ${activeStep + 1} z ${steps.length}`}
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
                  {steps.map(
                    (
                      label,
                      index
                    ) => (
                      <Step
                        key={label}
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
                          {label}
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
            {stepContent[activeStep]}
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
                Zpět
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
                        steps.length - 1
                      )
                  );
                }}
              >
                {isLastStep
                  ? "Vytvoření zapojíme později"
                  : "Pokračovat"}
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};

export default RepairIntakeWizardPage;
