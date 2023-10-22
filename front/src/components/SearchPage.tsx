import { Base } from "./Base";
import { Search } from "./Search";
import { NavLink } from "./NavLink";
import { Box, Container } from "@mui/material";
import * as appbar from "../models/appbar";
import { useElements } from "./FAQ";

export function SearchPage() {
  const { faqButton, faqDrawer } = useElements();

  const base = (
    <Base
      title="Search"
      user={{ isAuthenticated: true }}
      content={
        <Container maxWidth="xl">
          <Box
            width={"100%"}
            height={`calc(100vh - ${appbar.height})`}
            sx={{ backgroundColor: "white" }}
            marginTop={appbar.height}
          >
            <Search />
          </Box>
        </Container>
      }
      nav={
        <>
          <Box sx={{ display: "flex" }}>
            <NavLink text={"Log out"} id={"logout"} to={"/"} />
            {faqButton}
          </Box>
          {faqDrawer}
        </>
      }
    />
  );
  return base;
}
