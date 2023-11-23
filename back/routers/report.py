from typing import List
from fastapi import APIRouter
from fastapi.responses import RedirectResponse
from sqlmodel import SQLModel, Session, select, func, text
from ..internal.db import engine
from ..internal.models import ReadCount, Book
from ..internal.check import MaybeRedirect
from pydantic import BaseModel

router = APIRouter()


COUNT_COLUMN = "count"
TOTAL_READS = "total_reads"


class BookReadCount(SQLModel):
    book_id: int
    title: str
    read_count: int


class ReportGETResponse(BaseModel):
    total_reads: int | None
    books: list[BookReadCount]


class ReadCountAndCount(BaseModel):
    read_count: ReadCount
    count: int


@router.get("/report")
async def report_page(response: MaybeRedirect):
    if response:
        return response

    with Session(engine) as session:
        total_reads: int | None = session.exec(
            select(func.count(ReadCount.id).label(TOTAL_READS))
        ).first()

        read_count_and_count: List[(ReadCount, int, str)] = session.exec(
            select(ReadCount, func.count(ReadCount.book_id).label(COUNT_COLUMN), Book.title)
            .where(ReadCount.book_id == Book.book_id)
            .group_by(ReadCount.book_id)
            .order_by(text(f"{COUNT_COLUMN} desc"))
        ).fetchmany(10)

        top_books = [
            BookReadCount(book_id=x[0].book_id, read_count=x[1], title=x[2])
            for x in read_count_and_count
        ]

    return ReportGETResponse(books=top_books, total_reads=total_reads)
