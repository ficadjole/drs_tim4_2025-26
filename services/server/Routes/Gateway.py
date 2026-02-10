import json
import requests
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from Auth.Decorators import roles_required
from Domen.Enums.UserRoles import UserRoles
from Domen.Config.redis_client import redis_client
from Domen.Config.config import Config

gateway_bp = Blueprint("gateway_bp", __name__, url_prefix="/api/gateway")

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

        redis_client.delete("airCompanies:all") #ovo moramo raditi da bi podaci bili tacni
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
        redis_client.delete("airCompanies:all")
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

        redis_client.delete("airCompanies:all")

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
    
@gateway_bp.route("/tickets/rate/<int:ticket_id>", methods=["PUT"])
@jwt_required()
def rate_ticket_gateway(ticket_id):
    try:
        user_id = get_jwt_identity()
        data = request.json
        data["userId"] = user_id

        response = requests.put(
            f"{Config.FLIGHT_SERVICE_URL}/tickets/rate/{ticket_id}",
            json=data
        )

        return jsonify(response.json()), response.status_code

    except Exception as error:
        return jsonify({"message": f"Server: {error}"}), 500

@gateway_bp.route("/tickets/ratings", methods=["GET"])
@jwt_required()
@roles_required("ADMINISTRATOR")
def get_all_ratings_gateway():
    try:
        response = requests.get(
            f"{Config.FLIGHT_SERVICE_URL}/tickets/ratings"
        )

        return jsonify(response.json()), response.status_code

    except Exception as error:
        return jsonify({"message": f"Server: {error}"}), 500

# endregion

#region flights
@gateway_bp.route("/flights/getAll", methods=["GET"])
def getAllFlights():
    try:

        cache = redis_client.get(f"flights:all")

        if cache:
            return json.loads(cache), 200

        response = requests.get(f"{Config.FLIGHT_SERVICE_URL}/flights/getAll")

        if response.status_code != 200:
            return jsonify({"message":f"Server error: {response.status_code}"}), 500

        return response.json()

    except Exception as error:
        return jsonify({"message":f"Server error: {error}"}), 500

@gateway_bp.route("/flights/<int:id>", methods=["GET"])
def getFlight(id):
    try:
        cache = redis_client.get(f"flight:{id}")

        if(cache):
            return json.loads(cache), 200
        
        response = requests.get(f"{Config.FLIGHT_SERVICE_URL}/flights/getFlight/{id}")

        if response.status_code != 200:
            return jsonify({"message": f"server error: {response.status_code}"}), 500
        
        return jsonify(response.json()), 200
    except Exception as error:
        return jsonify({"message":f"Server error: {error}"}), 500
    
@gateway_bp.route("/flights/getFlight-byAirCompany/<int:airCompanyId>", methods=["GET"])
def getFlightByAirCompany(airCompanyId):
    try :
        cache = redis_client.get(f"flightsByCompany:{airCompanyId}")
        
        if cache:
            return json.loads(cache), 200

        response = requests.get(f"{Config.FLIGHT_SERVICE_URL}/flights/getFlight-byAirCompany/{airCompanyId}")

        if response.status_code != 200:
            return jsonify({"message":f"Server error: {response.status_code}"}), 500

        return jsonify(response.json()), 200

    except Exception as error:
        return jsonify({"message":f"Server error: {error}"}), 500
    
@gateway_bp.route("/flights/create", methods=["POST"])
@jwt_required()
@roles_required("MANAGER")
def create_flight():
    try:
        user_id = get_jwt_identity()  
        flight_data = request.get_json()

        flight_data["createdBy"] = user_id  

        response = requests.post(f"{Config.FLIGHT_SERVICE_URL}/flights/create", json=flight_data)
        
        if response.status_code != 201:
            return jsonify({
                "message": "Server error",
                "details": response.text
            }), 500

        redis_client.delete("flights:all") 
        return jsonify(response.json()), 201

    except Exception as error:
        return jsonify({"message":f"Server error: {error}"}), 500
    
@gateway_bp.route("/flights/update/<int:id>", methods=["PUT"])
@jwt_required()
@roles_required("MANAGER")
def update_flight(id):
    try:
        update_data = request.get_json()

        response = requests.put(f"{Config.FLIGHT_SERVICE_URL}/flights/update/{id}", json=update_data)
        
        if response.status_code != 200:
            return jsonify({"message":f"Server error: {response.status_code}"}), 500
        
        redis_client.delete("flights:all")
        redis_client.delete(f"flight:{id}")

        return jsonify(response.json()), 200

    
    except Exception as error:
        return jsonify({"message":f"Server error: {error}"}), 500
    

@gateway_bp.route("/flights/delete/<int:id>", methods=["DELETE"])
@jwt_required()
@roles_required("ADMINISTRATOR")
def delete_flight(id):
    try:

        response = requests.delete(f"{Config.FLIGHT_SERVICE_URL}/flights/delete/{id}")
        if response.status_code == 404:
            return jsonify({"message":f"Server: {response.text}"}), 404

        if response.status_code != 200:
            return jsonify({"message":f"Server: {response.status_code}"}), 500

        redis_client.delete("flights:all")

        return jsonify(response.json()), 200
    except Exception as error:
        return jsonify({"message":f"Server: {error}"}), 500
    
@gateway_bp.route("/flights/status/<string:status>", methods=["GET"])
def get_status(status):
    try:
        response = requests.get(f"{Config.FLIGHT_SERVICE_URL}/flights/status/{status}")

        if response.status_code != 200:
            return jsonify({"message":f"Server: {response.status_code}"}), 500

        return jsonify(response.json()), 200

    except Exception as error:
        return jsonify({"message":f"Server: {error}"}), 500


@gateway_bp.route("/flights/generate-report", methods=["POST"])
@jwt_required()
@roles_required("ADMINISTRATOR")
def generate_report():
    try:
        jwt_data = get_jwt()
        admin_email = jwt_data.get("email")

        if not admin_email:
            return jsonify({"message": "Email is not found. Please log in!"}), 400

        response = requests.post(f"{Config.FLIGHT_SERVICE_URL}/flights/generate-report",
                            json={
                                "email": admin_email,
                                "tabName": request.json.get("tabName")
                            },
                        )
        if response.status_code != 202:
            return jsonify({
                "message": "Flight Service greška",
                "details": response.text
            }), response.status_code

        return jsonify(response.json()), 202

    except Exception as error:
        return jsonify({"message": f"Server: {error}"}), 500
    
@gateway_bp.route("/flights/admin/getAll", methods=["GET"])
@jwt_required()
@roles_required("ADMINISTRATOR")
def get_all_flights_admin():
    print(get_jwt())
    try:
        response = requests.get(
            f"{Config.FLIGHT_SERVICE_URL}/flights/admin/getAll"
        )

        if response.status_code != 200:
            return jsonify({"message": "Server error"}), response.status_code

        return jsonify(response.json()), 200

    except Exception as error:
        return jsonify({"message": f"Server error: {error}"}), 500
    
@gateway_bp.route("/flights/manager/my", methods=["GET"])
@jwt_required()
@roles_required("MANAGER")
def gateway_get_my_flights():
    user_id = get_jwt_identity()
    # claims = get_jwt()
    # role = claims.get("role")

    # if role != "MANAGER":
    #     return jsonify({"message": "Forbidden"}), 403

    res = requests.get(
        f"{Config.FLIGHT_SERVICE_URL}/flights/manager/my/{user_id}"
    )

    return jsonify(res.json()), res.status_code

@gateway_bp.route("/flights/approve/<int:id>", methods=["PUT"])
@jwt_required()
@roles_required("ADMINISTRATOR")
def approve_flight(id):
    try:
        response = requests.put(
            f"{Config.FLIGHT_SERVICE_URL}/flights/approve/{id}"
        )

        if response.status_code != 200:
            return jsonify({"message": response.text}), response.status_code

        redis_client.delete("flights:all")
        redis_client.delete(f"flight:{id}")

        return jsonify(response.json()), 200

    except Exception as error:
        return jsonify({"message": f"Server error: {error}"}), 500

@gateway_bp.route("/flights/reject/<int:id>", methods=["PUT"])
@jwt_required()
@roles_required("ADMINISTRATOR")
def reject_flight(id):
    try:
        reason = request.json.get("reason")

        if not reason:
            return jsonify({"message": "Rejection reason is required"}), 400

        response = requests.put(
            f"{Config.FLIGHT_SERVICE_URL}/flights/reject/{id}",
            json={"reason": reason}
        )

        if response.status_code != 200:
            return jsonify({"message": response.text}), response.status_code

        redis_client.delete("flights:all")
        redis_client.delete(f"flight:{id}")

        return jsonify(response.json()), 200

    except Exception as error:
        return jsonify({"message": f"Server error: {error}"}), 500

@gateway_bp.route("/flights/cancel/<int:id>", methods=["PUT"])
@jwt_required()
@roles_required("ADMINISTRATOR")
def cancel_flight(id):
    try:
        response = requests.put(
            f"{Config.FLIGHT_SERVICE_URL}/flights/cancel/{id}"
        )

        if response.status_code != 200:
            return jsonify({"message": response.text}), response.status_code

        redis_client.delete("flights:all")
        redis_client.delete(f"flight:{id}")

        return jsonify(response.json()), 200

    except Exception as error:
        return jsonify({"message": f"Server error: {error}"}), 500

# endregion
