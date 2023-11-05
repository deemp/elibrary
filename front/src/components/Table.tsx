import React from 'react';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { TableVirtuoso } from 'react-virtuoso';
import { Book, bookPretty } from '../models/book';
import { Link } from 'react-router-dom';
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { TiArrowUnsorted, TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti'

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

function RowLink({ text, to }: { text: string, to: string }) {
  return <Link to={to} style={{ "color": "#1976d2", }}> {text} </Link>
}

const columnPretty = new Map([
  ...bookPretty.entries(),
  ...(new Map([['read', 'Read'], ['info', 'Info']]))
])

const padding = '10px'

function cell(id: string, value: any) {
  return (
    <TableCell key={id} align={'left'} sx={{ padding }}> {value} </TableCell>
  );
}

export function BookTable({ books }: { books: Book[] }) {

  const columnHelper = createColumnHelper<Book>()

  const columns = React.useMemo(() =>
    [
      {
        id: 'read',
        size: 40,
        f: props => <RowLink to={`/book/${props.row.original.book_id}/read`} text={"Read"} />
      },
      {
        id: 'info',
        size: 40,
        f: props => <RowLink to={`/book/${props.row.original.book_id}`} text={"Info"} />
      }
    ].map(({ id, f, size }) => columnHelper.display({
      id,
      size,
      cell: props => cell(id, f(props)),
      header: () => columnPretty.get(id)
    })).concat([
      {
        id: 'title',
        size: 200,
      },
      {
        id: 'authors',
        size: 100,
      },
      {
        id: 'publisher',
        size: 100,
      },
      {
        id: 'year',
        size: 50,
      },
      {
        id: 'isbn',
        size: 110,
      },
      {
        id: 'format',
        size: 80,
      },
    ].map(({ id, size }) => columnHelper.accessor(id as keyof Book, {
      header: () => columnPretty.get(id),
      size,
      cell: props => cell(id, props.getValue())
    })) as ColumnDef<Book, unknown>[])
    , [columnHelper]);

  const [sorting, setSorting] = React.useState([]);

  console.log("something")

  const table = useReactTable({
    data: books,
    columns,
    state: {
      sorting
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  const { rows } = table.getRowModel();

  return (
    <Paper variant='outlined' style={{ height: '98%' }}>
      <TableVirtuoso
        data={rows}
        style={{ height: "100%", width: '100%', borderRadius: '3px' }}
        totalCount={rows.length}
        components={{
          Table: ({ style, ...props }) => {
            return (
              <table
                {...props}
                style={{
                  ...style,
                  tableLayout: "fixed",
                  borderCollapse: "collapse",
                  width: '100%'
                }}
              />
            );
          },
          TableRow: (props) => {
            const index = props["data-index"];
            const row = rows[index];
            return (
              <tr {...props}>
                {row.getVisibleCells().map((cell) => (
                  flexRender(cell.column.columnDef.cell, cell.getContext())
                ))}
              </tr>
            );
          }
        }}
        fixedHeaderContent={() => {
          return (
            table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                style={{
                  background: "#e0e0e0",
                  color: 'black'
                }}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        width: header.getSize(),
                        padding: padding,
                        textAlign: "left",
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            style: {
                              ...(header.column.getCanSort()
                                ? {
                                  cursor: "pointer", userSelect: "none"
                                }
                                : {}),
                              display: 'flex',
                              alignItems: 'center'
                            },
                            onClick: header.column.getToggleSortingHandler()
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {(() => {
                            const isSorted = header.column.getIsSorted()
                            if (!isSorted) {
                              const headerId = header.id
                              return (
                                (headerId != 'info' && headerId != 'read') ?
                                  <TiArrowUnsorted style={{ "flex-shrink": 0 }} /> : null
                              )
                            } else {
                              return {
                                asc: <TiArrowSortedUp style={{ "flex-shrink": 0 }} />,
                                desc: <TiArrowSortedDown style={{ "flex-shrink": 0 }} />
                              }[isSorted]
                            }
                          })()
                          }
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))
          )
        }}
      />
    </Paper>
  );
}