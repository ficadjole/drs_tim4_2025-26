import json
import requests
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from Auth.Decorators import roles_required
from Domen.Enums.UserRoles import UserRoles
from Domen.Config.redis_client import redis_client
from sqlalchemy.engine.reflection import cache

gateway_bp = Blueprint("gateway_bp", __name__, url_prefix="/gateway")

@gateway_bp.route("/air_company/getAll", methods=["GET"])
@jwt_required()
def get_all_company():
    try:

        cache = redis_client.get(f"airCompanies:all")

        if cache:
            return json.loads(cache), 200

        response = requests.get(f"http://localhost:5002/api/companies/getAll")

        if response.status_code != 200:
            return jsonify({"message":f"Server error: {response.status_code}"}), 500

        return response.json()

    except Exception as error:
        return jsonify({"message":f"Server error: {error}"}), 500


@gateway_bp.route("/air_company/create", methods=["POST"])
@jwt_required()
@roles_required("ADMINISTRATOR")
def create_company():
    try:
        json_data = request.get_json()
        data = json_data.get("name")

        response = requests.post(f"http://localhost:5002/api/companies/create",json={'name':data})

        if response.status_code != 201:
            return jsonify({
                "message": "Server error",
                "details": response.text
            }), 500

        redis_client.delete("flights:all") #ovo moramo raditi da bi podaci bili tacni
        return jsonify(response.json()), 201

    except Exception as error:
        return jsonify({"message":f"Server error: {error}"}), 500