class TicketCreateDTO:
    def __init__(self,data:dict):
        self.userId = data['userId']
        self.flightId = data['flightId']
        self.ticketDescription = data['ticketDescription']
        self.ticketPrice  = data['ticketPrice']
        self.ticketDate = data['ticketDate']