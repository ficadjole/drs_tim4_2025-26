from Domen.Models.Flights import  Flights
from Database.InitializationDataBase import db


class FlightsService:
    @staticmethod
    def get_all_flights():
        return Flights.query.all()

    @staticmethod
    def get_flight_by_id(flight_id):
        return Flights.query.get(flight_id)

    @staticmethod
    def get_all_flights_by_date(date):
        return Flights.query.filter_by(date=date).all()

    @staticmethod
    def create_flight(flight):
        db.session.add(flight)
        db.session.commit()
        return flight

    @staticmethod
    def delete_flight(flight_id):

        flight = Flights.query.get(flight_id)

        if flight:
            db.session.delete(flight)
            db.session.commit()
            return True
        else:
            return False

    @staticmethod
    def update_flight(flight_id, data):
        flight = Flights.query.get(flight_id)

        if flight is None:
            return None

        for key, value in data.items():
            setattr(flight, key, value)

        db.session.commit()
        return flight

    @staticmethod
    def get_flights_by_air_company(air_company_id):
        return Flights.query.filter_by(airCompanyId=air_company_id).all()



