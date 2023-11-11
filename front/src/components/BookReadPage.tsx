import { useLoaderData } from "react-router-dom";
import { Base } from "./Base";
import { Book } from "./Book";
import { Container, Grid } from "@mui/material";
import { Ebsco, AppBarLink } from "./AppBar";
import { useFAQ } from "./FAQ";
import { Book as BookModel } from "../models/book"
import { searchLink } from "./SearchLink";

export function BookReadPage() {
  const { faqButton, faqDrawer } = useFAQ();
  const book = useLoaderData() as BookModel
  const id = book.book_id
  const base = (
    <Base
      title="Book"
      user={{ isAuthenticated: true }}
      content={<Book bookId={id}></Book>}
      nav={
        <>
          <Container maxWidth={"xl"}>
            <Grid container>
              <Grid item xs={7} sm={5}>
                <Grid container columnSpacing={1}>
                  <Grid item><AppBarLink text={"Info"} to={`/book/${id}`} id={"info"} /></Grid>
                  <Grid item>{searchLink}</Grid>
                  <Grid item>{faqButton}</Grid>
                </Grid>
              </Grid>
              <Grid
                item
                xs={5}
                sm={7}
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
