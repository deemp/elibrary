import { Link, useLoaderData } from "react-router-dom";
import { Base } from "./Base";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Book, bookPretty } from "../models/book";
import * as appbar from "./AppBar";
import { searchLink } from "./SearchLink"
import { useFAQ } from "./FAQ";
import { ReferencePanel } from "./ReferencePanel";
import { buttonPadding, fontSize, linkStyle } from "../models/elements";
import { AppBar } from "./AppBar";

function Row({
  title,
  content,
}: {
  title: string | undefined;
  content: string | undefined;
}) {
  return (
    <Grid item xs={12}>
      <Grid container>
        <Grid item sx={{ width: "80px" }}>
          <Typography>{title}</Typography>
        </Grid>
        <Grid item xs>
          <Typography sx={{ fontWeight: "bold" }}>{content}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

interface Data {
  book: Book
  dimensions: {
    height: number
    width: number
  }
}

export function BookInfoPage() {
  const { faqButton, faqDrawer } = useFAQ();
  const { book, dimensions } = useLoaderData() as Data;
  const [textReference, setTextReference] = useState<string>("");
  const [bibTexReference, setBibTexReference] = useState<string>("");

  const id = book.book_id;

  const coverUrl = `${import.meta.env.VITE_API_PREFIX}/covers/${id}.jpg`;

  useEffect(() => {
    const authors = book.authors.split("; ")
    const author = authors[0]
    setTextReference(
      `${author}. ${book.title} / ${authors.join(" , ")} // ${book.publisher}. - ${book.year}. - ${book.pages} p. - ISBN: ${book.isbn} // EBSCO EBOOK ARCHIVE. - URL: ${window.location.href}/read`
    );
    const bibTexTitle =
      `${author.split(" ").pop()?.toLowerCase()}${book.year}${book.title.split(" ")[0].toLowerCase()}`
        .match(/[a-zA-Z0-9]/g)?.join("")
    setBibTexReference(
      `@book{${bibTexTitle}, author={${authors.join(" and ")}}, title={${book.title}}, year={${book.year}}, publisher={${book.publisher}}}`
    );
  }, [book]);

  const elevation = 5;

  const base = (
    <Base
      title="Info"
      user={{ isAuthenticated: true }}
      content={
        <Container maxWidth="xl">
          <Box sx={{ minHeight: `calc(100vh - ${appbar.height})` }}>
            <Grid container rowSpacing={2} marginTop={appbar.height}>
              <Grid item xs={12} display={'flex'} justifyContent={'center'}>
                <Link to={`/book/${id}/read`} style={linkStyle}>
                  <Button
                    sx={{
                      ...buttonPadding,
                      fontSize,
                    }}
                    variant="contained"
                    size="large"
                    disableElevation
                  >
                    read this book
                  </Button>
                </Link>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={3} justifyContent={'center'}>
                  <Grid item sx={{ width: `${dimensions.width * 1.1}px` }} display={'flex'} justifyContent={'center'}>
                    <Link to={`/book/${id}/read`}>
                      <Card
                        elevation={elevation}
                        sx={{
                          height: {
                            xs: `${dimensions.height * 0.8}px`,
                            sm: `${dimensions.height}px`,
                          },
                          width: {
                            xs: `${dimensions.width * 0.8}px`,
                            sm: `${dimensions.width}px`,
                          },
                        }}
                      >
                        <CardMedia
                          component="img"
                          src={coverUrl}
                          sx={{
                            maxHeight: `100%`,
                            maxWidth: `100%`,
                          }}
                        />
                      </Card>
                    </Link>
                  </Grid>
                  <Grid item xs={12} sm>
                    <Grid container rowSpacing={1}>
                      {[
                        "title",
                        "authors",
                        "publisher",
                        "year",
                        "isbn",
                        "esbn",
                        "bisac",
                        "lc",
                        "imprint_publisher",
                        "oclc",
                        "lcc",
                        "dewey",
                      ].map((x) => {
                        if (book && x in book) {
                          return (
                            <Row
                              title={bookPretty.get(x)}
                              content={`${book[x as keyof typeof book]}`}
                              key={x}
                            ></Row>
                          );
                        } else {
                          return <></>;
                        }
                      })}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} marginBottom={3}>
                <Paper variant="outlined">
                  <ReferencePanel
                    textReference={textReference}
                    bibTexReference={bibTexReference}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Container>
      }
      nav={<AppBar
        faqDrawer={faqDrawer}
        leftChildren={[
          <Grid item>{searchLink}</Grid>,
          <Grid item>{faqButton}</Grid>,
        ]} />}
    />
  );
  return base;
}
