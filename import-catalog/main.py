# https://stackoverflow.com/a/67930222

import sqlite3
import pandas as pd
from contextlib import closing
import argparse
import tempfile
from pathlib import Path
from . import env

def run():
    parser = argparse.ArgumentParser(description="Convert xlsx to sql")
    parser.add_argument(
        "--xlsx",
        type=str,
        help="Path to input xlsx",
        default=env.XLSX,
        required=False,
    )
    parser.add_argument(
        "--sheet",
        type=str,
        help="Sheet within xlsx",
        default=env.SHEET,
        required=False,
    )
    parser.add_argument(
        "--sql",
        type=str,
        help="Path to output SQL",
        default=env.SQL,
        required=False,
    )
    parser.add_argument(
        "--table",
        type=str,
        help="Name of the table for data from xlsx",
        default=env.DB_TABLE_BOOK,
        required=False,
    )
    args = parser.parse_args()

    db_temp = tempfile.mktemp(prefix="book", suffix="db")
    with closing(sqlite3.connect(db_temp)) as conn:
        # import data from xlsx into a database
        wb = pd.read_excel(args.xlsx, sheet_name=args.sheet)
        wb.to_sql(name=args.table, con=conn, index=True)
        conn.commit()
        # save book data from that database into a sql file
        with open(args.sql, "w") as f:
            for line in conn.iterdump():
                f.write(f"{line}\n")

    # create a directory for the database if it doesn't exist
    Path(env.DB_PATH).parent.mkdir(exist_ok=True, parents=True)

    # import data from xlsx into a database
    with closing(sqlite3.connect(env.DB_PATH)) as conn:
        wb = pd.read_excel(args.xlsx, sheet_name=args.sheet)
        conn.execute(f"drop table if exists {env.DB_TABLE_BOOK};")
        wb.to_sql(name=args.table, con=conn, index=True)
        conn.commit()
