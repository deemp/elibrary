import { Box, Button } from "@mui/material"
import { fontSize, linkStyle } from "../models/elements"
import { Container, Grid } from "@mui/material";

export const height = '60px'
export const padding = '20px'

const sxBase = {
  color: "#ffffff",
  paddingX: '3px',
  fontSize,
  height: { xs: '25px', sm: '40px' }
}

export function AppBarButton({ text, onClick }: { text: string, onClick?: React.MouseEventHandler<HTMLButtonElement> }) {
  const sx = {
    ...sxBase,
    '&:hover': {
      backgroundColor: '#4f9ae3'
    }
  }
  return <Button onClick={onClick} sx={sx}>{text}</Button>
}

import { Link } from "react-router-dom";

export function AppBarLink({ text, id, to, }: { text: string; id: string; to: string; }) {
  return <Link id={id} style={linkStyle} to={to}><AppBarButton text={text} /></Link>
}


export function AppBarElement({ text }: { text: string }) {
  return <Box sx={{ ...sxBase, fontWeight: "bold", height: 'auto', alignItems: 'center', lineHeight: '1.2rem' }}>{text}</Box>
}

const Ebsco = <AppBarElement text={'EBSCO EBOOK ARCHIVE'}></AppBarElement>

export function AppBar(
  { faqDrawer, leftChildren }:
    { faqDrawer?: JSX.Element, leftChildren: JSX.Element[] }) {
  return <>
    <Container maxWidth={"xl"}>
      <Grid container>
        <Grid
          item
          xs={7}
          sm={6}
          display={"flex"}
          alignItems={"center"}
        >
          <Grid
            container
            columnSpacing={1}
            children={leftChildren} />
        </Grid>
        <Grid
          item
          xs={5}
          sm={6}
          display={"flex"}
          justifyContent={"end"}
          alignItems={"center"}
        >
          {Ebsco}
        </Grid>
      </Grid>
    </Container>
    {faqDrawer}
  </>
}