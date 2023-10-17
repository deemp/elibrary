import { Link, useParams } from "react-router-dom";
import { Base } from "./Base";
import { NavLink } from "./NavLink";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Book } from "../models/book";
import cover_url from "../assets/book_cover.png";

function Row({
  title,
  content,
}: {
  title: string | undefined;
  content: string | undefined;
}) {
  return (
    <>
      <Grid item xs={4} md={2}>
        <Typography sx={{ fontWeight: "bold" }} variant="h6" component="div">
          {title}:
        </Typography>
      </Grid>
      <Grid item xs={8} md={10}>
        <Typography component="div">{content}</Typography>
      </Grid>
    </>
  );
}

export function BookInfoPage() {
  const { id } = useParams();
  if (id) {
    const bookId = Number.parseInt(id);
    const url = `${import.meta.env.VITE_API_PREFIX}/search`;
    const [book, setBook] = useState<Book | undefined>();

    useEffect(() => {
      fetch(url, {
        method: "POST",
        headers: new Headers({ "content-type": "application/json" }),
        body: JSON.stringify({
          bisac: "",
          lc: "",
          filter: "id",
          filter_input: `${bookId}`,
        }),
      })
        .then((r) => r.json())
        .then((r: { books: Book[] }) => {
          setBook(r.books[0]);
        });
    }, [setBook, url, bookId]);

    const base = (
      <Base
        title="Info"
        user={{ isAuthenticated: true }}
        content={
          <Container>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <img
                style={{ height: "calc(100vh * 3/4)", margin: "1.5rem" }}
                src={cover_url}
                alt={`Image of ${book?.title}`}
                loading="lazy"
              />
              <Grid container spacing={2} paddingTop={2}>
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
