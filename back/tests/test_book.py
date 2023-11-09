import requests
from ..routers.book import *


def test_book_page_type():
    book = book_page(676913)
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

    def test_unit(self):
        response = book_page(self.book_id)
        self.check(response)

    def test_api(self):
        response = requests.get(
            f"http://localhost:5000/api/book/{self.book_id}"
        )
        self.check(Book(**response.json()))


class TestBookPageFail:
    book_id = 1

    def test_unit(self):
        try:
            book_page(self.book_id)
            assert False
        except HTTPException:
            return
        assert False

    def test_api(self):
        response = requests.get(
            f"http://localhost:5000/api/book/{self.book_id}"
        )
        assert response.json() == {"detail": "Book not found"}
