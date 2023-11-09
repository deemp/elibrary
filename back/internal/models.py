from sqlmodel import Field, SQLModel

from .. import env


class Book(SQLModel, table=True):
    __tablename__ = env.DB_TABLE_BOOK
    bisac: str
    lc: str
    publisher: str
    year: int
    book_id: int = Field(primary_key=True)
    authors: str
    title: str
    imprint_publisher: str
    isbn: int
    esbn: int
    oclc: int
    lcc: str
    dewey: float
    format: str
    pages: int
    reads: int = Field(default=0, nullable=False)


class BookTmp(SQLModel, table=True):
    __tablename__ = "book_tmp"
    bisac: str
    lc: str
    publisher: str
    year: int
    book_id: int = Field(primary_key=True)
    authors: str
    title: str
    imprint_publisher: str
    isbn: int
    esbn: int
    oclc: int
    lcc: str
    dewey: float
    format: str
    pages: int
