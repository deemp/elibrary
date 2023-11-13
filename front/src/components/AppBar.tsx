import { Box, Button } from "@mui/material"
import { fontSize } from "../models/elements"

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
  return <Link id={id} style={{ textDecoration: 'none' }} to={to}><AppBarButton text={text}></AppBarButton></Link>
}


export function AppBarElement({ text }: { text: string }) {
  return <Box sx={{ ...sxBase, fontWeight: "bold", height: 'auto', alignItems: 'center' }}>{text}</Box>
}

export const Ebsco = <AppBarElement text={'EBSCO EBOOK ARCHIVE'}></AppBarElement>
