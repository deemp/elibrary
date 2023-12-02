import {
  Box,
  Grid,
  Drawer,
  Typography,
  Divider,
  ListItem,
  List,
} from "@mui/material";
import { useState } from "react";
import { AppBarButton, AppBarElement } from "./AppBar";
import { color } from "../models/constants";
import * as constants from "../models/constants";
import { Link } from "react-router-dom";
import { Term } from "../models/terms";
import { bookPretty } from "../models/book";
import { intersperse } from "../models/functions";

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

export const section = (text: string) => (
  <Grid
    item
    xs={12}
    display={"flex"}
    justifyContent={"left"}
    alignItems={"center"}
    height={constants.heightAdaptive}
    color={"black"}
    paddingX={"1rem"}
  >
    <Typography variant="h6" fontWeight={500}>
      {text}
    </Typography>
    <Divider />
  </Grid>
);

export const sectionList = (text: string) => [
  <ListItem sx={{ paddingBottom: 0 }}>
    <Typography variant="h6" fontWeight={700}>
      {text}
    </Typography>
  </ListItem>,
];

export const sectionSourceCode = [
  sectionList("Source code"),
  <ListItem>
    <Typography
      component={Link}
      to={"https://gitlab.pg.innopolis.university/elibrary/elibrary"}
      sx={{ color }}
    >
      {"elibrary"}
    </Typography>
  </ListItem>,
];

export const sectionTerms = (terms: Term[]) => [
  sectionList("Terms and definitions"),
  terms.map((x) => {
    return (
      <ListItem key={x.name}>
        <Typography component={"div"}>
          <Typography component={Link} to={x.link} sx={{ color }}>
            {bookPretty.get(x.name)}
          </Typography>
          {" - "}
          <Typography component={"span"}>{x.definition}.</Typography>
        </Typography>
      </ListItem>
    );
  }),
];

export const mkContent = (elems: any[]) => (
  <List>
    {intersperse(
      <Divider component={"li"} variant="middle" />,
      elems.concat([sectionSourceCode])
    )}
  </List>
);

export const sectionUsage = (elems: JSX.Element[]) => [
  sectionList("Usage"),
  <ListItem>
    <Box>{elems}</Box>
  </ListItem>,
];

export const bold = (text: string) => (
  <Typography component={"span"} fontWeight={"bold"}>
    {text}
  </Typography>
);

export function useHelp(content: JSX.Element) {
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

  const helpButton = (
    <AppBarButton text={"Help"} onClick={toggleDrawer(true)}></AppBarButton>
  );

  const helpDrawer = (
    <Drawer anchor={anchor} open={state} onClose={toggleDrawer(false)}>
      <Box
        sx={{ width: "60vw" }}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        {header("Help")}
        {content}
      </Box>
    </Drawer>
  );
  return { helpButton, helpDrawer };
}
