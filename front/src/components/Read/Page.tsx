import { useLoaderData } from "react-router-dom";
import { Base } from "../Base";
import { BookReader } from "../Read/Reader";
import { Book as BookModel } from "../../models/book";
import { searchLink } from "../Search/Link";
import { reportLink } from "../Report/Link";
import { infoLink } from "../Info/Link";
import { AppBar } from "../AppBar";
import { Content } from "./Help";

export function BookReadPage() {
  const book = useLoaderData() as BookModel;
  const id = book.book_id;
  const base = (
    <Base
      title="Book"
      content={<BookReader bookId={id}></BookReader>}
      nav={<AppBar leftChildren={[reportLink(), searchLink, infoLink(id)]} content={Content} />}
    ></Base>
  );
  return base;
}
