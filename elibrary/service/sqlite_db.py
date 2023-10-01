import sqlite3
import json


def read_script():
    with open("setup.sql") as f:
        sql = f.read()

    return sql


def setup_db():
    conn = sqlite3.connect("test.db")

    db_cursor = conn.cursor()
    db_cursor.executescript(read_script())
    conn.commit()

    print("database set up successfully")
    conn.close()


def test_get_all_books():
    conn = sqlite3.connect("test.db")

    db_cursor = conn.cursor()
    db_cursor.execute("select * from books")
    books = db_cursor.fetchall()
    conn.close()

    return json.dumps(books)


def reset_database():
    conn = sqlite3.connect("test.db")

    db_cursor = conn.cursor()
    db_cursor.execute("drop table if exists books")

    conn.close()


if __name__ == "__main__":
    setup_db()
