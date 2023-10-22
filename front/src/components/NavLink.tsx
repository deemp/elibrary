import { Button } from "@mui/material"
import { Link } from "react-router-dom"

export function NavLink({ text, id, to }: { text: string, id: string, to: string }) {
    return (
        <Link id={id} to={to}>
            <Button sx={{
                "color": "#ffffff",
                padding: "20px",
                fontWeight: 'bold'
            }}>
                {text}
            </Button>
        </Link>
    )
}