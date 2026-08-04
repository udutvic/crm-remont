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

  const isLastStep = activeStep === intakeStepKeys.length - 1;

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
        bgcolor: "grey.50",
        py: { xs: 2, md: 3 },
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              background:
                "linear-gradient(135deg, rgba(25, 118, 210, 0.08), rgba(255, 255, 255, 0.98) 48%)",
            }}
          >
            <Stack spacing={3}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Box>
                  <Chip
                    label={t("intakeWizard.badge")}
                    color="primary"
                    variant="outlined"
                    sx={{ mb: 1.25 }}
                  />
                  <Typography variant="h4" component="h1" fontWeight={850}>
                    {t("intakeWizard.title")}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    {t("intakeWizard.subtitle")}
                  </Typography>
                </Box>

                <Chip
                  label={t("intakeWizard.stepCounter", {
                    current: activeStep + 1,
                    total: intakeStepKeys.length,
                  })}
                  color="primary"
                  sx={{ fontWeight: 750 }}
                />
              </Stack>

              <Box sx={{ overflowX: "auto", pb: 0.5 }}>
                <Stepper
                  nonLinear
                  activeStep={activeStep}
                  sx={{
                    minWidth: 760,
                    "& .MuiStepLabel-label": { fontWeight: 650 },
                    "& .MuiStepIcon-root.Mui-completed": {
                      color: "success.main",
                    },
                  }}
                >
                  {intakeStepKeys.map((key, index) => (
                    <Step key={key} completed={index < activeStep}>
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
              p: { xs: 2, sm: 3 },
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
              direction={{ xs: "column-reverse", sm: "row" }}
              spacing={2}
              justifyContent="space-between"
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                disabled={activeStep === 0}
                onClick={() => {
                  setActiveStep((current) => Math.max(current - 1, 0));
                }}
              >
                {t("intakeWizard.actions.back")}
              </Button>

              <Button
                variant="contained"
                endIcon={isLastStep ? <CheckIcon /> : <ArrowForwardIcon />}
                disabled={isLastStep}
                onClick={() => {
                  setActiveStep((current) =>
                    Math.min(current + 1, intakeStepKeys.length - 1)
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
