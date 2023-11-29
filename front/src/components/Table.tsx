import React from "react";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import { TableVirtuoso } from "react-virtuoso";
import {
  ColumnDef,
  ColumnHelper,
  OnChangeFn,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  TiArrowUnsorted,
  TiArrowSortedDown,
  TiArrowSortedUp,
} from "react-icons/ti";
import { Box, CircularProgress } from "@mui/material";

export interface BookRow {
  // C
  publisher: string;
  // D
  year: number;
  // F
  authors: string;
  // G
  title: string;
  // I
  isbn: number;
  // J
  esbn: number;
  // N
  format: string;

  book_id: number;

  info: React.ReactElement;
  read: React.ReactElement;
}

const padding = "0.5rem";

export function BookTable<T>({
  books,
  booksLoaded,
  columns: columns_,
}: {
  books: T[];
  booksLoaded: boolean;
  columns: (arg: ColumnHelper<T>) => ColumnDef<T, unknown>[];
}) {
  const columnHelper = createColumnHelper<T>();
  const columns = React.useMemo(
    () => columns_(columnHelper),
    [columnHelper, columns_]
  );

  const [sorting, setSorting] = React.useState([]);

  const table = useReactTable({
    data: books,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting as OnChangeFn<SortingState>,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { rows } = table.getRowModel();

  return (
    <Paper variant="outlined" style={{ height: "98%", position: "relative" }}>
      {booksLoaded ? undefined : (
        <Box
          position={"absolute"}
          left={"calc(50% - 2rem)"}
          top={"calc(50% - 2rem)"}
          zIndex={1}
        >
          <CircularProgress size={"4rem"} />
        </Box>
      )}
      <TableVirtuoso
        data={rows}
        style={{ width: "100%", borderRadius: "3px" }}
        totalCount={rows.length}
        components={{
          Table: ({ style, ...props }) => (
            <table
              {...props}
              style={{
                ...style,
                tableLayout: "fixed",
                borderCollapse: "collapse",
                width: "100%",
              }}
            />
          ),
          TableRow: (props) => {
            const index = props["data-index"];
            const row = rows[index];
            return (
              <tr {...props}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} sx={{ padding }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </tr>
            );
          },
        }}
        fixedHeaderContent={() => {
          return table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              style={{
                background: "#e0e0e0",
                color: "black",
              }}
            >
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      width: header.getSize(),
                      padding,
                      textAlign: "left",
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          style: {
                            ...(header.column.getCanSort()
                              ? {
                                  cursor: "pointer",
                                  userSelect: "none",
                                }
                              : {}),
                            display: "flex",
                            alignItems: "center",
                          },
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {(() => {
                          const isSorted = header.column.getIsSorted();
                          if (!isSorted) {
                            const headerId = header.id;
                            return headerId != "info" && headerId != "read" ? (
                              <TiArrowUnsorted style={{ flexShrink: 0 }} />
                            ) : null;
                          } else {
                            return {
                              asc: (
                                <TiArrowSortedUp style={{ flexShrink: 0 }} />
                              ),
                              desc: (
                                <TiArrowSortedDown style={{ flexShrink: 0 }} />
                              ),
                            }[isSorted];
                          }
                        })()}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ));
        }}
      />
    </Paper>
  );
}
