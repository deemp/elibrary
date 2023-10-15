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
        filters_all = filters + ["bisac" "lc"]
        if arg_search_input := request.json.get("filter_input"):
            if arg_search_input:
                filter = request.json.get("filter")

                # FIXME SQL injection
                search_input = f"%{arg_search_input}%"

                if filter in filters_all:
                    filter_attr = Book.__dict__[filter]
                    books = Book.query.filter(filter_attr.like(search_input)).all()
                else:
                    books = Book.query.all()
        else:
            books = Book.query.all()
        return jsonify(books)
