import { AppBarButton } from "../AppBar";
export const readLink = (id: number) =>
  AppBarButton({
    text: "read",
    to: `/book/${id}/read`,
    id: "read",
  });
