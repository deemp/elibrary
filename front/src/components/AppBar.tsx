import { Box, Button } from "@mui/material";
import {
  buttonBackgroundColor,
  fontSize,
  lineHeight,
} from "../models/constants";
import { Container, Grid } from "@mui/material";
import { Link } from "react-router-dom";

export const height = "80px";
export const padding = "20px";

const sxBase = {
  color: "#ffffff",
  fontSize,
  paddingY: { xs: 0, sm: "0.2rem" },
  lineHeight,
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
      backgroundColor: buttonBackgroundColor,
    },
    width: {
      xs: `calc(${text.length} * ${fontSize.xs} * 0.8)`,
      sm: `calc(${text.length} * ${fontSize.sm} * 0.8)`,
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
        fontWeight: "bold",
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
  faqDrawer,
  leftChildren,
}: {
  faqDrawer?: JSX.Element;
  leftChildren: JSX.Element[];
}) {
  return (
    <>
      <Container maxWidth={"xl"}>
        <Grid container>
          <Grid item xs={7} sm md lg xl display={"flex"} alignItems={"center"}>
            <Grid
              container
              children={leftChildren.map((x) => (
                <Grid item display={"flex"} maxHeight={"auto"} height={"auto"}>
                  {x}
                </Grid>
              ))}
            />
          </Grid>
          <Grid
            item
            xs={5}
            sm={3.5}
            md={5}
            display={"flex"}
            justifyContent={"end"}
            alignItems={"center"}
          >
            {Ebsco}
          </Grid>
        </Grid>
      </Container>
      {faqDrawer}
    </>
  );
}
