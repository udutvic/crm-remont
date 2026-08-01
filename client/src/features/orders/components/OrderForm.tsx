import {
  useEffect,
  useState,
} from "react";
import {
  AxiosError,
} from "axios";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
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
} from "index";
import {
  Client,
  Device,
  Order,
  OrderAccessType,
  OrderPayload,
  OrderStatus,
} from "types";

interface OrderFormProps {
  open: boolean;
  onClose: () => void;

  onSubmit: (
    data: OrderPayload
  ) => Promise<void>;

  order?: Order;
  clients: Client[];
}

interface OrderFormValues {
  clientId: number | "";
  deviceId: number | "";

  problem: string;
  status: OrderStatus;

  deviceCondition: string;
  accessories: string;

  accessType: OrderAccessType;
  accessCode: string;

  diagnosis: string;
  workPerformed: string;
  internalNote: string;

  estimatedPrice:
    | number
    | "";

  finalPrice:
    | number
    | "";

  receivedAt: string;
  dueAt: string;
}

interface ApiErrorResponse {
  error?: string;
  details?: Record<
    string,
    string
  >;
}

const statusOptions: OrderStatus[] = [
  "pending",
  "in_progress",
  "completed",
  "cancelled",
];

const statusTranslationKeys: Record<
  OrderStatus,
  string
> = {
  pending:
    "statuses.pending",
  in_progress:
    "statuses.inProgress",
  completed:
    "statuses.completed",
  cancelled:
    "statuses.cancelled",
};

const accessTypeOptions: OrderAccessType[] =
  [
    "none",
    "pin",
    "password",
    "pattern",
    "unknown",
  ];

const accessTypeTranslationKeys: Record<
  OrderAccessType,
  string
> = {
  none:
    "orderForm.accessTypes.none",
  pin:
    "orderForm.accessTypes.pin",
  password:
    "orderForm.accessTypes.password",
  pattern:
    "orderForm.accessTypes.pattern",
  unknown:
    "orderForm.accessTypes.unknown",
};

const requiredAccessCodeTypes =
  new Set<OrderAccessType>([
    "pin",
    "password",
    "pattern",
  ]);

const toNullableText = (
  value: string
): string | null => {
  const normalized =
    value.trim();

  return normalized || null;
};

const toDateTimeLocal = (
  value?: string | null
): string => {
  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

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

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return date.toISOString();
};

const createDefaultValues =
  (): OrderFormValues => ({
    clientId: "",
    deviceId: "",

    problem: "",
    status: "pending",

    deviceCondition: "",
    accessories: "",

    accessType: "none",
    accessCode: "",

    diagnosis: "",
    workPerformed: "",
    internalNote: "",

    estimatedPrice: 0,
    finalPrice: "",

    receivedAt:
      toDateTimeLocal(
        new Date().toISOString()
      ),

    dueAt: "",
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

const OrderForm = ({
  open,
  onClose,
  onSubmit,
  order,
  clients,
}: OrderFormProps) => {
  const {
    t,
  } = useTranslation();

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

  const {
    control,
    getValues,
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<OrderFormValues>({
    defaultValues:
      createDefaultValues(),
  });

  const selectedClientId =
    watch("clientId");

  const selectedAccessType =
    watch("accessType");

  const filteredDevices =
    devices.filter(
      (device) =>
        device.clientId ===
        selectedClientId
    );

  const accessCodeRequired =
    requiredAccessCodeTypes.has(
      selectedAccessType
    );

  const existingCodeCanBePreserved =
    Boolean(
      order?.hasAccessCode &&
        order.accessType ===
          selectedAccessType
    );

  useEffect(() => {
    if (!open) {
      return;
    }

    setServerError(null);

    if (order) {
      reset({
        clientId:
          order.clientId,

        deviceId:
          order.deviceId,

        problem:
          order.problem,

        status:
          order.status,

        deviceCondition:
          order.deviceCondition ??
          "",

        accessories:
          order.accessories ??
          "",

        accessType:
          order.accessType ??
          "none",

        accessCode: "",

        diagnosis:
          order.diagnosis ??
          "",

        workPerformed:
          order.workPerformed ??
          "",

        internalNote:
          order.internalNote ??
          "",

        estimatedPrice:
          order.estimatedPrice ??
          order.price ??
          0,

        finalPrice:
          order.finalPrice ??
          "",

        receivedAt:
          toDateTimeLocal(
            order.receivedAt ??
              order.createdAt
          ),

        dueAt:
          toDateTimeLocal(
            order.dueAt
          ),
      });

      return;
    }

    reset(
      createDefaultValues()
    );
  }, [
    open,
    order,
    reset,
  ]);

  useEffect(() => {
    if (!open) {
      return;
    }

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
            "Error loading devices:",
            error
          );

          setServerError(
            t(
              "orderForm.errors.loadDevices"
            )
          );
        }
      };

    void loadDevices();
  }, [
    open,
    t,
  ]);

  const handleFormSubmit =
    async (
      values: OrderFormValues
    ): Promise<void> => {
      if (
        values.clientId ===
          "" ||
        values.deviceId === ""
      ) {
        setServerError(
          t(
            "orderForm.validation.clientDeviceRequired"
          )
        );

        return;
      }

      const estimatedPrice =
        values.estimatedPrice ===
        ""
          ? 0
          : Number(
              values.estimatedPrice
            );

      const payload: OrderPayload =
        {
          clientId:
            values.clientId,

          deviceId:
            values.deviceId,

          problem:
            values.problem.trim(),

          status:
            values.status,

          /*
           * Temporary compatibility
           * with the current order
           * list and dashboard.
           */
          price:
            estimatedPrice,

          estimatedPrice,

          finalPrice:
            values.finalPrice ===
            ""
              ? null
              : Number(
                  values.finalPrice
                ),

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

          diagnosis:
            toNullableText(
              values.diagnosis
            ),

          workPerformed:
            toNullableText(
              values.workPerformed
            ),

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

      const accessCode =
        values.accessCode.trim();

      if (
        values.accessType ===
          "none" ||
        values.accessType ===
          "unknown"
      ) {
        /*
         * Explicitly remove any
         * previously stored code.
         */
        payload.accessCode = "";
      } else if (accessCode) {
        /*
         * A new code replaces the
         * existing encrypted code.
         */
        payload.accessCode =
          accessCode;
      }

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
          "Error saving order:",
          error
        );

        const axiosError =
          error as AxiosError<ApiErrorResponse>;

        const response =
          axiosError.response
            ?.data;

        const details =
          response?.details;

        const detailsMessage =
          details
            ? Object.values(
                details
              )
                .filter(Boolean)
                .join(" ")
            : "";

        setServerError(
          detailsMessage ||
            response?.error ||
            t(
              "orderForm.errors.save"
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
      onClose();
    };

  const getAccessCodeLabel =
    (): string => {
      switch (
        selectedAccessType
      ) {
        case "pin":
          return t(
            "orderForm.accessTypes.pin"
          );

        case "password":
          return t(
            "orderForm.accessTypes.password"
          );

        case "pattern":
          return t(
            "orderForm.accessTypes.pattern"
          );

        default:
          return t(
            "orderForm.fields.accessCode"
          );
      }
    };

  return (
    <Dialog
      open={open}
      onClose={
        handleCancel
      }
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {order
          ? t(
              "orderForm.titles.edit"
            )
          : t(
              "orderForm.titles.create"
            )}
      </DialogTitle>

      <form
        onSubmit={handleSubmit(
          handleFormSubmit
        )}
      >
        <DialogContent dividers>
          {serverError && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
              }}
            >
              {serverError}
            </Alert>
          )}

          <Typography
            variant="h6"
            gutterBottom
          >
            {t(
              "orderForm.sections.clientDevice"
            )}
          </Typography>

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
              <FormControl
                fullWidth
                margin="normal"
              >
                <InputLabel id="client-label">
                  {t(
                    "orderForm.fields.client"
                  )}
                </InputLabel>

                <Controller
                  name="clientId"
                  control={
                    control
                  }
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
                    <>
                      <Select
                        {...field}
                        labelId="client-label"
                        label={t(
                          "orderForm.fields.client"
                        )}
                        error={Boolean(
                          fieldState.error
                        )}
                        onChange={(
                          event
                        ) => {
                          const clientId =
                            Number(
                              event
                                .target
                                .value
                            );

                          field.onChange(
                            clientId
                          );

                          setValue(
                            "deviceId",
                            ""
                          );
                        }}
                      >
                        {clients.length ===
                        0 ? (
                          <MenuItem
                            disabled
                          >
                            {t(
                              "orderForm.helpers.noClients"
                            )}
                          </MenuItem>
                        ) : (
                          clients.map(
                            (
                              client
                            ) => (
                              <MenuItem
                                key={
                                  client.id
                                }
                                value={
                                  client.id
                                }
                              >
                                {
                                  client.name
                                }{" "}
                                (
                                {
                                  client.phone
                                }
                                )
                              </MenuItem>
                            )
                          )
                        )}
                      </Select>

                      {fieldState.error && (
                        <Alert
                          severity="error"
                          sx={{
                            mt: 1,
                          }}
                        >
                          {
                            fieldState
                              .error
                              .message
                          }
                        </Alert>
                      )}
                    </>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <FormControl
                fullWidth
                margin="normal"
                disabled={
                  selectedClientId ===
                  ""
                }
              >
                <InputLabel id="device-label">
                  {t(
                    "orderForm.fields.device"
                  )}
                </InputLabel>

                <Controller
                  name="deviceId"
                  control={
                    control
                  }
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
                    <>
                      <Select
                        {...field}
                        labelId="device-label"
                        label={t(
                          "orderForm.fields.device"
                        )}
                        error={Boolean(
                          fieldState.error
                        )}
                        onChange={(
                          event
                        ) => {
                          field.onChange(
                            Number(
                              event
                                .target
                                .value
                            )
                          );
                        }}
                      >
                        {filteredDevices.length ===
                        0 ? (
                          <MenuItem
                            disabled
                          >
                            {t(
                              "orderForm.helpers.noDevices"
                            )}
                          </MenuItem>
                        ) : (
                          filteredDevices.map(
                            (
                              device
                            ) => (
                              <MenuItem
                                key={
                                  device.id
                                }
                                value={
                                  device.id
                                }
                              >
                                {
                                  device.brand
                                }{" "}
                                {
                                  device.model
                                }
                                {device.imei1
                                  ? ` (${device.imei1})`
                                  : device.serial
                                    ? ` (${device.serial})`
                                    : ""}
                              </MenuItem>
                            )
                          )
                        )}
                      </Select>

                      {fieldState.error && (
                        <Alert
                          severity="error"
                          sx={{
                            mt: 1,
                          }}
                        >
                          {
                            fieldState
                              .error
                              .message
                          }
                        </Alert>
                      )}
                    </>
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>

          <Divider
            sx={{
              my: 3,
            }}
          />

          <Typography
            variant="h6"
            gutterBottom
          >
            {t(
              "orderForm.sections.intake"
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
              <Controller
                name="problem"
                control={control}
                rules={{
                  required: t(
                    "orderForm.validation.problemRequired"
                  ),

                  validate: (
                    value
                  ) =>
                    value
                      .trim()
                      .length >
                      0 ||
                    t(
                      "orderForm.validation.problemRequired"
                    ),

                  maxLength: {
                    value: 255,
                    message: t(
                      "orderForm.validation.problemMax"
                    ),
                  },
                }}
                render={({
                  field,
                  fieldState,
                }) => (
                  <TextField
                    {...field}
                    label={t(
                      "orderForm.fields.reportedProblem"
                    )}
                    fullWidth
                    multiline
                    minRows={3}
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
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Controller
                name="deviceCondition"
                control={control}
                render={({
                  field,
                }) => (
                  <TextField
                    {...field}
                    label={t(
                      "orderForm.fields.deviceCondition"
                    )}
                    fullWidth
                    multiline
                    minRows={2}
                    placeholder={t(
                      "orderForm.placeholders.deviceCondition"
                    )}
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
              <Controller
                name="accessories"
                control={control}
                render={({
                  field,
                }) => (
                  <TextField
                    {...field}
                    label={t(
                      "orderForm.fields.accessories"
                    )}
                    fullWidth
                    multiline
                    minRows={2}
                    placeholder={t(
                      "orderForm.placeholders.accessories"
                    )}
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
              <Controller
                name="receivedAt"
                control={control}
                rules={{
                  required: t(
                    "orderForm.validation.receivedRequired"
                  ),
                }}
                render={({
                  field,
                  fieldState,
                }) => (
                  <TextField
                    {...field}
                    label={t(
                      "orderForm.fields.receivedAt"
                    )}
                    type="datetime-local"
                    fullWidth
                    error={Boolean(
                      fieldState.error
                    )}
                    helperText={
                      fieldState
                        .error
                        ?.message
                    }
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
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
              <Controller
                name="dueAt"
                control={control}
                rules={{
                  validate: (
                    value
                  ) => {
                    if (!value) {
                      return true;
                    }

                    const receivedAt =
                      getValues(
                        "receivedAt"
                      );

                    if (
                      !receivedAt
                    ) {
                      return true;
                    }

                    return (
                      new Date(
                        value
                      ).getTime() >=
                        new Date(
                          receivedAt
                        ).getTime() ||
                      t(
                        "orderForm.validation.dueBeforeReceived"
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
                    label={t(
                      "orderForm.fields.dueAt"
                    )}
                    type="datetime-local"
                    fullWidth
                    error={Boolean(
                      fieldState.error
                    )}
                    helperText={
                      fieldState
                        .error
                        ?.message
                    }
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
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
              <FormControl
                fullWidth
                margin="normal"
              >
                <InputLabel id="access-type-label">
                  {t(
                    "orderForm.fields.accessType"
                  )}
                </InputLabel>

                <Controller
                  name="accessType"
                  control={
                    control
                  }
                  render={({
                    field,
                  }) => (
                    <Select
                      {...field}
                      labelId="access-type-label"
                      label={t(
                        "orderForm.fields.accessType"
                      )}
                      onChange={(
                        event
                      ) => {
                        field.onChange(
                          event
                            .target
                            .value as OrderAccessType
                        );

                        setValue(
                          "accessCode",
                          ""
                        );
                      }}
                    >
                      {accessTypeOptions.map(
                        (
                          accessType
                        ) => (
                          <MenuItem
                            key={
                              accessType
                            }
                            value={
                              accessType
                            }
                          >
                            {t(
                              accessTypeTranslationKeys[
                                accessType
                              ]
                            )}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              {accessCodeRequired ? (
                <Controller
                  name="accessCode"
                  control={
                    control
                  }
                  rules={{
                    validate: (
                      value
                    ) =>
                      value
                        .trim()
                        .length >
                        0 ||
                      existingCodeCanBePreserved ||
                      t(
                        "orderForm.validation.accessCodeRequired"
                      ),

                    maxLength: {
                      value: 256,
                      message: t(
                        "orderForm.validation.accessCodeMax"
                      ),
                    },
                  }}
                  render={({
                    field,
                    fieldState,
                  }) => (
                    <TextField
                      {...field}
                      label={
                        getAccessCodeLabel()
                      }
                      type={
                        selectedAccessType ===
                        "pattern"
                          ? "text"
                          : "password"
                      }
                      fullWidth
                      margin="normal"
                      error={Boolean(
                        fieldState.error
                      )}
                      helperText={
                        fieldState
                          .error
                          ?.message ??
                        (existingCodeCanBePreserved
                          ? t(
                              "orderForm.helpers.codeSaved"
                            )
                          : selectedAccessType ===
                              "pattern"
                            ? t(
                                "orderForm.helpers.patternExample"
                              )
                            : "")
                      }
                    />
                  )}
                />
              ) : (
                <TextField
                  label={t(
                    "orderForm.fields.accessCode"
                  )}
                  value=""
                  fullWidth
                  margin="normal"
                  disabled
                  helperText={
                    selectedAccessType ===
                    "unknown"
                      ? t(
                          "orderForm.helpers.unknownAccess"
                        )
                      : t(
                          "orderForm.helpers.noCodeRequired"
                        )
                  }
                />
              )}
            </Grid>
          </Grid>

          <Divider
            sx={{
              my: 3,
            }}
          />

          <Typography
            variant="h6"
            gutterBottom
          >
            {t(
              "orderForm.sections.repair"
            )}
          </Typography>

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
              <FormControl
                fullWidth
                margin="normal"
              >
                <InputLabel id="status-label">
                  {t(
                    "orderForm.fields.status"
                  )}
                </InputLabel>

                <Controller
                  name="status"
                  control={
                    control
                  }
                  render={({
                    field,
                  }) => (
                    <Select
                      {...field}
                      labelId="status-label"
                      label={t(
                        "orderForm.fields.status"
                      )}
                    >
                      {statusOptions.map(
                        (status) => (
                          <MenuItem
                            key={
                              status
                            }
                            value={
                              status
                            }
                          >
                            {t(
                              statusTranslationKeys[
                                status
                              ]
                            )}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  )}
                />
              </FormControl>
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
                  min: {
                    value: 0,
                    message: t(
                      "orderForm.validation.estimatedNonNegative"
                    ),
                  },

                  validate: (
                    value
                  ) =>
                    value ===
                      "" ||
                    Number.isInteger(
                      Number(value)
                    ) ||
                    t(
                      "orderForm.validation.estimatedWhole"
                    ),
                }}
                render={({
                  field,
                  fieldState,
                }) => (
                  <TextField
                    {...field}
                    label={t(
                      "orderForm.fields.estimatedPrice"
                    )}
                    type="number"
                    fullWidth
                    sx={
                      priceFieldSx
                    }
                    margin="normal"
                    error={Boolean(
                      fieldState.error
                    )}
                    helperText={
                      fieldState
                        .error
                        ?.message
                    }
                    slotProps={{
                      htmlInput: {
                        min: 0,
                        step: 1,
                        inputMode:
                          "numeric",
                      },
                    }}
                    onChange={(
                      event
                    ) => {
                      field.onChange(
                        event.target
                          .value ===
                          ""
                          ? ""
                          : Number(
                              event
                                .target
                                .value
                            )
                      );
                    }}
                  />
                )}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <Controller
                name="finalPrice"
                control={control}
                rules={{
                  min: {
                    value: 0,
                    message: t(
                      "orderForm.validation.finalNonNegative"
                    ),
                  },

                  validate: (
                    value
                  ) =>
                    value ===
                      "" ||
                    Number.isInteger(
                      Number(value)
                    ) ||
                    t(
                      "orderForm.validation.finalWhole"
                    ),
                }}
                render={({
                  field,
                  fieldState,
                }) => (
                  <TextField
                    {...field}
                    label={t(
                      "orderForm.fields.finalPrice"
                    )}
                    type="number"
                    fullWidth
                    sx={
                      priceFieldSx
                    }
                    margin="normal"
                    error={Boolean(
                      fieldState.error
                    )}
                    helperText={
                      fieldState
                        .error
                        ?.message
                    }
                    slotProps={{
                      htmlInput: {
                        min: 0,
                        step: 1,
                        inputMode:
                          "numeric",
                      },
                    }}
                    onChange={(
                      event
                    ) => {
                      field.onChange(
                        event.target
                          .value ===
                          ""
                          ? ""
                          : Number(
                              event
                                .target
                                .value
                            )
                      );
                    }}
                  />
                )}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
              }}
            >
              <Controller
                name="diagnosis"
                control={control}
                render={({
                  field,
                }) => (
                  <TextField
                    {...field}
                    label={t(
                      "orderForm.fields.diagnosis"
                    )}
                    fullWidth
                    multiline
                    minRows={3}
                  />
                )}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
              }}
            >
              <Controller
                name="workPerformed"
                control={control}
                render={({
                  field,
                }) => (
                  <TextField
                    {...field}
                    label={t(
                      "orderForm.fields.workPerformed"
                    )}
                    fullWidth
                    multiline
                    minRows={3}
                  />
                )}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
              }}
            >
              <Controller
                name="internalNote"
                control={control}
                render={({
                  field,
                }) => (
                  <TextField
                    {...field}
                    label={t(
                      "orderForm.fields.internalNote"
                    )}
                    fullWidth
                    multiline
                    minRows={3}
                    helperText={t(
                      "orderForm.helpers.internalNote"
                    )}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={
              handleCancel
            }
          >
            {t(
              "orderForm.actions.cancel"
            )}
          </Button>

          <Button
            type="submit"
            variant="contained"
          >
            {order
              ? t(
                  "orderForm.actions.update"
                )
              : t(
                  "orderForm.actions.add"
                )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default OrderForm;
