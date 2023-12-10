import { bold, mkBulletList, mkContent, sectionUsage } from "../Help";
import { P } from "../P";

export const Content = mkContent([
  sectionUsage([
    mkBulletList([
      <P>Choose a month and a year to see statistics for that month.</P>,
      <P>The {bold("Read count")} is shown for the selected month.</P>,
    ]),
  ]),
]);
