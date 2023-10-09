from flask import Blueprint
from flask_login import login_required
from flask_rangerequest import RangeRequest
from flask_api import status

book_file = Blueprint("book-file", __name__)


@book_file.route("/book/<book_id>/file")
@login_required
def read(book_id):
    if not (len(book_id) == 6 and book_id.isdigit()):
        return "Record not found", status.HTTP_400_BAD_REQUEST
    book_path = f"books/{book_id:06}.pdf"
    return RangeRequest(open(book_path, "rb")).make_response()
