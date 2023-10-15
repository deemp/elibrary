import { useParams } from "react-router-dom";
import { Base } from "./Base";
import { Book } from "./Book";
import { NavLink } from "./NavLink";

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
        nav={<NavLink text={"Search"} to={'/'} id={"search"} />}
      ></Base>
    );
    return base;
  } else {
    return <></>;
  }
}
