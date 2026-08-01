import { useEffect, useState } from "react";
import { AxiosError } from "axios";
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

import { getDevices } from "index";
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

  estimatedPrice: number | "";
  finalPrice: number | "";

  receivedAt: string;
  dueAt: string;
}

interface ApiErrorResponse {
  error?: string;
  details?: Record<string, string>;
}

const statusOptions: Array<{
  value: OrderStatus;
  label: string;
}> = [
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "in_progress",
    label: "In Progress",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
];

const accessTypeOptions: Array<{
  value: OrderAccessType;
  label: string;
}> = [
  {
    value: "none",
    label: "No access code",
  },
  {
    value: "pin",
    label: "PIN",
  },
  {
    value: "password",
    label: "Password",
  },
  {
    value: "pattern",
    label: "Pattern",
  },
  {
    value: "unknown",
    label: "Unknown",
  },
];

const requiredAccessCodeTypes =
  new Set<OrderAccessType>([
    "pin",
    "password",
    "pattern",
  ]);

const toNullableText = (
  value: string
): string | null => {
  const normalized = value.trim();

  return normalized || null;
};

const toDateTimeLocal = (
  value?: string | null
): string => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const localDate = new Date(
    date.getTime() -
      date.getTimezoneOffset() * 60_000
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

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
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

    receivedAt: toDateTimeLocal(
      new Date().toISOString()
    ),
    dueAt: "",
  });

const OrderForm = ({
  open,
  onClose,
  onSubmit,
  order,
  clients,
}: OrderFormProps) => {
  const [
    devices,
    setDevices,
  ] = useState<Device[]>([]);

  const [
    serverError,
    setServerError,
  ] = useState<string | null>(null);

  const {
    control,
    getValues,
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<OrderFormValues>({
    defaultValues: createDefaultValues(),
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
        clientId: order.clientId,
        deviceId: order.deviceId,

        problem: order.problem,
        status: order.status,

        deviceCondition:
          order.deviceCondition ?? "",
        accessories:
          order.accessories ?? "",

        accessType:
          order.accessType ?? "none",
        accessCode: "",

        diagnosis:
          order.diagnosis ?? "",
        workPerformed:
          order.workPerformed ?? "",
        internalNote:
          order.internalNote ?? "",

        estimatedPrice:
          order.estimatedPrice ??
          order.price ??
          0,

        finalPrice:
          order.finalPrice ?? "",

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

    reset(createDefaultValues());
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
        } catch (error: unknown) {
          console.error(
            "Error loading devices:",
            error
          );

          setServerError(
            "Failed to load devices."
          );
        }
      };

    void loadDevices();
  }, [open]);

  const handleFormSubmit = async (
    values: OrderFormValues
  ): Promise<void> => {
    if (
      values.clientId === "" ||
      values.deviceId === ""
    ) {
      setServerError(
        "Client and device must be selected."
      );

      return;
    }

    const estimatedPrice =
      values.estimatedPrice === ""
        ? 0
        : Number(
            values.estimatedPrice
          );

    const payload: OrderPayload = {
      clientId: values.clientId,
      deviceId: values.deviceId,

      problem:
        values.problem.trim(),
      status: values.status,

      /*
       * Temporary compatibility
       * with the current order list
       * and dashboard.
       */
      price: estimatedPrice,

      estimatedPrice,

      finalPrice:
        values.finalPrice === ""
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

      await onSubmit(payload);

      reset(createDefaultValues());
    } catch (error: unknown) {
      console.error(
        "Error saving order:",
        error
      );

      const axiosError =
        error as AxiosError<ApiErrorResponse>;

      const response =
        axiosError.response?.data;

      const details =
        response?.details;

      const detailsMessage =
        details
          ? Object.values(details)
              .filter(Boolean)
              .join(" ")
          : "";

      setServerError(
        detailsMessage ||
          response?.error ||
          "Failed to save order."
      );
    }
  };

  const handleCancel = (): void => {
    reset(createDefaultValues());
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
        {order
          ? "Edit Order"
          : "Create New Order"}
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
              sx={{ mb: 3 }}
            >
              {serverError}
            </Alert>
          )}

          <Typography
            variant="h6"
            gutterBottom
          >
            Client and Device
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
                  Client
                </InputLabel>

                <Controller
                  name="clientId"
                  control={control}
                  rules={{
                    validate: (value) =>
                      value !== "" ||
                      "Client is required",
                  }}
                  render={({
                    field,
                    fieldState,
                  }) => (
                    <>
                      <Select
                        {...field}
                        labelId="client-label"
                        label="Client"
                        error={Boolean(
                          fieldState.error
                        )}
                        onChange={(
                          event
                        ) => {
                          const clientId =
                            Number(
                              event.target
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
                        {clients.map(
                          (client) => (
                            <MenuItem
                              key={
                                client.id
                              }
                              value={
                                client.id
                              }
                            >
                              {client.name} (
                              {client.phone})
                            </MenuItem>
                          )
                        )}
                      </Select>

                      {fieldState.error && (
                        <Alert
                          severity="error"
                          sx={{ mt: 1 }}
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
                  Device
                </InputLabel>

                <Controller
                  name="deviceId"
                  control={control}
                  rules={{
                    validate: (value) =>
                      value !== "" ||
                      "Device is required",
                  }}
                  render={({
                    field,
                    fieldState,
                  }) => (
                    <>
                      <Select
                        {...field}
                        labelId="device-label"
                        label="Device"
                        error={Boolean(
                          fieldState.error
                        )}
                        onChange={(
                          event
                        ) => {
                          field.onChange(
                            Number(
                              event.target
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
                            This client has
                            no devices
                          </MenuItem>
                        ) : (
                          filteredDevices.map(
                            (device) => (
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
                          sx={{ mt: 1 }}
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

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="h6"
            gutterBottom
          >
            Intake Information
          </Typography>

          <Grid
            container
            spacing={2}
          >
            <Grid size={{ xs: 12 }}>
              <Controller
                name="problem"
                control={control}
                rules={{
                  required:
                    "Problem is required",
                  validate: (value) =>
                    value.trim()
                      .length > 0 ||
                    "Problem is required",
                  maxLength: {
                    value: 255,
                    message:
                      "Problem cannot exceed 255 characters",
                  },
                }}
                render={({
                  field,
                  fieldState,
                }) => (
                  <TextField
                    {...field}
                    label="Reported Problem"
                    fullWidth
                    multiline
                    minRows={3}
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
                name="deviceCondition"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Device Condition"
                    fullWidth
                    multiline
                    minRows={2}
                    placeholder="Scratches, cracks, bent frame..."
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
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Accessories"
                    fullWidth
                    multiline
                    minRows={2}
                    placeholder="Phone, case, charger..."
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
                  required:
                    "Received date is required",
                }}
                render={({
                  field,
                  fieldState,
                }) => (
                  <TextField
                    {...field}
                    label="Received At"
                    type="datetime-local"
                    fullWidth
                    error={Boolean(
                      fieldState.error
                    )}
                    helperText={
                      fieldState.error
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
                  validate: (value) => {
                    if (!value) {
                      return true;
                    }

                    const receivedAt =
                      getValues(
                        "receivedAt"
                      );

                    if (!receivedAt) {
                      return true;
                    }

                    return (
                      new Date(
                        value
                      ).getTime() >=
                        new Date(
                          receivedAt
                        ).getTime() ||
                      "Due date cannot be earlier than received date"
                    );
                  },
                }}
                render={({
                  field,
                  fieldState,
                }) => (
                  <TextField
                    {...field}
                    label="Due At"
                    type="datetime-local"
                    fullWidth
                    error={Boolean(
                      fieldState.error
                    )}
                    helperText={
                      fieldState.error
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
                  Access Type
                </InputLabel>

                <Controller
                  name="accessType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="access-type-label"
                      label="Access Type"
                      onChange={(
                        event
                      ) => {
                        field.onChange(
                          event.target
                            .value
                        );

                        setValue(
                          "accessCode",
                          ""
                        );
                      }}
                    >
                      {accessTypeOptions.map(
                        (option) => (
                          <MenuItem
                            key={
                              option.value
                            }
                            value={
                              option.value
                            }
                          >
                            {option.label}
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
                  control={control}
                  rules={{
                    validate: (value) =>
                      value.trim()
                        .length > 0 ||
                      existingCodeCanBePreserved ||
                      "Access code is required",
                    maxLength: {
                      value: 256,
                      message:
                        "Access code cannot exceed 256 characters",
                    },
                  }}
                  render={({
                    field,
                    fieldState,
                  }) => (
                    <TextField
                      {...field}
                      label={
                        selectedAccessType ===
                        "pin"
                          ? "PIN"
                          : selectedAccessType ===
                              "password"
                            ? "Password"
                            : "Pattern"
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
                        fieldState.error
                          ?.message ??
                        (existingCodeCanBePreserved
                          ? "A code is already saved. Leave blank to keep it."
                          : selectedAccessType ===
                              "pattern"
                            ? "Example: 1-2-5-8"
                            : "")
                      }
                    />
                  )}
                />
              ) : (
                <TextField
                  label="Access Code"
                  value=""
                  fullWidth
                  margin="normal"
                  disabled
                  helperText={
                    selectedAccessType ===
                    "unknown"
                      ? "The access method is unknown."
                      : "No access code is required."
                  }
                />
              )}
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="h6"
            gutterBottom
          >
            Repair Information
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
                  Status
                </InputLabel>

                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="status-label"
                      label="Status"
                    >
                      {statusOptions.map(
                        (option) => (
                          <MenuItem
                            key={
                              option.value
                            }
                            value={
                              option.value
                            }
                          >
                            {option.label}
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
                    message:
                      "Estimated price cannot be negative",
                  },
                }}
                render={({
                  field,
                  fieldState,
                }) => (
                  <TextField
                    {...field}
                    label="Estimated Price"
                    type="number"
                    fullWidth
                    margin="normal"
                    error={Boolean(
                      fieldState.error
                    )}
                    helperText={
                      fieldState.error
                        ?.message
                    }
                    slotProps={{
                      htmlInput: {
                        min: 0,
                        step: 0.01,
                      },
                    }}
                    onChange={(
                      event
                    ) => {
                      field.onChange(
                        event.target
                          .value === ""
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
                    message:
                      "Final price cannot be negative",
                  },
                }}
                render={({
                  field,
                  fieldState,
                }) => (
                  <TextField
                    {...field}
                    label="Final Price"
                    type="number"
                    fullWidth
                    margin="normal"
                    error={Boolean(
                      fieldState.error
                    )}
                    helperText={
                      fieldState.error
                        ?.message
                    }
                    slotProps={{
                      htmlInput: {
                        min: 0,
                        step: 0.01,
                      },
                    }}
                    onChange={(
                      event
                    ) => {
                      field.onChange(
                        event.target
                          .value === ""
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

            <Grid size={{ xs: 12 }}>
              <Controller
                name="diagnosis"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Diagnosis"
                    fullWidth
                    multiline
                    minRows={3}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="workPerformed"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Work Performed"
                    fullWidth
                    multiline
                    minRows={3}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="internalNote"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Internal Note"
                    fullWidth
                    multiline
                    minRows={3}
                    helperText="Visible only to service staff."
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleCancel}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
          >
            {order
              ? "Update"
              : "Add"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default OrderForm;