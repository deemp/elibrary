import { Base } from "./Base";
import { Search } from "./Search";
import { Box, Container, Grid } from "@mui/material";
import { Ebsco } from "./AppBar";
import * as appbar from "./AppBar";
import { useFAQ } from "./FAQ";
import { Props } from "./Search";
import { reportLink } from "./ReportLink";

export function SearchPage(props: Props) {
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
            <Search {...props} />
          </Box>
        </Container>
      }
      nav={
        <>
          <Container maxWidth={"xl"}>
            <Grid container alignItems={"center"}>
              <Grid item xs={7} sm={5}>
                <Grid container spacing={1}>
                  <Grid item>{reportLink}</Grid>
                  <Grid item>{faqButton}</Grid>
                </Grid>
              </Grid>
              <Grid item xs={5} sm={7} display={"flex"} justifyContent={"end"}>
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
