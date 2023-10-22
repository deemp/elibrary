import { Link, useParams } from "react-router-dom";
import { Base } from "./Base";
import { NavLink } from "./NavLink";
import {
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
import cover_url from "../assets/book_cover.png";
import * as appbar from "../models/appbar";
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";

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
        <Grid item xs={3} sm={3} md={2}><Typography>{title}</Typography></Grid>
        <Grid item xs={9} sm={9} md={10}>
          <Typography sx={{ fontWeight: 'bold' }}>
            {content}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

export function BookInfoPage() {
  const { id } = useParams();
  if (id) {
    const bookId = Number.parseInt(id);
    const url = `${import.meta.env.VITE_API_PREFIX}/book/${bookId}`;
    const [book, setBook] = useState<Book | undefined>();
    const [reference, setReference] = useState<string>("");

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
    }, [setBook, url]);

    const copyToClipboard = () => {
      if (copy(reference)) {
        toast.success("Copied to Clipboard");
      }
    };

    const elevation = 5

    const base = (
      <Base
        title="Info"
        user={{ isAuthenticated: true }}
        content={
          <Container maxWidth="lg">
            <Grid container rowSpacing={2} minHeight={`calc(100vh - ${appbar.height})`} marginTop={appbar.height}>
              <Grid item xs={12} textAlign={'center'}>
                <Link to={`/book/${bookId}/read`}>
                  <Button variant="outlined" size='medium'>READ</Button>
                </Link>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item sm={4} md={3} lg={3}>
                    <Grid container justifyContent={'center'}>
                      <Grid item xs={8} sm={12}>
                        <Card
                          elevation={elevation}
                        >
                          {/* TODO replace with cover url from book object */}
                          <CardMedia component="img" src={cover_url} />
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9} lg={9}>
                    <Grid container rowSpacing={1}>
                      {['title', 'authors', 'publisher', 'year', 'isbn', 'esbn', 'bisac', 'lc', 'imprint_publisher', 'oclc', 'lcc', 'dewey'].map(
                        x => {
                          if (book && x in book) {
                            return <Row title={bookPretty.get(x)} content={`${book[x as keyof typeof book]}`} key={x}></Row>
                          } else { return <></> }
                        }
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Paper variant="outlined">
                  <Grid container spacing={2} padding={'1rem'}>
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
          </Container>
        }
        nav={<NavLink text={"Search"} to={"/"} id={"search"} />}
      ></Base>
    );
    return base;
  } else {
    return <></>;
  }
}
