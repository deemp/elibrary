import { Book } from "../models/book";
import "../App.css";
import { Autocomplete, Grid, TextField } from "@mui/material";
import { BookTable } from "./Table";
import React, { useCallback, useEffect, useState } from "react";
import * as appbar from '../models/appbar'

export interface GETResponse {
  bisac: Map<string, string[]>
  lc: Map<string, string[]>
  filters: string[]
}

export interface POSTResponse {
  bisac: Map<string, string[]>
  lc: Map<string, string[]>
  books: Book[]
}

type Setter<T> = React.Dispatch<React.SetStateAction<T>>

function SearchField({ isLeft, label, id, options, colWidth, setter }: {
  isLeft: boolean, label: string, id: string, options: string[], colWidth?: number, setter: Setter<string>
}) {
  return (
    <Grid item xs={colWidth}>
      <Autocomplete
        disablePortal
        freeSolo
        id={id}
        options={options}
        renderInput={(params) =>
          <TextField {...params} label={label}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: isLeft ? "6px 0px 0px 6px" : "0px 6px 6px 0px",
              },
            }}
          />}
        onInputChange={(_event, value) => {
          setter(value || "")
        }}
      />
    </Grid>
  )
}

export function Search() {

  const [books, setBooks] = useState<Book[]>([]);

  const [filtersOptions, setFiltersOptions] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>("");

  const [filterInputOptions, setFilterInputOptions] = useState<string[]>([]);
  const [filterInput, setFilterInput] = useState<string>("");

  const [bisac, setBisac] = useState<string>("")
  const [bisacOptions, setBisacOptions] = useState<string[]>([]);

  const [lc, setLc] = useState<string>("")
  const [lcOptions, setLcOptions] = useState<string[]>([]);

  const url = `${import.meta.env.VITE_API_PREFIX}/search`;

  const setBisacLcOptions = useCallback((r: { bisac: Map<string, string[]>, lc: Map<string, string[]> }) => {
    if (bisac != "" && lc == "") {
      setBisacOptions(Array.from(r.bisac.keys()));
      setLcOptions(r.bisac.get(bisac) || [])
    }
    else if (lc != "" && bisac == "") {
      setBisacOptions(r.lc.get(lc) || [])
      setLcOptions(Array.from(r.lc.keys()));
    }
    else {
      setBisacOptions(Array.from(r.bisac.keys()))
      setLcOptions(Array.from(r.lc.keys()))
    }
  }, [bisac, lc, setBisacOptions, setLcOptions])

  useEffect(() => {
    fetch(url, {
      method: "GET",
      headers: new Headers({ "content-type": "application/json" }),
    })
      .then((r) => r.json())
      .then((r) => {
        return {
          filters: r.filters as string[],
          lc: new Map(Object.entries(r.lc)) as Map<string, string[]>,
          bisac: new Map(Object.entries(r.bisac)) as Map<string, string[]>
        }
      })
      .then((r: GETResponse) => {
        setFiltersOptions(r.filters);
        setBisacLcOptions({ bisac: r.bisac, lc: r.lc })
      });
  }, [url, setFiltersOptions, bisac, lc, setBisacOptions, setLcOptions, setBisacLcOptions]);

  const search = useCallback(() => {
    fetch(url, {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({ filter, filter_input: filterInput, lc, bisac }),
    })
      .then((r) => r.json())
      .then((r) => {
        return {
          books: r.books,
          lc: new Map(Object.entries(r.lc)) as Map<string, string[]>,
          bisac: new Map(Object.entries(r.bisac)) as Map<string, string[]>
        }
      })
      .then((r: POSTResponse) => {
        setBooks(r.books);
        setBisacLcOptions({ bisac: r.bisac, lc: r.lc })
        setFilterInputOptions(r.books.map(book => {
          if (filter in book) {
            return `${book[filter as keyof typeof book]}`
          } else {
            return ""
          }
        }))
      });
  }, [url, setBooks, lc, bisac, filterInput, filter, setBisacLcOptions])

  useEffect(() => {
    search()
  }, [url, setFiltersOptions, setBooks, lc, bisac, filterInput, filter, search]);

  const filtersHeight = 150
  return (
    <>
      <Grid container rowSpacing={1} marginTop={appbar.height} height={'100%'} paddingTop={1}>
        <Grid item xs={12} height={filtersHeight}>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={0}>
                <Grid item xs={6}>
                  <SearchField isLeft={true} label={"bisac"} id={"bisac"} options={bisacOptions} setter={setBisac}></SearchField>
                </Grid>
                <Grid item xs={6}>
                  <SearchField isLeft={false} label={"lc"} id={"lc"} options={lcOptions} setter={setLc}></SearchField>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={0}>
                <Grid item xs={3}>
                  <SearchField isLeft={true} label={"Filter"} id={"filter"} options={filtersOptions} setter={setFilter}></SearchField>
                </Grid>
                <Grid item xs={9}>
                  <SearchField isLeft={false} label={"Filter input"} id={"filter-input"} options={filterInputOptions} setter={setFilterInput}></SearchField>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} height={`calc(100% - ${filtersHeight}px)`}>
          <BookTable rows={books} />
        </Grid>
      </Grid>
    </>
  );
}
