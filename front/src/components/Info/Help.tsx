import { Typography } from "@mui/material";
import { Term, termsObject } from "../../models/terms";
import {
  bold,
  mkBulletList,
  mkContent,
  sectionTerms,
  sectionUsage,
} from "../Help";

const terms: Term[] = [
  "isbn",
  "esbn",
  "bisac",
  "lc",
  "imprint_publisher",
  "oclc",
  "lcc",
  "dewey",
].map((x) => termsObject[x as keyof typeof termsObject]);

export const Content = mkContent([
  sectionUsage([
    mkBulletList([
      <Typography component={"p"}>
        Click on {bold("READ")}, {bold("READ THIS BOOK")}, or the book cover to
        open the book viewer.
      </Typography>,
      <Typography component={"p"}>
        Click on the tab name in the reference panel to choose a reference
        format.
      </Typography>,
    ]),
  ]),
  sectionTerms(terms),
]);
