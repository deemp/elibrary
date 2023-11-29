import { ReactElement, useEffect } from "react";
import { AppBar, Toolbar } from "@mui/material";
import * as constants from "../models/constants";

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
      <AppBar
        elevation={0}
        sx={{ height: constants.heightAdaptive, color: "white" }}
      >
        <Toolbar
          variant="dense"
          disableGutters
          sx={{
            minHeight: constants.heightAdaptive,
            height: constants.heightAdaptive,
          }}
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
