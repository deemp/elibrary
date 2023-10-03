from flask import Flask
from website.views import views
from website.auth import auth


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = "my secret key"
    
    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')
    
    return app
