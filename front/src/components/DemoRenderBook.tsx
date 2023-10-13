import { Book } from "../models/book";
import { Table } from "./Table";

export const DemoRenderBook = () => {
  const heading = [
    "Id",
    "Title",
    "Year",
    "Authors",
    "Publisher",
    "ISBN",
    "Format",
  ];

  const body: Book[] = [
    {
      book_id: 1,
      title: "First Book",
      year: 2003,
      authors: "John Cena",
      publisher: "Invisible Inc.",
      isbn: 1299874,
      format: "pdf",
    },
    {
      book_id: 2,
      title: "Second Book",
      year: 2003,
      authors: "The Rock",
      publisher: "Hard Rocks Inc.",
      isbn: 1299874,
      format: "pdf",
    },
    {
      book_id: 3,
      title: "Third Book",
      year: 2003,
      authors: "John Cena",
      publisher: "Invisible Inc.",
      isbn: 1299874,
      format: "pdf",
    },
    {
      book_id: 4,
      title: "Fourth Book",
      year: 2003,
      authors: "The Rock",
      publisher: "Hard Rocks Inc.",
      isbn: 1299874,
      format: "pdf",
    },
  ];
  return (
    <div>
      <Table heading={heading} body={body} />,
    </div>
  );
};
