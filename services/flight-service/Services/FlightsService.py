import json
from Domen.Models.Flights import  Flights
from Database.InitializationDataBase import db
from Domen.Config.redis_client import redis_client
from Services.BoughtTicketsService import BougthTicketsService
from Services.FlightStatusService import FlightStatusService
from Domen.Enums.FlightApprovalStatus import FlightApprovalStatus
from datetime import datetime
import requests
from Domen.Config.config import Config

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
    def get_my_flights_as_manager(manager_id):
        return Flights.query.filter_by(createdBy=manager_id).all()

    @staticmethod
    def get_flight_by_id(flight_id):

        cache_key = f"flight:{flight_id}"

        cached_flight = redis_client.get(cache_key)

        if cached_flight:
            return json.loads(cached_flight)

        flight = Flights.query.get(flight_id)

        if not flight:
            return None

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
            approvalStatus=FlightApprovalStatus.PENDING,
            cancelled=False
        )

        db.session.add(newFlight)
        db.session.commit()

        flight_data = newFlight.to_dict()
        # try:
        #     requests.post(
        #         f"{Config.SERVER_URL}/api/gateway/internal/flight-created",
        #         json=flight_data,
        #         timeout=2
        #     )
        # except Exception as e:
        #     print("Gateway notify failed:", e)

        return flight_data

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
        if not flight:
            return None
    
        if flight.approvalStatus != FlightApprovalStatus.REJECTED:
            raise Exception("Only rejected flights can be edited")
    
        fields = ["name", "airCompanyId", "flightDuration", "currentFlightDuration", 
                  "departureAirport", "arrivalAirport", "ticketPrice"]

        for field in fields:
            if field in data and data[field] is not None:
                val = data[field]
                if field in ["airCompanyId", "flightDuration", "currentFlightDuration"]:
                    val = int(val)
                elif field == "ticketPrice":
                    val = float(val)
                
                setattr(flight, field, val)

        if 'departureTime' in data and data['departureTime']:
            try:
                date_str = data['departureTime'].replace('T', ' ')

                if len(date_str) > 16:
                    flight.departureTime = datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
                else:
                    flight.departureTime = datetime.strptime(date_str, "%Y-%m-%d %H:%M")
            except ValueError as ve:
                print(f"Greška u formatu datuma: {ve}")


        flight.approvalStatus = FlightApprovalStatus.PENDING
        flight.rejectionReason = None

        db.session.commit()
        redis_client.delete(f"flight:{flight_id}")
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
        if not flight:
            return None
        flight.approvalStatus = FlightApprovalStatus.APPROVED
        flight.rejectionReason = None
        db.session.commit()
        return flight.to_dict()
    
    @staticmethod
    def reject(flight_id, reason):
        flight = Flights.query.get(flight_id)
        if not flight:
            return None
        flight.approvalStatus = FlightApprovalStatus.REJECTED
        flight.rejectionReason = reason
        db.session.commit()
        return flight.to_dict()
    
    @staticmethod
    def cancel(flight_id):
        flight = Flights.query.get(flight_id)
        if not flight:
            return None
        status = FlightStatusService.get_status(flight)
        if status in ["IN_PROGRESS", "FINISHED"]:
            raise Exception("Flight cannot be cancelled")
        
        flight.cancelled = True
        BougthTicketsService.cancelAllFlights(flight_id)
        db.session.commit()
        return flight.to_dict()