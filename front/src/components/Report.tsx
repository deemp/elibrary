import { useCallback, useEffect, useState } from "react";
import { Base } from "./Base";
import { searchLink } from "./SearchLink";
import { Box, Container, Grid, Typography } from "@mui/material";
import { useFAQ } from "./FAQ";
import * as appbar from "./AppBar";
import { AppBar } from "./AppBar";
import { BookTable } from "./Table";
import { bookPretty } from "../models/book";
import { ColumnDef, ColumnHelper } from "@tanstack/react-table";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface Book {
  book_id: number;
  title: string;
  read_count: number;
}

interface ReportPOSTReponse {
  total_reads_month: number;
  total_reads_year: number;
  books: Book[];
}

// @ts-ignore
const columnPretty = new Map([
  ...bookPretty,
  // @ts-ignore
  ...new Map([["read_count", "Read count"]]),
]);

const columns = (columnHelper: ColumnHelper<Book>) =>
  [
    {
      id: "book_id",
      size: 100,
    },
    {
      id: "title",
      size: 200,
    },
    {
      id: "read_count",
      size: 100,
    },
  ].map(({ id, size }) =>
    columnHelper.accessor(id as keyof Book, {
      header: () => columnPretty.get(id),
      size,
      cell: (props) => props.getValue(),
    })
  ) as ColumnDef<Book, unknown>[];

const url = `${import.meta.env.VITE_API_PREFIX}/report`;

export const Report = () => {
  const { faqButton, faqDrawer } = useFAQ();
  const [books, setBooks] = useState<Book[]>([]);
  const [totalReadsMonth, setTotalReadsMonth] = useState<number>(0);
  const [totalReadsYear, setTotalReadsYear] = useState<number>(0);
  const [booksLoaded, setBooksLoaded] = useState<boolean>(false);
  const [date, setDate] = useState<Dayjs>(dayjs());

  const setData = useCallback(() => {
    if (!(date === null)) {
      fetch(url, {
        method: "POST",
        headers: new Headers({ "content-type": "application/json" }),
        body: JSON.stringify({ year: date.year(), month: date.month() + 1 }),
      })
        .then((r) => r.json())
        .then((r: ReportPOSTReponse) => {
          setBooks(r.books);
          setTotalReadsMonth(r.total_reads_month);
          setTotalReadsYear(r.total_reads_year);
          setBooksLoaded(true);
        });
    }
  }, [date]);

  useEffect(() => setData(), [setData]);

  return (
    <Base
      title="Report"
      user={{ isAuthenticated: true }}
      content={
        <Container maxWidth={"xl"}>
          <Grid
            container
            rowSpacing={2}
            columnSpacing={2}
            marginTop={appbar.height}
            height={`calc(100vh - ${appbar.height})`}
          >
            <Grid
              item
              xs={12}
              md={"auto"}
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "start" },
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  minDate={dayjs("2023-11")}
                  maxDate={dayjs("2042-11")}
                  defaultValue={dayjs()}
                  views={["month", "year"]}
                  onChange={(value) => {
                    if (value) setDate(value);
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid
              item
              xs={12}
              md
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "center", md: "start" },
              }}
            >
              <Typography sx={{ fontSize: "2rem" }}>
                Reads (month/year):{" "}
                <Box fontWeight="fontWeightMedium" display="inline">
                  {totalReadsMonth}
                </Box>
                /
                <Box fontWeight="fontWeightMedium" display="inline">
                  {totalReadsYear}
                </Box>
              </Typography>
            </Grid>
            <Grid item xs={12} height={{ xs: "80%", md: "90%" }}>
              <BookTable
                books={books}
                booksLoaded={booksLoaded}
                columns={columns}
              />
            </Grid>
          </Grid>
        </Container>
      }
      nav={
        <AppBar
          faqDrawer={faqDrawer}
          leftChildren={[
            <Grid item>{searchLink}</Grid>,
            <Grid item>{faqButton}</Grid>,
          ]}
        />
      }
    />
  );
};
