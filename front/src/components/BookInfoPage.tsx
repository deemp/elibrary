import { Link, useParams } from "react-router-dom";
import { Base } from "./Base";
import { NavLink } from "./NavLink";
import { Button, Container, Grid, Typography } from "@mui/material";

export function BookInfoPage() {
  const { id } = useParams();
  if (id) {
    const bookId = Number.parseInt(id);

    const base = (
      <Base
        title="Info"
        user={{ isAuthenticated: true }}
        content={
          <Container maxWidth='xl'>
            <Grid container justifyContent={'center'}>
              <Grid item xs={12} justifyContent={'center'}>
                <Typography variant="h5" component="div" paddingTop={3}>
                  Id: {bookId}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Link to={`/book/${bookId}/read`}>
                  <Button variant="outlined">Read</Button>
                </Link>
              </Grid>
            </Grid>
          </Container>
        }
        nav={<NavLink text={"Search"} to={'/'} id={"search"} />}
      ></Base>
    );
    return base;
  } else {
    return <></>;
  }
}
