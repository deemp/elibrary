from collections import defaultdict
from datetime import datetime
from typing import List
from fastapi import APIRouter
from sqlmodel import Session, select
from pydantic import BaseModel
from ..internal.models import Book, parse_read_count_key, read_count_key
from ..internal.db import engine
from ..internal.check import MaybeRedirect
from pydantic import BaseModel

router = APIRouter()


COUNT_COLUMN = "count"
TOTAL_READS = "total_reads"


class BookReadCount(BaseModel):
    book_id: int
    title: str
    read_count: defaultdict[str, int]


class BookReadCountResponse(BaseModel):
    book_id: int
    title: str
    read_count: int


class ReportPOSTResponse(BaseModel):
    books: List[BookReadCountResponse]
    total_reads_month: int
    total_reads_year: int


class ReportPOSTRequest(BaseModel):
    year: int
    month: int


@router.post("/report")
async def report_page(request: ReportPOSTRequest, response: MaybeRedirect):
    if response:
        return response

    request_read_count_key = read_count_key(
        datetime=datetime(year=request.year, month=request.month, day=1)
    )
    with Session(engine) as session:
        books: List[BookReadCount] = [
            BookReadCount(
                book_id=book_id,
                title=title,
                read_count=read_count,
            )
            for (book_id, title, read_count) in session.exec(
                select(Book.book_id, Book.title, Book.read_count).filter(
                    Book.read_count != {}
                )
            ).all()
        ]
        total_reads_month = sum(
            [book.read_count[request_read_count_key] for book in books]
        )

        books_sorted = [
            BookReadCountResponse(
                book_id=book.book_id,
                title=book.title,
                read_count=book.read_count[request_read_count_key],
            )
            for book in (
                sorted(
                    books,
                    key=lambda x: x.read_count[request_read_count_key],
                    reverse=True,
                )
            )
            if book.read_count[request_read_count_key] != 0
        ]

        total_reads_year = sum(
            [
                sum(
                    [
                        v
                        for k, v in book.read_count.items()
                        if parse_read_count_key(k).year == request.year
                    ]
                )
                for book in books
            ]
        )

    return ReportPOSTResponse(
        books=books_sorted,
        total_reads_month=total_reads_month,
        total_reads_year=total_reads_year,
    )
