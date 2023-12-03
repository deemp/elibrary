import { Link, useLoaderData } from "react-router-dom";
import { Base } from "../Base";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Book, bookPretty } from "../../models/book";
import { searchLink } from "../Search/Link";
import { ReferencePanel } from "./ReferencePanel";
import { buttonPadding, fontSize } from "../../models/constants";
import { Row } from "../Row";
import { reportLink } from "../Report/Link";
import { readLink } from "../Read/Link";
import * as constants from "../../models/constants";
import { AppBar } from "../AppBar";
import { Content } from "./Help";

interface Data {
  book: Book;
  dimensions: {
    height: number;
    width: number;
  };
}

export function BookInfoPage() {
  const { book, dimensions } = useLoaderData() as Data;
  const [textReference, setTextReference] = useState<string>("");
  const [bibTexReference, setBibTexReference] = useState<string>("");

  const bookId = book.book_id;

  const coverUrl = `${import.meta.env.VITE_API_PREFIX}/covers/${bookId}.jpg`;

  useEffect(() => {
    const authors = book.authors.split("; ");
    const author = authors[0];
    setTextReference(
      `${author}. ${book.title} / ${authors.join(" , ")} // ${
        book.publisher
      }. - ${book.year}. - ${book.pages} p. - ISBN: ${
        book.isbn
      } // EBSCO EBOOK ARCHIVE. - URL: ${
        import.meta.env.VITE_BASE_URL
      }/book/${bookId}/read`
    );
    const bibTexTitle = `${author.split(" ").pop()?.toLowerCase()}${
      book.year
    }${book.title.split(" ")[0].toLowerCase()}`
      .match(/[a-zA-Z0-9]/g)
      ?.join("");
    setBibTexReference(
      `@book{${bibTexTitle}, author={${authors.join(" and ")}}, title={${
        book.title
      }}, year={${book.year}}, publisher={${book.publisher}}}`
    );
  }, [book, bookId]);

  const elevation = 5;

  const base = (
    <Base
      title="Info"
      content={
        <Container maxWidth="xl">
          <Box sx={{ minHeight: constants.contentHeightAdaptive }}>
            <Grid container rowSpacing={2} marginTop={constants.heightAdaptive}>
              <Grid item xs={12} display={"flex"} justifyContent={"center"}>
                {
                  //@ts-expect-error doesn't support the property `to` from `Link`
                  <Button
                    sx={{
                      ...buttonPadding,
                      fontSize,
                    }}
                    variant="contained"
                    size="large"
                    disableElevation
                    LinkComponent={Link}
                    href={`/book/${bookId}/read`}
                    to={`/book/${bookId}/read`}
                    underline={"none"}
                  >
                    read this book
                  </Button>
                }
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={3} justifyContent={"center"}>
                  <Grid
                    item
                    sx={{ width: `${dimensions.width * 1.1}px` }}
                    display={"flex"}
                    justifyContent={"center"}
                  >
                    <Link to={`/book/${bookId}/read`}>
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
                        "imprint_publisher",
                        "year",
                        "isbn",
                        "esbn",
                        "bisac",
                        "lc",
                        "oclc",
                        "lcc",
                        "dewey",
                      ].map((x) => {
                        if (book && x in book) {
                          return (
                            <Row
                              sx={{}}
                              title={bookPretty.get(x)}
                              widthSx={{ width: "80px" }}
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
      nav={
        <AppBar
          leftChildren={[reportLink(), searchLink, readLink(bookId)]}
          content={Content}
        />
      }
    />
  );
  return base;
}
