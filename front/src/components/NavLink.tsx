import { Button } from "@mui/material"
import { Link } from "react-router-dom"

export function NavLink({ text, id, to }: { text: string, id: string, to: string }) {
    return (
        <Button sx={{
            "a": {
                "font-weight": 'bold',
                "font-size": '15px',
                "color": "#ffffff",
                "text-decoration": "inherit"
            },
            padding: "20px"
        }}>
            <Link id={id} to={to}>
                {text}
            </Link>
        </Button>
    )
}