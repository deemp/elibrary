from . import db
from flask_login import UserMixin
import json
from dataclasses import dataclass


@dataclass
class Book(db.Model):
    bisac: str
    lc: str
    publisher: str
    year: int
    book_id: int
    authors: str
    title: str
    imprint_publisher: str
    isbn: int
    esbn: int
    oclc: int
    lcc: str
    dewey: float
    format: str

    bisac = db.Column(db.String(50))
    lc = db.Column(db.String(50))
    publisher = db.Column(db.String(50))
    year = db.Column(db.Integer)
    book_id = db.Column(db.Integer, primary_key=True)
    authors = db.Column(db.String(50))
    title = db.Column(db.String(300))
    imprint_publisher = db.Column(db.String(300))
    isbn = db.Column(db.Integer)
    esbn = db.Column(db.Integer)
    oclc = db.Column(db.Integer)
    lcc = db.Column(db.String(50))
    dewey = db.Column(db.Float(50))
    format = db.Column(db.String(50))


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(150))
    first_name = db.Column(db.String(150))
    role = db.Column(db.String(50))
