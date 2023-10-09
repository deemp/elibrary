from . import db
from .models import Book
from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_required, current_user
from flask_rangerequest import RangeRequest

book = Blueprint("book", __name__)

@book.route("/book/<int:book_id>", methods=["GET", "POST"])
def book_by_id(book_id: int):
    book = Book.query.filter_by(book_id=book_id).all()[0]

    if request.method == "POST":
        if request.form.get("book_id"):
            book = Book.query.filter_by(book_id=request.form.get("book_id")).all()[0]
            return redirect(f"/bookreader/{book.book_id}")

    return render_template("book.html", book=book, user=current_user)


@book.route("/book/<int:book_id>/edit", methods=["GET", "POST"])
@login_required
def edit_book(book_id: int):
    book = Book.query.filter_by(book_id=book_id).first()
    if request.method == "POST":
        bisac = request.form.get("bisac")
        lc = request.form.get("lc")
        publisher = request.form.get("publisher")
        year = request.form.get("year")
        authors = request.form.get("authors")
        title = request.form.get("title")
        print_hub = request.form.get("print_hub")
        isbn = request.form.get("isbn")
        esbn = request.form.get("esbn")
        format = request.form.get("format")

        book.bisac = bisac
        book.lc = lc
        book.publisher = publisher
        book.year = year
        book.authors = authors
        book.title = title
        book.print_hub = print_hub
        book.isbn = isbn
        book.esbn = esbn
        book.format = format

        db.session.commit()
        flash("Book info updated!", category="success")
        return redirect(url_for("views.search"))

    return render_template("edit_book.html", book=book)


@book.route("/book/<int:book_id>/file")
@login_required
def read(book_id):
    book_path = f"books/{book_id:06}.pdf"
    return RangeRequest(open(book_path, "rb")).make_response()
