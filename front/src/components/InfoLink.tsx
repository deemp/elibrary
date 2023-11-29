import { AppBarButton } from "./AppBar";
export const infoLink = (id: number) =>
  AppBarButton({
    text: "Info",
    to: `/book/${id}`,
    id: "search",
  });
