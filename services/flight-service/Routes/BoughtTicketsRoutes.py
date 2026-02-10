from flask import Blueprint, request, jsonify
from DTO.TicketCreateDTO import TicketCreateDTO
from Services.BoughtTicketsService import BougthTicketsService
ticktes_bp = Blueprint('ticktes_bp', __name__, url_prefix='/api/tickets')

@ticktes_bp.route('/create', methods=['POST'])
def create():
    try:
        data = TicketCreateDTO(request.json)

        errors = data.is_valid()

        if errors:
            return jsonify({"message:": "Validation failed", "errors:": errors}), 400


        ticket = BougthTicketsService.create(data)

        if not ticket:
            return jsonify({"message":'Ticket creation failed'}),404

        return jsonify(ticket),201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ticktes_bp.route('/<int:ticket_id>', methods=['GET'])
def get(ticket_id):
    try:
        ticket = BougthTicketsService.get_by_id(ticket_id)
        if not ticket:
            return jsonify({"message":f'Ticket with {ticket_id} does not exist'}),404
        return jsonify(ticket),200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ticktes_bp.route('/users-tickets/<int:userId>', methods=['GET'])
def get_by_user(userId):
    try:
        tickets = BougthTicketsService.get_all_by_user(userId)

        if tickets == []:
            return jsonify({"message":f'Ticket with {userId} does not exist'}),200

        return jsonify([
            {
                "id" : u.id,
                "userId" : u.userId,
                "flightId": u.flightId,
                "ticketPrice":u.ticketPrice,
                "cancelled":u.cancelled,
                "ticketDescription":u.ticketDescription,
                "ticketDate":u.ticketDate,
                "rating":u.rating,
            }for u in tickets
        ]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ticktes_bp.route('/flights-tickets/<int:flightId>', methods=['GET'])
def get_by_flight(flightId):
    try:
        tickets = BougthTicketsService.get_all_by_flight(flightId)

        if not tickets:
            return jsonify({"message":f'Ticket with {flightId} does not exist'}),404

        return jsonify([
            {
                "id" : u.id,
                "userId" : u.userId,
                "flightId": u.flightId,
                "ticketPrice":u.ticketPrice,
                "cancelled":u.cancelled,
                "ticketDescription":u.ticketDescription,
                "ticketDate":u.ticketDate,
                "rating":u.rating,
            }for u in tickets
        ]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ticktes_bp.route('/cancel/<int:ticketId>', methods=['PUT'])
def cancel(ticketId):
    try:

        ticket = BougthTicketsService.get_by_id(ticketId)
        if not ticket:
            return jsonify({"message":f'Ticket with {ticketId} does not exist'}),404

        result = BougthTicketsService.cancel(ticketId)

        if result:
            return jsonify({"message":f"Ticket with {ticketId} has been cancelled"}), 200
        else:
            return jsonify({"message":f"Ticket with {ticketId} does not exist"}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@ticktes_bp.route('/rate/<int:ticket_id>', methods=['PUT'])
def rate_ticket(ticket_id):
    try:
        data = request.json
        rating = data.get("rating")
        user_id = data.get("userId")  # ili iz tokena kasnije

        ticket = BougthTicketsService.rate_ticket(ticket_id, user_id, rating)
        return jsonify(ticket), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@ticktes_bp.route('/ratings', methods=['GET'])
def get_all_ratings():
    try:
        ratings = BougthTicketsService.get_all_ratings()
        return jsonify(ratings), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@ticktes_bp.route('/ratings/by-flight', methods=['GET'])
def ratings_by_flight():
    try:
        data = BougthTicketsService.get_rating_stats_by_flight()
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

