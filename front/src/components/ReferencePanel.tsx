import Tab from "@mui/material/Tab";
import { ReactNode, SyntheticEvent, useState } from "react";
import { Button, Grid } from "@mui/material";
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

interface Reference {
  text: string
}

function tab(value: string, reference: string, copyToClipboard: () => void) {
  return (
    <TabPanel value={value}>
      <Grid container>
        <Grid item xs>
          {reference}
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
            }}
            variant="contained"
            size="large"
            disableElevation
            onClick={copyToClipboard}
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
  const [reference, setReference] = useState<Reference>({ text: textReference });

  const handleChange = (_e: SyntheticEvent, type: string) => {
    setValue(type)
    setReference({ text: type === "0" ? textReference : bibTexReference })
  };

  const copyToClipboard = () => {
    if (copy(reference.text)) {
      toast.success("Copied to Clipboard");
    }
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
              {tab("0", textReference, copyToClipboard)}
              {tab("1", bibTexReference, copyToClipboard)}
            </Grid>
          </Grid>
        </TabContext>
      </Grid>
    </Grid>
  );
}
