from flask import Blueprint, render_template, request, flash, redirect, url_for, jsonify
from .models import User
from werkzeug.security import generate_password_hash, check_password_hash
from . import db
from flask_login import login_user, login_required, logout_user, current_user
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

auth = Blueprint("auth", __name__)


# assume a user doesn't have a valid JWT when trying to log in
@auth.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    user = User.query.filter_by(email=email).first()

    if user:
        if not user.password:
            return jsonify({"msg": "No user with such password exists"}), 401
        if check_password_hash(user.password, password):
            access_token = create_access_token(identity=email)
            return jsonify(access_token=access_token)
        else:
            return jsonify({"msg": "Invalid password"}), 401
    else:
        return jsonify({"msg": "No user with such email exists"}), 401


# assume a user doesn't have a valid JWT when trying to log in
@auth.route("/register", methods=["POST"])
def register():
    email = request.json.get("email") or ""
    password = request.json.get("password") or ""
    confirm_password = request.json.get("confirm_password") or ""
    first_name = request.json.get("first_name") or ""

    user = User.query.filter_by(email=email).first()

    if user:
        return jsonify({"msg": "User already exists"}), 401
    elif len(email) < 4:
        return jsonify({"msg": "Email must be longer than 3 characters!"}), 401
    elif len(first_name) < 1:
        return jsonify({"msg": "Enter your first name"}), 401
    elif len(password) < 7:
        return jsonify({"msg": "Password must be longer than 6 characters"}), 401
    elif password != confirm_password:
        return jsonify({"msg": "Password and Confirm Password must be the same"}), 401
    else:
        password_hash = generate_password_hash(password)

        new_user = User(email=email, first_name=first_name, password=password_hash)
        db.session.add(new_user)
        db.session.commit()
        
        access_token = create_access_token(identity=email)
        return jsonify(access_token=access_token)


@auth.route("/logout")
@jwt_required
def logout():
    # TODO revoke JWT https://flask-jwt-extended.readthedocs.io/en/stable/blocklist_and_token_revoking.html#database
    pass
