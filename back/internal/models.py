from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from sqlmodel import Field, SQLModel
from collections import defaultdict
from .. import env
from sqlalchemy import JSON, Column
from sqlmodel import Field, SQLModel


class BookSchema(BaseModel):
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
    read_count: defaultdict[str, int] = Field(
        sa_column=Column(JSON), default_factory=defaultdict[str, int], nullable=False
    )


class Book(SQLModel, BookSchema, table=True):
    __tablename__ = env.DB_TABLE_BOOK


class BookTmp(SQLModel, BookSchema, table=True):
    __tablename__ = "book_tmp"


def read_count_key(datetime: datetime):
    return datetime.strftime("%Y-%m")

def parse_read_count_key(key):
    return datetime.strptime(key, "%Y-%m")