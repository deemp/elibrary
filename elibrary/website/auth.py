from flask import Blueprint, render_template, request

auth = Blueprint("auth", __name__)

@auth.route("/login", methods=['GET', 'POST'])
def login():
    ans = "test"
    if request.method == 'POST':
        ans = "Hello " + request.form['email']
    return render_template("login.html", ans=ans)