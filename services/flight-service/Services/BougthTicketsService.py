from Domen.Models.BougthTickets import BougthTickets
from Database.InitializationDataBase import db

class BougthTicketsService:
    @staticmethod
    def get(id):
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




