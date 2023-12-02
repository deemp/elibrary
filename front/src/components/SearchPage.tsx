import { Base } from "./Base";
import { Search } from "./Search";
import { Box, Container } from "@mui/material";
import { AppBar } from "./AppBar";
import { useHelp } from "./Help";
import { Props } from "./Search";
import { reportLink } from "./ReportLink";
import * as constants from "../models/constants";

export function SearchPage(props: Props) {
  const { helpButton, helpDrawer } = useHelp(props.searchResultsMax);

  const base = (
    <Base
      title="Search"
      content={
        <Container maxWidth="xl">
          <Box
            width={"100%"}
            height={constants.contentHeightAdaptive}
            sx={{ backgroundColor: "white" }}
            marginTop={constants.heightAdaptive}
          >
            <Search {...props} />
          </Box>
        </Container>
      }
      nav={
        <AppBar
          helpDrawer={helpDrawer}
          leftChildren={[helpButton, reportLink()]}
        />
      }
    />
  );
  return base;
}
