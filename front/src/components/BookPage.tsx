import { useParams } from "react-router-dom";
import { Base } from "./Base";
import { Book } from "./Book";
import { NavLink } from "./NavLink";
import { Container, Grid, Typography } from "@mui/material";
import * as appbar from "../models/appbar";
import { useElements as useFAQ } from "./FAQ";

export function BookPage() {
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
