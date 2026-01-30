from Domen.Models.BougthTickets import BougthTickets
from Database.InitializationDataBase import db
from Config.redis_client import redis_client

class BougthTicketsService:
    @staticmethod
    def get(id):

        cache_key = f"ticket:{id}"

        cache_value = redis_client.get(cache_key)

        if cache_value:
            return cache_value

        redis_client.set(cache_key, BougthTickets.query.get(id))

        return BougthTickets.query.get(id)
    @staticmethod
    def add(ticket):
        db.session.add(ticket)
        db.session.commit()
        return BougthTickets.query.get(ticket.id)

    @staticmethod
    def get_all_by_user(user_id):
        return BougthTickets.query.filter_by(user_id=user_id).all()

    @staticmethod
    def get_all_by_flight(flight_id):
        return BougthTickets.query.filter_by(flight_id=flight_id).all()

    @staticmethod
    def cancel(ticket_id):

        ticket = BougthTickets.query.get(ticket_id)

        ticket.cancelled = True

        cache_key = f"ticket:{ticket_id}"

        redis_client.set(cache_key, ticket.id)

        db.session.commit()



