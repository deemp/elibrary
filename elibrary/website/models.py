from . import db
from flask_login import UserMixin
import json


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

    def toJSON(self):
        attrs = self.__dict__
        return {k: attrs[k] for k in attrs.keys() if not k.startswith("_")}


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(150))
    first_name = db.Column(db.String(150))
    role = db.Column(db.String(50))
