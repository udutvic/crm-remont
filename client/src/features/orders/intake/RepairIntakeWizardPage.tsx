import { useState } from "react";
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircleOutline as CheckIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Step,
  StepButton,
  Stepper,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import CustomerDeviceStep, {
  type CustomerDeviceDraft,
} from "./CustomerDeviceStep";
import {
  DeviceInspectionStep,
  RepairPlanStep,
  ReviewStep,
} from "./IntakeWizardSteps";
import PricePartsStep, {
  type PricePartsDraft,
} from "./PricePartsStep";
import { intakeStepKeys } from "./intakeWizardConfig";

const initialCustomerDeviceDraft: CustomerDeviceDraft = {
  selectedClient: null,
  selectedDevice: null,
  selectedCatalogModel: null,
  availableDevices: [],
  client: {
    name: "",
    phone: "",
    secondaryPhone: "",
    email: "",
    address: "",
    note: "",
  },
  device: {
    deviceType: "phone",
    brand: "",
    model: "",
    color: "",
    imei1: "",
    imei2: "",
    serial: "",
  },
  accessType: "none",
  accessCode: "",
  accessVerified: false,
};

const initialPricePartsDraft: PricePartsDraft = {
  selectedParts: [],
  laborPrice: 0,
};

const RepairIntakeWizardPage = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [customerDeviceDraft, setCustomerDeviceDraft] =
    useState(initialCustomerDeviceDraft);
  const [pricePartsDraft, setPricePartsDraft] =
    useState(initialPricePartsDraft);

  const isLastStep =
    activeStep === intakeStepKeys.length - 1;

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <CustomerDeviceStep
            draft={customerDeviceDraft}
            onChange={setCustomerDeviceDraft}
          />
        );
      case 1:
        return <DeviceInspectionStep />;
      case 2:
        return <RepairPlanStep />;
      case 3:
        return (
          <PricePartsStep
            draft={pricePartsDraft}
            onChange={setPricePartsDraft}
          />
        );
      default:
        return <ReviewStep />;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100%",
        bgcolor: "#f5f7fb",
        color: "#07184a",
        py: {
          xs: 2,
          md: 2.5,
        },
        "& .MuiFormLabel-root": {
          color: "#405273",
          fontWeight: 650,
        },
        "& .MuiFormLabel-root.Mui-focused": {
          color: "#075cff",
        },
        "& .MuiFormLabel-asterisk": {
          color: "#d32f2f",
          fontWeight: 900,
        },
        "& .MuiOutlinedInput-root": {
          bgcolor: "#ffffff",
          borderRadius: 1.75,
          "& fieldset": {
            borderColor: "#ccd8e9",
          },
          "&:hover fieldset": {
            borderColor: "#7e9dcc",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#075cff",
            borderWidth: 1.5,
          },
        },
        "& .MuiInputBase-input": {
          color: "#07184a",
        },
        "& .MuiButton-containedPrimary": {
          bgcolor: "#075cff",
          color: "#ffffff",
          boxShadow: "0 5px 14px rgba(7, 92, 255, 0.22)",
          "&:hover": {
            bgcolor: "#004bd6",
          },
        },
        "& .MuiButton-outlinedPrimary": {
          color: "#075cff",
          borderColor: "#9bb7e5",
          "&:hover": {
            borderColor: "#075cff",
            bgcolor: "#edf3ff",
          },
        },
        "& .MuiChip-colorPrimary": {
          bgcolor: "#075cff",
          color: "#ffffff",
        },
        "& .MuiChip-outlinedPrimary": {
          bgcolor: "#eef4ff",
          color: "#075cff",
          borderColor: "#9bb7e5",
        },
        "& .MuiSvgIcon-colorPrimary": {
          color: "#075cff",
        },
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={2.5}>
          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 2,
                sm: 2.5,
              },
              borderRadius: 2.5,
              border: "1px solid #d8e2f0",
              bgcolor: "#ffffff",
              boxShadow: "0 6px 22px rgba(5, 25, 72, 0.045)",
            }}
          >
            <Stack spacing={2.5}>
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
                    label={t("intakeWizard.badge")}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{
                      mb: 1,
                      fontWeight: 750,
                    }}
                  />
                  <Typography
                    variant="h4"
                    component="h1"
                    fontWeight={900}
                    color="#07184a"
                    sx={{
                      fontSize: {
                        xs: "1.65rem",
                        md: "2rem",
                      },
                    }}
                  >
                    {t("intakeWizard.title")}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ mt: 0.4 }}
                  >
                    {t("intakeWizard.subtitle")}
                  </Typography>
                </Box>

                <Chip
                  label={t("intakeWizard.stepCounter", {
                    current: activeStep + 1,
                    total: intakeStepKeys.length,
                  })}
                  color="primary"
                  sx={{ fontWeight: 800 }}
                />
              </Stack>

              <Box
                sx={{
                  overflowX: "auto",
                  pb: 0.25,
                }}
              >
                <Stepper
                  nonLinear
                  activeStep={activeStep}
                  sx={{
                    minWidth: 760,
                    "& .MuiStepConnector-line": {
                      borderColor: "#cfd9e8",
                    },
                    "& .MuiStepLabel-label": {
                      color: "#5b6d89",
                      fontWeight: 700,
                    },
                    "& .MuiStepLabel-label.Mui-active": {
                      color: "#075cff",
                      fontWeight: 850,
                    },
                    "& .MuiStepLabel-label.Mui-completed": {
                      color: "#07184a",
                    },
                    "& .MuiStepIcon-root": {
                      color: "#ffffff",
                      border: "1.5px solid #6f83a3",
                      borderRadius: "50%",
                    },
                    "& .MuiStepIcon-root.Mui-active": {
                      color: "#075cff",
                      borderColor: "#075cff",
                    },
                    "& .MuiStepIcon-root.Mui-completed": {
                      color: "#075cff",
                      borderColor: "#075cff",
                    },
                    "& .MuiStepIcon-text": {
                      fill: "#07184a",
                      fontWeight: 800,
                    },
                    "& .MuiStepIcon-root.Mui-active .MuiStepIcon-text": {
                      fill: "#ffffff",
                    },
                    "& .MuiStepIcon-root.Mui-completed .MuiStepIcon-text": {
                      fill: "#ffffff",
                    },
                  }}
                >
                  {intakeStepKeys.map((key, index) => (
                    <Step
                      key={key}
                      completed={index < activeStep}
                    >
                      <StepButton
                        color="inherit"
                        onClick={() => setActiveStep(index)}
                      >
                        {t(key)}
                      </StepButton>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 1.5,
                sm: 2,
              },
              borderRadius: 2.5,
              border: "1px solid #d8e2f0",
              bgcolor: "#f8faff",
              boxShadow: "0 6px 22px rgba(5, 25, 72, 0.04)",
            }}
          >
            {renderStep()}
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 1.75,
              borderRadius: 2.5,
              border: "1px solid #d8e2f0",
              bgcolor: "#ffffff",
              boxShadow: "0 5px 18px rgba(5, 25, 72, 0.04)",
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
                  setActiveStep((current) =>
                    Math.max(current - 1, 0)
                  );
                }}
              >
                {t("intakeWizard.actions.back")}
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
                  setActiveStep((current) =>
                    Math.min(
                      current + 1,
                      intakeStepKeys.length - 1
                    )
                  );
                }}
              >
                {isLastStep
                  ? t("intakeWizard.actions.createLater")
                  : t("intakeWizard.actions.continue")}
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};

export default RepairIntakeWizardPage;
