import { Box, Typography, Button, useMediaQuery, useTheme } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
interface PageHeaderProps {
  title: string;
  onAddClick: () => void;
  addButtonText: string;
}
const PageHeader = ({ title, onAddClick, addButtonText }: PageHeaderProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "stretch", sm: "center" },
        gap: { xs: 2, sm: 0 },
        mb: { xs: 2, sm: 3, md: 4 },
        mt: { xs: 3, sm: 4, md: 6 },
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" } }}
      >
        {title}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onAddClick}
        fullWidth={isMobile}
        sx={{
          py: { xs: 1, sm: "auto" },
        }}
      >
        {addButtonText}
      </Button>
    </Box>
  );
};
export default PageHeader;
