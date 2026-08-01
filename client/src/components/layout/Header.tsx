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
      sx={{
        zIndex: (
          currentTheme
        ) =>
          currentTheme.zIndex
            .drawer + 1,

        backgroundColor:
          "#219EBC",
      }}
    >
      <Toolbar>
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
                xs: 1,
                sm: 2,
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
          <Construction
            sx={{
              mr: 1,

              fontSize: {
                xs: 20,
                sm: 24,
              },

              flexShrink: 0,
            }}
          />

          <Typography
            variant="h5"
            component="div"
            noWrap
            sx={{
              fontSize: {
                xs: "1.05rem",
                sm: "1.5rem",
              },
            }}
          >
            CRM Remont
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={{
            xs: 0.25,
            sm: 1,
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
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize:
                    "0.8rem",
                  backgroundColor:
                    "rgba(255, 255, 255, 0.2)",
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
              fontWeight={600}
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
