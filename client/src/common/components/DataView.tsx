import type {
  ReactNode,
} from "react";
import {
  useMediaQuery,
  useTheme,
} from "@mui/material";

import DataCards from "./DataCards";
import DataTable from "./DataTable";
import type {
  Column,
} from "./DataTable";

interface DataViewProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;

  renderTableRow: (
    item: T,
    index: number
  ) => ReactNode;

  renderCard: (
    item: T,
    index: number
  ) => ReactNode;

  tableSx?: Record<
    string,
    unknown
  >;

  cardsSx?: Record<
    string,
    unknown
  >;
}

function DataView<T>({
  data,
  columns,
  emptyMessage,
  renderTableRow,
  renderCard,
  tableSx,
  cardsSx,
}: DataViewProps<T>) {
  const theme =
    useTheme();

  const isMobile =
    useMediaQuery(
      theme.breakpoints.down(
        "sm"
      )
    );

  if (isMobile) {
    return (
      <DataCards
        data={data}
        emptyMessage={
          emptyMessage
        }
        renderCard={
          renderCard
        }
        sx={cardsSx}
      />
    );
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      emptyMessage={
        emptyMessage
      }
      renderRow={
        renderTableRow
      }
      sx={tableSx}
    />
  );
}

export default DataView;
