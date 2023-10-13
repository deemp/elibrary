import { Book } from "./models/book";
import "./App.css";
import { Form } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import { Autocomplete, TextField } from "@mui/material";
import { Table } from "./components/Table";
import React, { useState, useEffect } from "react";
import { SearchBotton } from "./components/SearchButton";

export interface Filter {
  filter: string;
}

export function Search() {
  const heading = [
    "Action",
    "Id",
    "Title",
    "Year",
    "Authors",
    "Publisher",
    "ISBN",
    "Format",
  ];
  const [books, setBooks] = useState<Book[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [filter, setFilter] = useState<string>();
  const [searchInput, setSearchInput] = useState<string>("");

  const url = "http://127.0.0.1:5000/search";

  useEffect(() => {
    fetch(url, {
      method: "GET",
      headers: new Headers({ "content-type": "application/json" }),
    })
      .then((r) => r.json())
      .then((r: Filter[]) => {
        setFilters([...r]);
      });
  }, [setFilters, url]);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(searchInput);
    console.log(filter);

    fetch(url, {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({ filter, filter_input: searchInput }),
    })
      .then((r) => r.json())
      .then((r: Book[]) => {
        setBooks([...r]);
      });
  };

  return (
    <>
      <div className="container">
        <form method="POST">
          <div className="mt-5">
            <div className="md-col-5">
              <InputGroup className="mb-3 md-col-2">
                <Form.Select
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    e.preventDefault();
                    setFilter(e.target.value);
                  }}
                >
                  <option value="">-- Select a filter --</option>
                  {filters.map((filter) => (
                    <option value={filter.toString()}>
                      {filter.toString()}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control
                  placeholder="Type something"
                  name={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </InputGroup>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={["Python", "C++", "Pascal", "Java", "C#"]}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="bisac" />
                )}
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
          <SearchBotton
            setBooks={setBooks}
            url={url}
            handleOnClick={handleSearch}
          />
        </form>
        <Table heading={heading} body={books} />
      </div>
    </>
  );
}
