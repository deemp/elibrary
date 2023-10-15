import { Base } from "./Base";
import { Search } from "./Search";
import { NavLink } from "./NavLink";
import { Container } from "@mui/material";

export function SearchPage() {
  const base = (
    <Base
      title="Search"
      user={{ isAuthenticated: true }}
      content={
        <Container sx={{ height: 'calc(100vh - 60px)' }} maxWidth='xl'>
          <Search />
        </Container>
      }
      nav={<NavLink text={"Log out"} id={"logout"} to={"/"} />}
    />
  );
  return base;
}
