import { Base } from "./Base";
import { Search } from "./Search";
import { NavLink } from "./NavLink";
import { Box, Container } from "@mui/material";
import * as appbar from '../models/appbar'
import { useState } from "react";

export function SearchPage() {
  let [filterCounter, setFilterCounter] = useState<number>(1)
  
  const base = (
    <Base
      title="Search"
      user={{ isAuthenticated: true }}
      content={
        <Container maxWidth="xl">
          <Box
            width={'100%'}
            height={`calc(100vh - ${appbar.height})`}
            sx={{ backgroundColor: 'white' }}
            marginTop={appbar.height}
          >
            <Search filterCounter={filterCounter} setFilterCounter={setFilterCounter}/>
          </Box>
        </Container>
      }
      nav={<NavLink text={"Log out"} id={"logout"} to={"/"} />}
    />
  );
  return base;
}
