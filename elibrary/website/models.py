from . import db


class Book(db.Model):
    bisac = db.Column(db.String(50))
    lc = db.Column(db.String(50))
    publisher = db.Column(db.String(50))
    year = db.Column(db.Integer)
    book_id = db.Column(db.Integer, primary_key=True)
    authors = db.Column(db.String(50))
    title = db.Column(db.String(300))
    print_hub = db.Column(db.String(50))
    isbn = db.Column(db.Integer)
    esbn = db.Column(db.Integer)
    format = db.Column(db.String(50))
