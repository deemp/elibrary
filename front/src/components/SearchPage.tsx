import { Base } from "./Base";
import { Search } from "./Search";
import { NavLink } from "./NavLink";
import { Box, Container, Grid, Typography } from "@mui/material";
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
            <Grid container alignItems={"center"}>
              <Grid item xs={7}>
                <Grid container spacing={1}>
                  <Grid item>
                    <NavLink text={"Log out"} id={"logout"} to={"/"} />
                  </Grid>
                  <Grid item>{faqButton}</Grid>
                </Grid>
              </Grid>
              <Grid
                item
                xs={5}
                paddingTop={appbar.padding}
                paddingBottom={appbar.padding}
                textAlign={"right"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"end"}
                fontSize={"14px"}
              >
                <Typography sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                  EBSCO EBOOK ARCHIVE
                </Typography>
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
