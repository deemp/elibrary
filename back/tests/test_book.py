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
        assert book == Book(
            year=2014,
            bisac="SOCIAL SCIENCE",
            authors="Cassandra S. Crawford",
            imprint_publisher="NYU Press",
            esbn=9780814764824,
            lcc="RD553 .C88 2014eb",
            format="EPUB;PDF",
            reads=0,
            lc="Sociology / General",
            publisher="New York University Press",
            book_id=676913,
            title="Phantom Limb : Amputation, Embodiment, and Prosthetic Technology",
            isbn=9780814789285,
            oclc=865578900,
            dewey=617.9,
            pages=316,
        )

    async def test_unit(self):
        response = await book_page(self.book_id, None)
        self.check(response)

    def test_api(self):
        response = requests.get(
            f"{book_url}/{self.book_id}"
        )
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
        response = requests.get(
            f"{book_url}/{self.book_id}"
        )
        assert response.json() == {"detail": "Book not found"}
