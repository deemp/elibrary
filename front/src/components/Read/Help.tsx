import { Box, ListItem } from "@mui/material";
import { mkBulletList, mkContent, sectionList } from "../Help";
import { Link } from "react-router-dom";
import { color } from "../../models/constants";
import { P } from "../P";

export const Content = mkContent([
  [
    sectionList("Limitations and mitigations"),
    <ListItem>
      <Box>
        {mkBulletList([
          <P>
            Due to an agreement with EBSCO, we don't provide easily downloadable
            PDFs.
          </P>,
          <P>
            Hence, this PDF viewer renders pages only as images and doesn't
            highlight search results.
          </P>,
          <P>
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
          </P>,
          <P>
            The book viewer supports major browsers and some of their versions (
            <Link
              to={
                "https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions#legacy-build"
              }
              style={{ color }}
            >
              link
            </Link>
            ).
          </P>,
          <P>Please, update your browser in case of problems.</P>,
        ])}
      </Box>
    </ListItem>,
  ],
]);
