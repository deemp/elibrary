import { useEffect } from "react";
import { Book } from "../models/book";
import { Button } from "@mui/material";

interface Props {
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  url: string;
  handleOnClick: (e: React.FormEvent) => void;
}

export const SearchButton = ({ setBooks, url, handleOnClick }: Props) => {
  useEffect(() => {
    fetch(url, {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({ filter: "", filter_input: "" }),
    })
      .then((r) => r.json())
      .then((r: Book[]) => {
        setBooks([...r]);
      });
  }, [setBooks, url]);

  return (
    <>
      <Button variant="outlined" onClick={(e) => handleOnClick(e)}>Search</Button>
    </>
  );
};
