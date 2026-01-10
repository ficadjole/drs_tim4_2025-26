from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from Services.AuthService import AuthService
from Domen.Models.TokenBlacklist import TokenBlacklist
from Database.InitializationDataBase import db
from DTO.AuthDTO import LoginDTO

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.route("/login", methods=["POST"])
def login():
    dto = LoginDTO(request.json)

    if not dto.is_valid():
        return jsonify({"error": "Invalid data"}), 400
    
    try:
        token = AuthService.login(dto.email, dto.password)
        return jsonify({"accessToken": token}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 401


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    db.session.add(TokenBlacklist(jti=jti))
    db.session.commit()

    return jsonify({"message": "Logged out successfully"}), 200

