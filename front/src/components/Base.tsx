import { ReactElement, useEffect } from "react";
import { User } from "../models/User";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { NavLink } from "./NavLink";

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
      <AppBar elevation={0} sx={{ height: '60px', color: 'white' }}>
        <Toolbar variant='dense' disableGutters sx={{ minHeight: 60, height: 60 }}>
          <Typography variant="h6" component="div">
            {user.isAuthenticated ? (
              nav
            ) : (
              <NavLink text={'Log in'} to='/login' id={'login'} />
            )}
          </Typography>
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
