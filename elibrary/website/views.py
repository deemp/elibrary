from flask import Blueprint, request, jsonify, render_template
from .models import Book
from flask_jwt_extended import jwt_required

views = Blueprint(
    "views",
    __name__,
    static_url_path="",
    template_folder="static/front/",
    static_folder="static/front/",
)


# FIXME set up hot reload for both back and front
@views.route("/", methods=["GET"])
# FIXME enable JWT authentication
# @jwt_required
def home():
    return render_template("index.html")


# FIXME use pagination
@views.route("/search", methods=["POST"])
# FIXME enable JWT authentication
# @jwt_required
def search():
    filters = [f for f in Book.__dict__.keys() if not f.startswith("_")]

    if request.method == "GET":
        return filters

    if request.method == "POST":
        # TODO set query parameters on typing in react
        books = []
        if arg_search_input := request.json.get("filter_input"):
            if arg_search_input:
                filter = request.json.get("filter")

                # FIXME SQL injection
                search_input = f"%{arg_search_input}%"

                def get_books(filter):
                    if filter in filters:
                        filter_attr = Book.__dict__[filter]
                        return Book.query.filter(filter_attr.like(search_input)).all()
                    else:
                        return Book.query.all()

                books = get_books(filter)
        else:
            books = Book.query.all()
        return jsonify(books)
