import {
  useState,
} from "react";
import type {
  FormEvent,
} from "react";
import type {
  AxiosError,
} from "axios";
import {
  Construction as ConstructionIcon,
  LockOutlined as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";
import {
  useLocation,
  useNavigate,
} from "react-router";

import LanguageSwitcher from "components/layout/LanguageSwitcher";
import useAuth from "features/auth/context/useAuth";
import type {
  AuthErrorResponse,
} from "types";

interface LoginLocationState {
  from?: string;
}

const LoginPage = () => {
  const {
    t,
  } = useTranslation();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    login,
    sessionError,
    refreshSession,
  } = useAuth();

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<
    string | null
  >(null);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    const normalizedEmail =
      email.trim();

    if (
      !normalizedEmail ||
      !password
    ) {
      setErrorMessage(
        t(
          "auth.errors.required"
        )
      );

      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null);

      await login({
        email:
          normalizedEmail,
        password,
      });

      const state =
        location.state as
          | LoginLocationState
          | null;

      const destination =
        state?.from &&
        state.from.startsWith(
          "/"
        )
          ? state.from
          : "/";

      navigate(
        destination,
        {
          replace: true,
        }
      );
    } catch (
      error: unknown
    ) {
      console.error(
        "Login failed:",
        error
      );

      const axiosError =
        error as AxiosError<AuthErrorResponse>;

      const code =
        axiosError.response
          ?.data?.code;

      const translationKey =
        code
          ? `auth.errors.codes.${code}`
          : "";

      const translated =
        translationKey
          ? t(
              translationKey,
              {
                defaultValue:
                  "",
              }
            )
          : "";

      setErrorMessage(
        translated ||
          axiosError.response
            ?.data?.error ||
          t(
            "auth.errors.loginFailed"
          )
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        p: 2,
        background:
          "linear-gradient(135deg, #e8f6fa 0%, #f7f9fb 55%, #eef2f5 100%)",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
        }}
      >
        <LanguageSwitcher />
      </Box>

      <Paper
        component="main"
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 430,
          p: {
            xs: 2.5,
            sm: 4,
          },
          borderRadius: 3,
        }}
      >
        <Stack
          spacing={3}
        >
          <Stack
            spacing={1}
            alignItems="center"
            textAlign="center"
          >
            <Avatar
              sx={{
                width: 58,
                height: 58,
                backgroundColor:
                  "primary.main",
              }}
            >
              <ConstructionIcon />
            </Avatar>

            <Typography
              variant="h4"
              component="h1"
              fontWeight={700}
            >
              CRM Remont
            </Typography>

            <Typography
              color="text.secondary"
            >
              {t(
                "auth.subtitle"
              )}
            </Typography>
          </Stack>

          {sessionError && (
            <Alert
              severity="warning"
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => {
                    void refreshSession();
                  }}
                >
                  {t(
                    "auth.actions.retry"
                  )}
                </Button>
              }
            >
              {t(
                "auth.errors.sessionCheckFailed"
              )}
            </Alert>
          )}

          {errorMessage && (
            <Alert
              severity="error"
              onClose={() => {
                setErrorMessage(
                  null
                );
              }}
            >
              {errorMessage}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={(
              event
            ) => {
              void handleSubmit(
                event
              );
            }}
            noValidate
          >
            <Stack spacing={2}>
              <TextField
                type="email"
                label={t(
                  "auth.fields.email"
                )}
                value={email}
                onChange={(
                  event
                ) => {
                  setEmail(
                    event.target.value
                  );
                }}
                autoComplete="username"
                autoFocus
                required
                fullWidth
                disabled={
                  submitting
                }
              />

              <TextField
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                label={t(
                  "auth.fields.password"
                )}
                value={password}
                onChange={(
                  event
                ) => {
                  setPassword(
                    event.target.value
                  );
                }}
                autoComplete="current-password"
                required
                fullWidth
                disabled={
                  submitting
                }
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon
                          fontSize="small"
                        />
                      </InputAdornment>
                    ),

                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          type="button"
                          edge="end"
                          onClick={() => {
                            setShowPassword(
                              (
                                current
                              ) =>
                                !current
                            );
                          }}
                          aria-label={t(
                            showPassword
                              ? "auth.actions.hidePassword"
                              : "auth.actions.showPassword"
                          )}
                        >
                          {showPassword
                            ? (
                              <VisibilityOffIcon />
                            )
                            : (
                              <VisibilityIcon />
                            )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={
                  submitting
                }
              >
                {submitting
                  ? t(
                      "auth.actions.signingIn"
                    )
                  : t(
                      "auth.actions.signIn"
                    )}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default LoginPage;
