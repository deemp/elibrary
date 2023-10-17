import { Link, useParams } from "react-router-dom";
import { Base } from "./Base";
import { NavLink } from "./NavLink";
import { Button, Container, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Book } from "../models/book";

function Row({ title, content }: { title: string | undefined, content: string | undefined }) {
  return (
    <>
      <Grid item xs={2}>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={10}>
        <Typography component="div">
          {content}
        </Typography>
      </Grid>
    </>
  )
}

export function BookInfoPage() {
  const { id } = useParams();
  if (id) {

    const bookId = Number.parseInt(id);
    const url = `${import.meta.env.VITE_API_PREFIX}/search`
    let [book, setBook] = useState<Book | undefined>()

    useEffect(() => {
      fetch(url, {
        method: "POST",
        headers: new Headers({ "content-type": "application/json" }),
        body: JSON.stringify({ bisac: "", lc: "", filter: "id", filter_input: `${bookId}` }),
      })
        .then((r) => r.json())
        .then((r: {books: Book[]}) => {
          setBook(r.books[0]);
        });
    }, [setBook, url, bookId]);

    const base = (
      <Base
        title="Info"
        user={{ isAuthenticated: true }}
        content={
          <Container maxWidth='lg'>
            <Grid container rowSpacing={1} paddingTop={2}>
              <Grid item xs={12}>
                <Link to={`/book/${bookId}/read`}>
                  <Button variant="outlined">
                    READ
                  </Button>
                </Link>
              </Grid>
              <Row title="BISAC" content={`${book?.bisac}`}></Row>
              <Row title="LC" content={`${book?.lc}`}></Row>
              <Row title="Publisher" content={`${book?.publisher}`}></Row>
              <Row title="Year" content={`${book?.year}`}></Row>
              <Row title="Author(s)" content={`${book?.authors}`}></Row>
              <Row title="Title" content={`${book?.title}`}></Row>
              <Row title="Imprint publisher" content={`${book?.imprint_publisher}`}></Row>
              <Row title="ISBN" content={`${book?.isbn}`}></Row>
              <Row title="ESBN" content={`${book?.esbn}`}></Row>
              <Row title="OCLC" content={`${book?.oclc}`}></Row>
              <Row title="LCC" content={`${book?.lcc}`}></Row>
              <Row title="Dewey" content={`${book?.dewey}`}></Row>
            </Grid>
          </Container>
        }
        nav={<NavLink text={"Search"} to={'/'} id={"search"} />}
      ></Base>
    );
    return base;
  } else {
    return <></>;
  }
}
