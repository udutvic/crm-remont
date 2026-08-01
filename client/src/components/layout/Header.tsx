import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Construction,
  Menu as MenuIcon,
} from "@mui/icons-material";

import LanguageSwitcher from "./LanguageSwitcher";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({
  onMenuClick,
}: HeaderProps) => {
  const theme = useTheme();

  const isMobile =
    useMediaQuery(
      theme.breakpoints.down("md")
    );

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (currentTheme) =>
          currentTheme.zIndex.drawer +
          1,
        backgroundColor:
          "#219EBC",
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="Open menu"
            edge="start"
            onClick={onMenuClick}
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

        <LanguageSwitcher />
      </Toolbar>
    </AppBar>
  );
};

export default Header;