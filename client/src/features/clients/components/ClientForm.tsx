import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Client } from "types";
import { AxiosError } from "axios";
interface ClientFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Client) => Promise<void | Error>;
  client?: Client;
}
const defaultValues = {
  name: "",
  phone: "",
  email: "",
};
const ClientForm: React.FC<ClientFormProps> = ({
  open,
  onClose,
  onSubmit,
  client,
}) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const { control, handleSubmit, reset } = useForm<Client>({
    defaultValues,
  });
  useEffect(() => {
    if (open) {
      setServerError(null);
      if (client) {
        reset(client);
      } else {
        reset(defaultValues);
      }
    }
  }, [client, reset, open]);
  const submitHandler = async (data: Client) => {
    try {
      setServerError(null);
      await onSubmit(data);
      reset(defaultValues);
    } catch (error: unknown) {
      console.error("Form submission error:", error);
      const axiosError = error as AxiosError<{ error: string }>;
      if (axiosError.response?.data?.error) {
        setServerError(axiosError.response.data.error);
      } else if (error instanceof Error && error.message.includes("phone")) {
        setServerError("Phone number is already used by another client");
      } else {
        setServerError("Error saving client. Please try again.");
      }
    }
  };
  const handleCancel = () => {
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
      <DialogTitle>{client ? "Edit Client" : "Add New Client"}</DialogTitle>
      <form onSubmit={handleSubmit(submitHandler)}>
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
                name="name"
                control={control}
                rules={{ required: "Name is required" }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Name"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: "Phone is required",
                  pattern: {
                    value: /^[0-9+\-\s()]{7,15}$/,
                    message: "Enter a valid phone number",
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Phone"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="email"
                control={control}
                rules={{
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email format",
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Email"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
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
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
export default ClientForm;
