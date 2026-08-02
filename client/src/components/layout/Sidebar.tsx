import {
  AdminPanelSettingsOutlined as AuditIcon,
  ArchiveOutlined as ArchiveIcon,
  Inventory2Outlined as InventoryIcon,
  ManageAccountsOutlined as StaffIcon,
  Assignment,
  Dashboard,
  Devices,
  People,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";
import {
  Link,
  useLocation,
} from "react-router";

import useAuth from "features/auth/context/useAuth";

const drawerWidth = 240;

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const Sidebar = ({
  mobileOpen,
  onClose,
  isMobile,
}: SidebarProps) => {
  const location =
    useLocation();

  const {
    t,
  } = useTranslation();

  const {
    user,
  } = useAuth();

  const isPathActive = (
    path: string
  ): boolean => {
    if (path === "/") {
      return (
        location.pathname ===
        "/"
      );
    }

    if (
      path === "/orders" &&
      location.pathname.startsWith(
        "/orders/archive"
      )
    ) {
      return false;
    }

    return (
      location.pathname ===
        path ||
      location.pathname.startsWith(
        `${path}/`
      )
    );
  };

  const menuItems = [
    {
      text: t(
        "navigation.dashboard"
      ),
      icon: Dashboard,
      path: "/",
    },
    {
      text: t(
        "navigation.clients"
      ),
      icon: People,
      path: "/clients",
    },
    {
      text: t(
        "navigation.devices"
      ),
      icon: Devices,
      path: "/devices",
    },
    {
      text: t(
        "navigation.orders"
      ),
      icon: Assignment,
      path: "/orders",
    },

    {
      text: t(
        "navigation.inventory"
      ),
      icon: InventoryIcon,
      path: "/inventory",
    },

    ...(user?.role ===
    "admin"
      ? [
          {
            text: t(
              "navigation.orderArchive"
            ),
            icon: ArchiveIcon,
            path:
              "/orders/archive",
          },
          {
            text: t(
              "staffPage.title"
            ),
            icon: StaffIcon,
            path: "/staff",
          },
          {
            text: t(
              "auditPage.title"
            ),
            icon: AuditIcon,
            path: "/audit",
          },
        ]
      : []),
  ];

  const drawerContent = (
    <>
      <Toolbar />

      <Divider />

      <List>
        {menuItems.map(
          (item) => {
            const active =
              isPathActive(
                item.path
              );

            const ItemIcon =
              item.icon;

            return (
              <ListItemButton
                key={item.path}
                component={Link}
                to={item.path}
                selected={active}
                onClick={
                  isMobile
                    ? onClose
                    : undefined
                }
              >
                <ListItemIcon>
                  <ItemIcon
                    sx={{
                      color: active
                        ? "#219EBC"
                        : "inherit",
                    }}
                  />
                </ListItemIcon>

                <ListItemText
                  primary={
                    item.text
                  }
                />
              </ListItemButton>
            );
          }
        )}
      </List>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: {
          md: drawerWidth,
        },
        flexShrink: {
          md: 0,
        },
      }}
    >
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: {
              xs: "block",
              md: "none",
            },

            "& .MuiDrawer-paper":
              {
                boxSizing:
                  "border-box",
                width:
                  drawerWidth,
              },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          open
          sx={{
            display: {
              xs: "none",
              md: "block",
            },

            "& .MuiDrawer-paper":
              {
                boxSizing:
                  "border-box",
                width:
                  drawerWidth,
              },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
