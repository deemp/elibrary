import React from "react";
import ReactDOM from "react-dom/client";
import { SearchPage } from "./components/SearchPage.tsx";
import { BookPage } from "./components/BookPage.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "./error-page.tsx";
import CssBaseline from '@mui/material/CssBaseline';

const router = createBrowserRouter([
  {
    path: "/",
    element: <SearchPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/book/:id/read",
    element: <BookPage />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CssBaseline />
    <RouterProvider router={router} />
  </React.StrictMode>
);
