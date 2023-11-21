import { Grid, SxProps, Theme, Typography } from "@mui/material";

export function Row({
  title,
  title_width,
  sx,
  content,
}: {
  title: string | undefined;
  title_width: string | undefined;
  content: string | undefined;
  sx: SxProps<Theme> | undefined;
}) {
  return (
    <Grid item xs={12}>
      <Grid container>
        <Grid item sx={{ width: title_width }}>
          <Typography sx={{ ...sx }}>{title}</Typography>
        </Grid>
        <Grid item xs>
          <Typography sx={{ fontWeight: "bold", ...sx }}>{content}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
