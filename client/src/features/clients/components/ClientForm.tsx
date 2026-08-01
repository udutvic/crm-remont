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
  Grid,
  Stack,
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
  ClientLookupResult,
  ClientPayload,
} from "types";

interface ClientFormProps {
  open: boolean;
  onClose: () => void;

  onSubmit: (
    data: ClientPayload
  ) => Promise<void>;

  onLookupByPhone: (
    phone: string
  ) => Promise<ClientLookupResult>;

  onClientFound: (
    client: Client
  ) => void;

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

interface LookupFeedback {
  severity:
    | "info"
    | "error";

  translationKey?: string;
  message?: string;
}

const defaultValues: ClientFormValues =
  {
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
  const normalized =
    value.trim();

  return normalized.length >
    0
    ? normalized
    : null;
};

const formFieldNames =
  new Set<
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
  onLookupByPhone,
  onClientFound,
  client,
}: ClientFormProps) => {
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
    lookupFeedback,
    setLookupFeedback,
  ] =
    useState<LookupFeedback | null>(
      null
    );

  const [
    lookupLoading,
    setLookupLoading,
  ] = useState(false);

  const {
    control,
    getValues,
    handleSubmit,
    reset,
    setError,
    trigger,
  } = useForm<ClientFormValues>({
    defaultValues,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    setServerError(null);
    setLookupFeedback(null);

    if (client) {
      reset({
        name:
          client.name ?? "",

        phone:
          client.phone ?? "",

        secondaryPhone:
          client.secondaryPhone ??
          "",

        email:
          client.email ?? "",

        address:
          client.address ?? "",

        note:
          client.note ?? "",
      });

      return;
    }

    reset(defaultValues);
  }, [
    client,
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
              detail.field as keyof ClientFormValues
            )
          ) {
            setError(
              detail.field as keyof ClientFormValues,
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

  const handlePhoneLookup =
    async (): Promise<void> => {
      setServerError(null);
      setLookupFeedback(null);

      const isPhoneValid =
        await trigger(
          "phone"
        );

      if (!isPhoneValid) {
        return;
      }

      const phone =
        getValues(
          "phone"
        ).trim();

      setLookupLoading(true);

      try {
        const result =
          await onLookupByPhone(
            phone
          );

        if (
          result.found &&
          result.client
        ) {
          onClientFound(
            result.client
          );

          return;
        }

        setLookupFeedback({
          severity: "info",
          translationKey:
            "clientForm.lookup.notFound",
        });
      } catch (
        error: unknown
      ) {
        console.error(
          "Client phone lookup failed:",
          error
        );

        const axiosError =
          error as AxiosError<ApiErrorResponse>;

        const apiMessage =
          axiosError.response
            ?.data?.error;

        setLookupFeedback({
          severity: "error",
          message:
            apiMessage,
          translationKey:
            apiMessage
              ? undefined
              : "clientForm.lookup.failed",
        });
      } finally {
        setLookupLoading(false);
      }
    };

  const submitHandler =
    async (
      values: ClientFormValues
    ): Promise<void> => {
      const payload: ClientPayload =
        {
          name:
            values.name.trim(),

          phone:
            values.phone.trim(),

          secondaryPhone:
            toNullableText(
              values.secondaryPhone
            ),

          email:
            toNullableText(
              values.email
            )?.toLowerCase() ??
            null,

          address:
            toNullableText(
              values.address
            ),

          note:
            toNullableText(
              values.note
            ),
        };

      try {
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
          "Client form submission failed:",
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

        setServerError(
          response?.error ??
            t(
              "clientForm.errors.save"
            )
        );
      }
    };

  const handleCancel =
    (): void => {
      reset(defaultValues);
      setServerError(null);
      setLookupFeedback(null);
      onClose();
    };

  const lookupMessage =
    lookupFeedback
      ? lookupFeedback.message ??
        (lookupFeedback.translationKey
          ? t(
              lookupFeedback.translationKey
            )
          : "")
      : "";

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
        {client
          ? t(
              "clientForm.titles.edit"
            )
          : t(
              "clientForm.titles.add"
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

          {lookupFeedback && (
            <Alert
              severity={
                lookupFeedback.severity
              }
              sx={{
                mb: 2,
              }}
            >
              {lookupMessage}
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
                name="name"
                control={control}
                rules={{
                  required: t(
                    "clientForm.validation.nameRequired"
                  ),

                  maxLength: {
                    value: 120,
                    message: t(
                      "clientForm.validation.nameMax"
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
                      "clientForm.fields.fullName"
                    )}
                    fullWidth
                    autoComplete="name"
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
              }}
            >
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: t(
                    "clientForm.validation.phoneRequired"
                  ),

                  pattern: {
                    value:
                      phonePattern,
                    message: t(
                      "clientForm.validation.phoneInvalid"
                    ),
                  },
                }}
                render={({
                  field,
                  fieldState,
                }) => (
                  <Stack
                    direction={{
                      xs: "column",
                      sm: "row",
                    }}
                    spacing={1}
                    alignItems="flex-start"
                  >
                    <TextField
                      {...field}
                      label={t(
                        "clientForm.fields.phone"
                      )}
                      fullWidth
                      type="tel"
                      autoComplete="tel"
                      placeholder="+420 777 123 456"
                      error={Boolean(
                        fieldState.error
                      )}
                      helperText={
                        fieldState
                          .error
                          ?.message
                      }
                    />

                    {!client && (
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() => {
                          void handlePhoneLookup();
                        }}
                        disabled={
                          lookupLoading
                        }
                        startIcon={
                          lookupLoading ? (
                            <CircularProgress
                              size={18}
                            />
                          ) : undefined
                        }
                        sx={{
                          minWidth: 150,
                          minHeight: 56,
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {lookupLoading
                          ? t(
                              "clientForm.lookup.searching"
                            )
                          : t(
                              "clientForm.lookup.findClient"
                            )}
                      </Button>
                    )}
                  </Stack>
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
                  validate: (
                    value
                  ) =>
                    !value ||
                    phonePattern.test(
                      value
                    ) ||
                    t(
                      "clientForm.validation.secondaryPhoneInvalid"
                    ),
                }}
                render={({
                  field,
                  fieldState,
                }) => (
                  <TextField
                    {...field}
                    label={t(
                      "clientForm.fields.secondaryPhone"
                    )}
                    fullWidth
                    type="tel"
                    placeholder="+420 777 123 456"
                    error={Boolean(
                      fieldState.error
                    )}
                    helperText={
                      fieldState
                        .error
                        ?.message ??
                      t(
                        "clientForm.helpers.optional"
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
                name="email"
                control={control}
                rules={{
                  validate: (
                    value
                  ) =>
                    !value ||
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
                }}
                render={({
                  field,
                  fieldState,
                }) => (
                  <TextField
                    {...field}
                    label={t(
                      "clientForm.fields.email"
                    )}
                    fullWidth
                    type="email"
                    autoComplete="email"
                    error={Boolean(
                      fieldState.error
                    )}
                    helperText={
                      fieldState
                        .error
                        ?.message ??
                      t(
                        "clientForm.helpers.optional"
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
                name="address"
                control={control}
                rules={{
                  maxLength: {
                    value: 255,
                    message: t(
                      "clientForm.validation.addressMax"
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
                      "clientForm.fields.address"
                    )}
                    fullWidth
                    autoComplete="street-address"
                    error={Boolean(
                      fieldState.error
                    )}
                    helperText={
                      fieldState
                        .error
                        ?.message ??
                      t(
                        "clientForm.helpers.optional"
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
                name="note"
                control={control}
                rules={{
                  maxLength: {
                    value: 2000,
                    message: t(
                      "clientForm.validation.noteMax"
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
                      "clientForm.fields.note"
                    )}
                    fullWidth
                    multiline
                    minRows={3}
                    maxRows={8}
                    error={Boolean(
                      fieldState.error
                    )}
                    helperText={
                      fieldState
                        .error
                        ?.message ??
                      t(
                        "clientForm.helpers.note"
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
          >
            {t(
              "clientForm.actions.cancel"
            )}
          </Button>

          <Button
            type="submit"
            variant="contained"
          >
            {t(
              "clientForm.actions.save"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ClientForm;
