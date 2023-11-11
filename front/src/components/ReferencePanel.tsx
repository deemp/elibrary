import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { SyntheticEvent, useState } from "react";
import { Button, Grid } from "@mui/material";
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";
import { CustomTabPanel } from "./CustomTabPanel";

function a11yProps(index: number) {
  return {
    id: `reference-tab-${index}`,
    "aria-controls": `reference-tabpanel-${index}`,
  };
}

interface ReferenceProps {
  textReference: string;
  bibTexReference: string;
}

export function ReferencePanel({
  textReference,
  bibTexReference,
}: ReferenceProps) {
  const [value, setValue] = useState<number>(0);
  const [reference, setReference] = useState<string | undefined>(undefined);

  const handleChange = (e: SyntheticEvent, newValue: number) => {
    e.preventDefault();

    setValue(newValue);

    console.log(value);

    if (value === 0) {
      setReference(textReference);
    } else {
      setReference(bibTexReference);
    }
  };

  const copyToClipboard = () => {
    if (reference === undefined && copy(bibTexReference)) {
      toast.success("Copied to Clipboard");
    }

    if (reference !== undefined && copy(reference)) {
      toast.success("Copied to Clipboard");
    }
  };

  return (
    <Grid container>
      <Grid item xs={12} sm>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12} sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={value} onChange={handleChange} aria-label="References">
                <Tab label="BibTex" {...a11yProps(0)} />
                <Tab label="Text Reference" {...a11yProps(1)} />
              </Tabs>
            </Grid>
            <Grid item xs={12}>
              <CustomTabPanel value={value} index={0}>
                {reference === undefined ? bibTexReference : reference}
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                {reference}
              </CustomTabPanel>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item display={'flex'} sx={{
        alignItems: 'center',
        justifyContent: { xs: 'center', sm: 'right' },
        width: { xs: '100%', sm: '200px', md: '300px' }
      }}>
        <Button
          sx={{
            fontSize: { xs: "1.2rem", sm: "1.5rem" },
            margin: { xs: "1rem" },
          }}
          variant="contained"
          size="large"
          disableElevation
          onClick={copyToClipboard}
        >
          copy reference
        </Button>
      </Grid>
    </Grid>
  );
}
