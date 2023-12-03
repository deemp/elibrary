from collections import defaultdict
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Request
from sqlmodel import Session, select
from ..internal.range_request import range_requests_response
from ..internal.models import Book, read_count_key
from ..internal.db import engine
from .. import env
from ..internal.check import MaybeRedirect
import re

router = APIRouter()


@router.get("/book/{book_id}")
async def book_page(book_id: int, response: MaybeRedirect):
    if response:
        return response
    with Session(engine) as session:
        book = session.get(Book, book_id)
        if not book:
            raise HTTPException(status_code=404, detail="Book not found")
        return book


@router.post("/book/{book_id}/file")
async def file_post(book_id: int, request: Request, response: MaybeRedirect):
    if response:
        return response

    if (
        (range := request.headers.get("range"))
        and (start := re.search("bytes=(\d+)-\d+", range))
        and int(start.group(1)) == 0
    ):
        with Session(engine) as session:
            book: Book = session.exec(select(Book).where(Book.book_id == book_id)).one()
            time = datetime.utcnow() + timedelta(hours=env.UTC_OFFSET)
            book.read_count = defaultdict(int, book.read_count)
            book.read_count[read_count_key(time)] += 1
            session.add(book)
            session.commit()

    return range_requests_response(
        request=request,
        file_path=f"{env.BOOKS_DIR}/{book_id}.pdf",
        content_type="application/pdf",
    )
