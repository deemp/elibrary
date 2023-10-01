import sqlite3
import json
from contextlib import closing
import io


def with_db(db, func):
    with closing(sqlite3.connect(db)) as conn:
        with closing(conn.cursor()) as cursor:
            return func(conn, cursor)


def read_script():
    with open("setup.sql") as f:
        sql = f.read()
    return sql


def setup_db(conn, cursor):
    cursor.executescript(read_script())
    conn.commit()
    print("database set up successfully")


def test_get_all_books(conn, cursor):
    cursor.execute("select * from books")
    books = cursor.fetchall()
    return json.dumps(books)


def reset_db(conn, cursor):
    cursor.execute("drop table if exists books")
    print("removed the table `books` if it exists")


def reset_database():
    conn = sqlite3.connect("test.db")

    db_cursor = conn.cursor()
    db_cursor.execute("drop table if exists books")

    conn.close()


if __name__ == "__main__":
    db = "test.db"
    def run(f): with_db(db, f)
    
    run(setup_db)
