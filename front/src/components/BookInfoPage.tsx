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
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Book } from "../models/book";
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
    <>
      <Grid container>
        <Grid item xs={4} sm={6}>
          <Typography sx={{ fontWeight: "bold" }} variant="h6" component="div">
            {title}:
          </Typography>
        </Grid>
        <Grid item xs={8} sm={6}>
          <Typography component="div">{content}</Typography>
        </Grid>
      </Grid>
    </>
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

    const base = (
      <Base
        title="Info"
        user={{ isAuthenticated: true }}
        content={
          <Container maxWidth="lg">
            <Stack
              alignItems={"center"}
              marginTop={appbar.height}
              paddingTop={"0.5rem"}
              sx={{
                minHeight: `calc(100vh - ${appbar.height})`,
              }}
            >
              <Link to={`/book/${bookId}/read`}>
                <Button
                  sx={{
                    marginTop: { xs: "1rem", md: "0" },
                    padding: "1rem 5rem",
                  }}
                  variant="outlined"
                >
                  READ
                </Button>
              </Link>
              <Box
                sx={{
                  backgroundColor: "white",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                }}
                paddingTop={"1rem"}
              >
                <Card
                  sx={{
                    height: "fit-content",
                    margin: { sm: "3rem", md: "0" },
                    marginRight: { md: "10rem" },
                  }}
                >
                  {/* TODO replace with cover url from book object */}
                  <CardMedia component="img" src={cover_url} />
                </Card>
                <Stack
                  sx={{ marginTop: { xs: "1.5rem", sm: "0" } }}
                  spacing={3}
                >
                  <Row title="Title" content={`${book?.title}`}></Row>
                  <Row title="Author(s)" content={`${book?.authors}`}></Row>
                  <Row title="Publisher" content={`${book?.publisher}`}></Row>
                  <Row title="Year" content={`${book?.year}`}></Row>
                  <Row title="ISBN" content={`${book?.isbn}`}></Row>
                  <Row title="ESBN" content={`${book?.esbn}`}></Row>
                  <Row title="BISAC" content={`${book?.bisac}`}></Row>
                  <Row title="LC" content={`${book?.lc}`}></Row>
                  <Row
                    title="Imprint publisher"
                    content={`${book?.imprint_publisher}`}
                  ></Row>
                  <Row title="OCLC" content={`${book?.oclc}`}></Row>
                  <Row title="LCC" content={`${book?.lcc}`}></Row>
                  <Row title="Dewey" content={`${book?.dewey}`}></Row>
                </Stack>
              </Box>
              <Box marginTop={3} alignSelf={"start"}>
                <Paper elevation={24} sx={{ padding: "1rem" }}>
                  <Stack direction={"row"} alignItems={"center"}>
                    <Typography variant="body1">{reference}</Typography>
                    <Button
                      sx={{
                        marginLeft: { xs: "1rem" },
                        padding: "0.5rem 3rem",
                      }}
                      variant="outlined"
                      onClick={copyToClipboard}
                    >
                      Copy Reference
                    </Button>
                  </Stack>
                </Paper>
              </Box>
            </Stack>
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
