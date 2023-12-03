import { Typography } from "@mui/material";
import { bold, mkContent, sectionUsage } from "../Help";

export const Content = mkContent([
  sectionUsage([
    <Typography component={"p"}>
      Choose a month and a year to see statistics for that month.
    </Typography>,
    <p></p>,
    <Typography component={"p"}>
      The {bold("Read count")} is shown for the selected month.
    </Typography>,
  ]),
]);
