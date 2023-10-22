import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import * as appbar from "../models/appbar";

export function NavLink({
  text,
  id,
  to,
}: {
  text: string;
  id: string;
  to: string;
}) {
  return (
    <Link id={id} to={to}>
      <Button
        sx={{
          color: "#ffffff",
          paddingTop: appbar.padding,
          paddingBottom: appbar.padding,
          fontWeight: "bold",
        }}
      >
        {text}
      </Button>
    </Link>
  );
}
