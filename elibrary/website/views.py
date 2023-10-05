from flask import Blueprint, render_template, request
import sqlite3

views = Blueprint('views', __name__)

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

@views.route('/', methods=['GET', 'POST'])
def home():
    conn = get_db_connection()
    books = []

    topics = conn.execute('select distinct lc from books').fetchall()

    if request.method == 'POST':
        print(request.form.get('topic'))
        books = conn.execute('select * from books where lc = \'' + request.form.get('topic') + '\'').fetchall()
    else:
        books = conn.execute('select * from books').fetchall()
    
    conn.close()

    return render_template("home.html", books=books, topics=topics)