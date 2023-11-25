import requests
from ..routers.book import *
from .. import env

book_url = f"{env.URL}/book"


async def test_book_page_type():
    book = await book_page(676913, None)
    assert type(book) == Book


class TestBookPage:
    book_id = 676913

    def check(self, book: Book):
        with Session(engine) as session:
            book_from_db = session.exec(
                select(Book).where(Book.book_id == book.book_id)
            ).one()
            assert book == book_from_db

    async def test_unit(self):
        response = await book_page(self.book_id, None)
        self.check(response)

    def test_api(self):
        response = requests.get(f"{book_url}/{self.book_id}")
        self.check(Book(**response.json()))


class TestBookPageFail:
    book_id = 1

    async def test_unit(self):
        try:
            await book_page(self.book_id, None)
            assert False
        except HTTPException:
            return

    def test_api(self):
        response = requests.get(f"{book_url}/{self.book_id}")
        assert response.json() == {"detail": "Book not found"}
