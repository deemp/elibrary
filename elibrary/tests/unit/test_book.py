from elibrary.routers.book import *


def test_book_page_type():
    book = book_page(676913)
    assert type(book) == Book


def test_book_page_fail():
    try:
        book = book_page(1)
        assert False
    except HTTPException:
        return
    assert False


def test_book_page():
    book = book_page(676913)
    assert book == Book(year=2014, bisac='SOCIAL SCIENCE', authors='Cassandra S. Crawford', imprint_publisher='NYU Press', esbn=9780814764824, lcc='RD553 .C88 2014eb', format='EPUB;PDF', reads=0, lc='Sociology / General', publisher='New York University Press', book_id=676913, title='Phantom Limb : Amputation, Embodiment, and Prosthetic Technology', isbn=9780814789285, oclc=865578900, dewey=617.9, pages=316)
