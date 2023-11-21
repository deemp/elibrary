from datetime import datetime
from fastapi import APIRouter, HTTPException, Request
from sqlmodel import Session
from ..internal.range_request import range_requests_response
from ..internal.models import Book, ReadCount
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
            read_count = ReadCount(
                book_id=book_id, month=datetime.now().month, year=datetime.now().year
            )
            session.add(read_count)
            session.commit()

    return range_requests_response(
        request=request,
        file_path=f"{env.BOOKS_DIR}/{book_id}.pdf",
        content_type="application/pdf",
    )
