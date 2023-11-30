import { useLoaderData } from "react-router-dom";
import { Base } from "./Base";
import { BookReader } from "./Book";
import { AppBar } from "./AppBar";
import { useFAQ } from "./FAQ";
import { Book as BookModel } from "../models/book";
import { searchLink } from "./SearchLink";
import { reportLink } from "./ReportLink";
import { infoLink } from "./InfoLink";
import { PropsCommon } from "../models/propsCommon";

export function BookReadPage(props: PropsCommon) {
  const { faqButton, faqDrawer } = useFAQ(props.searchResultsMax);
  const book = useLoaderData() as BookModel;
  const id = book.book_id;
  const base = (
    <Base
      title="Book"
      content={<BookReader bookId={id}></BookReader>}
      nav={
        <AppBar
          faqDrawer={faqDrawer}
          leftChildren={[faqButton, reportLink(), searchLink, infoLink(id)]}
        />
      }
    ></Base>
  );
  return base;
}
