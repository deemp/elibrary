import { Link } from "react-router-dom";
import { Book } from "../models/book";

interface RowData {
  content: Book;
  key: number;
}

export const TableRow = ({ content, key }: RowData) => {
  return (
    <tr key={key}>
      <td>
        <Link to={`book/${content.book_id}/read`}>Open</Link>
      </td>
      <td key={key}>{content.book_id}</td>
      <td key={key}>{content.title}</td>
      <td key={key}>{content.year}</td>
      <td key={key}>{content.authors}</td>
      <td key={key}>{content.publisher}</td>
      <td key={key}>{content.isbn}</td>
      <td key={key}>{content.format}</td>
    </tr>
  );
};
