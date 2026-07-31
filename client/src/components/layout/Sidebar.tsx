import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
} from "@mui/material";
import { Dashboard, People, Devices, Assignment } from "@mui/icons-material";
import { Link, useLocation } from "react-router";
const drawerWidth = 240; 
interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}
const Sidebar = ({ mobileOpen, onClose, isMobile }: SidebarProps) => {
  const location = useLocation();
  const menuItems = [
    { text: "Dashboard", icon: <Dashboard sx={{color: useLocation().pathname === "/" ? "#219EBC" : "inherit"}}/>, path: "/" },
    { text: "Clients", icon: <People sx={{color: useLocation().pathname === "/clients" ? "#219EBC" : "inherit"}}/>, path: "/clients" },
    { text: "Devices", icon: <Devices sx={{color: useLocation().pathname === "/devices" ? "#219EBC" : "inherit"}}/>, path: "/devices" },
    { text: "Orders", icon: <Assignment sx={{color: useLocation().pathname === "/orders" ? "#219EBC" : "inherit"}}/>, path: "/orders" },
  ];
  const drawerContent = (
    <>
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            onClick={isMobile ? onClose : undefined}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </>
  );
  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onClose}
          ModalProps={{
            keepMounted: true, 
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
};
export default Sidebar;
