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
          loadImage(setImageDimensions, coverUrl, maxCoverHeight);
          setBook(r);
          setReference(
            `${r?.authors.split("-")[0]}. ${r?.title}/${r?.authors}/${
              r?.publisher
            }.- ${r?.year}.-${r?.pages} p. -${r?.isbn}`
          );
        });
    }, [url, coverUrl]);

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
                    <Grid item sx={{ width: `${imageDimensions.width}` }}>
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
              <Grid container alignItems={"center"}>
                <Grid item xs={7}>
                  <Grid container spacing={1}>
                    <Grid item>
                      <NavLink text={"Search"} to={"/"} id={"search"} />
                    </Grid>
                    <Grid item>{faqButton}</Grid>
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={5}
                  paddingTop={appbar.padding}
                  paddingBottom={appbar.padding}
                  textAlign={"right"}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"end"}
                  fontSize={"14px"}
                >
                  <Typography sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                    EBSCO EBOOK ARCHIVE
                  </Typography>
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
