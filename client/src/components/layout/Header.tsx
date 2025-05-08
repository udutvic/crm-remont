import { AppBar, Toolbar, Typography, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { Construction, Menu as MenuIcon } from "@mui/icons-material";
interface HeaderProps {
  onMenuClick: () => void;
}
const Header = ({ onMenuClick }: HeaderProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: "#219EBC" }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="відкрити меню"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography
          variant="h5"
          component="div"
          sx={{ 
            flexGrow: 1,
            fontSize: { xs: '1.2rem', sm: '1.5rem' }
          }}
        >
          <Construction sx={{ mr: 1, fontSize: { xs: 20, sm: 24 } }} />
          CRM Remont
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
export default Header;
