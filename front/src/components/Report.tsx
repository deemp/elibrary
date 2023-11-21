import { useEffect, useState } from "react";
import { Book } from "../models/book";
import { Base } from "./Base";
import { searchLink } from "./SearchLink";
import { Container, Grid, Typography } from "@mui/material";
import { useFAQ } from "./FAQ";
import * as appbar from "./AppBar";
import { AppBar } from "./AppBar";
import { BookTable } from "./Table";
import { Row } from "./Row";

interface ReportGetReponse {
  total_reads: number;
  books: Book[];
}

export const Report = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const { faqButton, faqDrawer } = useFAQ();
  const [totalReads, setTotalReads] = useState<number>(0);
  const [booksLoaded, setBooksLoaded] = useState<boolean>(false);
  const url = `${import.meta.env.VITE_API_PREFIX}/report`;

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
  }, [url]);

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
              <Grid paddingTop={"1rem"} width={"100%"} height={"20%"}>
                <Row
                  title="Total number of reads: "
                  content={`${totalReads}`}
                  sx={{
                    fontSize: { xs: "1rem", sm: "2rem" },
                    display: "flex",
                  }}
                  widthSx={{ width: { xs: "50%", md: "25%" } }}
                />
                <Typography
                  marginY={"1rem"}
                  sx={{
                    fontSize: { xs: "1.5rem", sm: "3rem" },
                    display: "flex",
                    justifyContent: "center",
                  }}
                  fontWeight={"bold"}
                >
                  Top 10 Books
                </Typography>
              </Grid>
              <Grid item xs={12} height={"80%"}>
                <BookTable books={books} booksLoaded={booksLoaded} />
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
