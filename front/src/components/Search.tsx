import { Book, bookPretty, bookPrettyInverse } from "../models/book";
import "../App.css";
import { Autocomplete, Grid, TextField } from "@mui/material";
import { BookTable } from "./Table";
import React, { useCallback, useEffect, useState } from "react";
import * as appbar from '../models/appbar'
// import Immutable from 'immutable'
import { Map, List } from 'immutable'

export interface GETResponse {
  bisac: MapStrings
  lc: MapStrings
  filters: Strings
}

export interface POSTResponse {
  bisac: MapStrings
  lc: MapStrings
  books: List<Book>
}

type Setter<T> = React.Dispatch<React.SetStateAction<T>>

function SearchField({ isLeft, label, options, colWidth, setter }: {
  isLeft: boolean, label: string, options: Strings, colWidth?: number, setter: Setter<string>
}) {
  return (
    <Grid item xs={colWidth}>
      <Autocomplete
        disablePortal
        options={Array.from(options)}
        renderInput={(params) =>
          <TextField {...params} label={label}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: isLeft ? "6px 0px 0px 6px" : "0px 6px 6px 0px",
              },
            }}
            size="small"
          />}
        onInputChange={(_event, value) => {
          setter(value || "")
        }}
      />
    </Grid>
  )
}

interface FilterRow {
  filter: string
  filterInput: string
  id: number
}

type Strings = List<string>
type MapStrings = Map<string, Strings>

export function Search({ filterCounter, setFilterCounter }: { filterCounter: number, setFilterCounter: React.Dispatch<React.SetStateAction<number>> }) {

  const [books, setBooks] = useState<List<Book>>(List([]));

  const [filterOptions, setFilterOptions] = useState<Strings>(List([]));

  // filter and filter input
  const [filterRow, setFilterRow] = useState<List<FilterRow>>(List([]));
  const [filterInputOptionsRows, setFilterInputOptionsRow] = useState<List<Strings>>(List([]));

  const [bisac, setBisac] = useState<string>("")
  const [bisacOptions, setBisacOptions] = useState<Strings>(List([]));

  const [lc, setLc] = useState<string>("")
  const [lcOptions, setLcOptions] = useState<Strings>(List([]));


  const url = `${import.meta.env.VITE_API_PREFIX}/search`;

  const setBisacLcOptions = useCallback((r: { bisac: MapStrings, lc: MapStrings }) => {
    if (bisac != "" && lc == "") {
      setBisacOptions(List(r.bisac.keys()));
      setLcOptions(List(r.bisac.get(bisac) || []))
    }
    else if (lc != "" && bisac == "") {
      setBisacOptions(List(r.lc.get(lc) || []))
      setLcOptions(List(r.lc.keys()));
    }
    else {
      setBisacOptions(List(r.bisac.keys()))
      setLcOptions(List(r.lc.keys()))
    }
  }, [bisac, lc])

  useEffect(() => {
    fetch(url, {
      method: "GET",
      headers: new Headers({ "content-type": "application/json" }),
    })
      .then((r) => r.json())
      .then((r) => {
        return {
          filters: r.filters as Strings,
          lc: Map(r.lc) as MapStrings,
          bisac: Map(r.bisac) as MapStrings
        }
      })
      .then((r: GETResponse) => {
        setFilterOptions(r.filters.map(filter => bookPretty.get(filter) || ''))
        setBisacLcOptions({ bisac: r.bisac, lc: r.lc })
        setFilterRow(List([
          {
            filter: "",
            filterInput: "",
            id: 0
          },
          {
            filter: "",
            filterInput: "",
            id: 1
          }
        ]))
      });
  // run once
  }, []);

  const search = useCallback(() => {
    fetch(url, {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({
        filter_rows: filterRow
          .filter(x => x.filterInput !== '')
          .map(x => {
            return {
              filter: x.filter,
              filter_input: x.filterInput
            }
          }), lc, bisac
      }),
    })
      .then((r) => r.json())
      .then((r) => {
        return {
          books: r.books,
          lc: Map(r.lc) as MapStrings,
          bisac: Map(r.bisac) as MapStrings
        }
      })
      .then((r: POSTResponse) => {
        setBooks(r.books);
        setBisacLcOptions({ bisac: r.bisac, lc: r.lc })
        const f = filterRow.map(row => {
          const filterInputOptions = r.books.map(book => {
            if (row.filter in book) {
              return `${book[row.filter as keyof typeof book]}`
            } else {
              return ""
            }
          })
            .filter(x => x !== "")
          return filterInputOptions
        })
        setFilterInputOptionsRow(f)
        console.log(filterRow.get(0))
      })
  }, [url, lc, bisac, setBisacLcOptions, filterRow])

  useEffect(() => {
    search()
  }, [search]);

  const filtersHeight = 160
  return (
    <>
      <Grid container rowSpacing={0} marginTop={appbar.height} height={'100%'} paddingTop={1}>
        <Grid item xs={12} height={filtersHeight} paddingTop={1}>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={0}>
                <Grid item xs={6}>
                  <SearchField isLeft={true} label={bookPretty.get('bisac') || ''} options={bisacOptions} setter={setBisac}></SearchField>
                </Grid>
                <Grid item xs={6}>
                  <SearchField isLeft={false} label={bookPretty.get('lc') || ''} options={lcOptions} setter={setLc}></SearchField>
                </Grid>
              </Grid>
            </Grid>
            {filterRow.map((i, idx) => {
              return (
                <Grid item xs={12} key={i.id}>
                  <Grid container spacing={0}>
                    <Grid item xs={4}>
                      <SearchField isLeft={true} label={"Filter"} options={filterOptions} setter={x => {
                        const f = filterRow.update(idx, v => {
                          if (v) {
                            return { ...v, filter: bookPrettyInverse.get(x as string) || '', }
                          }
                        })
                        setFilterRow(f)
                      }}></SearchField>
                    </Grid>
                    <Grid item xs={8}>
                      <SearchField isLeft={false} label={"Filter input"} options={filterInputOptionsRows.get(idx) || List([])} setter={x => {
                        const f = filterRow.update(idx, v => {
                          if (v) {
                            return { ...v, filterInput: x as string }
                          }
                        })
                        setFilterRow(f)
                      }}></SearchField>
                    </Grid>
                  </Grid>
                </Grid>
              )
            })}
          </Grid>
        </Grid>
        <Grid item xs={12} height={`calc(100% - ${filtersHeight}px)`} paddingTop={2}>
          <BookTable rows={books} />
        </Grid>
      </Grid>
    </>
  );
}
