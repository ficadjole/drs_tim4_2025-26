from selectors import SelectSelector

from flask import jsonify, Blueprint,request
from DTO.FlightCreateDTO import FlightCreateDTO
from DTO.FlightCreateDTO import FlightUpdateDTO
from Services.FlightsService import FlightsService
from Services.ReportService import ReportService

flights_bp = Blueprint('flights_bp', __name__, url_prefix='/api/flights')

@flights_bp.route('/getAll', methods=['GET'])
def getAllFlights():
    try:
        flights = FlightsService.get_all_flights()
        return jsonify([
            {
                "id" : f.id,
                "name" : f.name,
                "airCompanyId": f.airCompanyId,
                "flightDuration":f.flightDuration,
                "currentFlightDuration":f.currentFlightDuration,
                "departureTime":f.departureTime,
                "departureAirport":f.departureAirport,
                "arrivalAirport":f.arrivalAirport,
                "ticketPrice":f.ticketPrice,
                "approvalStatus": f.approvalStatus.name,
            }for f in flights
        ])
    except Exception as e:
        return jsonify({"message":str(e)}), 500

@flights_bp.route('/admin/getAll', methods=['GET'])
def getAllFlightsAdmin():
    try:
        flights = FlightsService.get_all_flights_admin()
        return jsonify([f.to_dict() for f in flights]), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@flights_bp.route("/manager/my/<int:manager_id>", methods=["GET"])
def getManagerFlights(manager_id):
    try:
        flights = FlightsService.get_my_flights_as_manager(manager_id)
        return jsonify([f.to_dict() for f in flights]), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@flights_bp.route('/getFlight/<int:id>', methods=['GET'])
def getFlight(id):
    try:
        flight = FlightsService.get_flight_by_id(id)

        if not flight:
            return jsonify({"message":f"flight with id {id} not found"}), 404

        return jsonify(flight),200

    except Exception as e:
        return jsonify({"message":str(e)}), 500

@flights_bp.route('/getFlight-byAirCompany/<int:airCompanyId>', methods=['GET'])
def getFlightByAirport(airCompanyId):
    try:
        flights = FlightsService.get_flights_by_air_company(airCompanyId)
        if not flights:
            return jsonify({"message":f"flight with id {airCompanyId} not found"}), 404

        return jsonify([
            {
                "id": f.id,
                "name": f.name,
                "airCompanyId": f.airCompanyId,
                "flightDuration": f.flightDuration,
                "currentFlightDuration": f.currentFlightDuration,
                "departureTime": f.departureTime,
                "departureAirport": f.departureAirport,
                "arrivalAirport": f.arrivalAirport,
                "ticketPrice": f.ticketPrice,
            } for f in flights
        ])
    except Exception as e:
        return jsonify({"message":str(e)}), 500


@flights_bp.route('/create', methods=['POST'])
def create():
    try:
        json_data = FlightCreateDTO(request.json)

        flight = FlightsService.create_flight(json_data)

        if not flight:
            return jsonify({"message":'Flight creation failed'}), 404

        return jsonify(flight),201

    except Exception as e:
        return jsonify({"message":str(e)}), 500

@flights_bp.route('/update/<int:id>', methods=['PUT'])
def update(id):
    try:
        json_data = FlightUpdateDTO(request.json)

        flight = FlightsService.update_flight(id, json_data)

        if not flight:
            return jsonify({"message":f"flight with id {id} not found"}), 404

        return jsonify(flight),200
    except Exception as e:
        return jsonify({"message":str(e)}), 500

@flights_bp.route('/delete/<int:id>', methods=['DELETE'])
def delete(id):
    try:
       result = FlightsService.delete_flight(id)

       if result:
            return jsonify({"message":f"flight with id {id} is cancelled"}), 200
       else:
            return jsonify({"message":f"flight with id {id} not found"}), 404

    except Exception as e:
        return jsonify({"message":str(e)}), 500

@flights_bp.route('/status/<string:status>', methods=['GET'])
def get_flights_by_status(status):
    try:
        flights = FlightsService.get_flights_by_status(status.upper())
        return jsonify(flights), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
#admin actions

@flights_bp.route("/approve/<int:id>", methods=["PUT"])
def approve_flight(id):
    try:
        flight = FlightsService.approve(id)
        if not flight:
            return jsonify({"message": "Flight not found"}), 404
        return jsonify(flight), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@flights_bp.route("/reject/<int:id>", methods=["PUT"])
def reject_flight(id):
    try:
        reason = request.json.get("reason")
        if not reason: 
            return jsonify({"message": "Rejection reason is required"}), 400
        flight = FlightsService.reject(id, reason)
        if not flight:
            return jsonify({"message": "Flight not found"}), 404
        
        return jsonify(flight), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@flights_bp.route("/cancel/<int:id>", methods=["PUT"])
def cancel_flight(id):
    try:
        flight = FlightsService.cancel(id)
        if not flight:
            return jsonify({"message": "Flight not found"}), 404
        return jsonify(flight), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    
@flights_bp.route('/generate-report', methods=['POST'])
def generate_report():
    data = request.get_json()
    tab_name = data.get('tabName')
    admin_email = data.get('email')

    if not tab_name or not admin_email:
        return jsonify({"message": "TabName or Email is missing"}), 400

    flights = FlightsService.get_flights_by_status(tab_name.upper())

    success, message = ReportService.generate_and_send(flights, tab_name, admin_email)

    return jsonify({"message": message}), 202 if success else 400
