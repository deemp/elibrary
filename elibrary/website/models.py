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
    print_hub: str
    isbn: int
    esbn: int
    format: str

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


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(150))
    first_name = db.Column(db.String(150))
    role = db.Column(db.String(50))
