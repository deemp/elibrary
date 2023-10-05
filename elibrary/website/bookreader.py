from flask import Blueprint, render_template

bookreader = Blueprint('bookreader', __name__)

@bookreader.route('/bookreader')
def read():
    return render_template("bookreader.html")