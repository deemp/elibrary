from sqlmodel import SQLModel, Field

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


class User(SQLModel, table=True):
    id: int = Field(primary_key=True)
    email: str = Field(unique=True)
    password: str
    first_name: str
    role: str
