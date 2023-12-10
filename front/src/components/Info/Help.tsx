import { Term, termsObject } from "../../models/terms";
import {
  bold,
  mkBulletList,
  mkContent,
  sectionTerms,
  sectionUsage,
} from "../Help";
import { P } from "../P";

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
      <P>
        Click on {bold("READ")}, {bold("READ THIS BOOK")}, or the book cover to
        open the book reading page.
      </P>,
      <P>
        Click on the tab name in the reference panel to choose a reference
        format.
      </P>,
    ]),
  ]),
  sectionTerms(terms),
]);
