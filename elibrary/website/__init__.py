from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path
from .seed import list_of_seeds, create_table_script
from datetime import timedelta
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
DB_NAME = "database.db"


def create_app():
    app = Flask(
        __name__,
        static_url_path="",
        template_folder="../../front/dist",
        static_folder="../../front/dist",
    )
    app.config["SECRET_KEY"] = "my secret key"
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_NAME}"
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
    jwt = JWTManager(app)

    db.init_app(app)

    create_database(app)

    from elibrary.website.auth import auth
    from elibrary.website.views import views

    # from elibrary.website.bookreader import bookreader
    # from elibrary.website.book import book

    app.register_blueprint(views, url_prefix="/")
    app.register_blueprint(auth, url_prefix="/")
    # app.register_blueprint(bookreader, url_prefix="/")
    # app.register_blueprint(book, url_prefix="/")

    # from .models import User

    # login_manager = LoginManager()
    # login_manager.login_view = "auth.login"
    # login_manager.init_app(app)

    # @login_manager.user_loader
    # def load_user(id):
    #     return User.query.get((int(id)))

    return app


def create_database(app):
    from .models import Book

    if not path.exists("website/" + DB_NAME):
        with app.app_context():
            db.create_all()

            count = db.session.query(Book).count()
            if count < 1:
                db.session.execute(create_table_script)
                for i, sql in enumerate(list_of_seeds):
                    print("Seeding {} script".format(i + 1))
                    db.session.execute(sql)
                db.session.commit()
            print("Created Database!")
