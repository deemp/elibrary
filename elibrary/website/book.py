from .models import Book
from flask import Blueprint, jsonify
from flask_rangerequest import RangeRequest
from flask_jwt_extended import jwt_required

book = Blueprint("book", __name__)

@book.route("/book/<int:book_id>", methods=["GET"])
# FIXME require JWT
# @jwt_required
def book_page(book_id: int):
    books = Book.query.filter_by(book_id=book_id).first()
    if len(books) == 0:
        return jsonify({"msg": f"No book with id '{book_id}' found"}), 404
    return jsonify(books)


@book.route("/book/<int:book_id>/file")
# FIXME require JWT
# @jwt_required
def file(book_id):
    book_path = f"books/{book_id:06}.pdf"
    return RangeRequest(open(book_path, "rb")).make_response()
