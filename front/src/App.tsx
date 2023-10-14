import { Book } from "./models/book";
import "./App.css";
import { Col, Row } from "react-bootstrap";
import { Autocomplete, TextField } from "@mui/material";
import { Table } from "./components/Table";
import React, { useState, useEffect } from "react";
import { SearchButton } from "./components/SearchButton";

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
  const [filter, setFilter] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");

  const url = `${import.meta.env.VITE_API_PREFIX}/search`;

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
  }, [url]);

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

  function SearchField({ isLeft, label, id, options, colWidth }: {
    isLeft: boolean, label: string, id: string, options: string[], colWidth?: number
  }) {
    return (
      <Col className={`p${isLeft ? 'e' : 's'}-0 ${colWidth ? `col-${colWidth}` : ""}`}>
        <Autocomplete
          disablePortal
          id={id}
          options={options}
          renderInput={(params) =>
            <TextField {...params} label={label}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: isLeft ? "6px 0px 0px 6px" : "0px 6px 6px 0px",
                },
              }}
            />
          }
          className="mb-3"
        />
      </Col>
    )
  }

  const bisac = ["Python", "C++", "Pascal", "Java", "C#"]
  const lc = ["OOP", "FP", "PP", "TDD"]
  const filtersStrings = filters.map(toString)
  const filtersInputs = ["input1", "input2"]

  return (
    <>
      <Row className="justify-content-center">
        <Col className="col-10">
          <Row className="mt-5">
            <SearchField isLeft={true} label={"bisac"} id={"bisac"} options={bisac}></SearchField>
            <SearchField isLeft={false} label={"lc"} id={"lc"} options={lc}></SearchField>
          </Row>
          <Row>
            <SearchField isLeft={true} label={"Filter"} id={"filter"} options={filtersStrings} colWidth={3}></SearchField>
            <SearchField isLeft={false} label={"Filter input"} id={"filter-input"} options={filtersInputs}></SearchField>
          </Row>
          <Row className="mb-3">
            <Col>
              <SearchButton
                setBooks={setBooks}
                url={url}
                handleOnClick={handleSearch}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Table heading={heading} body={books} />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
