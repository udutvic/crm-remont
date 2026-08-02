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
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  Controller,
  useForm,
} from "react-hook-form";
import {
  useTranslation,
} from "react-i18next";

import {
  Client,
  Device,
  DevicePayload,
  DeviceType,
} from "types";

interface DeviceFormProps {
  open: boolean;
  onClose: () => void;

  onSubmit: (
    data: DevicePayload
  ) => Promise<void>;

  device?: Device;
  clients: Client[];
}

interface DeviceFormValues {
  clientId: number;
  deviceType: DeviceType;
  brand: string;
  model: string;
  imei1: string;
  imei2: string;
  serial: string;
  color: string;
}

interface ApiErrorResponse {
  error?: string;
  existingDeviceId?: number;

  details?:
    | Record<string, string>
    | Array<{
        field?: string;
        message: string;
      }>;
}

const defaultValues: DeviceFormValues =
  {
    clientId: 0,
    deviceType: "phone",
    brand: "",
    model: "",
    imei1: "",
    imei2: "",
    serial: "",
    color: "",
  };

const deviceTypes: DeviceType[] =
  [
    "phone",
    "tablet",
    "laptop",
    "smartwatch",
    "other",
  ];

const formFieldNames =
  new Set<
    keyof DeviceFormValues
  >([
    "clientId",
    "deviceType",
    "brand",
    "model",
    "imei1",
    "imei2",
    "serial",
    "color",
  ]);

const toNullableText = (
  value: string
): string | null => {
  const normalized =
    value.trim();

  return normalized || null;
};

const DeviceForm = ({
  open,
  onClose,
  onSubmit,
  device,
  clients,
}: DeviceFormProps) => {
  const {
    t,
  } = useTranslation();

  const [
    serverError,
    setServerError,
  ] = useState<
    string | null
  >(null);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setError,
  } = useForm<DeviceFormValues>({
    defaultValues,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    setServerError(null);

    if (device) {
      reset({
        clientId:
          device.clientId,

        deviceType:
          device.deviceType ??
          "phone",

        brand:
          device.brand ?? "",

        model:
          device.model ?? "",

        imei1:
          device.imei1 ?? "",

        imei2:
          device.imei2 ?? "",

        serial:
          device.serial ?? "",

        color:
          device.color ?? "",
      });

      return;
    }

    reset(defaultValues);
  }, [
    device,
    open,
    reset,
  ]);

  const applyServerFieldErrors =
    (
      details:
        ApiErrorResponse["details"]
    ): void => {
      if (!details) {
        return;
      }

      if (
        Array.isArray(details)
      ) {
        for (
          const detail of details
        ) {
          if (
            detail.field &&
            formFieldNames.has(
              detail.field as keyof DeviceFormValues
            )
          ) {
            setError(
              detail.field as keyof DeviceFormValues,
              {
                type: "server",
                message:
                  detail.message,
              }
            );
          }
        }

        return;
      }

      for (
        const [
          field,
          message,
        ] of Object.entries(
          details
        )
      ) {
        if (
          formFieldNames.has(
            field as keyof DeviceFormValues
          )
        ) {
          setError(
            field as keyof DeviceFormValues,
            {
              type: "server",
              message,
            }
          );
        }
      }
    };

  const validateImei = (
    value: string
  ): true | string => {
    const trimmed =
      value.trim();

    if (!trimmed) {
      return true;
    }

    if (
      !/^[0-9\s-]+$/.test(
        trimmed
      )
    ) {
      return t(
        "deviceForm.validation.imeiCharacters"
      );
    }

    const digits =
      trimmed.replace(
        /[^0-9]/g,
        ""
      );

    if (
      digits.length !== 15
    ) {
      return t(
        "deviceForm.validation.imeiLength"
      );
    }

    return true;
  };

  const submitHandler =
    async (
      values: DeviceFormValues
    ): Promise<void> => {
      const payload: DevicePayload =
        {
          clientId:
            values.clientId,

          deviceType:
            values.deviceType,

          brand:
            values.brand.trim(),

          model:
            values.model.trim(),

          imei1:
            toNullableText(
              values.imei1
            ),

          imei2:
            toNullableText(
              values.imei2
            ),

          serial:
            toNullableText(
              values.serial
            ),

          color:
            toNullableText(
              values.color
            ),
        };

      try {
        setSubmitting(true);
        setServerError(null);

        await onSubmit(
          payload
        );

        reset(
          defaultValues
        );
      } catch (
        error: unknown
      ) {
        console.error(
          "Device form submission failed:",
          error
        );

        const axiosError =
          error as AxiosError<ApiErrorResponse>;

        const response =
          axiosError.response
            ?.data;

        applyServerFieldErrors(
          response?.details
        );

        const existingDeviceText =
          response?.existingDeviceId
            ? ` ${t(
                "deviceForm.errors.existingDevice",
                {
                  id:
                    response.existingDeviceId,
                }
              )}`
            : "";

        setServerError(
          `${
            response?.error ??
            t(
              "deviceForm.errors.save"
            )
          }${existingDeviceText}`
        );
      } finally {
        setSubmitting(false);
      }
    };

  const handleCancel =
    (): void => {
      if (submitting) {
        return;
      }

      reset(defaultValues);
      setServerError(null);
      onClose();
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
        {device
          ? t(
              "deviceForm.titles.edit"
            )
          : t(
              "deviceForm.titles.add"
            )}
      </DialogTitle>

      <form
        onSubmit={handleSubmit(
          submitHandler
        )}
        noValidate
      >
        <DialogContent>
          {serverError && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
              }}
            >
              {serverError}
            </Alert>
          )}

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
                name="clientId"
                control={control}
                rules={{
                  validate: (
                    value
                  ) =>
                    value > 0 ||
                    t(
                      "deviceForm.validation.clientRequired"
                    ),
                }}
                render={({
                  field,
                  fieldState,
                }) => (
                  <FormControl
                    fullWidth
                    error={Boolean(
                      fieldState.error
                    )}
                  >
                    <InputLabel id="device-client-label">
                      {t(
                        "deviceForm.fields.client"
                      )}
                    </InputLabel>

                    <Select
                      labelId="device-client-label"
                      label={t(
                        "deviceForm.fields.client"
                      )}
                      value={
                        field.value ||
                        ""
                      }
                      onBlur={
                        field.onBlur
                      }
                      inputRef={
                        field.ref
                      }
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
                      {clients.length ===
                        0 && (
                        <MenuItem
                          disabled
                        >
                          {t(
                            "deviceForm.helpers.noClients"
                          )}
                        </MenuItem>
                      )}

                      {clients
                        .filter(
                          (
                            client
                          ): client is Client & {
                            id: number;
                          } =>
                            client.id !==
                            undefined
                        )
                        .map(
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
                        )}
                    </Select>

                    <FormHelperText>
                      {
                        fieldState
                          .error
                          ?.message
                      }
                    </FormHelperText>
                  </FormControl>
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
                name="deviceType"
                control={control}
                rules={{
                  required: t(
                    "deviceForm.validation.deviceTypeRequired"
                  ),
                }}
                render={({
                  field,
                  fieldState,
                }) => (
                  <FormControl
                    fullWidth
                    error={Boolean(
                      fieldState.error
                    )}
                  >
                    <InputLabel id="device-type-label">
                      {t(
                        "deviceForm.fields.deviceType"
                      )}
                    </InputLabel>

                    <Select
                      {...field}
                      labelId="device-type-label"
                      label={t(
                        "deviceForm.fields.deviceType"
                      )}
                    >
                      {deviceTypes.map(
                        (
                          type
                        ) => (
                          <MenuItem
                            key={type}
                            value={type}
                          >
                            {t(
                              `deviceForm.deviceTypes.${type}`
                            )}
                          </MenuItem>
                        )
                      )}
                    </Select>

                    <FormHelperText>
                      {
                        fieldState
                          .error
                          ?.message
                      }
                    </FormHelperText>
                  </FormControl>
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
                name="color"
                control={control}
                rules={{
                  maxLength: {
                    value: 80,
                    message: t(
                      "deviceForm.validation.colorMax"
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
                      "deviceForm.fields.color"
                    )}
                    fullWidth
                    error={Boolean(
                      fieldState.error
                    )}
                    helperText={
                      fieldState
                        .error
                        ?.message ??
                      t(
                        "deviceForm.helpers.optional"
                      )
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
                name="brand"
                control={control}
                rules={{
                  required: t(
                    "deviceForm.validation.brandRequired"
                  ),

                  maxLength: {
                    value: 120,
                    message: t(
                      "deviceForm.validation.brandMax"
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
                      "deviceForm.fields.brand"
                    )}
                    fullWidth
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
                name="model"
                control={control}
                rules={{
                  required: t(
                    "deviceForm.validation.modelRequired"
                  ),

                  maxLength: {
                    value: 120,
                    message: t(
                      "deviceForm.validation.modelMax"
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
                      "deviceForm.fields.model"
                    )}
                    fullWidth
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
                name="imei1"
                control={control}
                rules={{
                  validate:
                    validateImei,
                }}
                render={({
                  field,
                  fieldState,
                }) => (
                  <TextField
                    {...field}
                    label={t(
                      "deviceForm.fields.imei1"
                    )}
                    fullWidth
                    inputMode="numeric"
                    placeholder="356789012345678"
                    error={Boolean(
                      fieldState.error
                    )}
                    helperText={
                      fieldState
                        .error
                        ?.message ??
                      t(
                        "deviceForm.helpers.imei"
                      )
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
                name="imei2"
                control={control}
                rules={{
                  validate:
                    validateImei,
                }}
                render={({
                  field,
                  fieldState,
                }) => (
                  <TextField
                    {...field}
                    label={t(
                      "deviceForm.fields.imei2"
                    )}
                    fullWidth
                    inputMode="numeric"
                    placeholder="356789012345686"
                    error={Boolean(
                      fieldState.error
                    )}
                    helperText={
                      fieldState
                        .error
                        ?.message ??
                      t(
                        "deviceForm.helpers.imei"
                      )
                    }
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
                name="serial"
                control={control}
                rules={{
                  maxLength: {
                    value: 100,
                    message: t(
                      "deviceForm.validation.serialMax"
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
                      "deviceForm.fields.serial"
                    )}
                    fullWidth
                    error={Boolean(
                      fieldState.error
                    )}
                    helperText={
                      fieldState
                        .error
                        ?.message ??
                      t(
                        "deviceForm.helpers.optional"
                      )
                    }
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
            disabled={
              submitting
            }
          >
            {t(
              "deviceForm.actions.cancel"
            )}
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={
              submitting
            }
            startIcon={
              submitting ? (
                <CircularProgress
                  size={18}
                />
              ) : undefined
            }
          >
            {submitting
              ? t(
                  "deviceForm.actions.saving"
                )
              : t(
                  "deviceForm.actions.save"
                )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DeviceForm;
