import json
from Domen.Models.BoughtTickets import BoughtTickets
from Database.InitializationDataBase import db
from Domen.Config.redis_client import redis_client
from workers.celery_client import notify_ticket_cancel,notify_flight_cancelled

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
                ticketDate=ticket.ticketDate,
                ticketPrice=ticket.ticketPrice,
                ticketDescription=ticket.ticketDescription,
        )

        db.session.add(newTicket)
        db.session.commit()
        return newTicket.to_dict()

    @staticmethod
    def get_all_by_user(userId):
        return BoughtTickets.query.filter_by(userId=userId).all()

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




