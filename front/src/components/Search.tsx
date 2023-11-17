import { Book, bookPretty, bookPrettyInverse } from "../models/book";
import "../App.css";
import { Autocomplete, Grid, TextField } from "@mui/material";
import { BookTable } from "./Table";
import React, { useCallback, useEffect, useState } from "react";
import * as appbar from './AppBar'
import { Map, List } from 'immutable'
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

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


function SearchField({ isLeft, label, options, xs, sm, setter }: {
  isLeft?: boolean, label: string, options: Strings, xs?: number, sm?: number, setter: Setter<string>
}) {
  return (
    <Grid item xs={xs} sm={sm}>
      <Autocomplete
        disablePortal
        options={Array.from(options)}
        renderInput={(params) =>
          <TextField {...params} label={label}
            sx={isLeft !== undefined ? {
              "& .MuiOutlinedInput-root": {
                borderRadius: isLeft ? "6px 0px 0px 6px" : "0px 6px 6px 0px",
              },
            } : {}}
            size="small"
          />}
        renderOption={(props, option, { inputValue }) => {
          const matches = match(option, inputValue, { insideWords: true });
          const parts = parse(option, matches);

          return (
            <li {...props}>
              <div>
                {parts.map((part, index) => (
                  <span
                    key={index}
                    style={{
                      fontWeight: part.highlight ? 700 : 400,
                    }}
                  >
                    {part.text}
                  </span>
                ))}
              </div>
            </li>
          );
        }}
        freeSolo
        onInputChange={(_event, value) => {
          setter(value || "")
        }}
      />
    </Grid>
  )
}

interface RowFilter {
  filter: string
  filterInput: string
}

type Strings = List<string>
type MapStrings = Map<string, Strings>

export function Search() {
  const [filterCounter, setFilterCounter] = useState<number>(1)

  const [books, setBooks] = useState<List<Book>>(List([]));

  const [filterOptions, setFilterOptions] = useState<Strings>(List([]));

  const maxFilterCounter = 5
  const minFilterCounter = 1

  const emptyRowFilter = { filter: "", filterInput: "" }

  // filter and filter input
  const [rowFilter, setRowFilter] = useState<List<RowFilter>>(List(Array.from({ length: maxFilterCounter }, () => emptyRowFilter)));

  const [rowFilterInputOptions, setRowFilterInputOptions] = useState<List<Strings>>(List([]));

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
      });
    // run once
  }, []);

  const search = useCallback(() => {
    fetch(url, {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({
        filter_rows: rowFilter
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
        const f = rowFilter.map(row => {
          const filterInputOptions = r.books.map(book => {
            if (row.filter in book) {
              return `${book[row.filter as keyof typeof book]}`
            } else {
              return ""
            }
          })
            .filter(x => x !== "")
          return List([... new Set(filterInputOptions)])
        })
        setRowFilterInputOptions(f)
      })
  }, [url, lc, bisac, setBisacLcOptions, rowFilter])

  useEffect(() => {
    search()
  }, [search]);

  const rowHeight = 56
  const filtersHeight = (cnt: number) => cnt * rowHeight
  const filtersCountOptions = List(Array.from({ length: maxFilterCounter }, (_, idx) => (idx + 1).toString()))
  return (
    <>
      <Grid container rowSpacing={2} marginTop={appbar.height} height={'100%'}>
        <Grid item xs={12} >
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={10}>
                  <Grid container spacing={0}>
                    <SearchField xs={6} isLeft={true} label={bookPretty.get('bisac') || ''} options={bisacOptions} setter={setBisac} />
                    <SearchField xs={6} isLeft={false} label={bookPretty.get('lc') || ''} options={lcOptions} setter={setLc} />
                  </Grid>
                </Grid>
                <SearchField xs={12} sm={2} label={'Filters'} options={filtersCountOptions} setter={value => {
                  const num = Number.parseFloat(value as string)
                  const filterCounterNew = Math.min(maxFilterCounter, Math.max(minFilterCounter, Number.isNaN(num) ? 0 : num))
                  setFilterCounter(filterCounterNew)
                  setRowFilter(rowFilter.map((v, idx) => (idx >= filterCounterNew ? emptyRowFilter : v)))
                }
                } />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container rowSpacing={1}>
                {rowFilter.slice(0, filterCounter).map((_i, idx) => {
                  return (
                    <Grid item xs={12} key={idx}>
                      <Grid container spacing={0}>
                        <Grid item width={'150px'}>
                          <SearchField isLeft={true} label={"Filter"} options={filterOptions} setter={x => {
                            const f = rowFilter.update(idx, v => {
                              if (v) {
                                return { ...v, filter: bookPrettyInverse.get(x as string) || '', }
                              }
                            })
                            setRowFilter(f)
                          }} />
                        </Grid>
                        <Grid item xs>
                          <SearchField isLeft={false} label={"Filter input"} options={rowFilterInputOptions.get(idx) || List([])} setter={x => {
                            const f = rowFilter.update(idx, v => {
                              if (v) {
                                return { ...v, filterInput: x as string }
                              }
                            })
                            setRowFilter(f)
                          }} />
                        </Grid>
                      </Grid>
                    </Grid>
                  )
                })}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {((height = (cnt: number) => `calc(100% - ${filtersHeight(filterCounter + cnt)}px)`) =>
          <Grid item xs={12} height={{ xs: height(2), sm: height(1) }}>
            <BookTable books={Array.from(books)} />
          </Grid>)()}
      </Grid >
    </>
  );
} 
