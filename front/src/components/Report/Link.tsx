import { AppBarButton } from "../AppBar";
export const reportLink = (onClick?: () => void) =>
  AppBarButton({
    text: "report",
    to: "/report",
    id: "report",
    onClick
  });
