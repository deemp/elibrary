import { Link, useParams } from "react-router-dom";
import { Base } from "./Base";
import { NavLink } from "./NavLink";
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
import * as appbar from "../models/appbar";
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";
import { useElements as useFAQ } from "./FAQ";

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
        <Grid item xs={3} sm={3} md={2}>
          <Typography>{title}</Typography>
        </Grid>
        <Grid item xs={9} sm={9} md={10}>
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
  if (id) {
    const bookId = Number.parseInt(id);
    const url = `${import.meta.env.VITE_API_PREFIX}/book/${bookId}`;
    const coverUrl = `${import.meta.env.VITE_API_PREFIX}/covers/${bookId}.jpg`;
    const maxCoverHeight = 300;

    const [book, setBook] = useState<Book | undefined>();
    const [reference, setReference] = useState<string>("");
    const [imageDimensions, setImageDimensions] = useState({
      height: 200,
      width: 200,
    });

    useEffect(() => {
      fetch(url, {
        method: "GET",
        headers: new Headers({ "content-type": "application/json" }),
      })
        .then((r) => r.json())
        .then((r: Book | undefined) => {
          setBook(r);
          setReference(
            `${r?.authors}.${r?.title}//${r?.authors}//${r?.publisher}.-${r?.year}.${r?.isbn}`
          );
        });

    });

    loadImage(setImageDimensions, coverUrl, maxCoverHeight);

    const copyToClipboard = () => {
      if (copy(reference)) {
        toast.success("Copied to Clipboard");
      }
    };

    const elevation = 5;

    const { faqButton, faqDrawer } = useFAQ();

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
                    <Button variant="outlined" size="medium">
                      READ
                    </Button>
                  </Link>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4} md={3} lg={3} xl={3}>
                      <Card
                        elevation={elevation}
                        sx={{
                          height: `${imageDimensions.height}px`,
                          width: `${imageDimensions.width}px`,
                        }}
                      >
                        {/* TODO replace with cover url from book object */}
                        <CardMedia
                          component="img"
                          src={coverUrl}
                          height={`${imageDimensions.height}px`}
                          width={`${imageDimensions.width}px`}
                        />
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9} lg={9}>
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
                          Copy Reference
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
            <Container maxWidth="xl">
              <Grid container spacing={1} alignItems={"center"}>
                <Grid item>
                  <NavLink text={"Search"} to={"/"} id={"search"} />
                </Grid>
                <Grid item>{faqButton}</Grid>
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
