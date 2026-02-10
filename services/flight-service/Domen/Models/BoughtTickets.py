from Database.InitializationDataBase import db

class BoughtTickets(db.Model):
    __tablename__ = "BoughtTickets"
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer,nullable=False)
    flightId = db.Column(db.Integer,db.ForeignKey("Flights.id"),nullable=False)
    ticketPrice = db.Column(db.Integer,nullable=False)
    cancelled = db.Column(db.Boolean,nullable=False,default=False)
    ticketDescription = db.Column(db.String(255),nullable=False)
    ticketDate = db.Column(db.DateTime,nullable=False)
    rating = db.Column(db.Integer, nullable=True) #null dok se ne oceni
    flight = db.relationship("Flights")

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.userId,
            "flightId": self.flightId,
            "ticketPrice": self.ticketPrice,
            "cancelled": self.cancelled,
            "ticketDescription": self.ticketDescription,
            "ticketDate": self.ticketDate.strftime("%Y-%m-%d %H:%M:%S") if self.ticketDate else None,
            "rating": self.rating,
            #proverava da li nije null, ako je null bice None
        }

    def __repr__(self):
        return f"BoughtTicket {self.ticketPrice}"