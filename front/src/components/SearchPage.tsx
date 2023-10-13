import { Book } from "../models/book";
import { Link } from "react-router-dom";
import { Base } from "./Base";
import { useEffect, useState } from "react";
import { Search } from "../App";

export function SearchPage() {
  const [books, setBooks] = useState<Book[]>([]);

  const url = "http://localhost:5000/search";

  useEffect(() => {
    fetch(url, {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({ filter: "", filter_input: "" }),
    })
      .then((r) => r.json())
      .then((r: Book[]) => {
        setBooks([...r]);
      });
  }, []);

  const search = <Search filters={["isbn", "year"]} books={books} />;
  const base = (
    <Base
      title="Search"
      user={{ isAuthenticated: true }}
      content={search}
      nav={
        <Link className="nav-item nav-link" id="logout" to="/">
          Log out
        </Link>
      }
    />
  );
  return base;
}
