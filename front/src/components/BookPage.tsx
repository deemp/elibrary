import { Link, useParams } from "react-router-dom";
import { Base } from "./Base";
import { Book } from "./Book";

export function BookPage() {
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
          <Link className="nav-item nav-link" id="search" to="/">
            Search
          </Link>
        }
      ></Base>
    );
    return base;
  } else {
    return <></>;
  }
}
