import { Base } from "./Base";
import { Search } from "./Search";
import { NavLink } from "./NavLink";
import { Box, Container, Grid } from "@mui/material";
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
          <Container maxWidth={"xl"}>
            <Grid container>
              <Grid item xs={2}>
                <Box>
                  <NavLink text={"Log out"} id={"logout"} to={"/"} />
                  {faqButton}
                </Box>
              </Grid>
              <Grid
                item
                xs={10}
                paddingTop={appbar.padding}
                paddingBottom={appbar.padding}
                textAlign={"right"}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'end'}
              >
                EBSCO EBOOK ARCHIVE
              </Grid>
            </Grid>
          </Container>
          {faqDrawer}
        </>
      }
    />
  );
  return base;
}
