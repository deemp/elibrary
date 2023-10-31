# https://stackoverflow.com/a/67930222

from contextlib import closing
import sqlite3
import pandas as pd
from pathlib import Path

from sqlmodel import Session

from .models import Book, BookTmp
from .db import create_db_and_tables, engine
from .. import env


def run(
    xlsx=env.XLSX_PATH,
    sheet_name=env.SHEET,
    sql_dump_path=env.SQL_DUMP_PATH,
    db_path=env.DB_PATH,
):
    create_db_and_tables()

    Path(db_path).parent.mkdir(exist_ok=True, parents=True)

    df_xlsx = pd.read_excel(xlsx, sheet_name)

    book_tmp = BookTmp.__tablename__
    
    with Session(engine) as session:
        sql = f"delete from {book_tmp};"
        session.execute(sql)
        for row_dict in df_xlsx.to_dict(orient="records"):
            session.add(BookTmp(**row_dict))
        session.commit()

    book = Book.__tablename__
    book_id = "book_id"

    sql = f"insert into {book} select {book_tmp}.*, 0 from {book_tmp} where {book_tmp}.{book_id} not in (select {book_id} from {book})"
    session.execute(sql)
    sql = f"delete from {book} where {book}.{book_id} not in (select {book_id} from {book_tmp});"
    session.execute(sql)
    sql = f"drop table {book_tmp}"
    session.execute(sql)
    session.commit()
    
    with closing(sqlite3.connect(db_path)) as conn:
        # save book data from that database into a sql file
        with open(sql_dump_path, "w") as f:
            for line in conn.iterdump():
                f.write(f"{line}\n")
