from flask import Blueprint, render_template
from flask_login import current_user, login_required

bookreader = Blueprint('bookreader', __name__)


@bookreader.route('/bookreader/<int:book_id>')
@login_required
def read(book_id: int):
    book_id = str(book_id).rjust(6, '0')
    return render_template("bookreader.html", user=current_user, book_id=book_id)
