import { useEffect, useState } from "react";
import { Base } from "./Base";
import { searchLink } from "./SearchLink";
import { Box, Container, Grid, Typography } from "@mui/material";
import { useFAQ } from "./FAQ";
import * as appbar from "./AppBar";
import { AppBar } from "./AppBar";
import { BookTable } from "./Table";
import { bookPretty } from "../models/book";
import { ColumnDef, ColumnHelper } from "@tanstack/react-table";

interface Book {
  book_id: number
  title: string
  read_count: number
}

interface ReportGetReponse {
  total_reads: number;
  books: Book[];
}

// @ts-ignore
const columnPretty = new Map([
  ...bookPretty,
  // @ts-ignore
  ...(new Map([['read_count', 'Read count']]))
])

const columns = (columnHelper: ColumnHelper<Book>) =>
  [
    {
      id: 'book_id',
      size: 100,
    },
    {
      id: 'title',
      size: 200,
    },
    {
      id: 'read_count',
      size: 100,
    },
  ].map(({ id, size }) => columnHelper.accessor(id as keyof Book, {
    header: () => columnPretty.get(id),
    size,
    cell: props => props.getValue()
  })) as ColumnDef<Book, unknown>[];

const url = `${import.meta.env.VITE_API_PREFIX}/report`;

export const Report = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const { faqButton, faqDrawer } = useFAQ();
  const [totalReads, setTotalReads] = useState<number>(0);
  const [booksLoaded, setBooksLoaded] = useState<boolean>(false);

  useEffect(() => {
    fetch(url, {
      method: "GET",
      headers: new Headers({ "content-type": "application/json" }),
    })
      .then((r) => r.json())
      .then((r: ReportGetReponse) => {
        setBooks(r.books);
        setTotalReads(r.total_reads);
        setBooksLoaded(true);
      });
  }, []);

  return (
    <>
      <Base
        title="Report"
        user={{ isAuthenticated: true }}
        content={
          <Container maxWidth={"xl"}>
            <Grid
              container
              rowSpacing={2}
              marginTop={appbar.height}
              height={`calc(100vh - ${appbar.height})`}
            >
              <Grid item xs={12} paddingTop={"1rem"}>
                <Typography sx={{ fontSize: { xs: "1rem", sm: "1.5rem" } }}>
                  Total number of reads: {' '}
                  <Box fontWeight='fontWeightMedium' display='inline'>
                    {totalReads}
                  </Box>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  marginY={"1rem"}
                  sx={{
                    fontSize: { xs: "1.5rem", sm: "2rem" },
                    display: "flex",
                    justifyContent: "center",
                  }}
                  fontWeight={"bold"}
                >
                  Top 10 Books
                </Typography>
              </Grid>
              <Grid item xs={12} height={"80%"}>
                <BookTable books={books} booksLoaded={booksLoaded} columns={columns} />
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
    </>
  );
};
