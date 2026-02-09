from datetime import datetime

class FlightCreateDTO:
    def __init__(self,data:dict):
        self.name= data['name']
        self.airCompanyId = data['airCompanyId']
        self.flightDuration = data['flightDuration']
        self.currentFlightDuration = data['currentFlightDuration']
        self.departureTime = data['departureTime']
        self.departureAirport = data['departureAirport']
        self.arrivalAirport = data['arrivalAirport']
        self.ticketPrice = data['ticketPrice']
        self.createdBy = data['createdBy']

    def is_valid(self):
        errors = []
        if not self.name: errors.append("Name is required.")
        if not self.airCompanyId: errors.append("Air Company ID is required.")
        
        if self.departureAirport == self.arrivalAirport:
            errors.append("Departure and arrival airports cannot be the same.")
            
        if self.ticketPrice is not None and self.ticketPrice < 0:
            errors.append("Ticket price cannot be negative.")
        if self.flightDuration is not None and self.flightDuration <= 0:
            errors.append("Flight duration must be positive.")

        return errors


class FlightUpdateDTO:
    def __init__(self, data: dict):
        self.name = data.get('name')
        self.airCompanyId = data.get('airCompanyId')
        self.flightDuration = data.get('flightDuration')
        self.currentFlightDuration = data.get('currentFlightDuration')
        self.departureTime = data.get('departureTime')
        self.departureAirport = data.get('departureAirport')
        self.arrivalAirport = data.get('arrivalAirport')
        self.ticketPrice = data.get('ticketPrice')

    def is_valid(self):
        errors = []
        
        if self.ticketPrice is not None and self.ticketPrice < 0:
            errors.append("Ticket price cannot be negative.")
        
        return errors
