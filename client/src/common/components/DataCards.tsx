import type {
  ReactNode,
} from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

interface DataCardsProps<T> {
  data: T[];
  emptyMessage?: string;

  renderCard: (
    item: T,
    index: number
  ) => ReactNode;

  sx?: Record<
    string,
    unknown
  >;
}

function DataCards<T>({
  data,
  emptyMessage,
  renderCard,
  sx,
}: DataCardsProps<T>) {
  const {
    t,
  } = useTranslation();

  const resolvedEmptyMessage =
    emptyMessage ??
    t("common.noData");

  return (
    <Box
      sx={{
        mb: 3,
        ...sx,
      }}
    >
      {data.length === 0 ? (
        <Paper
          sx={{
            p: 3,
            textAlign:
              "center",
          }}
        >
          <Typography color="text.secondary">
            {
              resolvedEmptyMessage
            }
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {data.map(
            renderCard
          )}
        </Stack>
      )}
    </Box>
  );
}

export default DataCards;
