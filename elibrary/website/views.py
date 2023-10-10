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
    filters = ['title', 'year', 'authors', 'publisher', 'isbn', 'format']

    if request.method == "GET":
        search_input = request.args.get('search-input')
        filter = request.args.get('filter')

        if filter == filters[0]:
            search_input = "%{}%".format(search_input)
            books = Book.query.filter(Book.title.like(search_input)).all()
            return render_template("search.html", books=books, filters=filters, user=current_user)
        elif filter == filters[1]:
            search_input = "%{}%".format(search_input)
            books = Book.query.filter(Book.year.like(search_input)).all()
            return render_template("search.html", books=books, filters=filters, user=current_user)
        elif filter == filters[2]:
            search_input = "%{}%".format(search_input)
            books = Book.query.filter(Book.authors.like(search_input)).all()
            return render_template("search.html", books=books, filters=filters, user=current_user)
        elif filter == filters[3]:
            search_input = "%{}%".format(search_input)
            books = Book.query.filter(Book.publisher.like(search_input)).all()
            return render_template("search.html", books=books, filters=filters, user=current_user)
        elif filter == filters[4]:
            search_input = "%{}%".format(search_input)
            books = Book.query.filter(Book.isbn.like(search_input)).all()
            return render_template("search.html", books=books, filters=filters, user=current_user)
        elif filter == filters[5]:
            search_input = "%{}%".format(search_input)
            books = Book.query.filter(Book.format.like(search_input)).all()
            return render_template("search.html", books=books, filters=filters, user=current_user)
        else:
            books = Book.query.all()
            return render_template("search.html", books=books, filters=filters, user=current_user)
    else:
        book_id = request.form.get('book_id')

        if book_id:
            books = Book.query.all()
            return redirect(url_for('book.book_by_id', book_id=book_id))
        else:
            books = Book.query.all()
            return render_template("search.html", books=books, filters=filters, user=current_user)
