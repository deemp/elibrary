import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import { Book } from '../models/book';
import { Link } from 'react-router-dom';

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

function bookToBookRow(book: Book): BookRow {
  return {
    ...book,
    info: <RowLink to={`/book/${book.book_id}`} text={"Info"} />,
    read: <RowLink to={`/book/${book.book_id}/read`} text={"Read"} />
  }
}

interface ColumnData {
  dataKey: keyof BookRow;
  label: string;
  numeric?: boolean;
  width: number;
}

const columns: ColumnData[] = [
  {
    width: 50,
    label: 'Read',
    dataKey: 'read',
    numeric: false,
  },
  {
    width: 50,
    label: 'Info',
    dataKey: 'info',
    numeric: false,
  },
  {
    width: 100,
    label: 'Publisher',
    dataKey: 'publisher',
    numeric: false,
  },
  {
    width: 50,
    label: 'Year',
    dataKey: 'year',
    numeric: true,
  },
  {
    width: 200,
    label: 'Title',
    dataKey: 'title',
    numeric: false,
  },
  {
    width: 100,
    label: 'ISBN',
    dataKey: 'isbn',
    numeric: true,
  },
  {
    width: 60,
    label: 'Format',
    dataKey: 'format',
    numeric: false,
  },
];

const VirtuosoTableComponents: TableComponents<BookRow> = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
  ),
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric || false ? 'right' : 'left'}
          style={{ width: column.width }}
          sx={{
            backgroundColor: 'background.paper',
          }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

function rowContent(_index: number, row: BookRow) {
  return (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align={column.numeric || false ? 'right' : 'left'}
        >
          {row[column.dataKey]}
        </TableCell>
      ))}
    </React.Fragment>
  );
}

export function BookTable({ rows }: { rows: Book[] }) {
  return (
    <Paper style={{  width: '100.%', height: '60vh' }}>
      <TableVirtuoso
        data={rows.map(bookToBookRow)}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Paper>
  );
}