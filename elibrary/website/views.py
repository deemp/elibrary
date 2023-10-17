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

    def getDict(books, attr1, attr2):
        ret = {}
        for book in books:
            if (attr := book.__dict__[attr1]) not in ret.keys():
                ret[attr] = set()
            ret[attr].add(book.__dict__[attr2])

        for key in ret:
            ret[key] = list(ret[key])
        return ret

    if request.method == "GET":
        books = Book.query.all()
        bisac = getDict(books, "bisac", "lc")
        lc = getDict(books, "lc", "bisac")

        return {"bisac": bisac, "lc": lc, "filters": filters}

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

        bisac = getDict(books, "bisac", "lc")
        lc = getDict(books, "lc", "bisac")
        return jsonify({"books": books, "bisac": bisac, "lc": lc})
