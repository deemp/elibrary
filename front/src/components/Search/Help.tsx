import { Typography } from "@mui/material";
import { bold, mkContent, sectionTerms, sectionUsage } from "../Help";
import { Term, termsObject } from "../../models/terms";

const terms: Term[] = ["isbn"].map(
  (x) => termsObject[x as keyof typeof termsObject]
);

export const Content = ({ searchResultsMax }: { searchResultsMax: number }) =>
  mkContent([
    sectionUsage([
      <Typography component={"p"}>
        Search books via {bold("Category")}, {bold("Subject")}, and other
        filters.
      </Typography>,
      <Typography component={"p"}>
        Enter the number of filters in the {bold("Filters count")} field.
      </Typography>,
      <Typography component={"p"}>
        Enter a column in the {bold("Filter by")} field.
      </Typography>,
      <Typography component={"p"}>
        Enter some text in the {bold("Using text")} field.
      </Typography>,
      <Typography component={"p"}>
        All search results will have this text as a substring in the chosen
        column.
      </Typography>,
      <Typography component={"p"}>
        There will be at most {bold(`${searchResultsMax}`)} results.
      </Typography>,
    ]),
    sectionTerms(terms),
  ]);
