import { Grid, SxProps, Theme, Typography } from "@mui/material";

export function Row({
  title,
  widthSx,
  sx,
  content,
}: {
  title: string | undefined;
  content: string | undefined;
  sx: SxProps<Theme> | undefined;
  widthSx: SxProps<Theme> | undefined;
}) {
  return (
    <Grid item xs={12}>
      <Grid container>
        <Grid item sx={{ ...widthSx }}>
          <Typography sx={{ ...sx }}>{title}</Typography>
        </Grid>
        <Grid item xs>
          <Typography sx={{ fontWeight: "bold", ...sx }}>{content}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
