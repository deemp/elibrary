import { Base } from "./Base";
import { Search } from "./Search";
import { Box, Container, Grid, } from "@mui/material";
import { Ebsco } from "./AppBar";
import * as appbar from "./AppBar"
import { useFAQ } from "./FAQ";


export function SearchPage() {
  const { faqButton, faqDrawer } = useFAQ();

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
              <Grid item xs={4}>
                <Grid container spacing={1}>
                  <Grid item>{faqButton}</Grid>
                </Grid>
              </Grid>
              <Grid
                item
                xs={8}
                display={"flex"}
                justifyContent={"end"}
              >
                {Ebsco}
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
