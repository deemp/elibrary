from .models import Book
from flask import Blueprint, jsonify, render_template
from flask_rangerequest import RangeRequest
from flask_jwt_extended import jwt_required

book = Blueprint("book", __name__, template_folder="/website/templates")


@book.route("/book/<int:book_id>", methods=["GET"])
# FIXME require JWT
# @jwt_required
def book_page(book_id: int):
    book = Book.query.filter_by(book_id=book_id).first()
    if not book:
        return jsonify({"msg": f"No book with id '{book_id}' found"}), 404
    return jsonify(book)


@book.route("/book/<int:book_id>/file")
# FIXME require JWT
# @jwt_required
def file(book_id):
    book_path = f"books/{book_id:06}.pdf"
    return RangeRequest(open(book_path, "rb")).make_response()
