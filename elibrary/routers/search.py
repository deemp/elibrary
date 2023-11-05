from typing import TypeAlias
from fastapi import APIRouter
from sqlmodel import Session, select
from ..internal.models import Book
from ..internal.db import engine
from pydantic import BaseModel

router = APIRouter()

Strings: TypeAlias = list[str]
DictOptions: TypeAlias = dict[str, Strings]


def getDict(books, attr1, attr2) -> DictOptions:
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


filters = ["publisher", "year", "authors", "title", "isbn", "esbn", "format"]


@router.get("/search")
def search_get() -> SearchGETResponse:
    with Session(engine) as session:
        books = session.exec(select(Book)).all()
        bisac = getDict(books, "bisac", "lc")
        lc = getDict(books, "lc", "bisac")
        return SearchGETResponse(bisac=bisac, lc=lc, filters=filters)


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
    books: list[Book]


# https://fastapi.tiangolo.com/tutorial/body/
@router.post("/search")
def search_post(request: SearchPOSTRequest) -> SearchPOSTResponse:
    with Session(engine) as session:
        books = []

        conditions = [
            Book.bisac.contains(request.bisac),
            Book.lc.contains(request.lc),
        ]

        for r in request.filter_rows:
            if r.filter in filters:
                filter_attr = Book.__dict__[r.filter]
                conditions.append(filter_attr.contains(r.filter_input))

        books = session.exec(select(Book).where(*conditions)).all()

        bisac = getDict(books, "bisac", "lc")
        lc = getDict(books, "lc", "bisac")
        return SearchPOSTResponse(books=books, bisac=bisac, lc=lc)
