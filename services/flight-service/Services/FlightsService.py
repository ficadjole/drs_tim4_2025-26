import json

from Domen.Models.Flights import  Flights
from Database.InitializationDataBase import db
from Domen.Config.redis_client import redis_client
from Services.BoughtTicketsService import BougthTicketsService
from Services.FlightStatusService import FlightStatusService
from Domen.Enums.FlightApprovalStatus import FlightApprovalStatus
from Websocket.socket import socketio

class FlightsService:
    @staticmethod
    def get_all_flights():
        #ovako korisnik vidi samo odobrene letove
        return Flights.query.filter_by(
            approvalStatus = FlightApprovalStatus.APPROVED,
            cancelled = False
        ).all()
    
    @staticmethod
    def get_all_flights_admin():
        return Flights.query.all()
    
    @staticmethod
    def get_flight_by_id(flight_id):

        cache_key = f"flight:{flight_id}"

        cached_flight = redis_client.get(cache_key)

        if cached_flight:
            return json.loads(cached_flight)

        flight = Flights.query.get(flight_id)

        flight_data = flight.to_dict()

        redis_client.set(cache_key, json.dumps(flight_data),ex=300)
        return flight_data

    @staticmethod
    def get_all_flights_by_date(date):
        return Flights.query.filter_by(date=date).all()

    @staticmethod
    def create_flight(flight):

        newFlight = Flights(
            name=flight.name,
            airCompanyId=flight.airCompanyId,
            flightDuration=flight.flightDuration,
            currentFlightDuration=flight.currentFlightDuration,
            departureTime=flight.departureTime,
            departureAirport=flight.departureAirport,
            arrivalAirport=flight.arrivalAirport,
            ticketPrice=flight.ticketPrice,
            createdBy=flight.createdBy,
        )

        db.session.add(newFlight)
        db.session.commit()

        #notify admins
        socketio.emit(
            "flight_created",
            newFlight.to_dict(),
            room="admins"
        )

        return newFlight.to_dict()

    @staticmethod
    def delete_flight(flight_id):

        flight = Flights.query.get(flight_id)

        if not flight:
            return False

        BougthTicketsService.cancelAllFlights(flight_id)

        flight.cancelled = True


        cache_key = f"flight:{flight_id}"

        redis_client.delete(cache_key)

        db.session.commit()
        return True

    @staticmethod
    def update_flight(flight_id, data):
        flight = Flights.query.get(flight_id)

        cache_key = f"flight:{flight_id}"

        if flight is None:
            return None

        if hasattr(data, 'name') and data.name is not None:
            flight.name = data.name
        if hasattr(data, 'airCompanyId') and data.airCompanyId is not None:
            flight.airCompanyId = data.airCompanyId
        if hasattr(data, 'flightDuration') and data.flightDuration is not None:
            flight.flightDuration = data.flightDuration
        if hasattr(data, 'currentFlightDuration') and data.currentFlightDuration is not None:
            flight.currentFlightDuration = data.currentFlightDuration
        if hasattr(data, 'departureTime') and data.departureTime is not None:
            flight.departureTime = data.departureTime
        if hasattr(data, 'departureAirport') and data.departureAirport is not None:
            flight.departureAirport = data.departureAirport
        if hasattr(data, 'arrivalAirport') and data.arrivalAirport is not None:
            flight.arrivalAirport = data.arrivalAirport
        if hasattr(data, 'ticketPrice') and data.ticketPrice is not None:
            flight.ticketPrice = data.ticketPrice
        if hasattr(data, 'createdBy') and data.createdBy is not None:
            flight.createdBy = data.createdBy

        db.session.commit()
        redis_client.delete(cache_key)
        return flight.to_dict()

    @staticmethod
    def get_flights_by_air_company(air_company_id):
        return Flights.query.filter_by(airCompanyId=air_company_id).all()

    @staticmethod
    def get_flights_by_status(status):
        flights = Flights.query.all()
        result = []

        for flight in flights:
            flight_status = FlightStatusService.get_status(flight)

            if flight_status == status:
                data = flight.to_dict()
                data["status"] = flight_status
                result.append(data)
        
        return result

    @staticmethod
    def approve(flight_id):
        flight = Flights.query.get(flight_id)
        flight.approvalStatus = FlightApprovalStatus.APPROVED
        flight.rejectionReason = None
        db.session.commit()
        return flight.to_dict()
    
    @staticmethod
    def reject(flight_id, reason):
        flight = Flights.query.get(flight_id)
        flight.approvalStatus = FlightApprovalStatus.REJECTED
        flight.rejectionReason = reason
        db.session.commit()
        return flight.to_dict()
    
    @staticmethod
    def cancel(flight_id):
        flight = Flights.query.get(flight_id)

        status = FlightStatusService.get_status(flight)
        if status in ["IN_PROGRESS", "FINISHED"]:
            raise Exception("Flight cannot be cancelled")
        
        flight.cancelled = True
        BougthTicketsService.cancelAllFlights(flight_id)
        db.session.commit()
        return flight.to_dict()