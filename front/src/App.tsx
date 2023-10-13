import { Book } from "./models/book";
import "./App.css";
import { DropdownButton, DropdownItem, Form } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import { Autocomplete, TextField } from "@mui/material";
import { Table } from "./components/Table";

export function Search({
  filters,
  books,
}: {
  filters: string[];
  books: Book[];
}) {
  const heading = [
    "Id",
    "Title",
    "Year",
    "Authors",
    "Publisher",
    "ISBN",
    "Format",
  ];
  return (
    <>
      <div className="container">
        <div className="mt-5">
          <div className="md-col-5">
            <InputGroup className="mb-3">
              <DropdownButton
                variant="outline-secondary"
                title="Select a filter"
                id="input-group-dropdown"
              >
                {filters.map((filter) => (
                  <DropdownItem>{filter}</DropdownItem>
                ))}
              </DropdownButton>
              <Form.Control placeholder="Type something" />
            </InputGroup>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={["Python", "C++", "Pascal", "Java", "C#"]}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="bisac" />}
              className="mb-3"
            />
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={["OOP", "FP", "PP", "TDD"]}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="lc" />}
            />
          </div>
        </div>

        <Table heading={heading} body={books} />
      </div>
    </>
  );
}
