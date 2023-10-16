import { Base } from "./Base";
import { Search } from "./Search";
import { NavLink } from "./NavLink";
import { Box, Container } from "@mui/material";
import * as appbar from '../models/appbar'

export function SearchPage() {
  const base = (
    <Base
      title="Search"
      user={{ isAuthenticated: true }}
      content={
          <Box height={`calc(100vh - ${appbar.height})`}>
          <Search />
          </Box>
        </Container>
      }
      nav={<NavLink text={"Log out"} id={"logout"} to={"/"} />}
    />
  );
  return base;
}
