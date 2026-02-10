import json
from Domen.Models.BoughtTickets import BoughtTickets
from Database.InitializationDataBase import db
from Domen.Config.redis_client import redis_client
from workers.celery_client import notify_ticket_cancel,notify_flight_cancelled
from datetime import datetime
from Services.FlightStatusService import FlightStatusService
from Domen.Models.Flights import Flights
from sqlalchemy import func

class BougthTicketsService:
    @staticmethod
    def get_by_id(id):

        cache_key = f"ticket:{id}"

        cache_value = redis_client.get(cache_key)

        if cache_value:
            return json.loads(cache_value)

        ticket = BoughtTickets.query.get(id)

        if not ticket:
            return None

        ticket_data = ticket.to_dict()

        redis_client.set(cache_key,json.dumps(ticket_data),ex=300)

        return ticket_data

    @staticmethod
    def create(ticket):

        newTicket = BoughtTickets(
                flightId=ticket.flightId,
                userId=ticket.userId,
                ticketDate= datetime.now(),
                ticketPrice=ticket.ticketPrice,
                ticketDescription=ticket.ticketDescription,
        )

        db.session.add(newTicket)
        db.session.commit()
        return newTicket.to_dict()

    @staticmethod
    def get_all_by_user(userId):

        userTickets = BoughtTickets.query.filter_by(userId=userId).all()

        if userTickets == []:
            return []

        return userTickets

    @staticmethod
    def get_all_by_flight(flightId):
        return BoughtTickets.query.filter_by(flightId=flightId).all()

    @staticmethod
    def cancel(id):

        ticket = BoughtTickets.query.get(id)

        if not ticket:
            return False

        ticket.cancelled = True
        db.session.commit()

        cache_key = f"ticket:{ticket.id}"

        redis_client.delete(cache_key)
        notify_ticket_cancel(ticket.userId,ticket.flightId)
        return True

    @staticmethod
    def cancelAllFlights(flightId):

        tickets = BoughtTickets.query.filter_by(flightId=flightId).all()

        if tickets == []:
            return True


        for ticket in tickets:
            ticket.cancelled = True
            redis_client.delete(f"ticket:{ticket.id}")

        db.session.commit()

        notify_flight_cancelled(flightId)

        return True

    @staticmethod
    def rate_ticket(ticket_id, user_id, rating):
        ticket = BoughtTickets.query.get(ticket_id)

        if not ticket:
            raise Exception("Ticket not found")

        if ticket.userId != int(user_id):
            raise Exception("You can rate only your own ticket")


        if ticket.cancelled:
            raise Exception("Cancelled ticket cannot be rated")

        if ticket.rating is not None:
            raise Exception("Ticket already rated")

        flight = Flights.query.get(ticket.flightId)
        status = FlightStatusService.get_status(flight)

        if status != "FINISHED":
            raise Exception("Flight is not finished yet")

        if rating < 1 or rating > 5:
            raise Exception("Rating must be between 1 and 5")

        ticket.rating = rating
        db.session.commit()

        redis_client.delete(f"ticket:{ticket.id}")

        return ticket.to_dict()

    @staticmethod
    def get_all_ratings():
        tickets = BoughtTickets.query.filter(BoughtTickets.rating.isnot(None)).all()
        return [t.to_dict() for t in tickets]

    @staticmethod
    def get_rating_stats_by_flight():
        results = (
            db.session.query(
                BoughtTickets.flightId,
                func.avg(BoughtTickets.rating).label("avg_rating"),
                func.count(BoughtTickets.rating).label("count")
            )
            .filter(BoughtTickets.rating.isnot(None))
            .group_by(BoughtTickets.flightId)
            .all()
        )

        return [
            {
                "flightId": r.flightId,
                "avgRating": round(float(r.avg_rating), 1),
                "count": r.count
            }
            for r in results
        ]

