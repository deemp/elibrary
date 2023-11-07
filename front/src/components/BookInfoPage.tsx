import { Link, useParams } from "react-router-dom";
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
import { AppBarLink } from "./AppBar";
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";
import { useFAQ } from "./FAQ";
import { Ebsco } from "./AppBar";

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
  const { id } = useParams();
  const { faqButton, faqDrawer } = useFAQ();
  const [book, setBook] = useState<Book | undefined>();
  const [reference, setReference] = useState<string>("");
  const [imageDimensions, setImageDimensions] = useState({
    height: 200,
    width: 200,
  });

  if (id) {
    const bookId = Number.parseInt(id);
    const url = `${import.meta.env.VITE_API_PREFIX}/book/${bookId}`;
    const coverUrl = `${import.meta.env.VITE_API_PREFIX}/covers/${bookId}.jpg`;
    const maxCoverHeight = 375;

    useEffect(() => {
      fetch(url, {
        method: "GET",
        headers: new Headers({ "content-type": "application/json" }),
      })
        .then((r) => r.json())
        .then((r: Book | undefined) => {
          loadImage(setImageDimensions, coverUrl, maxCoverHeight);
          setBook(r);
          setReference(
            `${r?.authors.split("-")[0]}. ${r?.title}/${r?.authors}/${r?.publisher
            }.- ${r?.year}.-${r?.pages} p. - ISBN: ${r?.isbn}`
          );
        });
    }, [url, coverUrl]);

    const copyToClipboard = () => {
      if (copy(reference)) {
        toast.success("Copied to Clipboard");
      }
    };

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
                  <Link to={`/book/${bookId}/read`}>
                    <Button
                      sx={{
                        fontWeight: "bold",
                        paddingY: "1rem",
                        paddingX: { xs: "5rem", sm: "12rem" },
                        fontSize: { sm: '1.5rem' },
                      }}
                      variant="contained"
                      size="large"
                      disableElevation
                    >
                      READ
                    </Button>
                  </Link>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={3} justifyContent={'center'}>
                    <Grid item sx={{ width: `${imageDimensions.width}` }}>
                      <Link to={`/book/${bookId}/read`}>
                        <Card
                          elevation={elevation}
                          sx={{
                            height: { xs: `${imageDimensions.height * 0.8}px`, sm: `${imageDimensions.height}px` },
                            width: { xs: `${imageDimensions.width * 0.8}px`, sm: `${imageDimensions.width}px` },
                          }}
                        >
                          <CardMedia
                            component="img"
                            src={coverUrl}
                            sx={{
                              maxHeight: `100%`,
                              maxWidth: `100%`
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
                    <Grid container spacing={2} padding={"1rem"}>
                      <Grid item xs={12} md={10}>
                        <Typography variant="body1">{reference}</Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Button
                          size="medium"
                          variant="outlined"
                          onClick={copyToClipboard}
                        >
                          Copy bibliographic record
                        </Button>
                      </Grid>
                    </Grid>
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
                      <AppBarLink text={"Search"} to={"/"} id={"search"} />
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
  } else {
    return <></>;
  }
}
