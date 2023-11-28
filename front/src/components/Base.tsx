import { ReactElement, useEffect } from "react";
import { AppBar, Toolbar } from "@mui/material";
import * as appbar from "./AppBar";

export function Base({
  title,
  content,
  nav,
}: {
  title: string;
  content: ReactElement;
  nav: ReactElement;
}) {
  useEffect(() => {
    document.title = title;
  });

  // TODO show error pages
  return (
    <>
      <AppBar elevation={0} sx={{ height: appbar.height, color: "white" }}>
        <Toolbar
          variant="dense"
          disableGutters
          sx={{ minHeight: 60, height: 60 }}
        >
          {nav}
        </Toolbar>
      </AppBar>
      {content}
      <script
        src="https://kit.fontawesome.com/a93f01c655.js"
        crossOrigin="anonymous"
      ></script>
    </>
  );
}
