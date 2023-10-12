from flask import Blueprint, request, jsonify
from .models import Book
from flask_jwt_extended import jwt_required

views = Blueprint("views", __name__)


# FIXME use pagination
@views.route("/search", methods=["POST"])
# FIXME enable JWT authentication
# @jwt_required
def search():
    filters = [f for f in Book.__dict__.keys() if not f.startswith("_")]

    if request.method == "GET":
        return filters

    if request.method == "POST":
        # TODO set query parameters on typing in react
        books = []
        if arg_search_input := request.json.get("filter_input"):
            if arg_search_input:
                filter = request.json.get("filter")

                # FIXME SQL injection
                search_input = f"%{arg_search_input}%"

                def get_books(filter):
                    if filter in filters:
                        filter_attr = Book.__dict__[filter]
                        return Book.query.filter(filter_attr.like(search_input)).all()
                    else:
                        return Book.query.all()

                books = get_books(filter)
        else:
            books = Book.query.all()
        print(books)
        return jsonify([book.toJSON() for book in books])
