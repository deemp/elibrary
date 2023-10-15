import { ReactElement, useEffect } from "react";
import { Link } from "react-router-dom";
import { User } from "../models/User";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";

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
              <>{nav}</>
            ) : (
              <>
                <Button color='secondary'>
                  <Link id="login" to="/login" color="inherit">
                    Login
                  </Link>
                </Button>
                <Link
                  id="register"
                  to="/register"
                  color="inherit"
                >
                  Register
                </Link>
              </>
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
