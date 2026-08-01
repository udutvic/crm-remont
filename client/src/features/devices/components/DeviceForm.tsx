import {
  useEffect,
  useState,
} from "react";
import { AxiosError } from "axios";
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

const defaultValues: DeviceFormValues = {
  clientId: 0,
  deviceType: "phone",
  brand: "",
  model: "",
  imei1: "",
  imei2: "",
  serial: "",
  color: "",
};

const deviceTypes: Array<{
  value: DeviceType;
  label: string;
}> = [
  {
    value: "phone",
    label: "Phone",
  },
  {
    value: "tablet",
    label: "Tablet",
  },
  {
    value: "laptop",
    label: "Laptop",
  },
  {
    value: "smartwatch",
    label: "Smartwatch",
  },
  {
    value: "other",
    label: "Other",
  },
];

const formFieldNames = new Set<
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
  const normalized = value.trim();

  return normalized || null;
};

const validateImei = (
  value: string
): true | string => {
  const trimmed = value.trim();

  if (!trimmed) {
    return true;
  }

  if (!/^[0-9\s-]+$/.test(trimmed)) {
    return "IMEI may contain only digits, spaces and hyphens";
  }

  const digits = trimmed.replace(
    /[^0-9]/g,
    ""
  );

  if (digits.length !== 15) {
    return "IMEI must contain exactly 15 digits";
  }

  return true;
};

const DeviceForm = ({
  open,
  onClose,
  onSubmit,
  device,
  clients,
}: DeviceFormProps) => {
  const [
    serverError,
    setServerError,
  ] = useState<string | null>(null);

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
        clientId: device.clientId,

        deviceType:
          device.deviceType ??
          "phone",

        brand: device.brand ?? "",
        model: device.model ?? "",

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
  }, [device, open, reset]);

  const applyServerFieldErrors = (
    details: ApiErrorResponse["details"]
  ): void => {
    if (!details) {
      return;
    }

    if (Array.isArray(details)) {
      for (const detail of details) {
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
              message: detail.message,
            }
          );
        }
      }

      return;
    }

    for (const [field, message] of Object.entries(
      details
    )) {
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

  const submitHandler = async (
    values: DeviceFormValues
  ): Promise<void> => {
    const payload: DevicePayload = {
      clientId: values.clientId,
      deviceType: values.deviceType,
      brand: values.brand.trim(),
      model: values.model.trim(),

      imei1: toNullableText(
        values.imei1
      ),

      imei2: toNullableText(
        values.imei2
      ),

      serial: toNullableText(
        values.serial
      ),

      color: toNullableText(
        values.color
      ),
    };

    try {
      setSubmitting(true);
      setServerError(null);

      await onSubmit(payload);

      reset(defaultValues);
    } catch (error: unknown) {
      console.error(
        "Device form submission failed:",
        error
      );

      const axiosError =
        error as AxiosError<ApiErrorResponse>;

      const response =
        axiosError.response?.data;

      applyServerFieldErrors(
        response?.details
      );

      const existingDeviceText =
        response?.existingDeviceId
          ? ` Existing device ID: ${response.existingDeviceId}.`
          : "";

      setServerError(
        `${
          response?.error ??
          "Error saving device. Please try again."
        }${existingDeviceText}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = (): void => {
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
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {device
          ? "Edit Device"
          : "Add New Device"}
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
              sx={{ mb: 2 }}
            >
              {serverError}
            </Alert>
          )}

          <Grid
            container
            spacing={2}
          >
            <Grid size={{ xs: 12 }}>
              <Controller
                name="clientId"
                control={control}
                rules={{
                  validate: (value) =>
                    value > 0 ||
                    "Client is required",
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
                      Client
                    </InputLabel>

                    <Select
                      labelId="device-client-label"
                      label="Client"
                      value={
                        field.value || ""
                      }
                      onBlur={field.onBlur}
                      inputRef={field.ref}
                      onChange={(event) => {
                        field.onChange(
                          Number(
                            event.target.value
                          )
                        );
                      }}
                    >
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
                        .map((client) => (
                          <MenuItem
                            key={client.id}
                            value={client.id}
                          >
                            {client.name} (
                            {client.phone})
                          </MenuItem>
                        ))}
                    </Select>

                    <FormHelperText>
                      {
                        fieldState.error
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
                  required:
                    "Device type is required",
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
                      Device type
                    </InputLabel>

                    <Select
                      {...field}
                      labelId="device-type-label"
                      label="Device type"
                    >
                      {deviceTypes.map(
                        (type) => (
                          <MenuItem
                            key={
                              type.value
                            }
                            value={
                              type.value
                            }
                          >
                            {type.label}
                          </MenuItem>
                        )
                      )}
                    </Select>

                    <FormHelperText>
                      {
                        fieldState.error
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
                    message:
                      "Color cannot exceed 80 characters",
                  },
                }}
                render={({
                  field,
                  fieldState,
                }) => (
                  <TextField
                    {...field}
                    label="Color"
                    fullWidth
                    error={Boolean(
                      fieldState.error
                    )}
                    helperText={
                      fieldState.error
                        ?.message ??
                      "Optional"
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
                  required:
                    "Brand is required",

                  maxLength: {
                    value: 120,
                    message:
                      "Brand cannot exceed 120 characters",
                  },
                }}
                render={({
                  field,
                  fieldState,
                }) => (
                  <TextField
                    {...field}
                    label="Brand"
                    fullWidth
                    error={Boolean(
                      fieldState.error
                    )}
                    helperText={
                      fieldState.error
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
                  required:
                    "Model is required",

                  maxLength: {
                    value: 120,
                    message:
                      "Model cannot exceed 120 characters",
                  },
                }}
                render={({
                  field,
                  fieldState,
                }) => (
                  <TextField
                    {...field}
                    label="Model"
                    fullWidth
                    error={Boolean(
                      fieldState.error
                    )}
                    helperText={
                      fieldState.error
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
                  validate: validateImei,
                }}
                render={({
                  field,
                  fieldState,
                }) => (
                  <TextField
                    {...field}
                    label="IMEI 1"
                    fullWidth
                    inputMode="numeric"
                    placeholder="356789012345678"
                    error={Boolean(
                      fieldState.error
                    )}
                    helperText={
                      fieldState.error
                        ?.message ??
                      "Optional, 15 digits"
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
                  validate: validateImei,
                }}
                render={({
                  field,
                  fieldState,
                }) => (
                  <TextField
                    {...field}
                    label="IMEI 2"
                    fullWidth
                    inputMode="numeric"
                    placeholder="356789012345686"
                    error={Boolean(
                      fieldState.error
                    )}
                    helperText={
                      fieldState.error
                        ?.message ??
                      "Optional, 15 digits"
                    }
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="serial"
                control={control}
                rules={{
                  maxLength: {
                    value: 100,
                    message:
                      "Serial number cannot exceed 100 characters",
                  },
                }}
                render={({
                  field,
                  fieldState,
                }) => (
                  <TextField
                    {...field}
                    label="Serial number"
                    fullWidth
                    error={Boolean(
                      fieldState.error
                    )}
                    helperText={
                      fieldState.error
                        ?.message ??
                      "Optional"
                    }
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleCancel}
            disabled={submitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            startIcon={
              submitting ? (
                <CircularProgress
                  size={18}
                />
              ) : undefined
            }
          >
            {submitting
              ? "Saving..."
              : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DeviceForm;