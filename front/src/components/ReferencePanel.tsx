import Tab from "@mui/material/Tab";
import { ReactNode, SyntheticEvent, useState } from "react";
import { Button, Grid, Typography } from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";
import { buttonPadding, fontSize } from "../models/elements";
import React from "react";

export interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

interface ReferenceProps {
  textReference: string;
  bibTexReference: string;
}



function tab(value: string, reference: string) {
  return (
    <TabPanel value={value}>
      <Grid container>
        <Grid item xs>
          <Typography sx={{ fontFamily: 'monospace', wordWrap: 'break-word' }}>{reference}</Typography>
        </Grid>
        <Grid item display={'flex'} sx={{
          alignItems: 'start',
          justifyContent: { xs: 'center', sm: 'right' },
          width: { xs: '100%', sm: '150px' }
        }}>
          <Button
            sx={{
              fontSize,
              ...buttonPadding,
              marginTop: { xs: '1rem', sm: 0 }
            }}
            variant="contained"
            size="large"
            disableElevation
            onClick={() => {
              if (copy(reference)) {
                toast.success("Copied to Clipboard");
              } else {
                toast.warn("Could not copy to Clipboard");
              }
            }}
          >
            copy
          </Button>
        </Grid>
      </Grid>
    </TabPanel>
  )
}

export function ReferencePanel({
  textReference,
  bibTexReference,
}: ReferenceProps) {
  const [value, setValue] = React.useState<string>("0")
  const [_reference, setReference] = useState<string>(textReference);

  const handleChange = (_e: SyntheticEvent, type: string) => {
    setValue(type)
    setReference(type === "0" ? textReference : bibTexReference)
  };

  return (
    <Grid container>
      <Grid item xs={12} sm>
        <TabContext value={value}>
          <Grid container>
            <Grid item xs={12} sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChange} aria-label="References">
                <Tab value="0" sx={{ fontSize, maxWidth: { xs: '200px', md: '400px' } }} label="bibliographic information" />
                <Tab value="1" sx={{ fontSize }} label="BibTex" />
              </TabList>
            </Grid>
            <Grid item xs={12}>
              {tab("0", textReference)}
              {tab("1", bibTexReference)}
            </Grid>
          </Grid>
        </TabContext>
      </Grid>
    </Grid>
  );
}
