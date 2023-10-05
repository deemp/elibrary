from flask import Blueprint, render_template
from flask_login import current_user, login_required

bookreader = Blueprint('bookreader', __name__)


@bookreader.route('/bookreader')
@login_required
def read():
    return render_template("bookreader.html", user=current_user)
