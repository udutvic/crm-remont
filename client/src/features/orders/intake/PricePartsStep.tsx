import {
  BatteryChargingFullOutlined as BatteryIcon,
  Inventory2Outlined as InventoryIcon,
  PersonOutline as PersonIcon,
} from "@mui/icons-material";
import {
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import InventoryPartPicker, {
  type SelectedInventoryPart,
} from "./InventoryPartPicker";
import IntakeSectionCard from "./IntakeSectionCard";
import {
  approvalOptions,
  communicationOptions,
  durationOptions,
} from "./intakeWizardConfig";

export interface PricePartsDraft {
  selectedParts: SelectedInventoryPart[];
  laborPrice: number;
}

interface PricePartsStepProps {
  draft: PricePartsDraft;
  onChange: (
    draft: PricePartsDraft
  ) => void;
}

const PricePartsStep = ({
  draft,
  onChange,
}: PricePartsStepProps) => {
  const { t } = useTranslation();

  const partsTotal = useMemo(
    () =>
      draft.selectedParts.reduce(
        (total, part) =>
          total +
          part.quantity *
            part.unitPrice,
        0
      ),
    [draft.selectedParts]
  );

  const estimatedTotal =
    partsTotal + draft.laborPrice;

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 4 }}>
        <IntakeSectionCard
          icon={<InventoryIcon />}
          title={t(
            "intakeWizard.price.title"
          )}
        >
          <Stack spacing={2}>
            <TextField
              label={t(
                "inventoryPartPicker.laborPrice"
              )}
              value={draft.laborPrice}
              type="number"
              fullWidth
              onChange={(event) => {
                onChange({
                  ...draft,
                  laborPrice:
                    Math.max(
                      Number(
                        event.target.value
                      ) || 0,
                      0
                    ),
                });
              }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      Kč
                    </InputAdornment>
                  ),
                },
                htmlInput: {
                  min: 0,
                  step: 1,
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
                    "inventoryPartPicker.partsTotal"
                  ),
                  value: partsTotal,
                },
                {
                  label: t(
                    "inventoryPartPicker.laborPrice"
                  ),
                  value: draft.laborPrice,
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
                    {line.value.toLocaleString()} Kč
                  </Typography>
                </Stack>
              ))}

              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{
                  px: 1.5,
                  py: 1.25,
                  borderTop: "1px solid",
                  borderColor: "divider",
                  bgcolor: "primary.50",
                }}
              >
                <Typography fontWeight={850}>
                  {t(
                    "inventoryPartPicker.estimatedTotal"
                  )}
                </Typography>
                <Typography fontWeight={900}>
                  {estimatedTotal.toLocaleString()} Kč
                </Typography>
              </Stack>
            </Paper>

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
                    control={
                      <Radio size="small" />
                    }
                    label={t(
                      option.labelKey
                    )}
                  />
                )
              )}
            </RadioGroup>
          </Stack>
        </IntakeSectionCard>
      </Grid>

      <Grid size={{ xs: 12, lg: 5 }}>
        <Stack spacing={3}>
          <IntakeSectionCard
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
                    control={
                      <Radio size="small" />
                    }
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
          </IntakeSectionCard>

          <IntakeSectionCard
            icon={<InventoryIcon />}
            title={t(
              "intakeWizard.parts.title"
            )}
          >
            <InventoryPartPicker
              selectedParts={
                draft.selectedParts
              }
              onChange={(selectedParts) => {
                onChange({
                  ...draft,
                  selectedParts,
                });
              }}
            />
          </IntakeSectionCard>
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, lg: 3 }}>
        <IntakeSectionCard
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
              multiline
              minRows={8}
              fullWidth
              sx={{ mt: 1 }}
            />
          </Stack>
        </IntakeSectionCard>
      </Grid>
    </Grid>
  );
};

export default PricePartsStep;
