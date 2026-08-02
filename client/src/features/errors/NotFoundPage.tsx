import {
  ArrowBackOutlined as BackIcon,
  HomeOutlined as HomeIcon,
} from "@mui/icons-material";
import {
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";
import {
  useLocation,
  useNavigate,
} from "react-router";

const NotFoundPage = () => {
  const {
    t,
  } = useTranslation();

  const location =
    useLocation();

  const navigate =
    useNavigate();

  return (
    <Container
      maxWidth="sm"
      sx={{
        py: {
          xs: 3,
          sm: 6,
        },
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          p: {
            xs: 3,
            sm: 5,
          },
          textAlign: "center",
        }}
      >
        <Stack
          spacing={2.5}
          alignItems="center"
        >
          <Typography
            component="p"
            color="primary"
            sx={{
              fontSize: {
                xs: "4rem",
                sm: "6rem",
              },
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            404
          </Typography>

          <Stack spacing={1}>
            <Typography
              component="h1"
              variant="h5"
            >
              {t(
                "notFoundPage.title"
              )}
            </Typography>

            <Typography
              color="text.secondary"
            >
              {t(
                "notFoundPage.description"
              )}
            </Typography>
          </Stack>

          <Typography
            component="code"
            variant="body2"
            color="text.secondary"
            sx={{
              maxWidth: "100%",
              overflowWrap:
                "anywhere",
            }}
          >
            {location.pathname}
          </Typography>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1.5}
            width="100%"
            justifyContent="center"
          >
            <Button
              variant="outlined"
              startIcon={
                <BackIcon />
              }
              onClick={() => {
                navigate(-1);
              }}
            >
              {t(
                "notFoundPage.back"
              )}
            </Button>

            <Button
              variant="contained"
              startIcon={
                <HomeIcon />
              }
              onClick={() => {
                navigate("/");
              }}
            >
              {t(
                "notFoundPage.dashboard"
              )}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default NotFoundPage;
