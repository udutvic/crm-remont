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
  useNavigate,
} from "react-router";

import useAuth from "features/auth/context/useAuth";
import type {
  UserRole,
} from "types";

interface RequireRoleProps {
  allowedRoles: UserRole[];
  children: ReactNode;
}

const RequireRole = ({
  allowedRoles,
  children,
}: RequireRoleProps) => {
  const {
    t,
  } = useTranslation();

  const navigate =
    useNavigate();

  const {
    user,
  } = useAuth();

  if (
    !user ||
    !allowedRoles.includes(
      user.role
    )
  ) {
    return (
      <Box
        sx={{
          minHeight: 360,
          display: "grid",
          placeItems: "center",
          p: 2,
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
              "security.accessDenied"
            )}
          </Alert>

          <Button
            variant="contained"
            onClick={() => {
              navigate("/");
            }}
          >
            {t(
              "security.backToDashboard"
            )}
          </Button>
        </Stack>
      </Box>
    );
  }

  return children;
};

export default RequireRole;
