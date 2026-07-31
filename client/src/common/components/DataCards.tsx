import { ReactNode } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
} from '@mui/material';
interface DataCardsProps<T> {
  data: T[];
  emptyMessage?: string;
  renderCard: (item: T, index: number) => ReactNode;
  sx?: Record<string, unknown>;
}
function DataCards<T>({ data, emptyMessage = 'No data found', renderCard, sx }: DataCardsProps<T>) {
  return (
    <Box sx={{ mb: 3, ...sx }}>
      {data.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary">{emptyMessage}</Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {data.map(renderCard)}
        </Stack>
      )}
    </Box>
  );
}
export default DataCards;
