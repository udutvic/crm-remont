import {
  useState,
} from "react";
import type {
  MouseEvent,
} from "react";
import {
  Construction,
  Logout as LogoutIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";
import {
  useNavigate,
} from "react-router";

import useAuth from "features/auth/context/useAuth";

import LanguageSwitcher from "./LanguageSwitcher";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({
  onMenuClick,
}: HeaderProps) => {
  const {
    t,
  } = useTranslation();

  const navigate =
    useNavigate();

  const theme =
    useTheme();

  const isMobile =
    useMediaQuery(
      theme.breakpoints.down(
        "md"
      )
    );

  const {
    user,
    logout,
  } = useAuth();

  const [
    anchorElement,
    setAnchorElement,
  ] = useState<
    HTMLElement | null
  >(null);

  const menuOpen =
    Boolean(
      anchorElement
    );

  const handleOpenMenu = (
    event: MouseEvent<HTMLElement>
  ): void => {
    setAnchorElement(
      event.currentTarget
    );
  };

  const handleCloseMenu =
    (): void => {
      setAnchorElement(
        null
      );
    };

  const handleLogout =
    async (): Promise<void> => {
      handleCloseMenu();

      try {
        await logout();
      } catch (
        error: unknown
      ) {
        console.error(
          "Logout request failed:",
          error
        );
      } finally {
        navigate(
          "/login",
          {
            replace: true,
          }
        );
      }
    };

  const initials =
    user?.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(
        (part) =>
          part[0]
            ?.toUpperCase()
      )
      .join("") ||
    "?";

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (
          currentTheme
        ) =>
          currentTheme.zIndex
            .drawer + 1,
        background:
          "linear-gradient(90deg, #020f3a 0%, #03164f 48%, #00113f 100%)",
        color: "#ffffff",
        borderBottom:
          "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow:
          "0 4px 18px rgba(2, 15, 58, 0.16)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: {
            xs: "56px !important",
            sm: "58px !important",
          },
          px: {
            xs: 1.25,
            sm: 2.25,
          },
        }}
      >
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label={t(
              "common.openMenu"
            )}
            edge="start"
            onClick={
              onMenuClick
            }
            sx={{
              mr: {
                xs: 0.75,
                sm: 1.5,
              },
              color:
                "rgba(255, 255, 255, 0.95)",
              "&:hover": {
                bgcolor:
                  "rgba(255, 255, 255, 0.10)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              display: "grid",
              placeItems: "center",
              mr: 1.1,
              borderRadius: 1.5,
              bgcolor:
                "rgba(255, 255, 255, 0.08)",
              border:
                "1px solid rgba(255, 255, 255, 0.14)",
              flexShrink: 0,
            }}
          >
            <Construction
              sx={{
                fontSize: 20,
                color: "#ffffff",
              }}
            />
          </Box>

          <Typography
            variant="h6"
            component="div"
            noWrap
            sx={{
              fontSize: {
                xs: "0.98rem",
                sm: "1.08rem",
              },
              fontWeight: 850,
              letterSpacing:
                "0.01em",
              color: "#ffffff",
            }}
          >
            CRM Remont
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={{
            xs: 0.15,
            sm: 0.65,
          }}
          alignItems="center"
        >
          <LanguageSwitcher />

          <Tooltip
            title={t(
              "auth.userMenu.open"
            )}
          >
            <IconButton
              color="inherit"
              onClick={
                handleOpenMenu
              }
              aria-label={t(
                "auth.userMenu.open"
              )}
              aria-controls={
                menuOpen
                  ? "auth-user-menu"
                  : undefined
              }
              aria-haspopup="true"
              aria-expanded={
                menuOpen
                  ? "true"
                  : undefined
              }
              sx={{
                p: 0.5,
                "&:hover": {
                  bgcolor:
                    "rgba(255, 255, 255, 0.10)",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize:
                    "0.78rem",
                  fontWeight: 800,
                  color: "#ffffff",
                  bgcolor: "#075cff",
                  border:
                    "1px solid rgba(255, 255, 255, 0.28)",
                  boxShadow:
                    "0 3px 10px rgba(0, 0, 0, 0.18)",
                }}
              >
                {initials}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Stack>

        <Menu
          id="auth-user-menu"
          anchorEl={
            anchorElement
          }
          open={menuOpen}
          onClose={
            handleCloseMenu
          }
          anchorOrigin={{
            vertical:
              "bottom",
            horizontal:
              "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal:
              "right",
          }}
          slotProps={{
            paper: {
              sx: {
                mt: 1,
                minWidth: 250,
                borderRadius: 2,
                border:
                  "1px solid #d8e1ef",
                boxShadow:
                  "0 14px 36px rgba(3, 22, 79, 0.18)",
              },
            },
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.25,
            }}
          >
            <Typography
              fontWeight={700}
              color="#07184a"
              noWrap
            >
              {user?.name}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
            >
              {user?.email}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {t(
                user?.role ===
                  "admin"
                  ? "auth.roles.admin"
                  : "auth.roles.technician"
              )}
            </Typography>
          </Box>

          <Divider />

          <MenuItem
            onClick={() => {
              void handleLogout();
            }}
          >
            <ListItemIcon>
              <LogoutIcon
                fontSize="small"
              />
            </ListItemIcon>

            {t(
              "auth.actions.signOut"
            )}
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
