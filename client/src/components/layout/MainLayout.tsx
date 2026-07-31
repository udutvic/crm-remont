import React, { useState } from "react";
import { Box, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";
interface MainLayoutProps {
  children: React.ReactNode;
}
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  return (
    <Box sx={{ display: "flex" }}>
      <Header onMenuClick={handleDrawerToggle} />
      <Sidebar 
        mobileOpen={mobileOpen} 
        onClose={handleDrawerToggle} 
        isMobile={isMobile} 
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { sm: "calc(100% - 0px)" },
          ml: { sm: "0px" },
        }}
      >
        <Toolbar /> {}
        {children}
      </Box>
    </Box>
  );
};
export default MainLayout;
