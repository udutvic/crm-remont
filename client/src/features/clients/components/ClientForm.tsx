import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import {
  Controller,
  useForm,
} from "react-hook-form";

import {
  Client,
  ClientPayload,
} from "types";

interface ClientFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    data: ClientPayload
  ) => Promise<void>;
  client?: Client;
}

interface ClientFormValues {
  name: string;
  phone: string;
  secondaryPhone: string;
  email: string;
  address: string;
  note: string;
}

interface ApiErrorResponse {
  error?: string;

  details?:
    | Record<string, string>
    | Array<{
        field?: string;
        message: string;
      }>;
}

const defaultValues: ClientFormValues = {
  name: "",
  phone: "",
  secondaryPhone: "",
  email: "",
  address: "",
  note: "",
};

const phonePattern =
  /^[0-9+\-\s()]{8,24}$/;

const emailPattern =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toNullableText = (
  value: string
): string | null => {
  const normalized = value.trim();

  return normalized.length > 0
    ? normalized
    : null;
};

const formFieldNames = new Set<
  keyof ClientFormValues
>([
  "name",
  "phone",
  "secondaryPhone",
  "email",
  "address",
  "note",
]);

const ClientForm = ({
  open,
  onClose,
  onSubmit,
  client,
}: ClientFormProps) => {
  const [
    serverError,
    setServerError,
  ] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setError,
  } = useForm<ClientFormValues>({
    defaultValues,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    setServerError(null);

    if (client) {
      reset({
        name: client.name ?? "",
        phone: client.phone ?? "",
        secondaryPhone:
          client.secondaryPhone ?? "",
        email: client.email ?? "",
        address: client.address ?? "",
        note: client.note ?? "",
      });

      return;
    }

    reset(defaultValues);
  }, [client, open, reset]);

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
            detail.field as keyof ClientFormValues
          )
        ) {
          setError(
            detail.field as keyof ClientFormValues,
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
          field as keyof ClientFormValues
        )
      ) {
        setError(
          field as keyof ClientFormValues,
          {
            type: "server",
            message,
          }
        );
      }
    }
  };

  const submitHandler = async (
    values: ClientFormValues
  ): Promise<void> => {
    const payload: ClientPayload = {
      name: values.name.trim(),
      phone: values.phone.trim(),

      secondaryPhone: toNullableText(
        values.secondaryPhone
      ),

      email: toNullableText(
        values.email
      )?.toLowerCase() ?? null,

      address: toNullableText(
        values.address
      ),

      note: toNullableText(values.note),
    };

    try {
      setServerError(null);

      await onSubmit(payload);

      reset(defaultValues);
    } catch (error: unknown) {
      console.error(
        "Client form submission failed:",
        error
      );

      const axiosError =
        error as AxiosError<ApiErrorResponse>;

      const response =
        axiosError.response?.data;

      applyServerFieldErrors(
        response?.details
      );

      setServerError(
        response?.error ??
          "Error saving client. Please try again."
      );
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
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {client
          ? "Edit Client"
          : "Add New Client"}
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
                name="name"
                control={control}
                rules={{
                  required:
                    "Full name is required",

                  maxLength: {
                    value: 120,
                    message:
                      "Full name cannot exceed 120 characters",
                  },
                }}
                render={({
                  field,
                  fieldState,
                }) => (
                  <TextField
                    {...field}
                    label="Full name"
                    fullWidth
                    autoComplete="name"
                    error={Boolean(
                      fieldState.error
                    )}
                    helperText={
                      fieldState.error?.message
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
                name="phone"
                control={control}
                rules={{
                  required:
                    "Phone is required",

                  pattern: {
                    value: phonePattern,
                    message:
                      "Enter a valid phone number",
                  },
                }}
                render={({
                  field,
                  fieldState,
                }) => (
                  <TextField
                    {...field}
                    label="Phone"
                    fullWidth
                    type="tel"
                    autoComplete="tel"
                    placeholder="+420 777 123 456"
                    error={Boolean(
                      fieldState.error
                    )}
                    helperText={
                      fieldState.error?.message
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
                name="secondaryPhone"
                control={control}
                rules={{
                  validate: (value) =>
                    !value ||
                    phonePattern.test(value) ||
                    "Enter a valid secondary phone number",
                }}
                render={({
                  field,
                  fieldState,
                }) => (
                  <TextField
                    {...field}
                    label="Secondary phone"
                    fullWidth
                    type="tel"
                    placeholder="+420 777 123 456"
                    error={Boolean(
                      fieldState.error
                    )}
                    helperText={
                      fieldState.error?.message ??
                      "Optional"
                    }
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="email"
                control={control}
                rules={{
                  validate: (value) =>
                    !value ||
                    emailPattern.test(
                      value.trim()
                    ) ||
                    "Invalid email format",

                  maxLength: {
                    value: 160,
                    message:
                      "Email cannot exceed 160 characters",
                  },
                }}
                render={({
                  field,
                  fieldState,
                }) => (
                  <TextField
                    {...field}
                    label="Email"
                    fullWidth
                    type="email"
                    autoComplete="email"
                    error={Boolean(
                      fieldState.error
                    )}
                    helperText={
                      fieldState.error?.message ??
                      "Optional"
                    }
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="address"
                control={control}
                rules={{
                  maxLength: {
                    value: 255,
                    message:
                      "Address cannot exceed 255 characters",
                  },
                }}
                render={({
                  field,
                  fieldState,
                }) => (
                  <TextField
                    {...field}
                    label="Address"
                    fullWidth
                    autoComplete="street-address"
                    error={Boolean(
                      fieldState.error
                    )}
                    helperText={
                      fieldState.error?.message ??
                      "Optional"
                    }
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="note"
                control={control}
                rules={{
                  maxLength: {
                    value: 2000,
                    message:
                      "Note cannot exceed 2000 characters",
                  },
                }}
                render={({
                  field,
                  fieldState,
                }) => (
                  <TextField
                    {...field}
                    label="Client note"
                    fullWidth
                    multiline
                    minRows={3}
                    maxRows={8}
                    error={Boolean(
                      fieldState.error
                    )}
                    helperText={
                      fieldState.error?.message ??
                      "Internal information about the client"
                    }
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
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ClientForm;