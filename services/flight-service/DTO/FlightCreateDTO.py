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
        self.createdBy = data.get('createdBy')
