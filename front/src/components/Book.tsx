import { Box } from "@mui/material";
import * as constants from "../models/constants";

export function BookReader({ bookId }: { bookId: number }) {
  const prefix = import.meta.env.VITE_API_PREFIX;
  return (
    <Box
      height={constants.contentHeightAdaptive}
      marginTop={constants.heightAdaptive}
    >
      <iframe
        id="reader"
        src={`${prefix}/static/pdfjs/web/viewer.html?file=${prefix}/book/${bookId}/file`}
        style={{ height: "100%" }}
      />
    </Box>
  );
}
