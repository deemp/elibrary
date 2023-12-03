import { Box, ListItem, Typography } from "@mui/material";
import { mkBulletList, mkContent, sectionList } from "../Help";
import { Link } from "react-router-dom";
import { color } from "../../models/constants";

export const Content = mkContent([
  [
    sectionList("Limitations and mitigations"),
    <ListItem>
      <Box>
        {mkBulletList([
          <Typography component={"p"}>
            Due to an agreement with EBSCO, we don't provide easily downloadable
            PDFs.
          </Typography>,
          <Typography component={"p"}>
            Hence, this PDF viewer renders pages only as images and doesn't
            highlight search results.
          </Typography>,
          <Typography component={"p"}>
            You can search PDFs on{" "}
            {
              <Link to={"https://libstc.cc/#/"} style={{ color }}>
                STC
              </Link>
            }{" "}
            (
            {
              <Link
                to={"https://ipfs.io/ipns/standard-template-construct.org/#/)"}
                style={{ color }}
              >
                mirror
              </Link>
            }
            ),{" "}
            {
              <Link to={"http://libgen.is/"} style={{ color }}>
                Library Genesis
              </Link>
            }
            , or{" "}
            {
              <Link to={"https://z-lib.is/"} style={{ color }}>
                Z-Library
              </Link>
            }
            .
          </Typography>,
          <Typography component={"p"}>
            The book viewer supports major browsers and their versions (
            <Link
              to={
                "https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions#legacy-build"
              }
              style={{ color }}
            >
              link
            </Link>
            ).
          </Typography>,
          <Typography component={"p"}>
            Please, update your browser in case of problems.
          </Typography>,
        ])}
      </Box>
    </ListItem>,
  ],
]);
