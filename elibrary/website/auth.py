from flask import Blueprint, render_template, request, flash, redirect, url_for
from .models import User
from werkzeug.security import generate_password_hash, check_password_hash
from . import db
from flask_login import login_user, login_required, logout_user, current_user

auth = Blueprint("auth", __name__)


@auth.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")

        if len(email) < 4:
            flash("Email must be greater than 3 characters", category="error")
        elif len(password) < 7:
            flash("Password must be greater than 6 characters", category="error")
        else:
            user = User.query.filter_by(email=email).first()

            if user:
                if not user.password:
                    flash("You do not have a password!", category="error")
                    flash("Click Sign in with Google to continue",
                          category="error")
                    return render_template("login.html", user=current_user)
                if check_password_hash(user.password, password):
                    flash("Logged in successfully!", category="success")
                    login_user(user, remember=True)
                    return redirect(url_for("views.home"))
                else:
                    flash("Invalid email or password!", category="error")
            else:
                flash("User does not exist!", category="error")
    return render_template("login.html", user=current_user)


@auth.route("/register", methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        first_name = request.form.get('first_name')

        user = User.query.filter_by(email=email).first()

        if user:
            flash("User already exist!", category="error")
        elif len(email) < 4:
            flash("Email must be greater than 3 characters", category="error")
        elif len(first_name) < 2:
            flash("First name must be greater than 1 character", category="error")
        elif len(password) < 7:
            flash("Password must be greater than 6 characters", category="error")
        elif password != confirm_password:
            flash("Password and Confirm Password must match", category="error")
        else:
            password_hash = generate_password_hash(password)

            new_user = User(email=email, first_name=first_name,
                            password=password_hash)
            db.session.add(new_user)
            db.session.commit()
            flash("Account created successfully", category="success")
            login_user(new_user)
            return redirect(url_for("views.home"))
    return render_template('register.html', user=current_user)


@auth.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("auth.login"))
