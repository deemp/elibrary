from collections import defaultdict
from datetime import datetime
from fastapi import APIRouter, HTTPException, Request
from sqlmodel import Session, select
from ..internal.range_request import range_requests_response
from ..internal.models import Book, read_count_key
from ..internal.db import engine
from .. import env
from ..internal.check import MaybeRedirect

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


@router.get("/book/{book_id}/file")
async def file(book_id: int, request: Request, response: MaybeRedirect):
    if response:
        return response

    with Session(engine) as session:
        if request.headers.get("range") is None:
            book: Book = session.exec(select(Book).where(Book.book_id == book_id)).one()
            time = datetime.utcnow()
            book.read_count = defaultdict(int, book.read_count)
            book.read_count[read_count_key(time)] += 1
            session.add(book)
            session.commit()

    return range_requests_response(
        request=request,
        file_path=f"{env.BOOKS_DIR}/{book_id}.pdf",
        content_type="application/pdf",
    )
