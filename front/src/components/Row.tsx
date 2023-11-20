import { Grid, Typography } from "@mui/material";

export function Row({
  title,
  variant,
  title_width,
  content,
}: {
  title: string | undefined;
  variant: "text" | "outline" | "contained";
  title_width: string | undefined;
  content: string | undefined;
}) {
  return (
    <Grid item xs={12}>
      <Grid container>
        <Grid item sx={{ width: title_width }}>
          <Typography variant={variant}>{title}</Typography>
        </Grid>
        <Grid item xs>
          <Typography variant={variant} sx={{ fontWeight: "bold" }}>
            {content}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
