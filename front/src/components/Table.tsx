import { Book } from "../models/book";
import { TableRow } from "./TableRow";

interface TableData {
  heading: string[];
  body: Book[];
}

export const Table = ({ heading, body }: TableData) => {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          {heading.map((head, headID) => (
            <th key={headID}>{head}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {body.map((rowContent, rowID) => (
          <TableRow content={rowContent} key={rowID} />
        ))}
      </tbody>
    </table>
  );
};
