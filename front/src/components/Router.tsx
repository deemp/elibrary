import { useState } from "react";
import { SearchPage } from "./SearchPage.tsx";
import { BookReadPage } from "./BookReadPage.tsx";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { BookInfoPage } from "./BookInfoPage.tsx";
import { bookLoader, fetchImage } from "./Responses.tsx";
import { Props, RowFilter } from "./Search.tsx";
import { List } from "immutable";
import { Report } from "./Report.tsx";
import { PropsCommon } from "../models/propsCommon.ts";

export function Router() {
  const [filterCounter, setFilterCounter] = useState<number>(1);
  const minFilterCounter = 0;
  const maxFilterCounter = 5;
  const emptyRowFilter = { filter: "", filterInput: "" };
  const [rowFilter, setRowFilter] = useState<List<RowFilter>>(
    List(Array.from({ length: maxFilterCounter }, () => emptyRowFilter))
  );
  const [bisac, setBisac] = useState<string>("");
  const [lc, setLc] = useState<string>("");
  const [searchResultsMax, setSearchResultsMax] = useState<number>(0);

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
    searchResultsMax,
    setSearchResultsMax,
  };

  const propsCommon: PropsCommon = { searchResultsMax };

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
        element: <BookReadPage {...propsCommon} />,
        errorElement: <Navigate to={"/"} />,
      },
      {
        path: "book/:id",
        loader: async (params) => {
          const book = await bookLoader(params);
          const dimensions = await fetchImage(book.book_id);
          return { book, dimensions };
        },
        element: <BookInfoPage {...propsCommon} />,
        errorElement: <Navigate to={"/"} />,
      },
      {
        path: "/report",
        element: <Report {...propsCommon} />,
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
