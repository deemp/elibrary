from typing import List, Optional, TypeAlias
from dataclasses import dataclass
from fastapi import APIRouter
from sqlmodel import SQLModel, Session, select
from ..internal.models import Book
from ..internal.db import engine
from pydantic import BaseModel
from .. import env

router = APIRouter()

Strings: TypeAlias = list[str]
DictOptions: TypeAlias = dict[str, Strings]


@dataclass
class BookSearch(SQLModel):
    book_id: int
    bisac: str
    lc: str
    title: str
    authors: Optional[str]
    publisher: str
    year: int
    isbn: Optional[int]


class BookSearchResponse(SQLModel):
    book_id: int
    title: str
    authors: Optional[str]
    publisher: str
    year: int
    isbn: Optional[int]
    lc: str
    bisac: str


def getDict(books: List[BookSearch], attr1, attr2) -> DictOptions:
    ret = {}
    for book in books:
        if (attr := book.__dict__[attr1]) not in ret.keys():
            ret[attr] = set()
        ret[attr].add(book.__dict__[attr2])

    for key in ret:
        ret[key] = list(ret[key])
    return ret


class SearchGETResponse(BaseModel):
    bisac: DictOptions
    lc: DictOptions
    filters: Strings


filters = ["title", "authors", "publisher", "year", "isbn"]


def select_books():
    return select(
        Book.book_id,
        Book.bisac,
        Book.lc,
        Book.title,
        Book.authors,
        Book.publisher,
        Book.year,
        Book.isbn,
    )


@router.get("/search")
def search_get() -> SearchGETResponse:
    with Session(engine) as session:
        books = [
            BookSearch(*i)
            for i in session.exec(select_books()).fetchmany(env.SEARCH_RESULTS_MAX)
        ]
        bisac = getDict(books, "bisac", "lc")
        lc = getDict(books, "lc", "bisac")
        return SearchGETResponse(
            bisac=bisac,
            lc=lc,
            filters=filters,
        )


class FilterRow(BaseModel):
    filter: str
    filter_input: str


class SearchPOSTRequest(BaseModel):
    bisac: str
    lc: str
    filter_rows: list[FilterRow]


class SearchPOSTResponse(BaseModel):
    bisac: DictOptions
    lc: DictOptions
    books: List[BookSearchResponse]


# https://fastapi.tiangolo.com/tutorial/body/
@router.post("/search")
def search_post(request: SearchPOSTRequest) -> SearchPOSTResponse:
    with Session(engine) as session:
        books: List[BookSearch] = []

        conditions = [
            Book.bisac.contains(request.bisac),
            Book.lc.contains(request.lc),
        ]

        for r in request.filter_rows:
            if r.filter in filters:
                filter_attr = Book.__dict__[r.filter]
                conditions.append(filter_attr.contains(r.filter_input))

        books = [
            BookSearch(*i)
            for i in session.exec(select_books().where(*conditions)).fetchmany(
                env.SEARCH_RESULTS_MAX
            )
        ]

        bisac = getDict(books, "bisac", "lc")
        lc = getDict(books, "lc", "bisac")

        books_response: List[BookSearchResponse] = [
            BookSearchResponse(**i.__dict__) for i in books
        ]
        return SearchPOSTResponse(books=books_response, bisac=bisac, lc=lc)
