import { useEffect, useState } from "react";
import { SearchPage } from "./Search/Page";
import { BookReadPage } from "./Read/Page";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { BookInfoPage } from "./Info/Page";
import { bookLoader, fetchImage } from "../models/communication";
import { Props, RowFilter } from "./Search/Page";
import { List } from "immutable";
import { Report } from "./Report/Page";
import * as appBar from "./AppBar";
import * as searchHelp from "./Search/Help";

const url = `${import.meta.env.VITE_API_PREFIX}/help`;

export function Router() {
  const [filterCounter, setFilterCounter] = useState<"" | number>(1);
  const minFilterCounter = 1;
  const maxFilterCounter = 5;
  const emptyRowFilter = { filter: "", filterInput: "" };
  const [rowFilter, setRowFilter] = useState<List<RowFilter>>(
    List(Array.from({ length: maxFilterCounter }, () => emptyRowFilter)).update(
      0,
      (_v) => ({ filter: "title", filterInput: "" })
    )
  );
  const [bisac, setBisac] = useState<string>("");
  const [lc, setLc] = useState<string>("");
  const [searchResultsMax, setSearchResultsMax] = useState<number>(0);

  useEffect(() => {
    fetch(url, {
      method: "GET",
      headers: new Headers({ "content-type": "application/json" }),
    })
      .then((r) => r.json())
      .then((r) => {
        setSearchResultsMax(r.search_results_max);
      });
    // run once
  }, []);

  const props: Props = {
    emptyRowFilter,
    maxFilterCounter,
    minFilterCounter,
    filterCounter,
    setFilterCounter,
    rowFilter,
    setRowFilter,
    bisac,
    setBisac,
    lc,
    setLc,
    AppBar: (props) =>
      appBar.AppBar({
        ...props,
        content: searchHelp.Content({ searchResultsMax }),
      }),
  };

  const router = createBrowserRouter(
    [
      {
        path: "",
        element: <SearchPage {...props} />,
        errorElement: <Navigate to={"/"} />,
      },
      {
        path: "book/:id/read",
        loader: bookLoader,
        element: <BookReadPage />,
        errorElement: <Navigate to={"/"} />,
      },
      {
        path: "book/:id",
        loader: async (params) => {
          const book = await bookLoader(params);
          const dimensions = await fetchImage(book.book_id);
          return { book, dimensions };
        },
        element: <BookInfoPage />,
        errorElement: <Navigate to={"/"} />,
      },
      {
        path: "/report",
        element: <Report />,
        errorElement: <Navigate to={"/"} />,
      },
      {
        path: "*",
        element: <Navigate to={"/"} />,
        errorElement: <Navigate to={"/"} />,
      },
    ],
    { basename: "/" }
  );

  return <RouterProvider router={router} />;
}
