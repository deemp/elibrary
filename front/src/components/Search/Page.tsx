import {
  BookSearch as Book,
  bookPretty,
  bookPrettyInverse,
} from "../../models/book";
import "../../App.css";
import { Autocomplete, Box, Container, Grid, TextField } from "@mui/material";
import { BookTable } from "../Table";
import React, { useCallback, useEffect, useState } from "react";
import { Map, List } from "immutable";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import { CellContext, ColumnDef, ColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import * as constants from "../../models/constants";
import { AppBarWithChildren } from "../AppBar";
import { Base } from "../Base";
import { reportLink } from "../Report/Link";

export interface GETResponse {
  bisac: MapStrings;
  lc: MapStrings;
  filters: Strings;
  searchResultsMax: number;
}

export interface POSTResponse {
  bisac: MapStrings;
  lc: MapStrings;
  books: List<Book>;
}

type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

function SearchField({
  isLeft,
  label,
  value,
  options,
  xs,
  sm,
  setter,
}: {
  isLeft?: boolean;
  label: string;
  value: string;
  options: Strings;
  xs?: number;
  sm?: number;
  setter: Setter<string>;
}) {
  return (
    <Grid item xs={xs} sm={sm}>
      <Autocomplete
        disablePortal
        options={Array.from(options)}
        value={value}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            sx={
              isLeft !== undefined
                ? {
                    "& .MuiOutlinedInput-root": {
                      borderRadius: isLeft
                        ? "6px 0px 0px 6px"
                        : "0px 6px 6px 0px",
                    },
                  }
                : {}
            }
            size="small"
          />
        )}
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
          setter(value);
        }}
      />
    </Grid>
  );
}

export interface RowFilter {
  filter: string;
  filterInput: string;
}

export type Strings = List<string>;
export type MapStrings = Map<string, Strings>;

export interface Props {
  emptyRowFilter: RowFilter;
  maxFilterCounter: number;
  minFilterCounter: number;
  filterCounter: "" | number;
  setFilterCounter: Setter<"" | number>;
  rowFilter: List<RowFilter>;
  setRowFilter: Setter<List<RowFilter>>;
  bisac: string;
  setBisac: Setter<string>;
  lc: string;
  setLc: Setter<string>;
  AppBar: AppBarWithChildren;
}

function RowLink({ text, to }: { text: string; to: string }) {
  return (
    <Link to={to} style={{ color: constants.color }}>
      {text}
    </Link>
  );
}

// @ts-ignore
const columnPretty = new Map([
  ...bookPretty,
  // @ts-ignore
  ...new Map([
    ["read", "Read"],
    ["info", "Info"],
  ]),
]);

const columns = (columnHelper: ColumnHelper<Book>) =>
  [
    {
      id: "read",
      size: 60,
      f: (props: CellContext<Book, unknown>) => (
        <RowLink
          to={`/book/${props.row.original.book_id}/read`}
          text={"Read"}
        />
      ),
    },
    {
      id: "info",
      size: 60,
      f: (props: CellContext<Book, unknown>) => (
        <RowLink to={`/book/${props.row.original.book_id}`} text={"Info"} />
      ),
    },
  ]
    .map(({ id, f, size }) =>
      columnHelper.display({
        id,
        size,
        cell: (props) => f(props),
        header: () => columnPretty.get(id),
      })
    )
    .concat(
      [
        {
          id: "title",
          size: 300,
        },
        {
          id: "authors",
          size: 200,
        },
        {
          id: "publisher",
          size: 200,
        },
        {
          id: "year",
          size: 60,
        },
        {
          id: "isbn",
          size: 130,
        },
        {
          id: "bisac",
          size: 130,
        },
        {
          id: "lc",
          size: 130,
        },
      ].map(({ id, size }) =>
        columnHelper.accessor(id as keyof Book, {
          header: () => columnPretty.get(id),
          size,
          cell: (props) => props.getValue(),
        })
      ) as ColumnDef<Book, unknown>[]
    );

const url = `${import.meta.env.VITE_API_PREFIX}/search`;

export function SearchPage({
  emptyRowFilter,
  maxFilterCounter,
  minFilterCounter,
  filterCounter,
  setFilterCounter,
  rowFilter,
  setRowFilter,
  bisac,
  setBisac,
  lc,
  setLc,
  AppBar,
}: Props) {
  const [books, setBooks] = useState<List<Book>>(List([]));
  const [booksLoaded, setBooksLoaded] = useState<boolean>(true);
  const [filterOptions, setFilterOptions] = useState<Strings>(List([]));

  // filter and filter input
  const [rowFilterInputOptions, setRowFilterInputOptions] = useState<
    List<Strings>
  >(List([]));
  const [bisacOptions, setBisacOptions] = useState<Strings>(List([]));
  const [lcOptions, setLcOptions] = useState<Strings>(List([]));

  const setBisacLcOptions = useCallback(
    (r: { bisac: MapStrings; lc: MapStrings }) => {
      if (bisac != "" && lc == "") {
        setBisacOptions(List(r.bisac.keys()));
        setLcOptions(List(r.bisac.get(bisac) || []));
      } else if (lc != "" && bisac == "") {
        setBisacOptions(List(r.lc.get(lc) || []));
        setLcOptions(List(r.lc.keys()));
      } else {
        setBisacOptions(List(r.bisac.keys()));
        setLcOptions(List(r.lc.keys()));
      }
    },
    [bisac, lc]
  );

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
          bisac: Map(r.bisac) as MapStrings,
        };
      })
      .then((r) => {
        setFilterOptions(
          r.filters.map((filter) => bookPretty.get(filter) || "")
        );
        setBisacLcOptions({ bisac: r.bisac, lc: r.lc });
      });
    // run once
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    // https://mui.com/material-ui/react-progress/#delaying-appearance
    const timer = setTimeout(() => {
      setBooksLoaded(false);
    }, 1000);

    const fetchData = async () => {
      try {
        await fetch(url, {
          method: "POST",
          headers: new Headers({ "content-type": "application/json" }),
          body: JSON.stringify({
            filter_rows: rowFilter
              .filter((x) => x.filterInput !== "")
              .map((x) => {
                return {
                  filter: x.filter,
                  filter_input: x.filterInput,
                };
              }),
            lc,
            bisac,
          }),
          signal: abortController.signal,
        })
          .then((r) => r.json())
          .then((r) => {
            return {
              books: r.books,
              lc: Map(r.lc) as MapStrings,
              bisac: Map(r.bisac) as MapStrings,
            };
          })
          .then((r: POSTResponse) => {
            setBisacLcOptions({ bisac: r.bisac, lc: r.lc });
            const f = rowFilter.map((row) => {
              const filterInputOptions = r.books
                .map((book) => {
                  if (row.filter in book) {
                    return `${book[row.filter as keyof typeof book]}`;
                  } else {
                    return "";
                  }
                })
                .filter((x) => x !== "");
              return List([...new Set(filterInputOptions)]);
            });
            setRowFilterInputOptions(f);
            setBooks(r.books);
          });
      } catch (e) {
        if (!abortController.signal.aborted) {
          console.log((e as { message: string }).message);
        }
      } finally {
        // clear timeout before setting to true
        // so that the code in the timeout doesn't overwrite this value
        clearTimeout(timer);
        setBooksLoaded(true);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [
    lc,
    bisac,
    setBisacLcOptions,
    setBooks,
    setBooksLoaded,
    rowFilter,
    setRowFilterInputOptions,
  ]);

  const rowHeight = 56;
  const filtersHeight = (cnt: number) => cnt * rowHeight;
  const filtersCountOptions = List(
    Array.from({ length: maxFilterCounter }, (_, idx) => (idx + 1).toString())
  );
  return (
    <Base
      title="Search"
      content={
        <Container maxWidth="xl">
          <Box
            width={"100%"}
            height={constants.contentHeightAdaptive}
            sx={{ backgroundColor: "white" }}
            marginTop={constants.heightAdaptive}
          >
            <Grid
              container
              rowSpacing={2}
              marginTop={constants.heightAdaptive}
              height={"100%"}
            >
              <Grid item xs={12}>
                <Grid container rowSpacing={2}>
                  <Grid item xs={12}>
                    <Grid container direction={"row-reverse"} spacing={2}>
                      <Grid item xs={12} sm>
                        <Grid container columnSpacing={2}>
                          <SearchField
                            xs={6}
                            label={bookPretty.get("bisac") || ""}
                            value={bisac}
                            options={bisacOptions}
                            setter={setBisac}
                          />
                          <SearchField
                            xs={6}
                            label={bookPretty.get("lc") || ""}
                            value={lc}
                            options={lcOptions}
                            setter={setLc}
                          />
                        </Grid>
                      </Grid>
                      <Grid item width={{ xs: "100%", sm: "10rem" }}>
                        <SearchField
                          xs={12}
                          label={"Filters count"}
                          value={`${filterCounter}`}
                          options={filtersCountOptions}
                          setter={(value) => {
                            const num = Number.parseInt(value as string);
                            if (Number.isNaN(num)) {
                              const f = rowFilter.map((_v) => emptyRowFilter);
                              setFilterCounter("");
                              setRowFilter(f);
                            } else {
                              const filterCounterNew = Math.min(
                                maxFilterCounter,
                                Math.max(minFilterCounter, num)
                              );
                              setFilterCounter(filterCounterNew);
                              setRowFilter(
                                rowFilter.map((v, idx) =>
                                  idx >= filterCounterNew ? emptyRowFilter : v
                                )
                              );
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container rowSpacing={2}>
                      {(() => {
                        return rowFilter
                          .slice(0, filterCounter === "" ? 1 : filterCounter)
                          .map((filter, idx) => {
                            return (
                              <Grid item xs={12} key={idx}>
                                <Grid container spacing={0}>
                                  <Grid item width={{ xs: "8rem", sm: "9rem" }}>
                                    <SearchField
                                      isLeft={true}
                                      label={"Filter by"}
                                      value={
                                        bookPretty.get(filter.filter) || ""
                                      }
                                      options={filterOptions}
                                      setter={(x) => {
                                        const f = rowFilter.update(idx, (v) => {
                                          if (v) {
                                            return {
                                              ...v,
                                              filter:
                                                bookPrettyInverse.get(
                                                  x as string
                                                ) || "",
                                            };
                                          }
                                        });
                                        setRowFilter(f);
                                      }}
                                    />
                                  </Grid>
                                  <Grid item xs>
                                    <SearchField
                                      isLeft={false}
                                      label={"Using text"}
                                      value={filter.filterInput}
                                      options={
                                        rowFilterInputOptions.get(idx) ||
                                        List([])
                                      }
                                      setter={(x) => {
                                        const f = rowFilter.update(idx, (v) => {
                                          if (v) {
                                            return {
                                              ...v,
                                              filterInput: x as string,
                                            };
                                          }
                                        });
                                        setRowFilter(f);
                                      }}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            );
                          });
                      })()}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {((
                height = (cnt: number) =>
                  `calc(100% - ${filtersHeight(
                    (filterCounter === "" ? 1 : filterCounter) + cnt
                  )}px)`
              ) => (
                <Grid item xs={12} height={{ xs: height(2), sm: height(1) }}>
                  <BookTable
                    books={Array.from(books)}
                    booksLoaded={booksLoaded}
                    columns={columns}
                  />
                </Grid>
              ))()}
            </Grid>
          </Box>
        </Container>
      }
      nav={<AppBar leftChildren={[reportLink()]} />}
    />
  );
}
