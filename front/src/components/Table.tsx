import React from 'react';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import { TableVirtuoso } from 'react-virtuoso';
import {
  Book,
  bookPretty
} from '../models/book';
import { Link } from 'react-router-dom';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel, useReactTable
} from '@tanstack/react-table';

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

// const VirtuosoTableComponents: TableComponents<BookRow> = {
//   Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
//     <TableContainer component={Paper} {...props} ref={ref} />
//   )),
//   Table: (props) => (
//     <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
//   ),
//   TableHead,
//   TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
//   TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
//     <TableBody {...props} ref={ref} />
//   )),
// };

function rowContent(
  // book_id: number, 
  value: any, numeric: boolean) {
  return (
    // <React.Fragment>
    //   {columns.map((column) => (
    <TableCell
      // key={book_id}
      align={numeric || false ? 'right' : 'left'}
    >
      {value}
      {/* {row[column.dataKey]} */}
    </TableCell>
    //   ))}
    // </React.Fragment>
  );
}

// export function BookTable1({ rows }: { rows: Book[] }) {
//   return (
//     <Paper variant='outlined' style={{ height: '98%' }}>
//       <TableVirtuoso
//         data={rows.map(bookToBookRow)}
//         components={VirtuosoTableComponents}
//         fixedHeaderContent={fixedHeaderContent}
//         itemContent={rowContent}
//       />
//     </Paper>
//   );
// }

// interface Column {
//   size: number
//   accessorKey: string
//   numeric: boolean
//   accessorFn?: (row: BookRow) => 
// }

// function bookToBookRow(book: Book): BookRow {
//   return {
//     ...book,
//     info: <RowLink to={`/book/${book.book_id}`} text={"Info"} />,
//     read: <RowLink to={`/book/${book.book_id}/read`} text={"Read"} />
//   }
// }

export function BookTable({ books }: { books: Book[] }) {
  const columnHelper = createColumnHelper<Book>()

  // const data = books.map(bookToBookRow)

  // TODO use configs and map
  const columns = React.useMemo(() => [
    columnHelper.display({
      size: 30,
      id: 'read',
      header: () => columnPretty.get('read'),
      cell: props => rowContent(<RowLink to={`/book/${props.row.original.book_id}/read`} text={"Read"} />, false),
    }),
    columnHelper.display({
      size: 30,
      id: 'info',
      header: () => columnPretty.get('info'),
      cell: props => rowContent(<RowLink to={`/book/${props.row.original.book_id}`} text={"Info"} />, false),
    }),
    columnHelper.accessor('title', {
      size: 200,
      header: () => columnPretty.get('title'),
      cell: props => rowContent(props.getValue(), false)
    }),
    columnHelper.accessor('authors', {
      size: 150,
      header: () => columnPretty.get('authors'),
      cell: props => rowContent(props.getValue(), false)
    }),
    columnHelper.accessor('publisher', {
      size: 100,
      header: () => columnPretty.get('publisher'),
      cell: props => rowContent(props.getValue(), false)
    }),
    columnHelper.accessor('year', {
      size: 50,
      header: () => columnPretty.get('year'),
      cell: props => rowContent(props.getValue(), true)
    }),
    columnHelper.accessor('isbn', {
      size: 90,
      header: () => columnPretty.get('isbn'),
      cell: props => rowContent(props.getValue(), true)
    }),
    columnHelper.accessor('format', {
      size: 100,
      header: () => columnPretty.get('format'),
      cell: props => rowContent(props.getValue(), false)
    })
  ]
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

  // function fixedHeaderContent() {
  //   (
  //     <TableRow>
  //       {columns.map((column) => (
  //         <TableCell
  //           key={column.accessorKey}
  //           variant="head"
  //           align={column.numeric || false ? 'right' : 'left'}
  //           style={{ width: column.width }}
  //           sx={{
  //             backgroundColor: 'background.paper',
  //             fontWeight: "bold"
  //           }}
  //         >
  //           {column.header}
  //         </TableCell>
  //       ))}
  //     </TableRow>
  //   );
  // }

  const { rows } = table.getRowModel();

  return (
    <Paper variant='outlined' style={{ height: '98%' }}>
      <TableVirtuoso
        // data={rows.map(bookToBookRow)}
        style={{ height: "500px", border: "1px solid lightgray" }}
        totalCount={rows.length}
        components={{
          Table: ({ style, ...props }) => {
            return (
              <table
                {...props}
                style={{
                  ...style,
                  width: "100%",
                  tableLayout: "fixed",
                  borderCollapse: "collapse",
                  borderSpacing: 0
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
          return table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              style={{ background: "lightgray", margin: 0 }}
            >
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      width: header.getSize(),
                      // borderBottom: "1px solid lightgray",
                      // padding: "2px 4px",
                      // textAlign: "left"
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          style: header.column.getCanSort()
                            ? { cursor: "pointer", userSelect: "none" }
                            : {},
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
                            return null
                          } else {
                            return {
                              asc: " 🔼",
                              desc: " 🔽"
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
          ));
        }}
      // itemContent={rowContent}
      />
    </Paper>
  );
}