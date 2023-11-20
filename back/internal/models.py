from typing import Optional
from sqlmodel import Field, SQLModel
from datetime import datetime

from .. import env


class Book(SQLModel, table=True):
    __tablename__ = env.DB_TABLE_BOOK
    bisac: str
    lc: str
    publisher: str
    year: int
    book_id: int = Field(primary_key=True)
    authors: Optional[str]
    title: str
    imprint_publisher: str
    isbn: Optional[int]
    esbn: int
    oclc: Optional[int]
    lcc: Optional[str]
    dewey: Optional[float]
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
    authors: Optional[str]
    title: str
    imprint_publisher: str
    isbn: Optional[int]
    esbn: int
    oclc: Optional[int]
    lcc: Optional[str]
    dewey: Optional[float]
    format: str
    pages: int


class ReadCount(SQLModel, table=True):
    __tablename__ = "read_count"
    id: int = Field(primary_key=True)
    book_id: int = Field(foreign_key="{}.book_id".format(env.DB_TABLE_BOOK))
    month: int = Field(default=datetime.now().month)
    year: int = Field(default=datetime.now().year)
