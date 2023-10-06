from flask import Blueprint, render_template, request, redirect, url_for, flash
from .models import Book
from . import db
from flask_login import login_required, current_user

views = Blueprint('views', __name__)


@views.route('/', methods=['GET', 'POST'])
def home():
    return render_template("home.html", user=current_user)


@views.route('/search', methods=['GET', 'POST'])
def search():
    books = []

    topics = Book.query.distinct().all()

    if request.method == 'POST':
        books = Book.query.filter_by(lc=request.form.get('topic')).all()
        return render_template("search.html", books=books, topics=topics)

    books = Book.query.all()
    return render_template("search.html", books=books, topics=topics, user=current_user)


@views.route('/edit-book/<int:book_id>', methods=['GET', 'POST'])
@login_required
def edit_book(book_id: int):
    book = Book.query.filter_by(book_id=book_id).first()
    if request.method == 'POST':
        bisac = request.form.get('bisac')
        lc = request.form.get('lc')
        publisher = request.form.get('publisher')
        year = request.form.get('year')
        authors = request.form.get('authors')
        title = request.form.get('title')
        print_hub = request.form.get('print_hub')
        isbn = request.form.get('isbn')
        esbn = request.form.get('esbn')
        format = request.form.get('format')

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
        return redirect(url_for('views.view_catalog'))

    return render_template('edit_book.html', book=book)


@views.route('/view-catalog', methods=['GET', 'POST'])
@login_required
def view_catalog():
    books = Book.query.all()

    return render_template('view_catalog.html', books=books, user=current_user)
