import { useParams } from "react-router-dom";
import { Base } from "./Base";
import { Book } from "./Book";
import { Container, Grid } from "@mui/material";
import { Ebsco, AppBarLink } from "./AppBar";
import { useFAQ } from "./FAQ";

export function BookReadPage() {
  const { faqButton, faqDrawer } = useFAQ();
  const { id } = useParams();
  if (id) {
    const bookId = Number.parseInt(id);
    const book = <Book bookId={bookId}></Book>;
    const base = (
      <Base
        title="Book"
        user={{ isAuthenticated: true }}
        content={book}
        nav={
          <>
            <Container maxWidth={"xl"}>
              <Grid container>
                <Grid item xs={7} sm={5}>
                  <Grid container columnSpacing={1}>
                    <Grid item><AppBarLink text={"Search"} to={"/"} id={"search"} /></Grid>
                    <Grid item>{faqButton}</Grid>
                    <Grid item><AppBarLink text={"Info"} to={`/book/${id}`} id={"info"} /></Grid>
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
  } else {
    return <></>;
  }
}
