import { useLoaderData } from "react-router-dom";
import { Base } from "./Base";
import { Book } from "./Book";
import { AppBarLink, AppBar } from "./AppBar";
import { useFAQ } from "./FAQ";
import { Book as BookModel } from "../models/book";
import { searchLink } from "./SearchLink";
import { Grid } from "@mui/material";

export function BookReadPage() {
  const { faqButton, faqDrawer } = useFAQ();
  const book = useLoaderData() as BookModel;
  const id = book.book_id;
  const base = (
    <Base
      title="Book"
      user={{ isAuthenticated: true }}
      content={<Book bookId={id}></Book>}
      nav={
        <AppBar
          faqDrawer={faqDrawer}
          leftChildren={[
            <Grid item>
              <AppBarLink text={"Info"} to={`/book/${id}`} id={"info"} />
            </Grid>,
            <Grid item>{searchLink}</Grid>,
            <Grid item>{faqButton}</Grid>,
          ]}
        />
      }
    ></Base>
  );
  return base;
}
