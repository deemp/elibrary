import { Box, Grid, Drawer, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import { bookPretty } from "../models/book";
import { AppBarButton, AppBarElement } from "./AppBar";
import { color } from "../models/constants";
import * as constants from "../models/constants";


interface Term {
  name: string;
  definition: string;
  link: string;
}

export const terms: Term[] = [
  {
    name: "bisac",
    definition:
      "a set of subject headings that were created by the Book Industry Study Group and is the system used in many bookstores.",
    link: "https://en.wikipedia.org/wiki/BISAC_Subject_Headings",
  },
  {
    name: "lc",
    definition: "arranges books by subject",
    link: "https://www.farmingdale.edu/library/lcclass.shtml",
  },
  {
    name: "isbn",
    definition: "a unique numeric commercial book identifier",
    link: "https://en.wikipedia.org/wiki/ISBN",
  },
  {
    name: "esbn",
    definition: "a unique numeric educational book identifier",
    link: "https://esbn-international.com/esbn/",
  },
  {
    name: "oclc",
    definition: "identifier for a unique bibliographic record in OCLC WorldCat",
    link: "https://www.wikidata.org/wiki/Property:P243",
  },
  {
    name: "lcc",
    definition:
      "a system of library classification developed by the Library of Congress in the United States",
    link: "https://en.wikipedia.org/wiki/Library_of_Congress_Classification",
  },
  {
    name: "dewey",
    definition:
      "a classification number that unambiguously locates a particular volume in a position relative to other books in the library, on the basis of its subject",
    link: "https://en.wikipedia.org/wiki/Dewey_Decimal_Classification#Design",
  },
];

export function useFAQ() {
  const anchor = "right";
  const [state, setState] = useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift" ||
          (event as React.KeyboardEvent).key === "Enter")
      ) {
        return;
      }

      setState(open);
    };

  const faqButton = (
    <AppBarButton text={"FAQ"} onClick={toggleDrawer(true)}></AppBarButton>
  );

  const header = (text: string) => (
    <Grid
      item
      xs={12}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      height={constants.heightAdaptive}
      bgcolor={color}
    >
      <AppBarElement text={text}></AppBarElement>
    </Grid>
  );

  const faqDrawer = (
    <Drawer anchor={anchor} open={state} onClose={toggleDrawer(false)}>
      <Box
        sx={{ width: "60vw" }}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <Grid container>
          {header("Terms and definitions")}
          {terms.map((x) => {
            return (
              <Grid item xs={12} key={x.name} paddingX={"1rem"}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography
                      component={Link}
                      to={x.link}
                      sx={{ color }}
                      variant="h6"
                    >
                      {bookPretty.get(x.name)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    {x.definition}
                  </Grid>
                </Grid>
              </Grid>
            );
          })}
          {header("Source code")}
          <Grid item xs={12} paddingX={"1rem"}>
            <Grid container>
              <Grid item xs={12}>
                <Typography
                  component={Link}
                  to={
                    "https://gitlab.pg.innopolis.university/elibrary/elibrary"
                  }
                  variant="h6"
                  sx={{ color }}
                >
                  {"elibrary"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
  return { faqButton, faqDrawer };
}
