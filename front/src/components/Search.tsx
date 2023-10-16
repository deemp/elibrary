import { Book } from "../models/book";
import "../App.css";
import { Autocomplete, Grid, TextField } from "@mui/material";
import { BookTable } from "./Table";
import React, { useState, useEffect } from "react";
import { SearchButton } from "./SearchButton";
import * as appbar from '../models/appbar'

export interface Filter {
  bisac: Map<string, string[]>
  other: string[]
}

export function Search() {

  const [books, setBooks] = useState<Book[]>([]);
  const [filters, setFilters] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");

  const url = `${import.meta.env.VITE_API_PREFIX}/search`;

  useEffect(() => {
    fetch(url, {
      method: "GET",
      headers: new Headers({ "content-type": "application/json" }),
    })
      .then((r) => r.json())
      .then((r: Filter) => {
        setFilters(r.other);
      });
  }, [setFilters]);

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
      <Grid item xs={colWidth}>
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
        />
      </Grid>
    )
  }

  const bisac = ["Python", "C++", "Pascal", "Java", "C#"]
  const lc = ["OOP", "FP", "PP", "TDD"]
  const filtersInputs = ["input1", "input2"]

  return (
    <>
      <Grid container rowSpacing={2} marginTop={appbar.height}>
        <Grid item xs={12}>
          <Grid container spacing={0}>
            <Grid item xs={6}>
              <SearchField isLeft={true} label={"bisac"} id={"bisac"} options={bisac}></SearchField>
            </Grid>
            <Grid item xs={6}>
              <SearchField isLeft={false} label={"lc"} id={"lc"} options={lc}></SearchField>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={0}>
            <Grid item xs={3}>
              <SearchField isLeft={true} label={"Filter"} id={"filter"} options={filters}></SearchField>
            </Grid>
            <Grid item xs={9}>
              <SearchField isLeft={false} label={"Filter input"} id={"filter-input"} options={filtersInputs}></SearchField>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent={'center'}>
            <SearchButton
              setBooks={setBooks}
              url={url}
              handleOnClick={handleSearch}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <BookTable rows={books} />
        </Grid>
      </Grid>
    </>
  );
}
