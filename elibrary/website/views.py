from flask import Blueprint, render_template, request
from .models import Book

views = Blueprint('views', __name__)


@views.route('/', methods=['GET', 'POST'])
def home():
    books = []

    topics = Book.query.distinct().all()

    if request.method == 'POST':
        books = Book.query.filter_by(lc=request.form.get('topic')).all()
    else:
        books = Book.query.all()
    return render_template("home.html", books=books, topics=topics)
