import json
import requests
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from Auth.Decorators import roles_required
from Domen.Enums.UserRoles import UserRoles
from Domen.Config.redis_client import redis_client
from Domen.Config.config import Config

gateway_bp = Blueprint("gateway_bp", __name__, url_prefix="/gateway")

# region air_company gateway
@gateway_bp.route("/air_company/getAll", methods=["GET"])
def get_all_company():
    try:

        cache = redis_client.get(f"airCompanies:all")

        if cache:
            return json.loads(cache), 200

        response = requests.get(f"{Config.FLIGHT_SERVICE_URL}/companies/getAll")

        if response.status_code != 200:
            return jsonify({"message":f"Server error: {response.status_code}"}), 500

        return response.json()

    except Exception as error:
        return jsonify({"message":f"Server error: {error}"}), 500

@gateway_bp.route("/air_company/<int:air_company_id>", methods=["GET"])
def get_company(air_company_id):
    try:
        cache = redis_client.get(f"airCompanies:{air_company_id}")
        if cache:
            return json.loads(cache), 200

        response = requests.get(f"{Config.FLIGHT_SERVICE_URL}/companies/{air_company_id}")

        if response.status_code != 200:
            return jsonify({"message":f"Server error: {response.status_code}"}), 500

        return jsonify(response.json()), 200

    except Exception as error:
        return jsonify({"message":f"Server error: {error}"}), 500

@gateway_bp.route("/air_company/create", methods=["POST"])
@jwt_required()
@roles_required("ADMINISTRATOR","MANAGER")
def create_company():
    try:
        json_data = request.get_json()
        data = json_data.get("name")

        response = requests.post(f"{Config.FLIGHT_SERVICE_URL}/companies/create",json={'name':data})

        if response.status_code != 201:
            return jsonify({
                "message": "Server error",
                "details": response.text
            }), 500

        redis_client.delete("flights:all") #ovo moramo raditi da bi podaci bili tacni
        return jsonify(response.json()), 201

    except Exception as error:
        return jsonify({"message":f"Server error: {error}"}), 500

@gateway_bp.route("/air_company/<int:air_company_id>", methods=["PUT"])
@jwt_required()
@roles_required("ADMINISTRATOR","MANAGER")
def update_company(air_company_id):
    try:
        json_data = request.get_json()
        data = json_data.get("name")

        response = requests.put(f"{Config.FLIGHT_SERVICE_URL}/companies/{air_company_id}",json={'name':data})

        if response.status_code != 200:
            return jsonify({"message":f"Server error: {response.status_code}"}), 500
        redis_client.delete("flights:all")
        return jsonify(response.json()), 200
    except Exception as error:
        return jsonify({"message":f"Server error: {error}"}), 500

@gateway_bp.route("/air_company/<int:air_company_id>", methods=["DELETE"])
@jwt_required()
@roles_required("ADMINISTRATOR","MANAGER")
def delete_company(air_company_id):
    try:

        response = requests.delete(f"{Config.FLIGHT_SERVICE_URL}/companies/{air_company_id}")
        if response.status_code == 404:
            return jsonify({"message":f"Server: {response.text}"}), 404

        if response.status_code != 200:
            return jsonify({"message":f"Server: {response.status_code}"}), 500

        redis_client.delete("flights:all")

        return jsonify(response.json()), 200
    except Exception as error:
        return jsonify({"message":f"Server: {error}"}), 500

# endregion

# region bought_tickets

@gateway_bp.route("/tickets/<int:ticket_id>", methods=["GET"])
@jwt_required()
def get_ticket(ticket_id):
    try:
        response = requests.get(f"{Config.FLIGHT_SERVICE_URL}/tickets/{ticket_id}")

        if response.status_code != 200:
            return jsonify({"message":f"Server: {response.status_code}"}), 500

        return jsonify(response.json()), 200

    except Exception as error:
        return jsonify({"message":f"Server: {error}"}), 500

@gateway_bp.route("/tickets/user-tickets/<int:user_id>", methods=["GET"])
@jwt_required()
def get_users_tickets(user_id):
    try:
        response = requests.get(f"{Config.FLIGHT_SERVICE_URL}/tickets/users-tickets/{user_id}")
        if response.status_code != 200:
            return jsonify({"message":f"Server: {response.status_code}"}), 500

        return jsonify(response.json()), 200

    except Exception as error:
        return jsonify({"message":f"Server: {error}"}), 500

@gateway_bp.route("/tickets/flights-tickets/<int:ticket_id>", methods=["GET"])
@jwt_required()
def get_flights_tickets(ticket_id):
    try:
        response = requests.get(f"{Config.FLIGHT_SERVICE_URL}/tickets/flights-tickets/{ticket_id}")
        if response.status_code != 200:
            return jsonify({"message":f"Server: {response.status_code}"}), 500
        return jsonify(response.json()), 200
    except Exception as error:
        return jsonify({"message":f"Server: {error}"}), 500

@gateway_bp.route("/tickets/create", methods=["POST"])
@jwt_required()
def create_ticket():
    try:
        data = request.json

        response = requests.post(f'{Config.FLIGHT_SERVICE_URL}/tickets/create',json=data)

        if response.status_code != 201:
            return jsonify({"message":f"Server: {response.status_code}"}), 500

        return jsonify(response.json()), 201
    except Exception as error:
        return jsonify({"message":f"Server: {error}"}), 500

@gateway_bp.route("/tickets/cancel/<int:ticket_id>", methods=["PUT"])
@jwt_required()
def cancel_ticket(ticket_id):
    try:

        response = requests.put(f"{Config.FLIGHT_SERVICE_URL}/tickets/cancel/{ticket_id}")

        if response.status_code == 404:
            return jsonify({"message":f"Server: {response.text}"}), 404

        if response.status_code != 200:
            return jsonify({"message":f"Server: {response.status_code}"}), 500

        return jsonify(response.json()), 200

    except Exception as error:
        return jsonify({"message":f"Server: {error}"}), 500

# endregion