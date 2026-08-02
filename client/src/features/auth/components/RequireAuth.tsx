import type {
  ReactNode,
} from "react";
import {
  Alert,
  Box,
  Button,
  Stack,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";
import {
  Navigate,
  useLocation,
} from "react-router";

import LoadingIndicator from "components/ui/LoadingIndicator";
import useAuth from "features/auth/context/useAuth";

interface RequireAuthProps {
  children: ReactNode;
}

const RequireAuth = ({
  children,
}: RequireAuthProps) => {
  const {
    t,
  } = useTranslation();

  const location =
    useLocation();

  const {
    user,
    loading,
    sessionError,
    refreshSession,
  } = useAuth();

  if (loading) {
    return (
      <LoadingIndicator
        message={t(
          "auth.checkingSession"
        )}
      />
    );
  }

  if (sessionError) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          p: 2,
          backgroundColor:
            "background.default",
        }}
      >
        <Stack
          spacing={2}
          sx={{
            width: "100%",
            maxWidth: 520,
          }}
        >
          <Alert severity="error">
            {t(
              "auth.errors.sessionCheckFailed"
            )}
          </Alert>

          <Button
            variant="contained"
            onClick={() => {
              void refreshSession();
            }}
          >
            {t(
              "auth.actions.retry"
            )}
          </Button>
        </Stack>
      </Box>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from:
            location.pathname +
            location.search,
        }}
      />
    );
  }

  return children;
};

export default RequireAuth;
