

class TicketCreateDTO:
    def __init__(self,data:dict):
        self.userId = data.get('userId')
        self.flightId = data.get('flightId')
        self.ticketDescription = data.get('ticketDescription')
        self.ticketPrice  = data.get('ticketPrice')
        self.ticketDate = data.get('ticketDate')

    def is_valid(self):
        errors = []
        if not self.userId: 
            errors.append("UserId is required.")
        if not self.flightId: 
            errors.append("FlightId is required.")
        if self.ticketPrice is None:
            errors.append("Ticket price is required.")
        elif self.ticketPrice <= 0:
            errors.append("Ticket price must be positive number.")
        
        return errors