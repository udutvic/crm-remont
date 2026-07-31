import { ReactNode } from 'react';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
export interface Column<T> {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: unknown, item: T) => ReactNode;
  onClick?: () => void;
  sx?: Record<string, unknown>;
}
interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  renderRow: (item: T, index: number) => ReactNode;
  sx?: Record<string, unknown>;
}
function DataTable<T>({ columns, data, emptyMessage = 'No data found', renderRow, sx }: DataTableProps<T>) {
  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        overflowX: "auto", 
        maxWidth: "100%",
        boxShadow: { xs: 1, sm: 2 },
        borderRadius: 1,
        mb: { xs: 3, sm: 4 },
        ...sx
      }}
    >
      <Table sx={{ minWidth: 650 }} size="medium">
        <TableHead>
          <TableRow sx={{ background: "#f7f7fa" }}>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                sx={{ 
                  fontWeight: 600, 
                  fontSize: '1rem',
                  cursor: column.onClick ? 'pointer' : 'default',
                  ...column.sx
                }}
                onClick={column.onClick}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                align="center"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map(renderRow)
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default DataTable;
