import { ReactElement, useEffect } from "react";
import { Button, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { User } from "../models/User";

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
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
        crossOrigin="anonymous"
      />
      <Navbar className="navbar-expand-lg navbar-dark bg-dark">
        <Button
          className="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#navbar"
        >
          <span className="navbar-toggler-icon"></span>
        </Button>
        <div className="collapse navbar-collapse" id="navbar">
          <div className="navbar-nav">
            {user.isAuthenticated ? (
              <>{nav}</>
            ) : (
              <>
                <Link className="nav-item nav-link" id="login" to="/login">
                  Login
                </Link>
                <Link
                  className="nav-item nav-link"
                  id="register"
                  to="/register"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </Navbar>
      <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
      <script
        src="https://kit.fontawesome.com/a93f01c655.js"
        crossOrigin="anonymous"
      ></script>
      <script
        src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
        integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
        crossOrigin="anonymous"
      ></script>
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
        crossOrigin="anonymous"
      ></script>

      {content}
    </>
  );
}
