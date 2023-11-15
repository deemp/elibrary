import React from "react";
import ReactDOM from "react-dom/client";
import { SearchPage } from "./components/SearchPage.tsx";
import { BookReadPage } from "./components/BookReadPage.tsx";
import "./index.css";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { BookInfoPage } from "./components/BookInfoPage.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { bookLoader, fetchImage } from "./components/Responses.tsx";

const router = createBrowserRouter([
  {
    path: "",
    element: <SearchPage />,
    errorElement: <Navigate to={"/"} />
  },
  {
    path: "book/:id/read",
    loader: bookLoader,
    element: <BookReadPage />,
    errorElement: <Navigate to={"/"} />
  },
  {
    path: "book/:id",
    loader: async (params) => {
      const book = await bookLoader(params)
      const dimensions = await fetchImage(book.book_id)
      return { book, dimensions }
    },
    element: <BookInfoPage />,
    errorElement: <Navigate to={"/"} />
  },
  {
    path: "*",
    element: <Navigate to={"/"} />,
    errorElement: <Navigate to={"/"} />
  }
], { basename: "/" });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CssBaseline />
    <RouterProvider router={router} />
    <ToastContainer
      position="bottom-center"
      autoClose={200}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
  </React.StrictMode>
);
