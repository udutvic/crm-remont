import { useState, type ReactNode } from "react";
import {
  Add as AddIcon,
  BatteryChargingFullOutlined as BatteryIcon,
  BuildOutlined as BuildIcon,
  CameraAltOutlined as CameraIcon,
  CheckCircleOutline as CheckIcon,
  CleaningServicesOutlined as CleaningIcon,
  DeleteOutline as DeleteIcon,
  DevicesOutlined as DeviceIcon,
  Inventory2Outlined as InventoryIcon,
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
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import IntakeSectionCard from "./IntakeSectionCard";
import {
  additionalIssueKeys,
  approvalOptions,
  batteryOptions,
  communicationOptions,
  contaminationKeys,
  durationOptions,
  inspectionGroups,
  overallConditionOptions,
  repairRiskKeys,
  repairTypeOptions,
  reviewSections,
} from "./intakeWizardConfig";

type InspectionGroupId =
  (typeof inspectionGroups)[number]["id"];

const groupIcons: Record<InspectionGroupId, ReactNode> = {
  display: <PhoneIcon />,
  rearGlass: <DeviceIcon />,
  camera: <CameraIcon />,
  frame: <PhoneIcon />,
};

export const DeviceInspectionStep = () => {
  const { t } = useTranslation();
  const [overallCondition, setOverallCondition] = useState("likeNew");
  const [batteryCondition, setBatteryCondition] = useState("unknown");

  return (
    <Stack spacing={3}>
      <IntakeSectionCard
        icon={<DeviceIcon />}
        title={t("intakeWizard.inspection.overallTitle")}
        subtitle={t("intakeWizard.inspection.overallSubtitle")}
      >
        <Grid container spacing={2}>
          {overallConditionOptions.map((option, index) => {
            const selected = overallCondition === option.value;
            const tone = [
              "success.main",
              "warning.main",
              "warning.dark",
              "error.main",
            ][index];

            return (
              <Grid key={option.value} size={{ xs: 12, sm: 6, lg: 3 }}>
                <ButtonBase
                  onClick={() => setOverallCondition(option.value)}
                  sx={{
                    width: "100%",
                    height: "100%",
                    textAlign: "left",
                    alignItems: "stretch",
                    border: "1px solid",
                    borderColor: selected ? tone : "divider",
                    borderRadius: 3,
                    p: 2,
                    bgcolor: selected ? "action.selected" : "background.paper",
                  }}
                >
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Radio
                        checked={selected}
                        size="small"
                        sx={{
                          p: 0,
                          color: tone,
                          "&.Mui-checked": { color: tone },
                        }}
                      />
                      <Typography fontWeight={800} sx={{ color: tone }}>
                        {t(option.labelKey)}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {t(option.descriptionKey)}
                    </Typography>
                  </Stack>
                </ButtonBase>
              </Grid>
            );
          })}
        </Grid>
      </IntakeSectionCard>

      <Typography variant="h6" fontWeight={800}>
        {t("intakeWizard.inspection.visualTitle")}
      </Typography>

      <Grid container spacing={2}>
        {inspectionGroups.map((group) => (
          <Grid key={group.id} size={{ xs: 12, sm: 6, xl: 3 }}>
            <IntakeSectionCard icon={groupIcons[group.id]} title={t(group.titleKey)}>
              <Stack spacing={0.25}>
                {group.optionKeys.map((optionKey) => (
                  <FormControlLabel
                    key={optionKey}
                    control={<Checkbox size="small" />}
                    label={t(optionKey)}
                  />
                ))}
                <TextField
                  label={t("intakeWizard.inspection.note")}
                  multiline
                  minRows={2}
                  fullWidth
                  sx={{ mt: 1 }}
                />
              </Stack>
            </IntakeSectionCard>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <IntakeSectionCard
            icon={<WarningIcon />}
            title={t("intakeWizard.inspection.additional.title")}
          >
            <Stack spacing={0.25}>
              {additionalIssueKeys.map((key) => (
                <FormControlLabel
                  key={key}
                  control={<Checkbox size="small" />}
                  label={t(key)}
                />
              ))}
              <TextField
                label={t("intakeWizard.inspection.additional.note")}
                multiline
                minRows={2}
                fullWidth
                sx={{ mt: 1 }}
              />
            </Stack>
          </IntakeSectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <IntakeSectionCard
            icon={<CleaningIcon />}
            title={t("intakeWizard.inspection.contamination.title")}
          >
            <Stack spacing={0.25}>
              {contaminationKeys.map((key) => (
                <FormControlLabel
                  key={key}
                  control={<Checkbox size="small" />}
                  label={t(key)}
                />
              ))}
              <TextField
                label={t("intakeWizard.inspection.contamination.note")}
                multiline
                minRows={2}
                fullWidth
                sx={{ mt: 1 }}
              />
            </Stack>
          </IntakeSectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <IntakeSectionCard
            icon={<BatteryIcon />}
            title={t("intakeWizard.inspection.battery.title")}
          >
            <RadioGroup
              value={batteryCondition}
              onChange={(event) => setBatteryCondition(event.target.value)}
            >
              {batteryOptions.map((option) => (
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
              ))}
            </RadioGroup>
          </IntakeSectionCard>
        </Grid>
      </Grid>
    </Stack>
  );
};

export const RepairPlanStep = () => {
  const { t } = useTranslation();
  const [repairType, setRepairType] = useState("diagnostics");

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 4 }}>
        <IntakeSectionCard
          icon={<BuildIcon />}
          title={t("intakeWizard.repair.typeTitle")}
        >
          <Stack spacing={1.5}>
            <TextField
              placeholder={t("intakeWizard.repair.typeSearch")}
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
            <Typography variant="caption" fontWeight={750} color="text.secondary">
              {t("intakeWizard.repair.frequentTypes")}
            </Typography>
            <List
              dense
              sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
            >
              {repairTypeOptions.map((option) => (
                <ListItemButton
                  key={option.value}
                  selected={repairType === option.value}
                  onClick={() => setRepairType(option.value)}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <BuildIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={t(option.labelKey)} />
                </ListItemButton>
              ))}
            </List>
            <TextField
              label={t("intakeWizard.repair.otherType")}
              multiline
              minRows={2}
              fullWidth
            />
          </Stack>
        </IntakeSectionCard>
      </Grid>

      <Grid size={{ xs: 12, lg: 4 }}>
        <IntakeSectionCard
          icon={<DeviceIcon />}
          title={t("intakeWizard.repair.problemTitle")}
        >
          <Stack spacing={2}>
            <TextField
              label={t("intakeWizard.repair.customerProblem")}
              multiline
              minRows={5}
              fullWidth
            />
            <TextField
              label={t("intakeWizard.repair.diagnosis")}
              multiline
              minRows={5}
              fullWidth
            />
          </Stack>
        </IntakeSectionCard>
      </Grid>

      <Grid size={{ xs: 12, lg: 4 }}>
        <IntakeSectionCard
          icon={<WarningIcon />}
          title={t("intakeWizard.repair.risksTitle")}
          subtitle={t("intakeWizard.repair.risksSubtitle")}
        >
          <Stack spacing={0.25}>
            {repairRiskKeys.map((key, index) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    size="small"
                    defaultChecked={[0, 2, 4, 6].includes(index)}
                  />
                }
                label={t(key)}
              />
            ))}
            <TextField
              label={t("intakeWizard.repair.riskNote")}
              multiline
              minRows={3}
              fullWidth
              sx={{ mt: 1 }}
            />
          </Stack>
        </IntakeSectionCard>
      </Grid>
    </Grid>
  );
};

export const PricePartsStep = () => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 4 }}>
        <IntakeSectionCard
          icon={<InventoryIcon />}
          title={t("intakeWizard.price.title")}
        >
          <Stack spacing={2}>
            <TextField
              label={t("intakeWizard.price.targetPrice")}
              defaultValue="1500"
              type="number"
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      {t("intakeWizard.price.currency")}
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
              <Typography
                variant="caption"
                fontWeight={750}
                sx={{ display: "block", px: 1.5, py: 1, bgcolor: "grey.50" }}
              >
                {t("intakeWizard.price.breakdown")}
              </Typography>
              {[
                { label: t("intakeWizard.price.partLine"), value: "1 200 Kč" },
                { label: t("intakeWizard.price.laborLine"), value: "300 Kč" },
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
                  <Typography variant="body2">{line.label}</Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {line.value}
                  </Typography>
                </Stack>
              ))}
            </Paper>
            <Button variant="outlined" startIcon={<AddIcon />}>
              {t("intakeWizard.actions.addLine")}
            </Button>
            <Typography variant="subtitle2" fontWeight={800}>
              {t("intakeWizard.price.approvalTitle")}
            </Typography>
            <RadioGroup defaultValue="approved">
              {approvalOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio size="small" />}
                  label={t(option.labelKey)}
                />
              ))}
            </RadioGroup>
          </Stack>
        </IntakeSectionCard>
      </Grid>

      <Grid size={{ xs: 12, lg: 4 }}>
        <Stack spacing={3}>
          <IntakeSectionCard
            icon={<BatteryIcon />}
            title={t("intakeWizard.schedule.title")}
          >
            <RadioGroup defaultValue="24h">
              {durationOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio size="small" />}
                  label={t(option.labelKey)}
                />
              ))}
            </RadioGroup>
            <TextField
              label={t("intakeWizard.schedule.date")}
              type="date"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </IntakeSectionCard>

          <IntakeSectionCard
            icon={<InventoryIcon />}
            title={t("intakeWizard.parts.title")}
          >
            <Stack spacing={1.5}>
              <TextField
                placeholder={t("intakeWizard.parts.search")}
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
              <Typography variant="caption" fontWeight={750} color="text.secondary">
                {t("intakeWizard.parts.selected")}
              </Typography>
              <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    variant="rounded"
                    sx={{ bgcolor: "grey.100", color: "primary.main" }}
                  >
                    <PhoneIcon />
                  </Avatar>
                  <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                    <Typography variant="body2" fontWeight={750} noWrap>
                      {t("intakeWizard.parts.sampleName")}
                    </Typography>
                    <Typography variant="caption" color="primary.main" display="block">
                      {t("intakeWizard.parts.sampleSku")}
                    </Typography>
                    <Typography variant="caption" fontWeight={700}>
                      {t("intakeWizard.parts.samplePrice")}
                    </Typography>
                  </Box>
                  <IconButton size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Paper>
              <Button variant="outlined" startIcon={<AddIcon />}>
                {t("intakeWizard.actions.addPart")}
              </Button>
              <Alert severity="info">
                {t("intakeWizard.parts.reservationHint")}
              </Alert>
            </Stack>
          </IntakeSectionCard>
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, lg: 4 }}>
        <IntakeSectionCard
          icon={<PersonIcon />}
          title={t("intakeWizard.communication.title")}
          subtitle={t("intakeWizard.communication.subtitle")}
        >
          <Stack spacing={1}>
            {communicationOptions.map((option, index) => (
              <FormControlLabel
                key={option.value}
                control={<Checkbox defaultChecked={index !== 1} />}
                label={t(option.labelKey)}
              />
            ))}
            <TextField
              label={t("intakeWizard.communication.note")}
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

export const ReviewStep = () => {
  const { t } = useTranslation();

  return (
    <Stack spacing={3}>
      <Alert severity="success" sx={{ borderRadius: 3 }}>
        {t("intakeWizard.review.hint")}
      </Alert>
      <Grid container spacing={2}>
        {reviewSections.map((section) => (
          <Grid
            key={section.titleKey}
            size={{ xs: 12, sm: 6, lg: 4 }}
          >
            <Paper
              variant="outlined"
              sx={{ p: 2.5, borderRadius: 3, height: "100%" }}
            >
              <Stack spacing={1.25}>
                <Typography variant="h6" fontWeight={800}>
                  {t(section.titleKey)}
                </Typography>
                {section.lineKeys.map((lineKey) => (
                  <Stack
                    key={lineKey}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <CheckIcon color="success" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {t(lineKey)}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};
