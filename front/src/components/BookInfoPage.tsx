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
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Book } from "../models/book";
import cover_url from "../assets/book_cover.png";
import * as appbar from "../models/appbar";

function Row({
  title,
  content,
}: {
  title: string | undefined;
  content: string | undefined;
}) {
  return (
    <>
      <Grid item xs={4} sm={6}>
        <Typography sx={{ fontWeight: "bold" }} variant="h6" component="div">
          {title}:
        </Typography>
      </Grid>
      <Grid item xs={8} sm={6}>
        <Typography component="div">{content}</Typography>
      </Grid>
    </>
  );
}

export function BookInfoPage() {
  const { id } = useParams();
  if (id) {
    const bookId = Number.parseInt(id);
    const url = `${import.meta.env.VITE_API_PREFIX}/search/${bookId}`;
    const [book, setBook] = useState<Book | undefined>();

    useEffect(() => {
      fetch(url, {
        method: "GET",
        headers: new Headers({ "content-type": "application/json" }),
      })
        .then((r) => r.json())
        .then((r: Book | undefined) => {
          setBook(r);
        });
    }, [setBook, url]);

    const base = (
      <Base
        title="Info"
        user={{ isAuthenticated: true }}
        content={
          <Container fixed>
            <Box
              sx={{
                backgroundColor: "white",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
              }}
              marginTop={appbar.height}
            >
              <Card
                sx={{
                  width: { sm: "700px" },
                  height: "auto",
                  marginTop: { sm: "3rem" },
                  marginRight: { sm: "2rem" },
                }}
              >
                {/* TODO replace with cover url from book object */}
                <CardMedia component="img" src={cover_url} />
              </Card>
              <Grid container spacing={2} paddingTop={6}>
                <Grid item xs={12}>
                  <Link to={`/book/${bookId}/read`}>
                    <Button variant="outlined">READ</Button>
                  </Link>
                </Grid>
                <Row title="BISAC" content={`${book?.bisac}`}></Row>
                <Row title="LC" content={`${book?.lc}`}></Row>
                <Row title="Publisher" content={`${book?.publisher}`}></Row>
                <Row title="Year" content={`${book?.year}`}></Row>
                <Row title="Author(s)" content={`${book?.authors}`}></Row>
                <Row title="Title" content={`${book?.title}`}></Row>
                <Row
                  title="Imprint publisher"
                  content={`${book?.imprint_publisher}`}
                ></Row>
                <Row title="ISBN" content={`${book?.isbn}`}></Row>
                <Row title="ESBN" content={`${book?.esbn}`}></Row>
                <Row title="OCLC" content={`${book?.oclc}`}></Row>
                <Row title="LCC" content={`${book?.lcc}`}></Row>
                <Row title="Dewey" content={`${book?.dewey}`}></Row>
              </Grid>
            </Box>
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
