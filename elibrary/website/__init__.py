from flask import Flask
from elibrary.website.views import views
from elibrary.website.auth import auth
from elibrary.website.bookreader import bookreader

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = "my secret key"
    
    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')
    app.register_blueprint(bookreader, url_prefix='/')
    
    return app
