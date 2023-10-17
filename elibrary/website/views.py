from dataclasses import dataclass
from flask import Blueprint, request, jsonify, render_template
from .models import Book
from . import db
from flask_jwt_extended import jwt_required

views = Blueprint(
    "views",
    __name__,
    static_url_path="",
    template_folder="static/front/",
    static_folder="static/front/",
)


# FIXME set up hot reload for both back and front
@views.route("/", methods=["GET"])
# FIXME enable JWT authentication
# @jwt_required
def home():
    return render_template("index.html")


@dataclass
class SearchPostRequest(object):
    bisac: str
    lc: str
    filter: str
    filter_input: str


# FIXME use pagination
@views.route("/search", methods=["GET", "POST"])
# FIXME enable JWT authentication
# @jwt_required
def search():
    filters = ["publisher", "year", "authors", "title", "isbn", "esbn", "format"]

    if request.method == "GET":
        bisac = {}
        other = filters
        for book in Book.query.all():
            if book.bisac not in bisac.keys():
                bisac[book.bisac] = set()
            bisac[book.bisac].add(book.lc)

        for key in bisac:
            bisac[key] = list(bisac[key])

        result = {"bisac": bisac, "other": other}

        return result

    if request.method == "POST":
        books = []
        req = SearchPostRequest(**request.json)
        if req.filter in filters:
            filter_attr = Book.__dict__[req.filter]

            books = Book.query.filter(
                filter_attr.like(f"%{req.filter_input}%"),
                Book.bisac.like(f"%{req.bisac}%"),
                Book.lc.like(f"%{req.lc}%"),
            ).all()
        else:
            books = Book.query.all()
        return jsonify(books)
