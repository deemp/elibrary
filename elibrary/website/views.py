from flask import Blueprint, render_template, request, redirect, url_for, flash
from .models import Book
from flask_login import login_required, current_user

views = Blueprint("views", __name__)


@views.route("/", methods=["GET", "POST"])
def home():
    return render_template("home.html", user=current_user)


@views.route("/search", methods=["GET", "POST"])
@login_required
def search():
    filters = [f for f in Book.__dict__.keys() if not f.startswith("_")]

    if request.method == "GET":
        if arg_search_input := request.args.get("search-input"):
            filter = request.args.get("filter")
            search_input = f"%{arg_search_input}%"

            def get_books(filter):
                if filter in filters:
                    filter_attr = Book.__dict__[filter]
                    print(filter_attr)
                    return Book.query.filter(filter_attr.like(search_input)).all()
                else:
                    return Book.query.all()

            books = get_books(filter)

            return render_template(
                "search.html",
                books=books,
                filters=filters,
                user=current_user,
                search_input=arg_search_input
            )
        else:
            books = Book.query.all()
            return render_template(
                "search.html",
                books=books,
                filters=filters,
                user=current_user,
                search_input=""
            )
    else:
        book_id = request.form.get("book_id")
        books = Book.query.all()
        return redirect(url_for("book.book_by_id", book_id=book_id))
