import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

import { getDevices } from "index";
import {
  Client,
  Device,
  Order,
  OrderPayload,
  OrderStatus,
} from "types";

interface OrderFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: OrderPayload) => Promise<void>;
  order?: Order;
  clients: Client[];
}

interface OrderFormValues {
  clientId: number | "";
  deviceId: number | "";
  problem: string;
  status: OrderStatus;
  price: number;
}

const defaultValues: OrderFormValues = {
  clientId: "",
  deviceId: "",
  problem: "",
  status: "pending",
  price: 0,
};

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

const OrderForm = ({
  open,
  onClose,
  onSubmit,
  order,
  clients,
}: OrderFormProps) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [serverError, setServerError] =
    useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<OrderFormValues>({
    defaultValues,
  });

  const selectedClientId = watch("clientId");

  const filteredDevices = devices.filter(
    (device) => device.clientId === selectedClientId
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
        price: order.price,
      });

      return;
    }

    reset(defaultValues);
  }, [open, order, reset]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const loadDevices = async (): Promise<void> => {
      try {
        const data = await getDevices();

        setDevices(data);
      } catch (error: unknown) {
        console.error("Error loading devices:", error);
        setServerError("Failed to load devices.");
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

    const payload: OrderPayload = {
      clientId: values.clientId,
      deviceId: values.deviceId,
      problem: values.problem.trim(),
      status: values.status,
      price: Number(values.price),
    };

    try {
      setServerError(null);

      await onSubmit(payload);

      reset(defaultValues);
    } catch (error: unknown) {
      console.error("Error saving order:", error);
      setServerError("Failed to save order.");
    }
  };

  const handleCancel = (): void => {
    reset(defaultValues);
    setServerError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {order ? "Edit Order" : "Create New Order"}
      </DialogTitle>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
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
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        {...field}
                        labelId="client-label"
                        label="Client"
                        error={Boolean(fieldState.error)}
                        onChange={(event) => {
                          const clientId = Number(
                            event.target.value
                          );

                          field.onChange(clientId);
                          setValue("deviceId", "");
                        }}
                      >
                        {clients.map((client) => (
                          <MenuItem
                            key={client.id}
                            value={client.id}
                          >
                            {client.name} ({client.phone})
                          </MenuItem>
                        ))}
                      </Select>

                      {fieldState.error && (
                        <Alert
                          severity="error"
                          sx={{ mt: 1 }}
                        >
                          {fieldState.error.message}
                        </Alert>
                      )}
                    </>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControl
                fullWidth
                margin="normal"
                disabled={selectedClientId === ""}
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
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        {...field}
                        labelId="device-label"
                        label="Device"
                        error={Boolean(fieldState.error)}
                        onChange={(event) => {
                          field.onChange(
                            Number(event.target.value)
                          );
                        }}
                      >
                        {filteredDevices.length === 0 ? (
                          <MenuItem disabled>
                            This client has no devices
                          </MenuItem>
                        ) : (
                          filteredDevices.map((device) => (
                            <MenuItem
                              key={device.id}
                              value={device.id}
                            >
                              {device.brand} {device.model}
                              {device.serial
                                ? ` (${device.serial})`
                                : ""}
                            </MenuItem>
                          ))
                        )}
                      </Select>

                      {fieldState.error && (
                        <Alert
                          severity="error"
                          sx={{ mt: 1 }}
                        >
                          {fieldState.error.message}
                        </Alert>
                      )}
                    </>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="problem"
                control={control}
                rules={{
                  required: "Problem is required",
                  validate: (value) =>
                    value.trim().length > 0 ||
                    "Problem is required",
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Problem"
                    fullWidth
                    multiline
                    minRows={3}
                    error={Boolean(fieldState.error)}
                    helperText={
                      fieldState.error?.message
                    }
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
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
                      {statusOptions.map((option) => (
                        <MenuItem
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="price"
                control={control}
                rules={{
                  min: {
                    value: 0,
                    message:
                      "Price cannot be negative",
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Price"
                    type="number"
                    fullWidth
                    error={Boolean(fieldState.error)}
                    helperText={
                      fieldState.error?.message
                    }
                    slotProps={{
                      htmlInput: {
                        min: 0,
                        step: 1,
                      },
                    }}
                    onChange={(event) => {
                      field.onChange(
                        Number(event.target.value)
                      );
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCancel}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
          >
            {order ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default OrderForm;