from typing import TypeAlias
from fastapi import APIRouter
from sqlmodel import Session, select, func, text
from ..internal.db import engine
from ..internal.models import ReadCount, Book
from ..internal.check import MaybeRedirect
from pydantic import BaseModel

router = APIRouter()


COUNT_COLUMN = "count"
TOTAL_READS = "total_reads"


class ReportGETResponse(BaseModel):
    total_reads: int
    books: list[Book]


class ReadCountAndCount(BaseModel):
    read_count: ReadCount
    count: int


@router.get("/report")
async def report_page(response: MaybeRedirect) -> ReportGETResponse:
    read_count_and_count: list[ReadCountAndCount]
    books: []
    top_book_ids: list[int]

    if response:
        return response

    with Session(engine) as session:
        total_reads = session.exec(
            select(func.count(ReadCount.id).label(TOTAL_READS))
        ).first()

        read_count_and_count = session.exec(
            select(ReadCount, func.count(ReadCount.book_id).label(COUNT_COLUMN))
            .group_by(ReadCount.book_id)
            .order_by(text(f"{COUNT_COLUMN} desc"))
        ).fetchmany(10)

        top_book_ids = [x[0].book_id for x in read_count_and_count]

        books = session.exec(select(Book).where(Book.book_id.in_(top_book_ids))).all()

    return ReportGETResponse(books=books, total_reads=total_reads)
