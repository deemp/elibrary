import { Box, Button } from "@mui/material";
import * as constants from "../models/constants";
import { Container, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { useHelp } from "./Help";

export const height = "80px";
export const padding = "20px";

const sxBase = {
  color: "#ffffff",
  fontSize: constants.fontSize,
  paddingY: { xs: 0, sm: "0.2rem" },
  lineHeight: constants.lineHeight,
  paddingX: "0px",
};

export function AppBarButton({
  text,
  onClick,
  to,
  id,
}: {
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  to?: string;
  id?: string;
}) {
  const sx = {
    ...sxBase,
    "&:hover": {
      backgroundColor: constants.buttonBackgroundColor,
    },
    width: {
      xs: `calc(${text.length} * ${constants.fontSize.xs} * 0.8)`,
      sm: `calc(${text.length} * ${constants.fontSize.sm} * 0.8)`,
    },
  };
  return (
    <Button
      onClick={onClick}
      LinkComponent={Link}
      href={to}
      sx={sx}
      id={id}
      // @ts-expect-error doesn't inherit properties from `Link`
      underline={"none"}
      to={to}
    >
      {text}
    </Button>
  );
}

export function AppBarElement({ text }: { text: string }) {
  return (
    <Box
      sx={{
        ...sxBase,
        fontWeight: 800,
        height: "auto",
        alignItems: "center",
      }}
    >
      {text}
    </Box>
  );
}

const Ebsco = <AppBarElement text={"EBSCO EBOOK ARCHIVE"} />;

export function AppBar({
  content,
  leftChildren,
}: {
  content: JSX.Element;
  leftChildren: JSX.Element[];
}) {
  const { helpButton, helpDrawer } = useHelp(content);
  return (
    <>
      <Container maxWidth={constants.maxWidth}>
        <Grid container>
          <Grid
            item
            sx={{ width: { xs: "auto", sm: "auto" } }}
            display={"flex"}
            alignItems={"center"}
          >
            <Grid
              container
              children={[helpButton].concat(leftChildren).map((x, idx) => (
                <Grid item display={"flex"} maxHeight={"auto"} height={"auto"} key={`${idx}`}>
                  {x}
                </Grid>
              ))}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm
            display={"flex"}
            justifyContent={"end"}
            alignItems={"center"}
            textAlign={"right"}
          >
            {Ebsco}
          </Grid>
        </Grid>
      </Container>
      {helpDrawer}
    </>
  );
}

export type AppBarWithChildren = ({
  leftChildren,
}: {
  leftChildren: JSX.Element[];
}) => JSX.Element;
