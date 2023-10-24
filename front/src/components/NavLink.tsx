import { Button } from "@mui/material";
import { Link } from "react-router-dom";

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
          paddingLeft: '3px',
          paddingRight: '3px',
          fontWeight: "bold",
          fontSize: "14px",
          '&:hover': {
            backgroundColor: '#4f9ae3'
          }
        }}
      >
        {text}
      </Button>
    </Link>
  );
}
