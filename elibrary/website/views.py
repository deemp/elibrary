from flask import Blueprint, render_template, request
from .models import Book

views = Blueprint('views', __name__)


@views.route('/', methods=['GET', 'POST'])
def home():
    return render_template("home.html")


@views.route('/search', methods=['GET', 'POST'])
def search():
    books = []

    topics = Book.query.distinct().all()

    if request.method == 'POST':
        books = Book.query.filter_by(lc=request.form.get('topic')).all()
        return render_template("search.html", books=books, topics=topics)

    books = Book.query.all()
    return render_template("search.html", books=books, topics=topics)
