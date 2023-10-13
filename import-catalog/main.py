# https://stackoverflow.com/a/67930222

import sqlite3
import pandas as pd
from contextlib import closing
import argparse
from dotenv import dotenv_values
import tempfile


class obj(object):
    def __init__(self, dict_):
        self.__dict__.update(dict_)


config = obj(dotenv_values(".env"))


def run():
    parser = argparse.ArgumentParser(description="Convert xlsx to sql")
    parser.add_argument(
        "--xlsx",
        type=str,
        help="Path to input xlsx",
        default="books.xlsx",
        required=False,
    )
    parser.add_argument(
        "--sheet",
        type=str,
        help="Sheet within xlsx",
        default="Sheet1",
        required=False,
    )
    parser.add_argument(
        "--sql",
        type=str,
        help="Path to output SQL",
        default="books.sql",
        required=False,
    )
    parser.add_argument(
        "--table",
        type=str,
        help="Name of the table for data from xlsx",
        default="book",
        required=False,
    )
    args = parser.parse_args()

    db_temp = tempfile.mktemp(prefix="books", suffix="db")
    with closing(sqlite3.connect(db_temp)) as conn:
        # import data from xlsx into a database
        wb = pd.read_excel(args.xlsx, sheet_name=args.sheet)
        wb.to_sql(name=args.table, con=conn, if_exists="replace", index=True)
        conn.commit()
        # save book data from that database into a sql
        with open(args.sql, "w") as f:
            for line in conn.iterdump():
                f.write(f"{line}\n")

    # import data from xlsx into a database
    with closing(sqlite3.connect(f"instance/{config.DB_NAME}")) as conn:
        wb = pd.read_excel(args.xlsx, sheet_name=args.sheet)
        conn.execute('drop table if exists book;')
        wb.to_sql(name=args.table, con=conn, index=True)
        conn.commit()