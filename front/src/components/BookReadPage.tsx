import { useLoaderData } from "react-router-dom";
import { Base } from "./Base";
import { BookReader } from "./Book";
import { Book as BookModel } from "../models/book";
import { searchLink } from "./SearchLink";
import { reportLink } from "./ReportLink";
import { infoLink } from "./InfoLink";
import { PropsCommon } from "../models/propsCommon";

export function BookReadPage({ AppBar }: PropsCommon) {
  const book = useLoaderData() as BookModel;
  const id = book.book_id;
  const base = (
    <Base
      title="Book"
      content={<BookReader bookId={id}></BookReader>}
      nav={<AppBar leftChildren={[reportLink(), searchLink, infoLink(id)]} />}
    ></Base>
  );
  return base;
}
