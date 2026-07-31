import { ReactNode } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import DataTable, { Column } from './DataTable';
import DataCards from './DataCards';
interface DataViewProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
  renderTableRow: (item: T, index: number) => ReactNode;
  renderCard: (item: T, index: number) => ReactNode;
  tableSx?: Record<string, unknown>;
  cardsSx?: Record<string, unknown>;
}
function DataView<T>({ 
  data, 
  columns, 
  emptyMessage = 'No data found', 
  renderTableRow, 
  renderCard,
  tableSx,
  cardsSx
}: DataViewProps<T>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <>
      {!isMobile && (
        <DataTable
          columns={columns}
          data={data}
          emptyMessage={emptyMessage}
          renderRow={renderTableRow}
          sx={tableSx}
        />
      )}
      {isMobile && (
        <DataCards
          data={data}
          emptyMessage={emptyMessage}
          renderCard={renderCard}
          sx={cardsSx}
        />
      )}
    </>
  );
}
export default DataView;
