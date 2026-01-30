import json
from Domen.Models.BoughtTickets import BoughtTickets
from Database.InitializationDataBase import db
from Domen.Config.redis_client import redis_client

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


        ticket_data["ticketDate"] = ticket.ticketDate.strftime("%Y-%m-%d %H:%M:%S")
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
        cache_key = f"ticket:{ticket.id}"
        print(ticket.to_dict())
        if not ticket:
            return False

        ticket.cancelled = True
        ticket.ticketDate = ticket.ticketDate.strftime("%Y-%m-%d %H:%M:%S")
        cached_ticket = redis_client.get(cache_key)

        if cached_ticket:
            redis_client.set(cache_key, json.dumps(ticket.to_dict()), ex=300)


        db.session.commit()
        return True


