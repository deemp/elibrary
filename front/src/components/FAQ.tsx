import {
  Box,
  Button,
  Divider,
  Grid,
  Link,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import * as appbar from "../models/appbar";
import { useState } from "react";
import { bookPretty } from "../models/book";

interface Term {
  name: string;
  definition: string;
  link: string;
}

const terms: Term[] = [
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

export function useElements() {
  const anchor = "right";
  const [state, setState] = useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState(open);
    };

  const faqButton = (
    <Button
      sx={{
        color: "#ffffff",
        padding: "20px",
        fontWeight: "bold",
      }}
      onClick={toggleDrawer(true)}
    >
      FAQ
    </Button>
  );

  const faqDrawer = (
    <SwipeableDrawer
      anchor={anchor}
      open={state}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
    >
      <Box
        sx={{ width: "60vw" }}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <Grid container>
          <Grid
            item
            xs={12}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            height={appbar.height}
            bgcolor="#1976d2"
          >
            <Typography
              variant="h6"
              sx={{
                color: "#ffffff",
                fontWeight: "bold",
              }}
            >
              Terms and definitions
            </Typography>
          </Grid>
        </Grid>
        <Grid container padding={1}>
          {terms.map((x) => {
            return (
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={12}>
                    <Link href={x.link}>
                      <Typography variant="h6">
                        {bookPretty.get(x.name)}
                      </Typography>
                    </Link>
                  </Grid>
                  <Grid item xs={12}>
                    {x.definition}
                  </Grid>
                </Grid>
                <Divider />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </SwipeableDrawer>
  );
  return { faqButton, faqDrawer };
}
