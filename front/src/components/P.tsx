import { Typography } from "@mui/material";

export const P = (props: {
  children: React.ReactNode;
  elementType?: keyof JSX.IntrinsicElements;
}) => <Typography {...props} component="p" />;
