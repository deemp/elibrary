import React from "react";
import ReactDOM from "react-dom/client";
import { SearchPage } from "./components/SearchPage.tsx";
import { BookReadPage } from "./components/BookReadPage.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "./error-page.tsx";
import CssBaseline from "@mui/material/CssBaseline";
import { BookInfoPage } from "./components/BookInfoPage.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SearchPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/book/:id/read",
    element: <BookReadPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/book/:id",
    element: <BookInfoPage />,
    errorElement: <ErrorPage />,
  },
]);

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
