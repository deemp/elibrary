import { ReactElement, useEffect } from "react";
import { User } from "../models/User";
import { AppBar, Toolbar } from "@mui/material";
import * as appbar from "./AppBar";
import { AppBarLink } from "./AppBar";

export function Base({
  title,
  user,
  content,
  nav,
}: {
  title: string;
  user: User;
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
          {user.isAuthenticated ? (
            nav
          ) : (
            <AppBarLink text={"Log in"} to="/login" id={"login"} />
          )}
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
