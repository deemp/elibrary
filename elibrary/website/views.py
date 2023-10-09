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
    books = []

    topics = Book.query.distinct().all()

    if request.method == "POST":
        if request.form.get("topic"):
            books = Book.query.filter_by(lc=request.form.get("topic")).all()
            return render_template(
                "search.html", books=books, topics=topics, user=current_user
            )
        elif request.form.get("book_id"):
            book = Book.query.filter_by(book_id=request.form.get("book_id")).all()[0]
            return redirect(f"/book/{book.book_id}")

    books = Book.query.all()
    return render_template("search.html", books=books, topics=topics, user=current_user)
