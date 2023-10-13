import json
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path
from datetime import timedelta
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import dotenv_values


class obj(object):
    def __init__(self, dict_):
        self.__dict__.update(dict_)


config = obj(dotenv_values(".env"))

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = config.SECRET_KEY
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{config.DB_NAME}"
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
    jwt = JWTManager(app)

    db.init_app(app)

    create_database(app)

    from elibrary.website.auth import auth
    from elibrary.website.views import views
    from elibrary.website.book import book

    app.register_blueprint(views, url_prefix="/")
    app.register_blueprint(auth, url_prefix="/")
    app.register_blueprint(book, url_prefix="/")

    # from .models import User

    # login_manager = LoginManager()
    # login_manager.login_view = "auth.login"
    # login_manager.init_app(app)

    # @login_manager.user_loader
    # def load_user(id):
    #     return User.query.get((int(id)))

    CORS(app, origins=["http://localhost:5001", "http://localhost:5000"])

    return app


def create_database(app):
    if not path.exists("website/" + config.DB_NAME):
        with app.app_context():
            db.create_all()
        print("Created Database!")
dotenv_values