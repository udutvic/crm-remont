import {
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  AxiosError,
} from "axios";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  Controller,
  useForm,
} from "react-hook-form";
import {
  useTranslation,
} from "react-i18next";

import {
  getDevices,
  lookupClientByPhone,
} from "index";
import type {
  Client,
  Device,
  DeviceType,
  IntakeClientSelection,
  IntakeDeviceSelection,
  OrderAccessType,
  OrderIntakePayload,
  RepairIntakeErrorResponse,
  RepairIntakePayload,
} from "types";

interface RepairIntakeFormProps {
  open: boolean;
  clients: Client[];

  onClose: () => void;

  onSubmit: (
    payload: RepairIntakePayload
  ) => Promise<void>;
}

type SelectionMode =
  | "existing"
  | "new";

type PersistedClient =
  Client & {
    id: number;
  };

type PersistedDevice =
  Device & {
    id: number;
  };

interface LookupFeedback {
  severity:
    | "success"
    | "info"
    | "error";

  message: string;
}

interface IntakeFormValues {
  clientMode: SelectionMode;
  existingClientId:
    | number
    | "";

  clientName: string;
  clientPhone: string;
  clientSecondaryPhone: string;
  clientEmail: string;
  clientAddress: string;
  clientNote: string;

  deviceMode: SelectionMode;
  existingDeviceId:
    | number
    | "";

  deviceType: DeviceType;
  deviceBrand: string;
  deviceModel: string;
  deviceImei1: string;
  deviceImei2: string;
  deviceSerial: string;
  deviceColor: string;

  problem: string;
  deviceCondition: string;
  accessories: string;

  accessType: OrderAccessType;
  accessCode: string;

  estimatedPrice:
    | number
    | "";

  receivedAt: string;
  dueAt: string;
  internalNote: string;
}

const deviceTypeOptions: DeviceType[] = [
  "phone",
  "tablet",
  "laptop",
  "smartwatch",
  "other",
];

const accessTypeOptions: OrderAccessType[] = [
  "none",
  "pin",
  "password",
  "pattern",
  "unknown",
];

const requiredAccessCodeTypes =
  new Set<OrderAccessType>([
    "pin",
    "password",
    "pattern",
  ]);

const emailPattern =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toDateTimeLocal = (
  value: string
): string => {
  const date =
    new Date(value);

  const localDate =
    new Date(
      date.getTime() -
        date.getTimezoneOffset() *
          60_000
    );

  return localDate
    .toISOString()
    .slice(0, 16);
};

const toIsoDate = (
  value: string
): string | null => {
  if (!value) {
    return null;
  }

  const date =
    new Date(value);

  return Number.isNaN(
    date.getTime()
  )
    ? null
    : date.toISOString();
};

const toNullableText = (
  value: string
): string | null => {
  const normalized =
    value.trim();

  return normalized || null;
};

const countDigits = (
  value: string
): number =>
  value.replace(
    /\D/g,
    ""
  ).length;

const normalizeImei = (
  value: string
): string =>
  value.replace(
    /\D/g,
    ""
  );

const createDefaultValues =
  (): IntakeFormValues => ({
    clientMode:
      "new",
    existingClientId:
      "",

    clientName: "",
    clientPhone: "",
    clientSecondaryPhone:
      "",
    clientEmail: "",
    clientAddress: "",
    clientNote: "",

    deviceMode:
      "new",
    existingDeviceId:
      "",

    deviceType: "phone",
    deviceBrand: "",
    deviceModel: "",
    deviceImei1: "",
    deviceImei2: "",
    deviceSerial: "",
    deviceColor: "",

    problem: "",
    deviceCondition: "",
    accessories: "",

    accessType: "none",
    accessCode: "",

    estimatedPrice: 0,

    receivedAt:
      toDateTimeLocal(
        new Date().toISOString()
      ),

    dueAt: "",
    internalNote: "",
  });

const priceFieldSx = {
  "& input[type=number]": {
    MozAppearance:
      "textfield",
  },

  "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
    {
      WebkitAppearance:
        "none",
      margin: 0,
    },
};

const RepairIntakeForm = ({
  open,
  clients,
  onClose,
  onSubmit,
}: RepairIntakeFormProps) => {
  const {
    t,
  } = useTranslation();

  const [
    availableClients,
    setAvailableClients,
  ] = useState<Client[]>(
    clients
  );

  const [
    devices,
    setDevices,
  ] = useState<Device[]>([]);

  const [
    serverError,
    setServerError,
  ] = useState<
    string | null
  >(null);

  const [
    lookupFeedback,
    setLookupFeedback,
  ] = useState<
    LookupFeedback | null
  >(null);

  const [
    lookupLoading,
    setLookupLoading,
  ] = useState(false);

  const {
    control,
    getValues,
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<IntakeFormValues>({
    defaultValues:
      createDefaultValues(),
  });

  const clientMode =
    watch("clientMode");

  const existingClientId =
    watch(
      "existingClientId"
    );

  const deviceMode =
    watch("deviceMode");

  const accessType =
    watch("accessType");

  const persistedClients =
    useMemo(
      () =>
        availableClients.filter(
          (
            client
          ): client is PersistedClient =>
            typeof client.id ===
            "number"
        ),
      [availableClients]
    );

  const persistedDevices =
    useMemo(() => {
      if (
        existingClientId ===
        ""
      ) {
        return [];
      }

      return devices.filter(
        (
          device
        ): device is PersistedDevice =>
          typeof device.id ===
            "number" &&
          device.clientId ===
            existingClientId
      );
    }, [
      devices,
      existingClientId,
    ]);

  const accessCodeRequired =
    requiredAccessCodeTypes.has(
      accessType
    );

  useEffect(() => {
    setAvailableClients(
      clients
    );
  }, [clients]);

  useEffect(() => {
    if (!open) {
      return;
    }

    reset(
      createDefaultValues()
    );

    setServerError(null);
    setLookupFeedback(null);

    const loadDevices =
      async (): Promise<void> => {
        try {
          const data =
            await getDevices();

          setDevices(data);
        } catch (
          error: unknown
        ) {
          console.error(
            "Error loading devices for intake:",
            error
          );

          setServerError(
            t(
              "repairIntake.errors.loadDevices"
            )
          );
        }
      };

    void loadDevices();
  }, [
    open,
    reset,
    t,
  ]);

  useEffect(() => {
    if (
      clientMode !== "new"
    ) {
      return;
    }

    setValue(
      "existingClientId",
      ""
    );

    setValue(
      "deviceMode",
      "new"
    );

    setValue(
      "existingDeviceId",
      ""
    );
  }, [
    clientMode,
    setValue,
  ]);

  useEffect(() => {
    setValue(
      "existingDeviceId",
      ""
    );
  }, [
    existingClientId,
    setValue,
  ]);

  const validatePhone = (
    value: string,
    required: boolean
  ): true | string => {
    const normalized =
      value.trim();

    if (
      required &&
      !normalized
    ) {
      return t(
        "clientForm.validation.phoneRequired"
      );
    }

    if (!normalized) {
      return true;
    }

    const digits =
      countDigits(
        normalized
      );

    return (
      (digits >= 8 &&
        digits <= 15) ||
      t(
        "clientForm.validation.phoneInvalid"
      )
    );
  };

  const validateImei = (
    value: string
  ): true | string => {
    const normalized =
      value.trim();

    if (!normalized) {
      return true;
    }

    if (
      !/^[0-9\s-]+$/.test(
        normalized
      )
    ) {
      return t(
        "deviceForm.validation.imeiCharacters"
      );
    }

    return (
      normalizeImei(
        normalized
      ).length === 15 ||
      t(
        "deviceForm.validation.imeiLength"
      )
    );
  };

  const handlePhoneLookup =
    async (): Promise<void> => {
      const phone =
        getValues(
          "clientPhone"
        ).trim();

      const validationResult =
        validatePhone(
          phone,
          true
        );

      if (
        validationResult !==
        true
      ) {
        setLookupFeedback({
          severity: "error",
          message:
            validationResult,
        });

        return;
      }

      try {
        setLookupLoading(true);
        setLookupFeedback(null);

        const result =
          await lookupClientByPhone(
            phone
          );

        if (
          result.found &&
          result.client &&
          typeof result.client.id ===
            "number"
        ) {
          const foundClient =
            result.client;

          const foundClientId =
            result.client.id;

          setAvailableClients(
            (currentClients) => {
              const alreadyExists =
                currentClients.some(
                  (client) =>
                    client.id ===
                    foundClient.id
                );

              return alreadyExists
                ? currentClients
                : [
                    ...currentClients,
                    foundClient,
                  ];
            }
          );

          setValue(
            "clientMode",
            "existing"
          );

          setValue(
            "existingClientId",
            foundClientId
          );

          setLookupFeedback({
            severity:
              "success",

            message: t(
              "repairIntake.lookup.found"
            ),
          });

          return;
        }

        setLookupFeedback({
          severity: "info",

          message: t(
            "repairIntake.lookup.notFound"
          ),
        });
      } catch (
        error: unknown
      ) {
        console.error(
          "Client phone lookup failed:",
          error
        );

        setLookupFeedback({
          severity: "error",

          message: t(
            "repairIntake.lookup.failed"
          ),
        });
      } finally {
        setLookupLoading(false);
      }
    };

  const handleFormSubmit =
    async (
      values: IntakeFormValues
    ): Promise<void> => {
      const clientSelection:
        IntakeClientSelection =
        values.clientMode ===
        "existing"
          ? {
              mode:
                "existing",

              id: Number(
                values.existingClientId
              ),
            }
          : {
              mode: "new",

              data: {
                name:
                  values.clientName.trim(),

                phone:
                  values.clientPhone.trim(),

                secondaryPhone:
                  toNullableText(
                    values.clientSecondaryPhone
                  ),

                email:
                  toNullableText(
                    values.clientEmail
                  ),

                address:
                  toNullableText(
                    values.clientAddress
                  ),

                note:
                  toNullableText(
                    values.clientNote
                  ),
              },
            };

      const deviceSelection:
        IntakeDeviceSelection =
        values.deviceMode ===
        "existing"
          ? {
              mode:
                "existing",

              id: Number(
                values.existingDeviceId
              ),
            }
          : {
              mode: "new",

              data: {
                deviceType:
                  values.deviceType,

                brand:
                  values.deviceBrand.trim(),

                model:
                  values.deviceModel.trim(),

                imei1:
                  toNullableText(
                    values.deviceImei1
                  ),

                imei2:
                  toNullableText(
                    values.deviceImei2
                  ),

                serial:
                  toNullableText(
                    values.deviceSerial
                  ),

                color:
                  toNullableText(
                    values.deviceColor
                  ),
              },
            };

      const estimatedPrice =
        values.estimatedPrice ===
        ""
          ? 0
          : Number(
              values.estimatedPrice
            );

      const order:
        OrderIntakePayload = {
          problem:
            values.problem.trim(),

          status:
            "pending" as const,

          price:
            estimatedPrice,

          estimatedPrice,

          finalPrice: null,

          deviceCondition:
            toNullableText(
              values.deviceCondition
            ),

          accessories:
            toNullableText(
              values.accessories
            ),

          accessType:
            values.accessType,

          diagnosis: null,
          workPerformed: null,

          internalNote:
            toNullableText(
              values.internalNote
            ),

          receivedAt:
            toIsoDate(
              values.receivedAt
            ) ??
            new Date().toISOString(),

          dueAt:
            toIsoDate(
              values.dueAt
            ),
        };

      if (
        accessCodeRequired
      ) {
        order.accessCode =
          values.accessCode.trim();
      }

      const payload:
        RepairIntakePayload = {
          client:
            clientSelection,

          device:
            deviceSelection,

          order,
        };

      try {
        setServerError(null);

        await onSubmit(
          payload
        );

        reset(
          createDefaultValues()
        );
      } catch (
        error: unknown
      ) {
        console.error(
          "Error creating repair intake:",
          error
        );

        const axiosError =
          error as AxiosError<RepairIntakeErrorResponse>;

        const response =
          axiosError.response
            ?.data;

        const detailsMessage =
          response?.details
            ? Object.values(
                response.details
              )
                .filter(Boolean)
                .join(" ")
            : "";

        const codeMessage =
          response?.code
            ? t(
                `repairIntake.errors.codes.${response.code}`,
                {
                  defaultValue:
                    "",
                }
              )
            : "";

        setServerError(
          detailsMessage ||
            codeMessage ||
            response?.error ||
            t(
              "repairIntake.errors.save"
            )
        );
      }
    };

  const handleCancel =
    (): void => {
      reset(
        createDefaultValues()
      );

      setServerError(null);
      setLookupFeedback(null);
      onClose();
    };

  return (
    <Dialog
      open={open}
      onClose={
        isSubmitting
          ? undefined
          : handleCancel
      }
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        {t(
          "repairIntake.title"
        )}
      </DialogTitle>

      <Box
        component="form"
        onSubmit={handleSubmit(
          handleFormSubmit
        )}
      >
        <DialogContent dividers>
          <Stack spacing={3}>
            <Alert severity="info">
              {t(
                "repairIntake.intro"
              )}
            </Alert>

            {serverError && (
              <Alert severity="error">
                {serverError}
              </Alert>
            )}

            <Box>
              <Typography
                variant="h6"
                gutterBottom
              >
                {t(
                  "repairIntake.sections.client"
                )}
              </Typography>

              <Controller
                name="clientMode"
                control={control}
                render={({
                  field,
                }) => (
                  <ToggleButtonGroup
                    exclusive
                    value={
                      field.value
                    }
                    onChange={(
                      _event,
                      nextMode:
                        SelectionMode | null
                    ) => {
                      if (
                        nextMode
                      ) {
                        field.onChange(
                          nextMode
                        );
                      }
                    }}
                    size="small"
                    sx={{
                      mb: 2,
                    }}
                  >
                    <ToggleButton value="new">
                      {t(
                        "repairIntake.modes.new"
                      )}
                    </ToggleButton>

                    <ToggleButton value="existing">
                      {t(
                        "repairIntake.modes.existing"
                      )}
                    </ToggleButton>
                  </ToggleButtonGroup>
                )}
              />

              {clientMode ===
              "existing" ? (
                <Controller
                  name="existingClientId"
                  control={control}
                  rules={{
                    validate: (
                      value
                    ) =>
                      value !==
                        "" ||
                      t(
                        "orderForm.validation.clientRequired"
                      ),
                  }}
                  render={({
                    field,
                    fieldState,
                  }) => (
                    <Autocomplete
                      options={
                        persistedClients
                      }
                      value={
                        persistedClients.find(
                          (client) =>
                            client.id ===
                            field.value
                        ) ?? null
                      }
                      onChange={(
                        _event,
                        option
                      ) => {
                        field.onChange(
                          option?.id ??
                            ""
                        );
                      }}
                      isOptionEqualToValue={(
                        option,
                        value
                      ) =>
                        option.id ===
                        value.id
                      }
                      getOptionLabel={(
                        option
                      ) =>
                        `${option.name} (${option.phone})`
                      }
                      renderInput={(
                        params
                      ) => (
                        <TextField
                          {...params}
                          label={t(
                            "repairIntake.fields.existingClient"
                          )}
                          error={Boolean(
                            fieldState.error
                          )}
                          helperText={
                            fieldState
                              .error
                              ?.message
                          }
                        />
                      )}
                    />
                  )}
                />
              ) : (
                <Grid
                  container
                  spacing={2}
                >
                  <Grid
                    size={{
                      xs: 12,
                      md: 6,
                    }}
                  >
                    <TextField
                      {...register(
                        "clientName",
                        {
                          required: t(
                            "clientForm.validation.nameRequired"
                          ),

                          maxLength: {
                            value: 120,

                            message: t(
                              "clientForm.validation.nameMax"
                            ),
                          },
                        }
                      )}
                      label={t(
                        "clientForm.fields.fullName"
                      )}
                      error={Boolean(
                        errors.clientName
                      )}
                      helperText={
                        errors.clientName
                          ?.message
                      }
                      fullWidth
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 8,
                    }}
                  >
                    <TextField
                      {...register(
                        "clientPhone",
                        {
                          validate: (
                            value
                          ) =>
                            validatePhone(
                              value,
                              true
                            ),
                        }
                      )}
                      label={t(
                        "clientForm.fields.phone"
                      )}
                      error={Boolean(
                        errors.clientPhone
                      )}
                      helperText={
                        errors.clientPhone
                          ?.message
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
                    <Button
                      type="button"
                      variant="outlined"
                      disabled={
                        lookupLoading
                      }
                      startIcon={
                        lookupLoading ? (
                          <CircularProgress
                            size={16}
                          />
                        ) : undefined
                      }
                      onClick={() => {
                        void handlePhoneLookup();
                      }}
                      fullWidth
                      sx={{
                        height:
                          "100%",
                        minHeight: 56,
                      }}
                    >
                      {lookupLoading
                        ? t(
                            "repairIntake.lookup.checking"
                          )
                        : t(
                            "repairIntake.lookup.checkPhone"
                          )}
                    </Button>
                  </Grid>

                  {lookupFeedback && (
                    <Grid
                      size={{
                        xs: 12,
                      }}
                    >
                      <Alert
                        severity={
                          lookupFeedback.severity
                        }
                      >
                        {
                          lookupFeedback.message
                        }
                      </Alert>
                    </Grid>
                  )}

                  <Grid
                    size={{
                      xs: 12,
                      md: 6,
                    }}
                  >
                    <TextField
                      {...register(
                        "clientSecondaryPhone",
                        {
                          validate: (
                            value
                          ) =>
                            validatePhone(
                              value,
                              false
                            ),
                        }
                      )}
                      label={t(
                        "clientForm.fields.secondaryPhone"
                      )}
                      error={Boolean(
                        errors.clientSecondaryPhone
                      )}
                      helperText={
                        errors.clientSecondaryPhone
                          ?.message ??
                        t(
                          "clientForm.helpers.optional"
                        )
                      }
                      fullWidth
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 6,
                    }}
                  >
                    <TextField
                      {...register(
                        "clientEmail",
                        {
                          validate: (
                            value
                          ) =>
                            !value.trim() ||
                            emailPattern.test(
                              value.trim()
                            ) ||
                            t(
                              "clientForm.validation.emailInvalid"
                            ),

                          maxLength: {
                            value: 160,

                            message: t(
                              "clientForm.validation.emailMax"
                            ),
                          },
                        }
                      )}
                      label={t(
                        "clientForm.fields.email"
                      )}
                      error={Boolean(
                        errors.clientEmail
                      )}
                      helperText={
                        errors.clientEmail
                          ?.message ??
                        t(
                          "clientForm.helpers.optional"
                        )
                      }
                      fullWidth
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                    }}
                  >
                    <TextField
                      {...register(
                        "clientAddress",
                        {
                          maxLength: {
                            value: 255,

                            message: t(
                              "clientForm.validation.addressMax"
                            ),
                          },
                        }
                      )}
                      label={t(
                        "clientForm.fields.address"
                      )}
                      error={Boolean(
                        errors.clientAddress
                      )}
                      helperText={
                        errors.clientAddress
                          ?.message ??
                        t(
                          "clientForm.helpers.optional"
                        )
                      }
                      fullWidth
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                    }}
                  >
                    <TextField
                      {...register(
                        "clientNote",
                        {
                          maxLength: {
                            value: 2000,

                            message: t(
                              "clientForm.validation.noteMax"
                            ),
                          },
                        }
                      )}
                      label={t(
                        "clientForm.fields.note"
                      )}
                      error={Boolean(
                        errors.clientNote
                      )}
                      helperText={
                        errors.clientNote
                          ?.message ??
                        t(
                          "clientForm.helpers.note"
                        )
                      }
                      multiline
                      minRows={2}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              )}
            </Box>

            <Divider />

            <Box>
              <Typography
                variant="h6"
                gutterBottom
              >
                {t(
                  "repairIntake.sections.device"
                )}
              </Typography>

              <Controller
                name="deviceMode"
                control={control}
                render={({
                  field,
                }) => (
                  <ToggleButtonGroup
                    exclusive
                    value={
                      field.value
                    }
                    onChange={(
                      _event,
                      nextMode:
                        SelectionMode | null
                    ) => {
                      if (
                        nextMode
                      ) {
                        field.onChange(
                          nextMode
                        );
                      }
                    }}
                    size="small"
                    sx={{
                      mb: 2,
                    }}
                  >
                    <ToggleButton value="new">
                      {t(
                        "repairIntake.modes.new"
                      )}
                    </ToggleButton>

                    <ToggleButton
                      value="existing"
                      disabled={
                        clientMode ===
                        "new"
                      }
                    >
                      {t(
                        "repairIntake.modes.existing"
                      )}
                    </ToggleButton>
                  </ToggleButtonGroup>
                )}
              />

              {clientMode ===
                "new" && (
                <Alert
                  severity="info"
                  sx={{
                    mb: 2,
                  }}
                >
                  {t(
                    "repairIntake.helpers.newClientNewDevice"
                  )}
                </Alert>
              )}

              {deviceMode ===
              "existing" ? (
                existingClientId ===
                "" ? (
                  <Alert severity="info">
                    {t(
                      "repairIntake.helpers.selectClientFirst"
                    )}
                  </Alert>
                ) : (
                  <Controller
                    name="existingDeviceId"
                    control={control}
                    rules={{
                      validate: (
                        value
                      ) =>
                        value !==
                          "" ||
                        t(
                          "orderForm.validation.deviceRequired"
                        ),
                    }}
                    render={({
                      field,
                      fieldState,
                    }) => (
                      <Autocomplete
                        options={
                          persistedDevices
                        }
                        value={
                          persistedDevices.find(
                            (device) =>
                              device.id ===
                              field.value
                          ) ?? null
                        }
                        onChange={(
                          _event,
                          option
                        ) => {
                          field.onChange(
                            option?.id ??
                              ""
                          );
                        }}
                        isOptionEqualToValue={(
                          option,
                          value
                        ) =>
                          option.id ===
                          value.id
                        }
                        getOptionLabel={(
                          option
                        ) => {
                          const identifier =
                            option.imei1 ||
                            option.serial ||
                            option.imei2;

                          return identifier
                            ? `${option.brand} ${option.model} — ${identifier}`
                            : `${option.brand} ${option.model}`;
                        }}
                        noOptionsText={t(
                          "repairIntake.helpers.noDevices"
                        )}
                        renderInput={(
                          params
                        ) => (
                          <TextField
                            {...params}
                            label={t(
                              "repairIntake.fields.existingDevice"
                            )}
                            error={Boolean(
                              fieldState.error
                            )}
                            helperText={
                              fieldState
                                .error
                                ?.message
                            }
                          />
                        )}
                      />
                    )}
                  />
                )
              ) : (
                <Grid
                  container
                  spacing={2}
                >
                  <Grid
                    size={{
                      xs: 12,
                      md: 4,
                    }}
                  >
                    <Controller
                      name="deviceType"
                      control={control}
                      render={({
                        field,
                      }) => (
                        <TextField
                          {...field}
                          select
                          label={t(
                            "deviceForm.fields.deviceType"
                          )}
                          fullWidth
                        >
                          {deviceTypeOptions.map(
                            (
                              option
                            ) => (
                              <MenuItem
                                key={
                                  option
                                }
                                value={
                                  option
                                }
                              >
                                {t(
                                  `deviceForm.deviceTypes.${option}`
                                )}
                              </MenuItem>
                            )
                          )}
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 4,
                    }}
                  >
                    <TextField
                      {...register(
                        "deviceBrand",
                        {
                          required: t(
                            "deviceForm.validation.brandRequired"
                          ),

                          maxLength: {
                            value: 120,

                            message: t(
                              "deviceForm.validation.brandMax"
                            ),
                          },
                        }
                      )}
                      label={t(
                        "deviceForm.fields.brand"
                      )}
                      error={Boolean(
                        errors.deviceBrand
                      )}
                      helperText={
                        errors.deviceBrand
                          ?.message
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
                    <TextField
                      {...register(
                        "deviceModel",
                        {
                          required: t(
                            "deviceForm.validation.modelRequired"
                          ),

                          maxLength: {
                            value: 120,

                            message: t(
                              "deviceForm.validation.modelMax"
                            ),
                          },
                        }
                      )}
                      label={t(
                        "deviceForm.fields.model"
                      )}
                      error={Boolean(
                        errors.deviceModel
                      )}
                      helperText={
                        errors.deviceModel
                          ?.message
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
                    <TextField
                      {...register(
                        "deviceColor",
                        {
                          maxLength: {
                            value: 80,

                            message: t(
                              "deviceForm.validation.colorMax"
                            ),
                          },
                        }
                      )}
                      label={t(
                        "deviceForm.fields.color"
                      )}
                      error={Boolean(
                        errors.deviceColor
                      )}
                      helperText={
                        errors.deviceColor
                          ?.message ??
                        t(
                          "deviceForm.helpers.optional"
                        )
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
                    <TextField
                      {...register(
                        "deviceImei1",
                        {
                          validate:
                            validateImei,
                        }
                      )}
                      label={t(
                        "deviceForm.fields.imei1"
                      )}
                      error={Boolean(
                        errors.deviceImei1
                      )}
                      helperText={
                        errors.deviceImei1
                          ?.message ??
                        t(
                          "deviceForm.helpers.imei"
                        )
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
                    <TextField
                      {...register(
                        "deviceImei2",
                        {
                          validate: (
                            value
                          ) => {
                            const formatResult =
                              validateImei(
                                value
                              );

                            if (
                              formatResult !==
                              true
                            ) {
                              return formatResult;
                            }

                            const imei1 =
                              normalizeImei(
                                getValues(
                                  "deviceImei1"
                                )
                              );

                            const imei2 =
                              normalizeImei(
                                value
                              );

                            return (
                              !imei1 ||
                              !imei2 ||
                              imei1 !==
                                imei2 ||
                              t(
                                "deviceForm.validation.imeiLength"
                              )
                            );
                          },
                        }
                      )}
                      label={t(
                        "deviceForm.fields.imei2"
                      )}
                      error={Boolean(
                        errors.deviceImei2
                      )}
                      helperText={
                        errors.deviceImei2
                          ?.message ??
                        t(
                          "deviceForm.helpers.imei"
                        )
                      }
                      fullWidth
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 6,
                    }}
                  >
                    <TextField
                      {...register(
                        "deviceSerial",
                        {
                          maxLength: {
                            value: 100,

                            message: t(
                              "deviceForm.validation.serialMax"
                            ),
                          },
                        }
                      )}
                      label={t(
                        "deviceForm.fields.serial"
                      )}
                      error={Boolean(
                        errors.deviceSerial
                      )}
                      helperText={
                        errors.deviceSerial
                          ?.message ??
                        t(
                          "deviceForm.helpers.optional"
                        )
                      }
                      fullWidth
                    />
                  </Grid>
                </Grid>
              )}
            </Box>

            <Divider />

            <Box>
              <Typography
                variant="h6"
                gutterBottom
              >
                {t(
                  "repairIntake.sections.order"
                )}
              </Typography>

              <Grid
                container
                spacing={2}
              >
                <Grid
                  size={{
                    xs: 12,
                  }}
                >
                  <TextField
                    {...register(
                      "problem",
                      {
                        required: t(
                          "orderForm.validation.problemRequired"
                        ),

                        maxLength: {
                          value: 255,

                          message: t(
                            "orderForm.validation.problemMax"
                          ),
                        },
                      }
                    )}
                    label={t(
                      "orderForm.fields.reportedProblem"
                    )}
                    error={Boolean(
                      errors.problem
                    )}
                    helperText={
                      errors.problem
                        ?.message
                    }
                    multiline
                    minRows={2}
                    fullWidth
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <TextField
                    {...register(
                      "deviceCondition",
                      {
                        maxLength:
                          5000,
                      }
                    )}
                    label={t(
                      "orderForm.fields.deviceCondition"
                    )}
                    placeholder={t(
                      "orderForm.placeholders.deviceCondition"
                    )}
                    multiline
                    minRows={2}
                    fullWidth
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <TextField
                    {...register(
                      "accessories",
                      {
                        maxLength:
                          2000,
                      }
                    )}
                    label={t(
                      "orderForm.fields.accessories"
                    )}
                    placeholder={t(
                      "orderForm.placeholders.accessories"
                    )}
                    multiline
                    minRows={2}
                    fullWidth
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 4,
                  }}
                >
                  <Controller
                    name="accessType"
                    control={control}
                    render={({
                      field,
                    }) => (
                      <TextField
                        {...field}
                        select
                        label={t(
                          "orderForm.fields.accessType"
                        )}
                        fullWidth
                      >
                        {accessTypeOptions.map(
                          (
                            option
                          ) => (
                            <MenuItem
                              key={
                                option
                              }
                              value={
                                option
                              }
                            >
                              {t(
                                `orderForm.accessTypes.${option}`
                              )}
                            </MenuItem>
                          )
                        )}
                      </TextField>
                    )}
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 4,
                  }}
                >
                  <TextField
                    {...register(
                      "accessCode",
                      {
                        validate: (
                          value
                        ) =>
                          !accessCodeRequired ||
                          Boolean(
                            value.trim()
                          ) ||
                          t(
                            "orderForm.validation.accessCodeRequired"
                          ),

                        maxLength: {
                          value: 256,

                          message: t(
                            "orderForm.validation.accessCodeMax"
                          ),
                        },
                      }
                    )}
                    label={t(
                      "orderForm.fields.accessCode"
                    )}
                    error={Boolean(
                      errors.accessCode
                    )}
                    helperText={
                      errors.accessCode
                        ?.message ??
                      (accessType ===
                      "pattern"
                        ? t(
                            "orderForm.helpers.patternExample"
                          )
                        : undefined)
                    }
                    disabled={
                      !accessCodeRequired
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
                  <Controller
                    name="estimatedPrice"
                    control={control}
                    rules={{
                      validate: (
                        value
                      ) => {
                        if (
                          value ===
                          ""
                        ) {
                          return true;
                        }

                        const number =
                          Number(
                            value
                          );

                        if (
                          number < 0
                        ) {
                          return t(
                            "orderForm.validation.estimatedNonNegative"
                          );
                        }

                        return (
                          Number.isInteger(
                            number
                          ) ||
                          t(
                            "orderForm.validation.estimatedWhole"
                          )
                        );
                      },
                    }}
                    render={({
                      field,
                      fieldState,
                    }) => (
                      <TextField
                        {...field}
                        type="number"
                        label={t(
                          "orderForm.fields.estimatedPrice"
                        )}
                        error={Boolean(
                          fieldState.error
                        )}
                        helperText={
                          fieldState
                            .error
                            ?.message
                        }
                        onChange={(
                          event
                        ) => {
                          const value =
                            event.target
                              .value;

                          field.onChange(
                            value ===
                              ""
                              ? ""
                              : Number(
                                  value
                                )
                          );
                        }}
                        slotProps={{
                          htmlInput: {
                            min: 0,
                            step: 1,
                          },
                        }}
                        sx={
                          priceFieldSx
                        }
                        fullWidth
                      />
                    )}
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <TextField
                    {...register(
                      "receivedAt",
                      {
                        required: t(
                          "orderForm.validation.receivedRequired"
                        ),
                      }
                    )}
                    type="datetime-local"
                    label={t(
                      "orderForm.fields.receivedAt"
                    )}
                    error={Boolean(
                      errors.receivedAt
                    )}
                    helperText={
                      errors.receivedAt
                        ?.message
                    }
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    fullWidth
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <TextField
                    {...register(
                      "dueAt",
                      {
                        validate: (
                          value
                        ) => {
                          if (!value) {
                            return true;
                          }

                          const received =
                            getValues(
                              "receivedAt"
                            );

                          if (
                            !received
                          ) {
                            return true;
                          }

                          return (
                            new Date(
                              value
                            ).getTime() >=
                              new Date(
                                received
                              ).getTime() ||
                            t(
                              "orderForm.validation.dueBeforeReceived"
                            )
                          );
                        },
                      }
                    )}
                    type="datetime-local"
                    label={t(
                      "orderForm.fields.dueAt"
                    )}
                    error={Boolean(
                      errors.dueAt
                    )}
                    helperText={
                      errors.dueAt
                        ?.message ??
                      t(
                        "clientForm.helpers.optional"
                      )
                    }
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    fullWidth
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                  }}
                >
                  <TextField
                    {...register(
                      "internalNote",
                      {
                        maxLength:
                          10000,
                      }
                    )}
                    label={t(
                      "orderForm.fields.internalNote"
                    )}
                    helperText={t(
                      "orderForm.helpers.internalNote"
                    )}
                    multiline
                    minRows={2}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            type="button"
            onClick={
              handleCancel
            }
            disabled={
              isSubmitting
            }
          >
            {t(
              "common.cancel"
            )}
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={
              isSubmitting
            }
            startIcon={
              isSubmitting ? (
                <CircularProgress
                  size={16}
                  color="inherit"
                />
              ) : undefined
            }
          >
            {isSubmitting
              ? t(
                  "repairIntake.actions.creating"
                )
              : t(
                  "repairIntake.actions.create"
                )}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default RepairIntakeForm;
