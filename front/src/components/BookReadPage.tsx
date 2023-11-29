import { useLoaderData } from "react-router-dom";
import { Base } from "./Base";
import { BookReader } from "./Book";
import { AppBar } from "./AppBar";
import { useFAQ } from "./FAQ";
import { Book as BookModel } from "../models/book";
import { searchLink } from "./SearchLink";
import { reportLink } from "./ReportLink";
import { infoLink } from "./InfoLink";

export function BookReadPage() {
  const { faqButton, faqDrawer } = useFAQ();
  const book = useLoaderData() as BookModel;
  const id = book.book_id;
  const base = (
    <Base
      title="Book"
      content={<BookReader bookId={id}></BookReader>}
      nav={
        <AppBar
          faqDrawer={faqDrawer}
          leftChildren={[
            faqButton,
            searchLink,
            reportLink(),
            infoLink(id),
          ]}
        />
      }
    ></Base>
  );
  return base;
}
