import {
  bold,
  mkBulletList,
  mkContent,
  sectionTerms,
  sectionUsage,
} from "../Help";
import { Term, termsObject } from "../../models/terms";
import { P } from "../P";

const terms: Term[] = ["isbn"].map(
  (x) => termsObject[x as keyof typeof termsObject]
);

export const Content = ({ searchResultsMax }: { searchResultsMax: number }) =>
  mkContent([
    sectionUsage([
      mkBulletList([
        <P>
          Search books via {bold("Category")}, {bold("Subject")}, and other
          filters.
        </P>,
        <P>
          Enter the number of filters in the {bold("Filters count")} field.
        </P>,
        <P>Clear this field to reset filters.</P>,
        <P>Enter a column name in the {bold("Filter by")} field.</P>,
        <P>Enter some text in the {bold("Using text")} field.</P>,
        <P>
          All search results will have this text as a substring in the chosen
          column.
        </P>,
        <P>There will be at most {bold(`${searchResultsMax}`)} results.</P>,
      ]),
    ]),
    sectionTerms(terms),
  ]);
