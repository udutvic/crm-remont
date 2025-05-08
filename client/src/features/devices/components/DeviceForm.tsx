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
  SelectChangeEvent,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Device, Client } from "types";
import { getClients } from "index";
interface DeviceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Device) => void;
  device?: Device;
  clients?: Client[];
}
const defaultValues = {
  brand: "",
  model: "",
  serial: "",
  clientId: 0,
};
const DeviceForm: React.FC<DeviceFormProps> = ({
  open,
  onClose,
  onSubmit,
  device,
  clients: initialClients,
}) => {
  const [clients, setClients] = useState<Client[]>(initialClients || []);
  const { control, handleSubmit, reset, setValue } = useForm<Device>({
    defaultValues,
  });
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (error) {
        console.error("Error loading clients:", error);
      }
    };
    if (open && (!initialClients || initialClients.length === 0)) {
      fetchClients();
    } else if (open && initialClients && initialClients.length > 0) {
      setClients(initialClients);
    }
  }, [open, initialClients]);
  useEffect(() => {
    if (open) {
      if (device) {
        setValue("brand", device.brand);
        setValue("model", device.model);
        setValue("serial", device.serial || "");
        setValue("clientId", device.clientId);
      } else {
        reset(defaultValues);
      }
    }
  }, [device, setValue, reset, open]);
  const submitHandler = (data: Device) => {
    onSubmit(data);
    reset(defaultValues);
    onClose();
  };
  const handleCancel = () => {
    reset(defaultValues);
    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{device ? "Edit Device" : "Add New Device"}</DialogTitle>
      <form onSubmit={handleSubmit(submitHandler)}>
        <DialogContent>
          <Grid
            container
            spacing={2}
          >
            <Grid size={{ xs: 12 }}>
              <Controller
                name="brand"
                control={control}
                rules={{ required: "Brand is required" }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Brand"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="model"
                control={control}
                rules={{ required: "Model is required" }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Model"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="serial"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Serial Number"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="clientId"
                control={control}
                rules={{ required: "Client is required" }}
                render={({ field, fieldState }) => (
                  <FormControl
                    fullWidth
                    error={!!fieldState.error}
                  >
                    <InputLabel id="client-label">Client</InputLabel>
                    <Select
                      labelId="client-label"
                      label="Client"
                      value={field.value || ""}
                      onChange={(e: SelectChangeEvent<number>) => {
                        field.onChange(Number(e.target.value));
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
                  </FormControl>
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
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
export default DeviceForm;
