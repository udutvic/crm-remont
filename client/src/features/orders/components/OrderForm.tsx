import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Order, Device, OrderStatus, Client } from "types";
import { getDevices } from "index";
interface OrderFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Order) => void;
  order?: Order;
  clients: Client[];
}
const defaultValues = {
  device: {},
  problem: "",
  status: "pending" as OrderStatus,
  price: 0,
  clientId: undefined as number | undefined,
};
const OrderForm: React.FC<OrderFormProps> = ({
  open,
  onClose,
  onSubmit,
  order,
  clients,
}) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const { control, handleSubmit, reset, watch } = useForm<Order & { clientId?: number }>({
    defaultValues,
  });
  const selectedClientId = watch("clientId");
  const filteredDevices = devices.filter(
    (device) => device.clientId === selectedClientId
  );
  useEffect(() => {
    if (open) {
      if (order) {
        reset(order);
      } else {
        reset(defaultValues);
      }
    }
  }, [order, reset, open]);
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const data = await getDevices();
        setDevices(data);
      } catch (error) {
        console.error("Error loading devices:", error);
      }
    };
    if (open) {
      fetchDevices();
    }
  }, [open]);
  const submitHandler = (data: Order & { clientId?: number }): void => {
    if (!data.device || !data.device.id) {
      return;
    }
    if (!data.problem) {
      return;
    }
    if (!data.clientId) {
      alert("Please select a client!");
      return;
    }
    const payload = {
      ...data,
      deviceId: data.device.id,
      clientId: data.clientId,
      status: data.status,
      price: data.price,
      problem: data.problem,
    };
    onSubmit(payload);
    reset(defaultValues);
    onClose();
  };
  const handleCancel = () => {
    reset(defaultValues);
    onClose();
  };
  const statusOptions: { value: OrderStatus; label: string }[] = [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];
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
      <form onSubmit={handleSubmit(submitHandler)}>
        <DialogContent>
          <Grid
            container
            spacing={2}
          >
            {}
            <Grid size={{ xs: 12 }}>
              <FormControl
                fullWidth
                margin="normal"
              >
                <InputLabel id="client-label">Client</InputLabel>
                <Controller
                  name="clientId"
                  control={control}
                  defaultValue={undefined}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="client-label"
                      label="Client"
                      required
                      displayEmpty
                      value={field.value || ""}
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
                  )}
                />
              </FormControl>
            </Grid>
            {}
            <Grid size={{ xs: 12 }}>
              <FormControl
                fullWidth
                margin="normal"
              >
                <InputLabel id="device-label">Device</InputLabel>
                <Controller
                  name="device"
                  control={control}
                  defaultValue={undefined}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="device-label"
                      label="Device"
                      required
                      value={field.value && field.value.id ? field.value.id : ""}
                      onChange={(e) => {
                        const selectedDevice = devices.find(
                          (device) => device.id === Number(e.target.value)
                        );
                        field.onChange(selectedDevice || {});
                      }}
                    >
                      {selectedClientId ? (
                        filteredDevices.length === 0 ? (
                          <MenuItem disabled>This client has no devices</MenuItem>
                        ) : (
                          filteredDevices.map((device) => (
                            <MenuItem
                              key={device.id}
                              value={device.id}
                            >
                              {device.brand} {device.model} ({device.serial})
                            </MenuItem>
                          ))
                        )
                      ) : (
                        <MenuItem disabled>Select a client first</MenuItem>
                      )}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            {}
            <Grid size={{ xs: 12 }}>
              <Controller
                name="problem"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Problem"
                    fullWidth
                    required
                  />
                )}
              />
            </Grid>
            {}
            <Grid size={{ xs: 12 }}>
              <FormControl
                fullWidth
                margin="normal"
              >
                <InputLabel id="status-label">Status</InputLabel>
                <Controller
                  name="status"
                  control={control}
                  defaultValue="pending"
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="status-label"
                      label="Status"
                      required
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
            {}
            <Grid size={{ xs: 12 }}>
              <Controller
                name="price"
                control={control}
                defaultValue={0}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Price"
                    type="number"
                    fullWidth
                    required
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            {order ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
export default OrderForm;
