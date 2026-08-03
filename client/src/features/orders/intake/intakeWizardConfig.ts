export const intakeStepKeys = [
  "intakeWizard.steps.customerDevice",
  "intakeWizard.steps.inspection",
  "intakeWizard.steps.repairPlan",
  "intakeWizard.steps.priceParts",
  "intakeWizard.steps.review",
] as const;

export const deviceTypeOptions = [
  {
    value: "phone",
    labelKey: "intakeWizard.device.types.phone",
  },
  {
    value: "tablet",
    labelKey: "intakeWizard.device.types.tablet",
  },
  {
    value: "laptop",
    labelKey: "intakeWizard.device.types.laptop",
  },
  {
    value: "smartwatch",
    labelKey: "intakeWizard.device.types.smartwatch",
  },
  {
    value: "other",
    labelKey: "intakeWizard.device.types.other",
  },
] as const;

export const accessTypeOptions = [
  {
    value: "none",
    labelKey: "intakeWizard.access.types.none",
  },
  {
    value: "pin",
    labelKey: "intakeWizard.access.types.pin",
  },
  {
    value: "password",
    labelKey: "intakeWizard.access.types.password",
  },
  {
    value: "pattern",
    labelKey: "intakeWizard.access.types.pattern",
  },
  {
    value: "unknown",
    labelKey: "intakeWizard.access.types.unknown",
  },
] as const;

export const overallConditionOptions = [
  {
    value: "likeNew",
    labelKey: "intakeWizard.inspection.overall.likeNew.label",
    descriptionKey:
      "intakeWizard.inspection.overall.likeNew.description",
  },
  {
    value: "lightWear",
    labelKey: "intakeWizard.inspection.overall.lightWear.label",
    descriptionKey:
      "intakeWizard.inspection.overall.lightWear.description",
  },
  {
    value: "normalWear",
    labelKey: "intakeWizard.inspection.overall.normalWear.label",
    descriptionKey:
      "intakeWizard.inspection.overall.normalWear.description",
  },
  {
    value: "heavyWear",
    labelKey: "intakeWizard.inspection.overall.heavyWear.label",
    descriptionKey:
      "intakeWizard.inspection.overall.heavyWear.description",
  },
] as const;

export const inspectionGroups = [
  {
    id: "display",
    titleKey: "intakeWizard.inspection.groups.display.title",
    optionKeys: [
      "intakeWizard.inspection.groups.display.hairlineScratches",
      "intakeWizard.inspection.groups.display.deepScratches",
      "intakeWizard.inspection.groups.display.cracked",
      "intakeWizard.inspection.groups.display.deadPixels",
      "intakeWizard.inspection.groups.display.colorSpots",
      "intakeWizard.inspection.groups.display.lifting",
    ],
  },
  {
    id: "rearGlass",
    titleKey: "intakeWizard.inspection.groups.rearGlass.title",
    optionKeys: [
      "intakeWizard.inspection.groups.rearGlass.scratches",
      "intakeWizard.inspection.groups.rearGlass.cracked",
      "intakeWizard.inspection.groups.rearGlass.looseCover",
    ],
  },
  {
    id: "camera",
    titleKey: "intakeWizard.inspection.groups.camera.title",
    optionKeys: [
      "intakeWizard.inspection.groups.camera.crackedLens",
      "intakeWizard.inspection.groups.camera.scratchedLens",
      "intakeWizard.inspection.groups.camera.replaced",
    ],
  },
  {
    id: "frame",
    titleKey: "intakeWizard.inspection.groups.frame.title",
    optionKeys: [
      "intakeWizard.inspection.groups.frame.scratches",
      "intakeWizard.inspection.groups.frame.scuffs",
      "intakeWizard.inspection.groups.frame.dents",
      "intakeWizard.inspection.groups.frame.bent",
      "intakeWizard.inspection.groups.frame.paintLoss",
    ],
  },
] as const;

export const additionalIssueKeys = [
  "intakeWizard.inspection.additional.noPower",
  "intakeWizard.inspection.additional.restarts",
  "intakeWizard.inspection.additional.oxidation",
  "intakeWizard.inspection.additional.swollenBattery",
  "intakeWizard.inspection.additional.missingSimTray",
  "intakeWizard.inspection.additional.missingScrews",
] as const;

export const contaminationKeys = [
  "intakeWizard.inspection.contamination.heavy",
  "intakeWizard.inspection.contamination.speaker",
  "intakeWizard.inspection.contamination.microphone",
  "intakeWizard.inspection.contamination.chargingPort",
  "intakeWizard.inspection.contamination.liquidTraces",
] as const;

export const batteryOptions = [
  {
    value: "90-100",
    labelKey: "intakeWizard.inspection.battery.level90",
  },
  {
    value: "80-89",
    labelKey: "intakeWizard.inspection.battery.level80",
  },
  {
    value: "70-79",
    labelKey: "intakeWizard.inspection.battery.level70",
  },
  {
    value: "below-70",
    labelKey: "intakeWizard.inspection.battery.below70",
  },
  {
    value: "unknown",
    labelKey: "intakeWizard.inspection.battery.unknown",
  },
] as const;

export const repairTypeOptions = [
  {
    value: "display-original",
    labelKey: "intakeWizard.repair.types.displayOriginal",
  },
  {
    value: "display-premium",
    labelKey: "intakeWizard.repair.types.displayPremium",
  },
  {
    value: "display-glass",
    labelKey: "intakeWizard.repair.types.displayGlass",
  },
  {
    value: "battery-original",
    labelKey: "intakeWizard.repair.types.batteryOriginal",
  },
  {
    value: "battery-premium",
    labelKey: "intakeWizard.repair.types.batteryPremium",
  },
  {
    value: "rear-glass",
    labelKey: "intakeWizard.repair.types.rearGlass",
  },
  {
    value: "rear-cover",
    labelKey: "intakeWizard.repair.types.rearCover",
  },
  {
    value: "diagnostics",
    labelKey: "intakeWizard.repair.types.diagnostics",
  },
] as const;

export const repairRiskKeys = [
  "intakeWizard.repair.risks.dataLoss",
  "intakeWizard.repair.risks.unrepairable",
  "intakeWizard.repair.risks.noWarranty",
  "intakeWizard.repair.risks.hiddenDefects",
  "intakeWizard.repair.risks.waterDamage",
  "intakeWizard.repair.risks.nonOriginalPart",
  "intakeWizard.repair.risks.waterResistance",
] as const;

export const approvalOptions = [
  {
    value: "approved",
    labelKey: "intakeWizard.price.approval.approved",
  },
  {
    value: "contact",
    labelKey: "intakeWizard.price.approval.contact",
  },
  {
    value: "afterApproval",
    labelKey: "intakeWizard.price.approval.afterApproval",
  },
] as const;

export const durationOptions = [
  {
    value: "24h",
    labelKey: "intakeWizard.schedule.options.within24Hours",
  },
  {
    value: "1-2-days",
    labelKey: "intakeWizard.schedule.options.oneTwoDays",
  },
  {
    value: "2-3-days",
    labelKey: "intakeWizard.schedule.options.twoThreeDays",
  },
  {
    value: "3-5-days",
    labelKey: "intakeWizard.schedule.options.threeFiveDays",
  },
  {
    value: "week-plus",
    labelKey: "intakeWizard.schedule.options.weekOrMore",
  },
  {
    value: "custom",
    labelKey: "intakeWizard.schedule.options.customDate",
  },
] as const;

export const communicationOptions = [
  {
    value: "call",
    labelKey: "intakeWizard.communication.call",
  },
  {
    value: "sms",
    labelKey: "intakeWizard.communication.sms",
  },
  {
    value: "email",
    labelKey: "intakeWizard.communication.email",
  },
] as const;

export const reviewSections = [
  {
    titleKey: "intakeWizard.review.sections.customer.title",
    lineKeys: [
      "intakeWizard.review.sections.customer.contact",
      "intakeWizard.review.sections.customer.note",
    ],
  },
  {
    titleKey: "intakeWizard.review.sections.device.title",
    lineKeys: [
      "intakeWizard.review.sections.device.identity",
      "intakeWizard.review.sections.device.access",
    ],
  },
  {
    titleKey: "intakeWizard.review.sections.inspection.title",
    lineKeys: [
      "intakeWizard.review.sections.inspection.visual",
      "intakeWizard.review.sections.inspection.battery",
    ],
  },
  {
    titleKey: "intakeWizard.review.sections.repair.title",
    lineKeys: [
      "intakeWizard.review.sections.repair.type",
      "intakeWizard.review.sections.repair.risks",
    ],
  },
  {
    titleKey: "intakeWizard.review.sections.price.title",
    lineKeys: [
      "intakeWizard.review.sections.price.breakdown",
      "intakeWizard.review.sections.price.parts",
    ],
  },
  {
    titleKey: "intakeWizard.review.sections.communication.title",
    lineKeys: [
      "intakeWizard.review.sections.communication.channels",
      "intakeWizard.review.sections.communication.deadline",
    ],
  },
] as const;

export const sampleModelNames = [
  "iPhone 15 Pro Max",
  "iPhone 15 Pro",
  "iPhone 15",
  "iPhone 14 Pro Max",
  "iPhone 14 Pro",
  "iPhone 14",
  "iPhone 13 Pro Max",
  "iPhone 13 Pro",
  "iPhone 13",
  "iPhone 12 Pro Max",
  "iPhone 12 Pro",
  "iPhone 12",
] as const;
