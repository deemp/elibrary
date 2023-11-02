from ..routers.search import *

def test_get_all_books():
    with Session(engine) as session:
        books = session.exec(select(Book)).all()
        print(books)
