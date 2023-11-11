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
import { Ebsco } from "./AppBar";
import { ReferencePanel } from "./ReferenceTabs";

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

interface ImageDimensions {
  height: number;
  width: number;
}

const loadImage = (
  setImageDimensions: React.Dispatch<React.SetStateAction<ImageDimensions>>,
  imageUrl: string,
  maxHeight: number
) => {
  const img = new Image();
  img.src = imageUrl;

  const ratio = img.height / img.width;

  img.onload = () => {
    setImageDimensions({
      height: maxHeight,
      width: maxHeight / ratio,
    });
  };
  img.onerror = (err) => {
    console.log("img error");
    console.error(err);
  };
};

export function BookInfoPage() {
  const { faqButton, faqDrawer } = useFAQ();
  const [book, setBook] = useState<Book>(useLoaderData() as Book);
  const [textReference, setTextReference] = useState<string>("");
  const [bibTexReference, setBibTexReference] = useState<string>("");
  const [bibTexTitle, setBibTexTitle] = useState<string>("");
  const [imageDimensions, setImageDimensions] = useState({
    height: 200,
    width: 200,
  });

  const id = book.book_id;

  const coverUrl = `${import.meta.env.VITE_API_PREFIX}/covers/${id}.jpg`;
  const maxCoverHeight = 375;

  useEffect(() => {
    (async () => {
      loadImage(setImageDimensions, coverUrl, maxCoverHeight);
      setBook(book);
      setBibTexTitle(
        `${book.authors.split("-")[0].split(" ").pop()?.toLowerCase()}${book.year
        }${book.title.split(" ")[0].toLowerCase()}`
      );
      setTextReference(
        `${book.authors.split("-")[0]}. ${book.title}/${book.authors}/${book.publisher
        }.- ${book.year}.-${book.pages} p. - ISBN: ${book.isbn}`
      );
      setBibTexReference(
        `@book{${bibTexTitle}, title={${book.title}}, year={${book.year}}, publisher={${book.publisher}}}`
      );
    })();
  }, []);

  const elevation = 5;

  const base = (
    <Base
      title="Info"
      user={{ isAuthenticated: true }}
      content={
        <Container maxWidth="xl">
          <Box sx={{ minHeight: `calc(100vh - ${appbar.height})` }}>
            <Grid container rowSpacing={2} marginTop={appbar.height}>
              <Grid item xs={12} textAlign={"center"}>
                <Link to={`/book/${id}/read`}>
                  <Button
                    sx={{
                      paddingY: "0.5rem",
                      paddingX: "1.5rem",
                      fontSize: { xs: "1.2rem", sm: "1.5rem" },
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
                <Grid container spacing={3} justifyContent={"center"}>
                  <Grid item sx={{ width: `${imageDimensions.width}` }}>
                    <Link to={`/book/${id}/read`}>
                      <Card
                        elevation={elevation}
                        sx={{
                          height: {
                            xs: `${imageDimensions.height * 0.8}px`,
                            sm: `${imageDimensions.height}px`,
                          },
                          width: {
                            xs: `${imageDimensions.width * 0.8}px`,
                            sm: `${imageDimensions.width}px`,
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
      nav={
        <>
          <Container maxWidth={"xl"}>
            <Grid container>
              <Grid item xs={5}>
                <Grid container columnSpacing={1}>
                  <Grid item>
                    {searchLink}
                  </Grid>
                  <Grid item>{faqButton}</Grid>
                </Grid>
              </Grid>
              <Grid
                item
                xs={7}
                display={"flex"}
                justifyContent={"end"}
                alignItems={"center"}
              >
                {Ebsco}
              </Grid>
            </Grid>
          </Container>
          {faqDrawer}
        </>
      }
    ></Base>
  );
  return base;
}
