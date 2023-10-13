import { useEffect } from "react";
import { Book } from "../models/book";

interface Props {
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  url: string;
  handleOnClick: (e: React.FormEvent) => void;
}

export const SearchBotton = ({ setBooks, url, handleOnClick }: Props) => {
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
  }, []);

  return (
    <>
      <button
        className="btn btn-primary"
        type="button"
        onClick={(e) => handleOnClick(e)}
      >
        Search
      </button>
    </>
  );
};
