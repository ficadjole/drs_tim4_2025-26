from Database.InitializationDataBase import db

class BoughtTickets(db.Model):
    __tablename__ = "BoughtTickets"
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer,nullable=False)
    flightId = db.Column(db.Integer,db.ForeignKey("Flights.id"),nullable=False)
    ticketPrice = db.Column(db.Integer,nullable=False)
    cancelled = db.Column(db.Boolean,nullable=False)
    ticketDescription = db.Column(db.String(255),nullable=False)
    ticketDate = db.Column(db.DateTime,nullable=False)
    flight = db.relationship("Flights")

    def __repr__(self):
        return f"BoughtTicket {self.ticketPrice}"