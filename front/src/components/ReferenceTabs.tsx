import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { SyntheticEvent, useState } from "react";
import { Button, Stack } from "@mui/material";
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

export function ReferenceTabs({
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
    <Stack direction={{ xs: "column", sm: "row" }}>
      <Box sx={{ width: "100%", padding: "1%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="References">
            <Tab label="BibTex" {...a11yProps(0)} />
            <Tab label="Text Reference" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          {reference === undefined ? bibTexReference : reference}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          {reference}
        </CustomTabPanel>
      </Box>
      <Button
        sx={{ margin: { xs: "5%", sm: "2%" } }}
        size="medium"
        variant="outlined"
        onClick={copyToClipboard}
      >
        Copy Reference
      </Button>
    </Stack>
  );
}
