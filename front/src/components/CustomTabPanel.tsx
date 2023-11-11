import Typography from "@mui/material/Typography";
import { TabPanelProps } from "../models/TabPanelProps";
import { Stack } from "@mui/material";

export function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reference-tabpanel-${index}`}
      aria-labelledby={`reference-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Stack sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Stack>
      )}
    </div>
  );
}
